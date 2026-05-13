'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { useProfiles } from '@/lib/useProfiles'
import { Profile, Interest, formatIncome } from '@/lib/types'
import s from './dashboard.module.css'

type FanPos = 'left' | 'center' | 'right'
type FanSlot = 'profile' | 'details' | 'biodata'

const INITIAL: Record<FanSlot, FanPos> = { details: 'left', profile: 'center', biodata: 'right' }

function dobFmt(dateStr?: string) {
  if (!dateStr || dateStr === '—') return '—'
  try { return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return dateStr }
}

export default function MobileDashboard() {
  const router = useRouter()
  const { user, profile: me } = useAuth()
  const { pool, interests, engagements, savedProfiles: initSaved, loading, refetch } = useProfiles(me)

  const [idx, setIdx] = useState(0)
  const [saved, setSaved] = useState<string[]>(initSaved)
  const [positions, setPositions] = useState<Record<FanSlot, FanPos>>(INITIAL)
  const [animating, setAnimating] = useState(false)
  const [hint, setHint] = useState<{ text: string; out: boolean } | null>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setSaved(initSaved) }, [initSaved])
  useEffect(() => { setIdx(0); setPositions(INITIAL) }, [pool.length])

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  const current: Profile | null = pool[idx] ?? null

  const myInterest = current
    ? interests.find(i => (i.from === me?.u && i.to === current.u) || (i.from === current.u && i.to === me?.u)) ?? null
    : null

  const engagement = engagements.find(e => e.p1.u === me?.u || e.p2.u === me?.u) ?? null
  const partner = engagement ? (engagement.p1.u === me?.u ? engagement.p2 : engagement.p1) : null

  function showHint(text: string) {
    if (hintTimer.current) clearTimeout(hintTimer.current)
    setHint({ text, out: false })
    hintTimer.current = setTimeout(() => {
      setHint(h => h ? { ...h, out: true } : null)
      setTimeout(() => setHint(null), 400)
    }, 1800)
  }

  function rotate(dir: 'left' | 'right') {
    if (animating) return
    setAnimating(true)
    setPositions(prev => {
      const entries = Object.entries(prev) as [FanSlot, FanPos][]
      const center = entries.find(([, p]) => p === 'center')![0]
      const left = entries.find(([, p]) => p === 'left')![0]
      const right = entries.find(([, p]) => p === 'right')![0]
      const next = { ...prev }
      if (dir === 'left') { next[left as FanSlot] = 'center'; next[center as FanSlot] = 'right'; next[right as FanSlot] = 'left' }
      else { next[right as FanSlot] = 'center'; next[center as FanSlot] = 'left'; next[left as FanSlot] = 'right' }
      return next
    })
    setTimeout(() => {
      setAnimating(false)
      const label = dir === 'left' ? '✦ Tap to view full details' : '✦ Tap to view biodata'
      showHint(label)
    }, 560)
  }

  function selectCard(slot: FanSlot) {
    const pos = positions[slot]
    if (pos === 'center') {
      if (slot === 'details') router.push(`/profile/${current?.u}`)
      else if (slot === 'biodata') router.push(`/biodata/${current?.u}`)
    } else {
      rotate(pos === 'left' ? 'left' : 'right')
    }
  }

  function nextProfile() { setIdx(i => i >= pool.length - 1 ? 0 : i + 1); setPositions(INITIAL) }
  function prevProfile() { setIdx(i => i <= 0 ? pool.length - 1 : i - 1); setPositions(INITIAL) }

  async function toggleSave(u: string) {
    if (!me) return
    const isSaved = saved.includes(u)
    setSaved(prev => isSaved ? prev.filter(x => x !== u) : [...prev, u])
    try {
      await updateDoc(doc(db, 'users', me.uid), {
        savedProfiles: isSaved ? arrayRemove(u) : arrayUnion(u)
      })
    } catch { setSaved(prev => isSaved ? [...prev, u] : prev.filter(x => x !== u)) }
  }

  async function sendInterest(toU: string) {
    if (!me?.u) return
    try {
      await setDoc(doc(db, 'interests', `${me.u}_${toU}`), {
        from: me.u, to: toU, status: 'pending', createdAt: serverTimestamp(),
      })
      refetch()
    } catch (e) { console.error(e) }
  }

  function posClass(pos: FanPos) {
    return pos === 'center' ? s.fanCenter : pos === 'left' ? s.fanLeft : s.fanRight
  }

  if (loading || !user) return null

  if (engagement && partner) {
    return (
      <div className={s.page}>
        <div className={s.hero}>
          <div className={s.heroWelcome}>Your Account is On Hold</div>
        </div>
        <div className={s.area}>
          <div className={s.engCard}>
            <div className={s.engRing}>💍</div>
            <div className={s.engTitle}>Congratulations!</div>
            <div className={s.engText}>
              Your upcoming engagement with <strong>{partner.name ?? 'your partner'}</strong> is being finalised.
              Profile browsing is paused while the bureau completes the process.
            </div>
            <button type="button" className={s.btnCrimsonPill} onClick={() => router.push('/interests')}>
              View Your Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <div className={s.heroWelcome}>Welcome{me?.name ? `, ${(me.name as string).split(' ')[0]}` : ''}</div>
        <div className={s.heroSub}>Discover your destined match below</div>
      </div>

      <div className={s.area}>
        {pool.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyEmoji}>🌸</div>
            <div className={s.emptyTitle}>No Members Yet</div>
            <div className={s.emptyText}>New verified members join us daily. Check back soon.</div>
          </div>
        ) : current && (
          <>
            <div className={s.fanWrap}>
              <div className={`${s.fanSlot} ${posClass(positions.details)}`} onClick={() => selectCard('details')}>
                <DetailsCard p={current} />
              </div>
              <div className={`${s.fanSlot} ${posClass(positions.biodata)}`} onClick={() => selectCard('biodata')}>
                <BiodataCard p={current} />
              </div>
              <div className={`${s.fanSlot} ${posClass(positions.profile)}`}>
                <ProfileCard
                  p={current}
                  saved={saved.includes(current.u)}
                  myInterest={myInterest}
                  onSave={() => toggleSave(current.u)}
                  onInterest={() => sendInterest(current.u)}
                  onWhatsapp={() => window.open(`https://wa.me/91${current.mob}?text=Hello, I found your profile on Reddy Elite Matrimony`, '_blank')}
                />
              </div>
            </div>

            <div className={s.navRow}>
              <button type="button" className={s.navBtn} onClick={prevProfile} aria-label="Previous profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <span className={s.navCount}>{idx + 1} / {pool.length}</span>
              <button type="button" className={s.navBtn} onClick={nextProfile} aria-label="Next profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </>
        )}
      </div>

      {hint && (
        <div className={`${s.tapHint} ${hint.out ? s.tapHintOut : ''}`}>{hint.text}</div>
      )}
    </div>
  )
}

function ProfileCard({ p, saved, myInterest, onSave, onInterest, onWhatsapp }: {
  p: Profile; saved: boolean; myInterest: Interest | null
  onSave: () => void; onInterest: () => void; onWhatsapp: () => void
}) {
  const contactOk = myInterest?.status === 'contact_released'
  const isMutual = myInterest?.status === 'mutual' || contactOk
  const isPending = myInterest?.status === 'pending'
  return (
    <div className={s.pcard}>
      <div className={s.pcardHead}>
        <span className={s.pcEmoji}>{p.em ?? '💫'}</span>
        <div className={s.pcTierPill}>{p.tier ?? 'VIP'}</div>
        <div className={s.pcVerify}>✓ Verified</div>
        <button type="button" className={`${s.pcBookmark} ${saved ? s.saved : ''}`} onClick={onSave} aria-label="Save profile">
          <svg viewBox="0 0 24 24" fill={saved ? '#B8892A' : 'none'} stroke={saved ? '#B8892A' : 'rgba(255,255,255,0.8)'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className={s.pcardBody}>
        <div className={s.pcName}>{p.name}, {p.age}</div>
        <div className={s.pcSub}>{p.prof ?? p.occ ?? '—'} · {p.city ?? '—'}{p.country ? `, ${p.country}` : ''} · {p.nat ?? p.native ?? '—'}</div>
        <div className={s.pcDiv}><span>✦</span></div>
        <div className={s.detGrid}>
          <div><div className={s.diL}>Age</div><div className={s.diV}>{p.age} Years</div></div>
          <div><div className={s.diL}>Height</div><div className={s.diV}>{p.ht ?? '—'}</div></div>
          <div><div className={s.diL}>Education</div><div className={s.diV}>{p.edu ?? '—'}</div></div>
          <div><div className={s.diL}>Income</div><div className={s.diV}>{formatIncome(p.inc ?? p.sal)}</div></div>
          <div><div className={s.diL}>Native</div><div className={s.diV}>{p.nat ?? p.native ?? '—'}</div></div>
          <div><div className={s.diL}>Diet</div><div className={s.diV}>{p.diet ?? '—'}</div></div>
          <div><div className={s.diL}>Rashi</div><div className={s.diV}>{p.rashi ?? '—'}</div></div>
          <div><div className={s.diL}>Nakshatra</div><div className={s.diV}>{p.nak ?? '—'}</div></div>
        </div>
      </div>
      <div className={s.actions}>
        {!isMutual && (isPending ? (
          <div className={s.btnInterestSent}>✓ Interest Expressed</div>
        ) : (
          <button type="button" className={s.btnInterest} onClick={onInterest}>Express Interest</button>
        ))}
        {contactOk && (
          <button type="button" className={s.btnWhatsapp} onClick={onWhatsapp} aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
        )}
      </div>
    </div>
  )
}

function DetailsCard({ p }: { p: Profile }) {
  return (
    <div className={s.detCard}>
      <div className={s.detCardHead}><div className={s.detCardTitle}>Full Details</div></div>
      <div className={s.detCardBody}>
        <div className={s.detSection}>Personal</div>
        <div className={s.detGrid}>
          <div><div className={s.diL}>Age</div><div className={s.diV}>{p.age} Yrs</div></div>
          <div><div className={s.diL}>Height</div><div className={s.diV}>{p.ht ?? '—'}</div></div>
          <div><div className={s.diL}>Diet</div><div className={s.diV}>{p.diet ?? '—'}</div></div>
          <div><div className={s.diL}>Location</div><div className={s.diV}>{p.city ?? '—'}</div></div>
        </div>
        <div className={s.detSection}>Astrological</div>
        <div className={s.detGrid}>
          <div><div className={s.diL}>Gotra</div><div className={s.diV}>{p.gotra ?? '—'}</div></div>
          <div><div className={s.diL}>Rashi</div><div className={s.diV}>{p.rashi ?? '—'}</div></div>
          <div><div className={s.diL}>Nakshatra</div><div className={s.diV}>{p.nak ?? '—'}</div></div>
          <div><div className={s.diL}>Native</div><div className={s.diV}>{p.nat ?? p.native ?? '—'}</div></div>
        </div>
        <div className={s.detSection}>Career</div>
        <div className={s.detGrid}>
          <div><div className={s.diL}>Education</div><div className={s.diV}>{p.edu ?? '—'}</div></div>
          <div><div className={s.diL}>Profession</div><div className={s.diV}>{p.prof ?? p.occ ?? '—'}</div></div>
        </div>
        <div className={s.detSection}>Family</div>
        <div className={s.detGrid}>
          <div><div className={s.diL}>Father</div><div className={s.diV}>{(p.fn as string) ?? '—'}</div></div>
          <div><div className={s.diL}>Mother</div><div className={s.diV}>{(p.mn as string) ?? '—'}</div></div>
        </div>
      </div>
    </div>
  )
}

function BiodataCard({ p }: { p: Profile }) {
  const rows: [string, string][] = [
    ['Date of Birth', dobFmt(p.dob)],
    ['Height', p.ht ?? '—'],
    ['Complexion', (p.cx as string) ?? '—'],
    ['Gotram', (p.fg as string) ?? p.gotra ?? '—'],
    ['Sub Caste', p.gotra ?? '—'],
    ['Star', p.nak ?? '—'],
    ['Native Dist', p.nat ?? p.native ?? '—'],
    ['Raasi', p.rashi ?? '—'],
    ['Settled Place', p.city ?? '—'],
    ['Occupation', p.prof ?? p.occ ?? '—'],
    ['Salary', formatIncome(p.inc ?? p.sal)],
  ]
  return (
    <div className={s.bioCard}>
      <div className={s.bioHead}>
        <div className={s.bioOrg}>Naveen Reddy Marriage Bureau</div>
        <div className={s.bioSub}>Matrimonial Biodata</div>
      </div>
      <div className={s.bioBody}>
        {rows.map(([label, val]) => (
          <div key={label} className={s.bioRow}>
            <span className={s.bioLabel}>{label}</span>
            <span className={s.bioValue}> : {val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
