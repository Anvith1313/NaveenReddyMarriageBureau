'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminAppointment, tsToString } from '../adminTypes'

export default function Appointments({ showToast }: SectionProps) {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([])
  const [statusFilter, setStatusFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  useEffect(() => { load(statusFilter) }, [statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  async function load(filter: string) {
    setLoading(true)
    try {
      let q
      if (filter === 'all') q = query(collection(db, 'appointments'), orderBy('ts', 'desc'))
      else q = query(collection(db, 'appointments'), where('status', '==', filter))
      const snap = await getDocs(q)
      const appts: AdminAppointment[] = []
      snap.forEach(d => appts.push({ ...d.data(), docId: d.id } as AdminAppointment))
      appts.sort((a, b) => (b.ts ?? '').localeCompare(a.ts ?? ''))
      setAppointments(appts)
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
    setLoading(false)
  }

  async function confirmAppt(docId: string) {
    try {
      await updateDoc(doc(db, 'appointments', docId), { status: 'confirmed', confirmedAt: serverTimestamp() })
      setAppointments(appts => appts.map(a => a.docId === docId ? { ...a, status: 'confirmed' as const } : a))
      showToast('✅ Appointment confirmed')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  async function deleteAppt(docId: string) {
    if (!confirm('Delete this appointment?')) return
    try {
      await deleteDoc(doc(db, 'appointments', docId))
      setAppointments(appts => appts.filter(a => a.docId !== docId))
      showToast('Appointment deleted')
    } catch (e: unknown) { showToast('Error: ' + (e instanceof Error ? e.message : String(e))) }
  }

  function whatsappLink(a: AdminAppointment): string {
    const msg = encodeURIComponent(`Dear ${a.name}, your appointment at NRMB has been confirmed for ${a.date}${a.time ? ' at ' + a.time : ''}. Please arrive on time. — NRMB Team`)
    const num = a.mob.replace(/\D/g, '')
    return `https://wa.me/91${num}?text=${msg}`
  }

  return (
    <div>
      <div className={s.secTools}>
        <select className={s.secFilter} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="all">All</option>
        </select>
        <button className={s.actBtn} onClick={() => load(statusFilter)}>↻ Refresh</button>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? <div className={s.emptyState}>Loading…</div> : (
        appointments.length === 0 ? (
          <div className={s.emptyState}>No appointments found.</div>
        ) : (
          <div>
            {appointments.map(a => (
              <div key={a.docId} className={`${s.apptCard} ${a.status === 'confirmed' ? s.apptCardConfirmed : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <div className={s.apptName}>{a.name}</div>
                    <div className={s.apptMeta}>{a.mob}{a.username && a.username !== 'guest' ? ` · @${a.username}` : ''}</div>
                  </div>
                  <span className={`${s.apptStatusBadge} ${a.status === 'confirmed' ? s.apptBadgeConfirmed : s.apptBadgePending}`}>
                    {a.status}
                  </span>
                </div>
                <div className={s.apptDetail}>
                  📅 {a.date}{a.time ? ` · ${a.time}` : ''}{a.branch ? ` · ${a.branch}` : ''}
                  {a.purpose ? <><br />Purpose: {a.purpose}</> : null}
                  {a.msg ? <><br /><em>&quot;{a.msg}&quot;</em></> : null}
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', color: 'var(--a-muted)', marginBottom: '0.7rem' }}>
                  Booked: {tsToString(a.ts)}
                </div>
                <div className={s.apptActions}>
                  {a.status === 'pending' && (
                    <button className={`${s.actBtn} ${s.actBtnGrn}`} onClick={() => confirmAppt(a.docId)}>✓ Confirm</button>
                  )}
                  <a href={whatsappLink(a)} target="_blank" rel="noopener noreferrer">
                    <button className={`${s.actBtn} ${s.actBtnPrim}`}>💬 WhatsApp</button>
                  </a>
                  <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => deleteAppt(a.docId)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
