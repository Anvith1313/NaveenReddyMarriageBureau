'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { ActivityItem, tsToString } from '../adminTypes'

function badgeClass(type: string) {
  if (type === 'signup') return s.badgeSignup
  if (type === 'interest') return s.badgeInterest
  if (type === 'appt') return s.badgeAppt
  if (type === 'update') return s.badgeUpdate
  if (type === 'engaged') return s.badgeEngaged
  return ''
}

function badgeLabel(type: string) {
  if (type === 'signup') return 'Signup'
  if (type === 'interest') return 'Interest'
  if (type === 'appt') return 'Appointment'
  if (type === 'update') return 'Update'
  if (type === 'engaged') return 'Engaged'
  if (type === 'login') return 'Login'
  return type
}

export default function ActivityLog({ showToast }: SectionProps) {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    const all: ActivityItem[] = []
    try {
      // Users
      const userSnap = await getDocs(collection(db, 'users'))
      userSnap.forEach(d => {
        const p = d.data()
        if (p.status === 'deleted' || p.status === 'merged') return
        const em = p.em || p.emoji || '👤'
        const nm = p.name || p.displayName || p.email || d.id
        if (p.createdAt) all.push({ type: 'signup', icon: em, name: nm, desc: 'New member registered', ts: p.createdAt })
        if (p.updatedAt && p.updatedAt !== p.createdAt) all.push({ type: 'update', icon: em, name: nm, desc: 'Profile updated', ts: p.updatedAt })
      })
    } catch { /* skip */ }
    try {
      // Interests
      const intSnap = await getDocs(collection(db, 'interests'))
      intSnap.forEach(d => {
        const i = d.data()
        all.push({ type: 'interest', icon: '💌', name: i.from, desc: `Sent interest to ${i.to}`, ts: i.createdAt || i.date || '' })
      })
    } catch { /* skip */ }
    try {
      // Appointments
      const apptSnap = await getDocs(collection(db, 'appointments'))
      apptSnap.forEach(d => {
        const a = d.data()
        all.push({ type: 'appt', icon: '📅', name: a.name, desc: `Appointment booked for ${a.date}`, ts: a.ts || '' })
      })
    } catch { /* skip */ }
    try {
      // Engagements
      const engSnap = await getDocs(collection(db, 'engagements'))
      engSnap.forEach(d => {
        const e = d.data()
        all.push({ type: 'engaged', icon: '💍', name: `${e.p1?.name ?? '?'} & ${e.p2?.name ?? '?'}`, desc: 'Engagement confirmed', ts: e.createdAt || e.engDate || '' })
      })
    } catch { /* skip */ }

    // Sort and take top 50
    all.sort((a, b) => {
      const ta = typeof a.ts === 'object' && 'seconds' in a.ts ? a.ts.seconds : new Date(a.ts as string).getTime() / 1000
      const tb = typeof b.ts === 'object' && 'seconds' in b.ts ? b.ts.seconds : new Date(b.ts as string).getTime() / 1000
      return tb - ta
    })
    setItems(all.slice(0, 80))
    setLoading(false)
    if (all.length > 0) showToast(`Loaded ${all.length} activity records`)
  }

  if (loading) return <div className={s.emptyState}>Loading activity feed…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.8rem' }}>
        <button className={s.actBtn} onClick={load}>↻ Refresh</button>
      </div>
      <div className={s.actLogFeed}>
        {items.length === 0 ? (
          <div className={s.actLogEmpty}>No activity records found.</div>
        ) : items.map((item, i) => (
          <div key={i} className={s.actLogItem}>
            <div className={s.actLogAvatar}>{item.icon}</div>
            <div className={s.actLogMain}>
              <span className={s.actLogName}>{item.name}</span>
              <span className={`${s.actLogBadge} ${badgeClass(item.type)}`}>{badgeLabel(item.type)}</span>
              <div className={s.actLogDesc}>{item.desc}</div>
            </div>
            <div className={s.actLogTime}>{tsToString(item.ts)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
