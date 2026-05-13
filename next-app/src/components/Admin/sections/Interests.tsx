'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminInterest, profileEm, profileName } from '../adminTypes'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  mutual: 'Mutual Match',
  contact_released: 'Contact Released',
  released: 'Released',
}

export default function Interests({ profiles, interests, setInterests, showToast }: SectionProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = interests.filter(i => {
    const p1 = profiles.find(p => p.u === i.from)
    const p2 = profiles.find(p => p.u === i.to)
    const text = `${profileName(p1 ?? { uid: i.from, u: i.from })} ${profileName(p2 ?? { uid: i.to, u: i.to })} ${i.from} ${i.to}`.toLowerCase()
    const matchSearch = !search || text.includes(search.toLowerCase())
    const matchStatus = !statusFilter || i.status === statusFilter
    return matchSearch && matchStatus
  })

  async function markMutual(interest: AdminInterest) {
    if (!interest._docId) return
    try {
      await updateDoc(doc(db, 'interests', interest._docId), { status: 'mutual', mutualAt: serverTimestamp() })
      setInterests(interests.map(i => i._docId === interest._docId ? { ...i, status: 'mutual' } : i))
      showToast('✅ Marked as Mutual Match')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function releaseContact(interest: AdminInterest) {
    if (!interest._docId) return
    try {
      await updateDoc(doc(db, 'interests', interest._docId), { status: 'contact_released', releasedAt: serverTimestamp() })
      setInterests(interests.map(i => i._docId === interest._docId ? { ...i, status: 'contact_released' } : i))
      showToast('📞 Contact released')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function removeInterest(interest: AdminInterest) {
    if (!interest._docId) return
    if (!confirm('Remove this interest record?')) return
    try {
      await deleteDoc(doc(db, 'interests', interest._docId))
      setInterests(interests.filter(i => i._docId !== interest._docId))
      showToast('Interest removed')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  function getStatusClass(status: string) {
    if (status === 'mutual') return s.statusMutual
    if (status === 'contact_released') return s.statusContact
    if (status === 'released') return s.statusArchived
    return s.statusPending
  }

  return (
    <div>
      <div className={s.secTools}>
        <input className={s.secSearch} placeholder="Search by name or username…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className={s.secFilter} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="mutual">Mutual</option>
          <option value="contact_released">Contact Released</option>
          <option value="released">Released</option>
        </select>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>
          {filtered.length} records
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className={s.emptyState}>No interest records found.</div>
      ) : (
        <div className={s.cardGrid}>
          {filtered.map((int) => {
            const p1 = profiles.find(p => p.u === int.from) ?? { uid: int.from, u: int.from, name: int.from }
            const p2 = profiles.find(p => p.u === int.to) ?? { uid: int.to, u: int.to, name: int.to }
            return (
              <div key={int._docId ?? `${int.from}_${int.to}`} className={s.card}>
                <div className={s.cardTop}>
                  <div className={s.cardAvatars}>
                    <div className={s.cardAvatar}>{profileEm(p1)}</div>
                    <div className={s.cardAvatar}>{profileEm(p2)}</div>
                  </div>
                  <div>
                    <div className={s.cardName}>{profileName(p1)} &amp; {profileName(p2)}</div>
                    <div className={`${s.cardStatus} ${getStatusClass(int.status)}`}>{STATUS_LABEL[int.status] ?? int.status}</div>
                  </div>
                </div>
                <div className={s.cardDetail}>
                  <strong>From:</strong> {profileName(p1)} (@{int.from})<br />
                  <strong>To:</strong> {profileName(p2)} (@{int.to})<br />
                  <strong>Date:</strong> {int.date ?? '—'}
                </div>
                <div className={s.cardActions}>
                  {int.status === 'pending' && (
                    <>
                      <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => markMutual(int)}>✓ Mark Mutual</button>
                      <button className={s.actBtn} onClick={() => removeInterest(int)}>Remove</button>
                    </>
                  )}
                  {int.status === 'mutual' && (
                    <>
                      <button className={`${s.actBtn} ${s.actBtnGrn}`} onClick={() => releaseContact(int)}>📞 Release Contact</button>
                      <button className={s.actBtn} onClick={() => removeInterest(int)}>🔓 Reset</button>
                    </>
                  )}
                  {int.status === 'contact_released' && (
                    <button className={s.actBtn} onClick={() => removeInterest(int)}>Remove</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
