'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminProfile, profileEm, profileName } from '../adminTypes'

export default function Archived({ archived, setArchived, profiles, setProfiles, showToast }: SectionProps) {
  const [loading, setLoading] = useState(false)
  const [localArchived, setLocalArchived] = useState<AdminProfile[]>(archived)

  useEffect(() => { setLocalArchived(archived) }, [archived])

  async function loadArchived() {
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('status', '==', 'archived')))
      const arr: AdminProfile[] = []
      snap.forEach(d => arr.push({ ...d.data(), uid: d.id } as AdminProfile))
      setLocalArchived(arr)
      setArchived(arr)
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
    setLoading(false)
  }

  async function restoreProfile(p: AdminProfile) {
    try {
      await updateDoc(doc(db, 'users', p.uid), { status: 'active', closedDate: null, reason: null })
      const updated = localArchived.filter(x => x.uid !== p.uid)
      setLocalArchived(updated)
      setArchived(updated)
      setProfiles([...profiles, { ...p, status: 'active' }])
      showToast(`${profileName(p)} restored to active profiles`)
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function purgeProfile(p: AdminProfile) {
    if (!confirm(`Permanently DELETE ${profileName(p)}? This cannot be undone.`)) return
    try {
      await deleteDoc(doc(db, 'users', p.uid))
      const updated = localArchived.filter(x => x.uid !== p.uid)
      setLocalArchived(updated)
      setArchived(updated)
      showToast('Record permanently deleted')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>
          {localArchived.length} archived profile{localArchived.length !== 1 ? 's' : ''}
        </span>
        <button className={s.actBtn} onClick={loadArchived} disabled={loading}>↻ Refresh</button>
      </div>

      {loading ? (
        <div className={s.emptyState}>Loading…</div>
      ) : localArchived.length === 0 ? (
        <div className={s.emptyState}>No archived profiles.</div>
      ) : (
        <div className={s.cardGrid}>
          {localArchived.map(p => (
            <div key={p.uid} className={s.card}>
              <div className={s.cardTop}>
                <div className={s.cardAvatar}>{profileEm(p)}</div>
                <div>
                  <div className={s.cardName}>{profileName(p)}</div>
                  <div className={`${s.cardStatus} ${s.statusArchived}`}>Archived</div>
                </div>
              </div>
              <div className={s.cardDetail}>
                <strong>Age:</strong> {p.age ?? '—'} · <strong>Gender:</strong> {p.g ?? '—'}<br />
                <strong>Tier:</strong> {p.tier ?? '—'} · <strong>City:</strong> {p.city ?? '—'}<br />
                <strong>Closed:</strong> {p.closedDate ?? '—'} · <strong>Reason:</strong> {p.reason ?? '—'}
              </div>
              <div className={s.cardActions}>
                <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => restoreProfile(p)}>↩ Restore</button>
                <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => purgeProfile(p)}>🗑 Delete Permanently</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
