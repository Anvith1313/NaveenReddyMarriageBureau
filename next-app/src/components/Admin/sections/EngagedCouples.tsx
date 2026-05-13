'use client'

import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'

export default function EngagedCouples({ engaged, setEngaged, showToast }: SectionProps) {
  async function markPaid(idx: number, side: 1 | 2) {
    const e = engaged[idx]
    if (!e.docId) return
    const field = side === 1 ? 'p1_paid' : 'p2_paid'
    try {
      await updateDoc(doc(db, 'engagements', e.docId), { [field]: true })
      const updated = engaged.map((item, i) => i === idx ? { ...item, [field]: true } : item)
      setEngaged(updated)
      showToast(`✅ Payment marked for ${side === 1 ? e.p1?.name : e.p2?.name}`)
    } catch (err: unknown) { showToast('Error: ' + (err instanceof Error ? err.message : String(err))) }
  }

  function sendReminder(idx: number) {
    const e = engaged[idx]
    const p = !e.p1_paid ? e.p1 : e.p2
    const mob = p?.name
    const msg = `Dear ${mob}, kindly settle your membership fee at the earliest. Thank you — NRMB Team`
    alert(`Reminder message (copy & send via WhatsApp):\n\n${msg}`)
  }

  return (
    <div>
      {engaged.length === 0 ? (
        <div className={s.emptyState}>No engaged couples recorded.</div>
      ) : (
        <div className={s.cardGrid}>
          {engaged.map((e, idx) => {
            const deadline = e.engDate
              ? new Date(new Date(e.engDate).getTime() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
              : '—'
            const bothPaid = e.p1_paid && e.p2_paid
            return (
              <div key={e.docId ?? idx} className={s.card}>
                <div className={s.cardTop}>
                  <div className={s.cardAvatars}>
                    <div className={s.cardAvatar}>{e.p1?.em ?? '👤'}</div>
                    <div className={s.cardAvatar}>{e.p2?.em ?? '👤'}</div>
                  </div>
                  <div>
                    <div className={s.cardName}>{e.p1?.name ?? '—'} &amp; {e.p2?.name ?? '—'}</div>
                    <div className={`${s.cardStatus} ${bothPaid ? s.statusContact : s.statusMutual}`}>
                      {bothPaid ? '✅ Fully Paid' : '⏳ Payment Pending'}
                    </div>
                  </div>
                </div>
                <div className={s.cardDetail}>
                  <strong>Engagement Date:</strong> {e.engDate ?? '—'}<br />
                  <strong>Payment Deadline:</strong> {deadline}<br />
                  <strong>{e.p1?.name ?? 'P1'} ({e.p1?.tier ?? 'VIP'}):</strong> {e.p1_paid ? '✅ Paid' : '❌ Unpaid'}
                  &nbsp;·&nbsp;
                  <strong>{e.p2?.name ?? 'P2'} ({e.p2?.tier ?? 'VIP'}):</strong> {e.p2_paid ? '✅ Paid' : '❌ Unpaid'}
                </div>
                <div className={s.cardActions}>
                  {!e.p1_paid && (
                    <button className={s.actBtn} onClick={() => markPaid(idx, 1)}>
                      Mark {e.p1?.name ?? 'P1'} Paid
                    </button>
                  )}
                  {!e.p2_paid && (
                    <button className={s.actBtn} onClick={() => markPaid(idx, 2)}>
                      Mark {e.p2?.name ?? 'P2'} Paid
                    </button>
                  )}
                  {!bothPaid && (
                    <button className={s.actBtn} onClick={() => sendReminder(idx)}>📨 Reminder</button>
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
