'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminEditRequest, tsToString } from '../adminTypes'

export default function EditRequests({ profiles, setProfiles, showToast }: SectionProps) {
  const [requests, setRequests] = useState<AdminEditRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'editRequests'), where('status', '==', 'pending')))
      const reqs: AdminEditRequest[] = []
      snap.forEach(d => reqs.push({ ...d.data(), docId: d.id } as AdminEditRequest))
      reqs.sort((a, b) => (b.ts ?? '').localeCompare(a.ts ?? ''))
      setRequests(reqs)
    } catch (e: unknown) { showToast('Error loading requests: ' + (e instanceof Error ? e.message : String(e))) }
    setLoading(false)
  }

  async function approveRequest(req: AdminEditRequest) {
    const profile = profiles.find(p => p.u === req.from || p.uid === req.from)
    if (!profile) { showToast('Profile not found'); return }
    try {
      await updateDoc(doc(db, 'users', profile.uid), { ...req.changes, updatedAt: serverTimestamp() })
      await updateDoc(doc(db, 'editRequests', req.docId), { status: 'approved', reviewedAt: serverTimestamp() })
      setProfiles(profiles.map(p => p.uid === profile.uid ? { ...p, ...req.changes } : p))
      setRequests(requests.filter(r => r.docId !== req.docId))
      showToast('✅ Changes approved and applied')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function rejectRequest(req: AdminEditRequest) {
    try {
      await updateDoc(doc(db, 'editRequests', req.docId), { status: 'rejected', reviewedAt: serverTimestamp() })
      setRequests(requests.filter(r => r.docId !== req.docId))
      showToast('Request rejected')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  if (loading) return <div className={s.emptyState}>Loading edit requests…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>{requests.length} pending request{requests.length !== 1 ? 's' : ''}</span>
        <button className={s.actBtn} onClick={load}>↻ Refresh</button>
      </div>

      {requests.length === 0 ? (
        <div className={s.emptyState}>No pending edit requests.</div>
      ) : (
        <div>
          {requests.map(req => {
            const profile = profiles.find(p => p.u === req.from || p.uid === req.from)
            return (
              <div key={req.docId} className={s.editReqCard}>
                <div className={s.editReqUser}>
                  {profile?.name ?? req.from}
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'var(--a-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                    @{req.from} · {tsToString(req.ts)}
                  </span>
                </div>
                <div className={s.editReqChanges}>
                  {Object.entries(req.changes ?? {}).map(([k, v]) => (
                    <div key={k}>
                      <span className={s.editReqFieldKey}>{k}</span>: <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <div className={s.editReqActions}>
                  <button className={`${s.actBtn} ${s.actBtnGrn}`} onClick={() => approveRequest(req)}>✓ Approve</button>
                  <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => rejectRequest(req)}>✕ Reject</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
