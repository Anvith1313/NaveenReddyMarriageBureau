'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import s from './static.module.css'

const STATIC_STORIES = [
  { names: 'Priya & Rahul Reddy', year: 'Married · December 2023 · Hyderabad', text: '"NRMB\'s personal attention made all the difference for our families. An experience beyond expectations."' },
  { names: 'Ananya & Kiran Reddy', year: 'Married · March 2024 · Bangalore', text: '"The verification process gave us complete confidence. Within three months we found each other."' },
  { names: 'Deepa & Vivek Reddy', year: 'Married · August 2023 · London', text: '"As NRI members the Elite tier exceeded every expectation. Truly a white-glove service."' },
  { names: 'Kavya & Suresh Reddy', year: 'Married · January 2024 · Warangal', text: '"Both our families are from Warangal. NRMB found our common roots beautifully."' },
  { names: 'Meena & Arjun Reddy', year: 'Married · October 2022 · Vijayawada', text: '"Professional, private and perfect. NRMB changed our perspective on matrimony bureaus."' },
  { names: 'Roja & Naresh Reddy', year: 'Married · June 2023 · USA', text: '"Two Telangana families in the USA, united by NRMB. A beautifully bridged distance."' },
]

export default function StoriesPage({ desktop = false }: { desktop?: boolean }) {
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')
  const [yr, setYr] = useState('')
  const [loc, setLoc] = useState('')
  const [msg, setMsg] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!n1.trim() || !n2.trim() || !yr || !msg.trim()) return
    setLoading(true)
    try {
      await addDoc(collection(db, 'stories'), {
        names: `${n1.trim()} & ${n2.trim()}`,
        year: yr,
        location: loc.trim(),
        text: msg.trim(),
        contact: contact.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } catch { /* silent */ }
    setLoading(false)
  }

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroTag}>Real Couples</div>
        <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>Happy Stories</div>
      </div>

      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        <div className={s.secHd}>
          <div className={s.secTag}>Real Couples</div>
          <div className={s.secTitle}>Thousands of Blessed Unions</div>
          <div className={s.secSub}>Our greatest achievement — the happiness of families we have united</div>
        </div>

        <div className={`${s.storiesGrid} ${desktop ? s.storiesGridDesktop : ''}`}>
          {STATIC_STORIES.map(st => (
            <div key={st.names} className={s.storyCard}>
              <div className={s.storyNames}>{st.names}</div>
              <div className={s.storyMeta}>{st.year}</div>
              <div className={s.storyText}>{st.text}</div>
            </div>
          ))}
        </div>

        <div className={`${s.secHd} ${s.storyFormHd}`}>
          <div className={s.secTag}>Share Your Joy</div>
          <div className={s.secTitle}>Got Married Through NRMB?</div>
          <div className={s.secSub}>We&apos;d be honoured to feature your love story.</div>
        </div>

        {submitted ? (
          <div className={`${s.card} ${s.storyThanks}`}>
            <div className={s.storyThanksEmoji}>💌</div>
            <div className={s.storyNames}>Thank you for sharing your story!</div>
            <div className={s.storyText}>We&apos;ll review and publish it within 2–3 business days.</div>
          </div>
        ) : (
          <div className={s.formCard}>
            <div className={s.formGrid}>
              <div className={s.ff}>
                <label className={s.ffLabel}>Partner 1 Name *</label>
                <input className={s.ffInput} placeholder="e.g. Priya Reddy" value={n1} onChange={e => setN1(e.target.value)} />
              </div>
              <div className={s.ff}>
                <label className={s.ffLabel}>Partner 2 Name *</label>
                <input className={s.ffInput} placeholder="e.g. Rahul Reddy" value={n2} onChange={e => setN2(e.target.value)} />
              </div>
              <div className={s.ff}>
                <label className={s.ffLabel}>Year of Marriage *</label>
                <input className={s.ffInput} type="number" placeholder="2024" value={yr} onChange={e => setYr(e.target.value)} />
              </div>
              <div className={s.ff}>
                <label className={s.ffLabel}>City / Location</label>
                <input className={s.ffInput} placeholder="e.g. Hyderabad" value={loc} onChange={e => setLoc(e.target.value)} />
              </div>
            </div>
            <div className={`${s.ff} ${s.ffMt}`}>
              <label className={s.ffLabel}>Your Story *</label>
              <textarea className={`${s.ffInput} ${s.ffTextarea}`} placeholder="Tell us how NRMB helped bring you together…" value={msg} onChange={e => setMsg(e.target.value)} />
            </div>
            <div className={`${s.ff} ${s.ffMt}`}>
              <label className={s.ffLabel}>Mobile / Email (for verification)</label>
              <input className={s.ffInput} placeholder="We'll verify before publishing" value={contact} onChange={e => setContact(e.target.value)} />
            </div>
            <button type="button" className={s.btnSubmit} onClick={submit} disabled={loading}>
              {loading ? 'Submitting…' : 'Share Our Story ✦'}
            </button>
            <p className={s.formNote}>Stories are reviewed and published within 2–3 business days.</p>
          </div>
        )}
      </div>
    </div>
  )
}
