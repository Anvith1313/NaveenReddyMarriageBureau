'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { Profile } from '@/lib/types'
import s from './biodata.module.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function fmtDob(d: string | undefined): string {
  if (!d || d === '—') return '—'
  try {
    const dt = new Date(d)
    return `${String(dt.getDate()).padStart(2,'0')}-${MONTHS[dt.getMonth()]}-${dt.getFullYear()}`
  } catch { return d }
}

function fmt12(t: string | undefined): string {
  if (!t || t === '—') return ''
  try {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + ' ' + ampm
  } catch { return t }
}

function fmtSal(v: string | undefined): string {
  if (!v || v === '—' || v === '' || v === '0') return '—'
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''))
  if (isNaN(n) || n <= 0) return String(v)
  if (n >= 10000000) return (n / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Crore,PA'
  if (n >= 100000)   return (n / 100000).toFixed(1).replace(/\.?0+$/, '') + ' Lakhs,PA'
  if (n >= 1000)     return (n / 1000).toFixed(0) + ' Thousand,PA'
  return n + ',PA'
}

function Row({ label, value, label2, value2 }: {
  label: string
  value?: string | number | null
  label2?: string
  value2?: string | number | null
}) {
  const cell = (l: string, v?: string | number | null) => (
    <div className={s.row}>
      <span className={s.lbl}>{l}</span>
      <span className={s.colon}>:</span>
      <span className={s.val}>{v || '—'}</span>
    </div>
  )
  if (label2 !== undefined) {
    return <div className={s.rowTwo}>{cell(label, value)}{cell(label2, value2)}</div>
  }
  return cell(label, value)
}

export default function BiodataPage({ uid, desktop = false }: { uid: string; desktop?: boolean }) {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const sheetRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Zoom-to-fit: scale the A4 sheet to fill mobile screen width
  useEffect(() => {
    if (desktop || !sheetRef.current || !wrapRef.current) return
    function applyZoom() {
      const sheet = sheetRef.current!
      const wrap = wrapRef.current!
      const screenW = window.innerWidth - 16
      const naturalW = sheet.scrollWidth
      if (naturalW > screenW) {
        const z = +(screenW / naturalW).toFixed(3)
        sheet.style.transform = `scale(${z})`
        sheet.style.transformOrigin = 'top center'
        wrap.style.height = `${sheet.scrollHeight * z}px`
      }
    }
    // Wait one frame for fonts/images to settle, then zoom
    const raf = requestAnimationFrame(() => setTimeout(applyZoom, 80))
    window.addEventListener('resize', applyZoom)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', applyZoom) }
  }, [desktop, profile])

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          setProfile({ ...snap.data(), uid: snap.id } as Profile)
        } else {
          const q = query(collection(db, 'users'), where('u', '==', uid))
          const qSnap = await getDocs(q)
          if (!qSnap.empty) setProfile({ ...qSnap.docs[0].data(), uid: qSnap.docs[0].id } as Profile)
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [uid, user, router])

  if (loading) return <div className={s.loadWrap}><div className={s.spinner} /></div>
  if (!profile) return (
    <div className={s.notFound}>
      <p>Profile not found.</p>
      <button type="button" className={s.btnBack} onClick={() => router.back()}>← Go Back</button>
    </div>
  )

  const p = profile as Profile & Record<string, unknown>

  // ── SI Number (hash-based, identical to original) ──
  const tier = (p.tier as string) || 'VIP'
  const uidHash = ((p.u as string) || '').split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 7), 0)
  const slNum = 10000 + Math.abs(uidHash % 90000)
  const slId = p.slid && p.slid !== '—' ? String(p.slid) : `${tier.toUpperCase()} ${slNum}`

  // ── Gender ──
  const gender = (p.g as string) === 'Female' ? 'Bride' : 'Groom'

  // ── Date / time of birth ──
  const dobStr = fmtDob(p.dob as string)
  const tobStr = fmt12(p.tob as string)
  const pob = (p.pob as string) || ''
  const timePlace = [tobStr, pob && pob !== '—' ? pob : ''].filter(Boolean).join(', ')

  // ── Education labels ──
  const board = (p.board as string) || ''
  const boardLbl = board && board !== '—' && board !== 'Other' ? board + ' School Name' : 'School Name'
  const colVal = ((p.col as string) || '').trim()
  const colLow = colVal.toLowerCase()
  const pgLbl = colLow.startsWith('ms ') || colLow.includes(' ms ') || colLow.startsWith('m.s.')
    ? 'MS College Name'
    : colLow.startsWith('mba') || colLow.includes(' mba ')
    ? 'MBA College Name'
    : 'PG College Name'

  // ── Career ──
  const salDisplay = fmtSal((p.inc as string) || (p.sal as string) || '')
  const isBusinessOcc = (p.emp as string) === 'Business / Self-Employed'
    || ((p.prof as string) || '').toLowerCase().includes('business')
    || ((p.prof as string) || '').toLowerCase().includes('director')
  const placeLabel = isBusinessOcc ? 'Place of Business' : 'Place of Job'
  const workLoc = [(p.wcountry as string), (p.wstate as string), (p.wcity as string)]
    .filter(v => v && v !== '—').join(', ') || (p.workplace as string) || ''

  // ── Marital status ──
  const msVal = ((p.ms as string) || (p.maritalStatus as string) || '')
  const isDivorced = msVal.toLowerCase().includes('divorce') || msVal.toLowerCase().includes('separated')

  // ── Siblings ──
  const bCnt = parseInt(p.br as string) || 0
  const sCnt = parseInt(p.sr as string) || 0
  const bMar = parseInt(p.brm as string) || 0
  const sMar = parseInt(p.srm as string) || 0
  const broOcc = (p.bro_occ as string) || ''
  const sisOcc = (p.sis_occ as string) || ''

  // ── Partner preferences ──
  const ageGap = (p.pp_af && p.pp_at) ? `${p.pp_af} - ${p.pp_at} Years` : '—'

  // ── Branch color (blue online, crimson offline) — passed as CSS variable ──
  const isOnline = ((p.registrationSource as string) || 'online') !== 'offline'
  const branchColor = isOnline ? '#111' : '#8b1a2a'

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : s.pageMobile}`}>
      <div className={s.controls}>
        <button type="button" className={s.btnBack} onClick={() => router.back()}>← Back</button>
      </div>

      <div ref={wrapRef} className={s.sheetWrap}>
      <div ref={sheetRef} className={s.sheet}>
        {/* ── Header ── */}
        <div className={s.metaRow}>
          <span className={s.metaSince}><em>Since 2000</em></span>
          <div className={s.logoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Assets/Biodata-logo.jpg"
              alt="Naveen Reddy Marriage Bureau"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span
            className={s.metaSlNum}
            style={{ ['--br-c' as string]: branchColor }}
          >
            <em>SI No :</em> <strong>{slId}</strong>
          </span>
        </div>

        <div className={s.address}>
          <span className={s.addrRed}>Corporate office:</span>{' '}
          <span className={s.addrBlue}>Somajiguda,</span>&nbsp;
          <span className={s.addrRed}>Branches:</span>{' '}
          <span className={s.addrBlack}>Kothapet, Warangal, Karimnagar</span>
        </div>

        {/* ── Personal ── */}
        <Row label={`Name of the ${gender}`} value={p.name} />
        <Row label="Date of Birth" value={dobStr} label2="Height" value2={p.ht as string} />
        {timePlace ? <Row label="Time and Place" value={timePlace} /> : null}
        <Row label="Complexion / Color" value={(p.cx as string) || '—'} label2="Gotram" value2={(p.fg as string) || (p.gotra as string) || '—'} />
        <Row label="Sub Caste" value={(p.gotra as string) || '—'} label2="Star" value2={(p.nak as string) || '—'} />
        <Row label="Native Dist" value={(p.nat as string) || (p.native as string) || '—'} label2="Raasi" value2={(p.rashi as string) || '—'} />
        <Row label="Settled Place" value={p.city} />

        {/* ── Education (conditional) ── */}
        {p.school && p.school !== '—' ? <Row label={boardLbl} value={p.school as string} /> : null}
        {p.inter && p.inter !== '—' ? <Row label="Inter College Name" value={p.inter as string} /> : null}
        {p.engcol && p.engcol !== '—' ? <Row label="Engineering College Name" value={p.engcol as string} /> : null}
        {colVal && colVal !== '—' ? <Row label={pgLbl} value={colVal} /> : null}

        {/* ── Career ── */}
        <Row label="Occupation" value={(p.prof as string) || (p.occ as string)} />
        {p.co && p.co !== '—' ? <Row label="Company Name" value={p.co as string} /> : null}
        {workLoc ? <Row label={placeLabel} value={workLoc} /> : null}
        {salDisplay && salDisplay !== '—' ? (
          p.visa && p.visa !== '—'
            ? <Row label="Salary" value={salDisplay} label2="Visa Status" value2={p.visa as string} />
            : <Row label="Salary" value={salDisplay} />
        ) : null}
        {p.sinceWork && p.sinceWork !== '—' ? <Row label="Since Working" value={p.sinceWork as string} /> : null}
        {isDivorced && p.divorceInfo && p.divorceInfo !== '—' ? <Row label="Divorces" value={p.divorceInfo as string} /> : null}

        <div className={s.spacer} />

        {/* ── Family ── */}
        <div className={s.secTitle}>FAMILY MEMBERS DETAILS</div>
        <Row label="Father's Profession" value={(p.fo as string) || (p.fp as string)} />
        <Row label="Mother's Profession" value={p.mo as string} />
        <div className={s.gap} />

        {/* ── Siblings ── */}
        {bCnt > 0 ? <Row label={bCnt > 1 ? 'Brothers' : 'Brother'} value={`${bCnt} (Married: ${bMar})${broOcc && broOcc !== '—' ? ' / ' + broOcc : ''}`} /> : null}
        {sCnt > 0 ? <Row label={sCnt > 1 ? 'Sisters' : 'Sister'} value={`${sCnt} (Married: ${sMar})${sisOcc && sisOcc !== '—' ? ' / ' + sisOcc : ''}`} /> : null}
        {!bCnt && !sCnt ? <Row label="" value="No Siblings" /> : null}

        <div className={s.anchor} />

        {/* ── Partner preferences ── */}
        <div className={s.secTitle}>CHOICE PREFERRED</div>
        <Row label="Age Range" value={ageGap} label2="Complexion / Color" value2={(p.pp_cx as string) || 'Any'} />
        <Row
          label="Height"
          value={p.pp_hf && p.pp_hf !== 'Any' ? `${p.pp_hf} And Above` : 'Any'}
          label2="Qualification"
          value2={(p.pp_edu as string) || 'Any'}
        />
        <Row label="Profession" value={(p.pp_occ as string) || 'Any'} label2="Expected Income" value2={(p.pp_inc as string) || 'Any'} />
        <Row
          label="Preferred Location"
          value={(p.pploc as string) || (p.pp_loc as string) || 'Any'}
          label2="NRI Preference"
          value2={(p.pp_nri as string) || 'Any'}
        />
        {p.pp_note && String(p.pp_note).trim() ? <Row label="Other Notes" value={String(p.pp_note)} /> : null}

        {/* ── Footer ── */}
        <div className={s.footer}>
          <span className={s.footerLbl}>Relationship</span>
          <span className={s.colon}>:</span>
          <span className={s.val}>{(p.rel as string) || 'Father'}</span>
        </div>
        <div className={s.actionRow}>
          <button type="button" className={s.closeBtn} onClick={() => router.back()}>Close</button>
        </div>
      </div>
      </div>{/* /sheetWrap */}
    </div>
  )
}
