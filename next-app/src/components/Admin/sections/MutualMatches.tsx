'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminEngaged, profileEm, profileName } from '../adminTypes'

export default function MutualMatches({ profiles, interests, engaged, setInterests, setEngaged, showToast }: SectionProps) {
  const mutual = interests.filter(i => i.status === 'mutual' || i.status === 'contact_released')
  const [engageModal, setEngageModal] = useState<{ fromU: string; toU: string; docId: string } | null>(null)
  const [engDate, setEngDate] = useState('')

  async function releaseContact(docId: string) {
    try {
      await updateDoc(doc(db, 'interests', docId), { status: 'contact_released', releasedAt: serverTimestamp() })
      setInterests(interests.map(i => i._docId === docId ? { ...i, status: 'contact_released' } : i))
      showToast('📞 Contact released')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function resetMatch(docId: string) {
    try {
      await updateDoc(doc(db, 'interests', docId), { status: 'pending' })
      setInterests(interests.map(i => i._docId === docId ? { ...i, status: 'pending' } : i))
      showToast('Match reset to pending')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function confirmEngagement() {
    if (!engageModal) return
    const p1 = profiles.find(p => p.u === engageModal.fromU)
    const p2 = profiles.find(p => p.u === engageModal.toU)
    if (!p1 || !p2) { showToast('Could not find profiles'); return }

    const engagementId = `${engageModal.fromU}_${engageModal.toU}`
    const newEng: AdminEngaged = {
      p1: { name: profileName(p1), u: p1.u, tier: p1.tier, em: profileEm(p1) },
      p2: { name: profileName(p2), u: p2.u, tier: p2.tier, em: profileEm(p2) },
      engDate: engDate || new Date().toISOString().split('T')[0],
      p1_paid: false,
      p2_paid: false,
      docId: engagementId,
    }

    try {
      await setDoc(doc(db, 'engagements', engagementId), { ...newEng, createdAt: serverTimestamp() })
      await updateDoc(doc(db, 'interests', engageModal.docId), { status: 'released' })
      setEngaged([...engaged, newEng])
      setInterests(interests.map(i => i._docId === engageModal.docId ? { ...i, status: 'released' } : i))
      setEngageModal(null)
      setEngDate('')
      showToast('💍 Engagement confirmed!')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  return (
    <div>
      {mutual.length === 0 ? (
        <div className={s.emptyState}>No mutual matches yet.</div>
      ) : (
        <div className={s.cardGrid}>
          {mutual.map((int) => {
            const p1 = profiles.find(p => p.u === int.from) ?? { uid: int.from, u: int.from, name: int.from }
            const p2 = profiles.find(p => p.u === int.to) ?? { uid: int.to, u: int.to, name: int.to }
            const isContactReleased = int.status === 'contact_released'
            return (
              <div key={int._docId} className={s.card}>
                <div className={s.cardTop}>
                  <div className={s.cardAvatars}>
                    <div className={s.cardAvatar}>{profileEm(p1)}</div>
                    <div className={s.cardAvatar}>{profileEm(p2)}</div>
                  </div>
                  <div>
                    <div className={s.cardName}>{profileName(p1)} &amp; {profileName(p2)}</div>
                    <div className={`${s.cardStatus} ${isContactReleased ? s.statusContact : s.statusMutual}`}>
                      {isContactReleased ? 'Contact Released' : 'Mutual Match'}
                    </div>
                  </div>
                </div>
                <div className={s.cardDetail}>
                  <strong>Match Date:</strong> {int.date ?? '—'}<br />
                  <strong>From:</strong> {int.from} &nbsp;<strong>To:</strong> {int.to}
                </div>
                <div className={s.cardActions}>
                  {!isContactReleased && (
                    <button className={`${s.actBtn} ${s.actBtnGrn}`} onClick={() => int._docId && releaseContact(int._docId)}>
                      📞 Release Contact
                    </button>
                  )}
                  {isContactReleased && (
                    <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => int._docId && setEngageModal({ fromU: int.from, toU: int.to, docId: int._docId })}>
                      💍 Confirm Engagement
                    </button>
                  )}
                  <button className={s.actBtn} onClick={() => int._docId && resetMatch(int._docId)}>🔓 Reset</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Engagement modal */}
      {engageModal && (
        <div className={s.overlay} onClick={e => e.target === e.currentTarget && setEngageModal(null)}>
          <div className={s.modal}>
            <div className={s.modalHead}>
              <div className={s.modalTitle}>💍 Confirm Engagement</div>
              <div className={s.modalSub}>
                {profileName(profiles.find(p => p.u === engageModal.fromU) ?? { uid: engageModal.fromU, u: engageModal.fromU })} &amp; {profileName(profiles.find(p => p.u === engageModal.toU) ?? { uid: engageModal.toU, u: engageModal.toU })}
              </div>
              <button className={s.modalClose} onClick={() => setEngageModal(null)}>×</button>
            </div>
            <div className={s.modalBody}>
              <div className={s.engWarn}>
                Once confirmed, this match will be moved to Engaged Couples. Both parties will be expected to settle their membership fees within 7 days.
              </div>
              <div className={s.formGroup}>
                <label className={s.formLabel}>Engagement Date</label>
                <input
                  className={s.formInput}
                  type="date"
                  value={engDate}
                  onChange={e => setEngDate(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
                <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={confirmEngagement} style={{ padding: '0.6rem 1.8rem' }}>
                  💍 Confirm Engagement
                </button>
                <button className={s.actBtn} onClick={() => setEngageModal(null)} style={{ padding: '0.6rem 1.4rem' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
