'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { RichSelect } from '@/components/ui/rich-select'
import {
  useSignupForm,
  INDIA_STATES, HEIGHTS, GOTRAS, NAKSHATRAS, RASHIS,
  SignupFormState,
} from '@/lib/useSignupForm'
import DatePicker from '@/components/DatePicker/DatePicker'
import s from './signup.module.css'

// ── Progress messages ─────────────────────────────────────────────────────────
const MSGS = [
  { to: 15,  text: "Let’s start! Tell us about yourself." },
  { to: 30,  text: "Great start! You’re doing wonderfully 🌸" },
  { to: 50,  text: "Halfway there! Your profile is taking shape." },
  { to: 70,  text: "More than halfway! Almost done." },
  { to: 85,  text: "Almost there! Just a few final touches ✨" },
  { to: 100, text: "Final step! Your perfect match awaits 💍" },
]
function progressMsg(pct: number) {
  return MSGS.find(m => pct < m.to)?.text ?? MSGS[MSGS.length - 1].text
}

const TERMS = `1. Eligibility: Membership is exclusively for Reddy community members of Hindu religion.

2. Membership Fees (Non-Refundable): VIP ₹15,000/yr · Elite ₹1,00,000/yr · VVIP ₹30,000/yr.

3. Post-Engagement Fee: Upon engagement facilitated by NRMB, each individual must pay within 7 days.

4. Privacy: Contact details are NOT shared unless both parties express interest and the bureau approves.

5. Code of Conduct: Dignity, honesty and respect are mandatory. Misuse leads to termination.

6. Governing Law: Telangana, India. Disputes subject to Hyderabad jurisdiction.`

const DRAFT_FIELDS: (keyof SignupFormState)[] = [
  'profileFor','relationship','gender','name','email',
  'maritalStatus','dob','height','complexion','motherTongue',
  'country','state','city','nativePlace','residentialStatus',
  'gotra','fatherGotra','nakshatra','rashi',
  'highestQual','degreeCollege','pgCollege',
  'employedIn','occupation','company','workCountry','workState','workCity','annualIncome',
  'diet','smoking','drinking','aboutYourself',
  'familyType','familyValues','fatherName','fatherStatus','motherName','motherStatus',
  'ppAgeFrom','ppAgeTo','ppHeight','ppIncome','ppNRI',
  'mobile','username','tier',
]

// ── Small helpers ─────────────────────────────────────────────────────────────
function Tile({ icon, label, sub, selected, onClick }: {
  icon: string; label: string; sub?: string; selected: boolean; onClick: () => void
}) {
  return (
    <button type="button" className={selected ? s.tileSelected : s.tile} onClick={onClick}>
      <span className={s.tileIcon}>{icon}</span>
      <span className={s.tileLabel}>{label}</span>
      {sub && <span className={s.tileSub}>{sub}</span>}
    </button>
  )
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" className={selected ? s.radioOptSelected : s.radioOpt} onClick={onClick}>
      {selected && <span>✓ </span>}{label}
    </button>
  )
}

// ── Screen list ───────────────────────────────────────────────────────────────
const SCREENS = [
  'for', 'rel', 'name', 'dob', 'height',
  'location', 'native', 'community', 'education', 'career',
  'lifestyle', 'family', 'partner', 'account', 'tier', 'review',
] as const
type ScreenId = typeof SCREENS[number]
const OPTIONAL: ScreenId[] = ['native', 'community', 'family', 'partner']

// Category labels — replaces "Step X of Y"
const SCREEN_LABELS: Record<ScreenId, string> = {
  for: 'Your Profile', rel: 'Your Status', name: 'About You', dob: 'Your Birthday',
  height: 'Your Appearance', location: 'Where You Live', native: 'Your Roots',
  community: 'Your Community', education: 'Education', career: 'Career',
  lifestyle: 'Your Lifestyle', family: 'Your Family', partner: 'Partner Preferences',
  account: 'Your Account', tier: 'Membership', review: 'Almost Done',
}

const LS_KEY = 'nrmb_signup_v1'

function saveLocal(f: SignupFormState, idx: number) {
  try {
    const d: Record<string, unknown> = { __idx: idx }
    DRAFT_FIELDS.forEach(k => { if (f[k]) d[k] = f[k] })
    localStorage.setItem(LS_KEY, JSON.stringify(d))
  } catch {}
}

function loadLocal(): { data: Record<string, unknown>; idx: number } | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    const d = JSON.parse(raw) as Record<string, unknown>
    return { data: d, idx: typeof d.__idx === 'number' ? d.__idx : 0 }
  } catch { return null }
}

// ── Main ──────────────────────────────────────────────────────────────────────
function Inner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { f, set, loading, setLoading, error, setError } = useSignupForm()
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'bck'>('fwd')
  const [showPass, setShowPass] = useState(false)
  const [draftData, setDraftData] = useState<Record<string, unknown> | null>(null)
  const [showDraft, setShowDraft] = useState(false)
  const [showLocalDraft, setShowLocalDraft] = useState(false)
  const localDraftRef = useRef<{ data: Record<string, unknown>; idx: number } | null>(null)
  const refCode = searchParams.get('ref') ?? ''
  const draftSaved = useRef(false)
  const progressFillRef = useRef<HTMLDivElement>(null)

  const total = SCREENS.length
  const pct = Math.round((idx / (total - 1)) * 100)
  const screen: ScreenId = SCREENS[idx]

  // On mount: check localStorage for a saved draft
  useEffect(() => {
    const local = loadLocal()
    if (local && Object.keys(local.data).length > 1) {
      localDraftRef.current = local
      setShowLocalDraft(true)
    }
  }, [])

  // Progress bar width via ref
  useEffect(() => {
    if (progressFillRef.current) {
      progressFillRef.current.style.width = `${pct}%`
    }
  }, [pct])

  function err(m: string) { setError(m); if (typeof window !== 'undefined') window.scrollTo(0, 0) }

  function restoreLocalDraft() {
    const local = localDraftRef.current
    if (!local) return
    DRAFT_FIELDS.forEach(k => { if (local.data[k] !== undefined) set(k, local.data[k] as never) })
    setIdx(local.idx)
    setShowLocalDraft(false)
  }

  async function checkDraft() {
    const email = f.email.trim().toLowerCase()
    if (!email.includes('@')) return
    try {
      const snap = await getDoc(doc(db, 'drafts', email))
      if (snap.exists()) { setDraftData(snap.data()); setShowDraft(true) }
    } catch { /* ignore */ }
  }

  function restoreDraft() {
    if (!draftData) return
    DRAFT_FIELDS.forEach(k => { if (draftData[k] !== undefined) set(k, draftData[k] as never) })
    setShowDraft(false)
  }

  async function saveDraft() {
    if (draftSaved.current || !f.email.includes('@')) return
    try {
      const d: Record<string, unknown> = {}
      DRAFT_FIELDS.forEach(k => { if (f[k]) d[k] = f[k] })
      await setDoc(doc(db, 'drafts', f.email.trim().toLowerCase()), d)
      draftSaved.current = true
    } catch { /* ignore */ }
  }

  function next() {
    setError('')
    saveDraft()
    saveLocal(f, Math.min(idx + 1, total - 1))
    setDir('fwd')
    setIdx(i => Math.min(i + 1, total - 1))
    window.scrollTo(0, 0)
  }
  function back() {
    setError('')
    saveLocal(f, Math.max(idx - 1, 0))
    setDir('bck')
    setIdx(i => Math.max(i - 1, 0))
    window.scrollTo(0, 0)
  }
  function skip() {
    setError('')
    saveLocal(f, Math.min(idx + 1, total - 1))
    setDir('fwd')
    setIdx(i => Math.min(i + 1, total - 1))
    window.scrollTo(0, 0)
  }

  function canProceed() {
    switch (screen) {
      case 'for':       return !!f.profileFor
      case 'rel':       return !!f.maritalStatus
      case 'name':      return f.name.trim().length >= 2 && !!f.gender && f.email.includes('@')
      case 'dob':       return !!f.dob
      case 'height':    return !!f.height
      case 'location':  return !!f.city.trim() && !!f.state
      case 'education': return !!f.highestQual
      case 'career':    return !!f.occupation.trim()
      case 'lifestyle': return !!f.diet && f.aboutYourself.trim().length >= 10
      case 'account':   return (
        f.username.trim().length >= 3 && f.email.includes('@') &&
        f.password.length >= 6 && f.mobile.trim().length >= 10
      )
      case 'tier':      return !!f.tier
      case 'review':    return f.tcAgreed
      default:          return true
    }
  }

  async function submit() {
    if (!f.tcAgreed) { err('Please agree to the Terms & Conditions.'); return }
    setLoading(true); setError('')
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('u', '==', f.username.trim())))
      if (!snap.empty) { err('Username already taken. Go back and choose another.'); setLoading(false); return }
      const cred = await createUserWithEmailAndPassword(auth, f.email, f.password)
      await sendEmailVerification(cred.user)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, email: f.email, name: f.name.trim(), u: f.username.trim(),
        gender: f.gender, profileFor: f.profileFor, relationship: f.relationship,
        maritalStatus: f.maritalStatus, dob: f.dob, height: f.height,
        complexion: f.complexion, motherTongue: f.motherTongue || 'Telugu',
        bodyType: f.bodyType, bloodGroup: f.bloodGroup, differentlyAbled: f.differentlyAbled,
        tob: f.tobH && f.tobM && f.tobAP ? `${f.tobH}:${f.tobM} ${f.tobAP}` : '',
        placeOfBirth: f.placeOfBirth, country: f.country, state: f.state, city: f.city,
        nativePlace: f.nativePlace, residentialStatus: f.residentialStatus,
        gotra: f.gotra, fatherGotra: f.fatherGotra, nakshatra: f.nakshatra, rashi: f.rashi,
        education: { schoolBoard: f.schoolBoard, schoolName: f.schoolName,
          interCollege: f.interCollege, highestQual: f.highestQual,
          degreeCollege: f.degreeCollege, pgCollege: f.pgCollege },
        career: { employedIn: f.employedIn, occupation: f.occupation, company: f.company,
          workCountry: f.workCountry, workState: f.workState, workCity: f.workCity,
          annualIncome: f.annualIncome, visaStatus: f.visaStatus },
        lifestyle: { diet: f.diet, smoking: f.smoking, drinking: f.drinking },
        aboutYourself: f.aboutYourself,
        family: { familyType: f.familyType, familyValues: f.familyValues, familyStatus: f.familyStatus,
          fatherName: f.fatherName, fatherStatus: f.fatherStatus, fatherOcc: f.fatherOcc,
          motherName: f.motherName, motherStatus: f.motherStatus, motherOcc: f.motherOcc,
          parentMobile1: f.parentMobile1, parentMobile2: f.parentMobile2,
          brothers: f.brothers, brothersMarried: f.brothersMarried,
          sisters: f.sisters, sistersMarried: f.sistersMarried, propertyValue: f.propertyValue },
        partner: { ppAgeFrom: f.ppAgeFrom, ppAgeTo: f.ppAgeTo, ppHeight: f.ppHeight,
          ppEducation: f.ppEducation, ppProfession: f.ppProfession, ppIncome: f.ppIncome,
          ppLocation: f.ppLocation, ppNRI: f.ppNRI, ppNotes: f.ppNotes },
        mobile: f.mobile, tier: f.tier,
        approved: false, verified: false, savedProfiles: [],
        createdAt: new Date().toISOString(),
        ...(refCode ? { referredBy: refCode } : {}),
      })
      deleteDoc(doc(db, 'drafts', f.email.trim().toLowerCase())).catch(() => {})
      try { localStorage.removeItem(LS_KEY) } catch {}
      router.push('/m/verify')
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      const msg = code === 'auth/email-already-in-use'
        ? 'This email is already registered. Go back to step "About You" and sign in instead.'
        : code === 'auth/weak-password'
        ? 'Password too weak. Go back and choose a password with at least 6 characters.'
        : code === 'auth/invalid-email'
        ? 'The email address is invalid. Please go back and correct it.'
        : `Registration could not be completed (${code ?? 'unknown error'}). Please try again or contact support.`
      err(msg)
    }
    setLoading(false)
  }

  // ── Render question content ────────────────────────────────────────────────
  function body() {
    const n = idx + 1
    switch (screen) {

      case 'for': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Creating a profile for…</div>
        <div className={s.qDetail}>Who is this matrimony profile for?</div>
        <div className={s.tileGrid}>
          {[['🙋','Myself',''],['👧','My Daughter','Female'],['👦','My Son','Male'],
            ['👩','My Sister','Female'],['🧑','My Brother','Male'],['👨‍👩‍👧','A Relative','']
          ].map(([icon, label, g]) => (
            <Tile key={label} icon={icon} label={label} sub={g || undefined}
              selected={f.profileFor === label}
              onClick={() => {
                set('profileFor', label)
                if (g) set('gender', g)
                setTimeout(() => next(), 350)
              }} />
          ))}
        </div>
      </>)

      case 'rel': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Current relationship status?</div>
        <div className={s.radioRow}>
          {['Never Married','Divorced','Widowed','Separated'].map(v => (
            <Pill key={v} label={v} selected={f.maritalStatus === v}
              onClick={() => { set('maritalStatus', v); set('relationship', v); setTimeout(() => next(), 350) }} />
          ))}
        </div>
      </>)

      case 'name': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>What is your full name?</div>
        {showDraft && (
          <div className={s.draftBanner}>
            <span className={s.draftText}>Found a saved draft — continue where you left off?</span>
            <button type="button" className={s.draftYes} onClick={restoreDraft}>Restore</button>
            <button type="button" className={s.draftNo} onClick={() => setShowDraft(false)}>Discard</button>
          </div>
        )}
        <div className={s.field}>
          <label className={s.fieldLabel}>Full Name *</label>
          <input className={s.input} placeholder="e.g. Kavya Reddy" value={f.name}
            onChange={e => set('name', e.target.value)} autoComplete="name" onBlur={checkDraft} />
        </div>
        {!['My Daughter','My Son','My Sister','My Brother'].includes(f.profileFor) && (
          <div className={s.field}>
            <label className={s.fieldLabel}>Gender *</label>
            <div className={s.radioRow}>
              {['Male','Female'].map(v => (
                <Pill key={v} label={v} selected={f.gender === v} onClick={() => set('gender', v)} />
              ))}
            </div>
          </div>
        )}
        <div className={s.field}>
          <label className={s.fieldLabel}>Email Address *</label>
          <input className={s.input} type="email" placeholder="your@email.com" value={f.email}
            onChange={e => set('email', e.target.value)} onBlur={checkDraft} autoComplete="email" />
        </div>
      </>)

      case 'dob': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>When were you born?</div>
        <div className={s.qDetail}>Your age is shown publicly, not the exact date. Min age: 21 (Male), 18 (Female).</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Date of Birth *</label>
          <DatePicker value={f.dob} onChange={v => set('dob', v)}
            placeholder="Select date of birth"
            maxYear={new Date().getFullYear() - (f.gender === 'Female' ? 18 : 21)} />
        </div>
      </>)

      case 'height': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>A bit about your appearance</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Height *</label>
          <RichSelect options={HEIGHTS} value={f.height} onChange={v => set('height', v)} placeholder="Select height" ariaLabel="Height" />
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Complexion</label>
          <div className={s.radioRow}>
            {['Very Fair','Fair','Wheatish','Wheatish Brown','Dark'].map(v => (
              <Pill key={v} label={v} selected={f.complexion === v} onClick={() => set('complexion', v)} />
            ))}
          </div>
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Blood Group</label>
          <div className={s.radioRow}>
            {['A+','A−','B+','B−','O+','O−','AB+','AB−'].map(v => (
              <Pill key={v} label={v} selected={f.bloodGroup === v} onClick={() => set('bloodGroup', v)} />
            ))}
          </div>
        </div>
      </>)

      case 'location': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Where do you currently live?</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>City *</label>
          <input className={s.input} placeholder="e.g. Hyderabad" value={f.city}
            onChange={e => set('city', e.target.value)} />
        </div>
        <div className={s.fieldGrid2}>
          <div className={s.field}>
            <label className={s.fieldLabel}>State *</label>
            <RichSelect options={INDIA_STATES} value={f.state} onChange={v => set('state', v)} placeholder="Select state" ariaLabel="State" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Country</label>
            <RichSelect options={['India','USA','UK','UAE','Canada','Australia','Singapore','Other']} value={f.country} onChange={v => set('country', v)} placeholder="Select country" ariaLabel="Country" />
          </div>
        </div>
      </>)

      case 'native': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Where are you originally from?</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Native Place</label>
          <input className={s.input} placeholder="e.g. Nellore" value={f.nativePlace}
            onChange={e => set('nativePlace', e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Residential Status</label>
          <div className={s.radioRow}>
            {['Permanent Resident','NRI','Student Visa','Work Visa'].map(v => (
              <Pill key={v} label={v} selected={f.residentialStatus === v}
                onClick={() => set('residentialStatus', v)} />
            ))}
          </div>
        </div>
      </>)

      case 'community': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Your community details</div>
        <div className={s.qDetail}>Helps us find the most compatible Reddy matches.</div>
        <div className={s.fieldGrid2}>
          <div className={s.field}>
            <label className={s.fieldLabel}>Gotra</label>
            <RichSelect options={GOTRAS} value={f.gotra} onChange={v => set('gotra', v)} placeholder="Select gotra" ariaLabel="Gotra" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Father&apos;s Gotra</label>
            <RichSelect options={GOTRAS} value={f.fatherGotra} onChange={v => set('fatherGotra', v)} placeholder="Select gotra" ariaLabel="Father's Gotra" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Nakshatra</label>
            <RichSelect options={NAKSHATRAS} value={f.nakshatra} onChange={v => set('nakshatra', v)} placeholder="Select nakshatra" ariaLabel="Nakshatra" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Rashi</label>
            <RichSelect options={RASHIS} value={f.rashi} onChange={v => set('rashi', v)} placeholder="Select rashi" ariaLabel="Rashi" />
          </div>
        </div>
      </>)

      case 'education': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>What is your highest qualification?</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Qualification *</label>
          <RichSelect
            options={['High School','Diploma','B.A.','B.Com','B.Sc','B.Tech / B.E.','MBBS','BDS','LLB','M.A.','M.Com','M.Sc','M.Tech / M.E.','MBA','MCA','MD / MS','CA / ICAI','Ph.D','Other']}
            value={f.highestQual} onChange={v => set('highestQual', v)}
            placeholder="Select qualification" ariaLabel="Highest Qualification"
          />
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>College / University</label>
          <input className={s.input} placeholder="e.g. JNTU Hyderabad" value={f.degreeCollege}
            onChange={e => set('degreeCollege', e.target.value)} />
        </div>
      </>)

      case 'career': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>What do you do for work?</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Employed In *</label>
          <div className={s.radioRow}>
            {['Private Sector','Government','Business / Self-Employed','Not Working','Student'].map(v => (
              <Pill key={v} label={v} selected={f.employedIn === v} onClick={() => set('employedIn', v)} />
            ))}
          </div>
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Occupation *</label>
          <input className={s.input} placeholder="e.g. Software Engineer, Doctor…"
            value={f.occupation} onChange={e => set('occupation', e.target.value)} />
        </div>
        <div className={s.fieldGrid2}>
          <div className={s.field}>
            <label className={s.fieldLabel}>Annual Income</label>
            <RichSelect options={['Below 3 Lakhs','3–5 Lakhs','5–10 Lakhs','10–20 Lakhs','20–50 Lakhs','50L–1 Crore','1 Crore+']} value={f.annualIncome} onChange={v => set('annualIncome', v)} placeholder="Select income range" ariaLabel="Annual Income" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Work City</label>
            <input className={s.input} placeholder="City" value={f.workCity}
              onChange={e => set('workCity', e.target.value)} />
          </div>
        </div>
      </>)

      case 'lifestyle': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Tell us about your lifestyle</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Diet *</label>
          <div className={s.radioRow}>
            {['Vegetarian','Non-Vegetarian','Eggetarian','Jain'].map(v => (
              <Pill key={v} label={v} selected={f.diet === v} onClick={() => set('diet', v)} />
            ))}
          </div>
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>About Yourself * (min 10 chars)</label>
          <textarea className={s.textarea}
            placeholder="Share what makes you unique — hobbies, values, what you seek in a partner…"
            value={f.aboutYourself} onChange={e => set('aboutYourself', e.target.value)} rows={4} />
          <div className={s.hint}>{f.aboutYourself.length} / 500 characters</div>
        </div>
      </>)

      case 'family': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>A little about your family</div>
        <div className={s.qDetail}>Family background matters in our community. You can update these later too.</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Family Type</label>
          <div className={s.radioRow}>
            {['Nuclear Family','Joint Family'].map(v => (
              <Pill key={v} label={v} selected={f.familyType === v} onClick={() => set('familyType', v)} />
            ))}
          </div>
        </div>
        <div className={s.fieldGrid2}>
          <div className={s.field}>
            <label className={s.fieldLabel}>Father&apos;s Name</label>
            <input className={s.input} placeholder="Father's full name" value={f.fatherName} onChange={e => set('fatherName', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Father&apos;s Status</label>
            <RichSelect options={['Employed','Business','Retired','Expired']} value={f.fatherStatus} onChange={v => set('fatherStatus', v)} placeholder="Select status" ariaLabel="Father's Status" />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Mother&apos;s Name</label>
            <input className={s.input} placeholder="Mother's full name" value={f.motherName} onChange={e => set('motherName', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Mother&apos;s Status</label>
            <RichSelect options={['Homemaker','Working','Retired','Expired']} value={f.motherStatus} onChange={v => set('motherStatus', v)} placeholder="Select status" ariaLabel="Mother's Status" />
          </div>
        </div>
      </>)

      case 'partner': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>What are you looking for in a partner?</div>
        <div className={s.qDetail}>These are preferences — just a starting point. You can refine later.</div>
        <div className={s.fieldGrid2}>
          <div className={s.field}>
            <label className={s.fieldLabel}>Age From</label>
            <input className={s.input} type="number" placeholder="22" min={18} max={60}
              value={f.ppAgeFrom} onChange={e => set('ppAgeFrom', e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.fieldLabel}>Age To</label>
            <input className={s.input} type="number" placeholder="30" min={18} max={65}
              value={f.ppAgeTo} onChange={e => set('ppAgeTo', e.target.value)} />
          </div>
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Preferred Income</label>
          <RichSelect options={['Any','3–5 Lakhs','5–10 Lakhs','10–20 Lakhs','20–50 Lakhs','50L–1 Crore','1 Crore+']} value={f.ppIncome || 'Any'} onChange={v => set('ppIncome', v === 'Any' ? '' : v)} placeholder="Any" ariaLabel="Preferred Income" />
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>NRI Preference</label>
          <div className={s.radioRow}>
            {['Open to NRI','NRI Preferred','India Only','No Preference'].map(v => (
              <Pill key={v} label={v} selected={f.ppNRI === v} onClick={() => set('ppNRI', v)} />
            ))}
          </div>
        </div>
      </>)

      case 'account': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Set up your account</div>
        <div className={s.qDetail}>Choose a unique username — this is your identity on the platform.</div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Username *</label>
          <input className={s.input} placeholder="e.g. kavya_r" value={f.username}
            onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            autoComplete="username" />
          <div className={s.hint}>Letters, numbers and underscores only.</div>
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Mobile Number *</label>
          <input className={s.input} type="tel" placeholder="+91 9876543210" value={f.mobile}
            onChange={e => set('mobile', e.target.value)} autoComplete="tel" />
        </div>
        <div className={s.field}>
          <label className={s.fieldLabel}>Password *</label>
          <div className={s.passwordWrap}>
            <input className={s.input} type={showPass ? 'text' : 'password'}
              placeholder="Min 6 characters" value={f.password}
              onChange={e => set('password', e.target.value)} autoComplete="new-password" />
            <button type="button" className={s.eyeBtn}
              onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
              {showPass ? '🙈' : '👁'}
            </button>
          </div>
        </div>
      </>)

      case 'tier': return (<>
        <div className={s.qNum}>{SCREEN_LABELS[screen]}</div>
        <div className={s.qText}>Choose your membership plan</div>
        <div className={s.qDetail}>All plans include full access. You can upgrade anytime from your profile.</div>
        <div className={s.tierGrid}>
          {([
            { v: 'VIP',  icon: '👑', price: '₹15,000/yr',   feats: 'Full visibility · Browse verified · Express interest' },
            { v: 'Elite',icon: '💎', price: '₹1,00,000/yr', feats: 'All VIP · Priority results · Dedicated manager' },
            { v: 'VVIP', icon: '🏆', price: '₹30,000/yr',   feats: 'All Elite · White-glove · Background verification' },
          ] as const).map(t => (
            <button key={t.v} type="button"
              className={f.tier === t.v ? s.tierCardSelected : s.tierCard}
              onClick={() => { set('tier', t.v); setTimeout(() => next(), 400) }}>
              <span className={s.tierCardIcon}>{t.icon}</span>
              <span className={s.tierCardInfo}>
                <span className={s.tierCardName}>{t.v}</span>
                <span className={s.tierCardPrice}>{t.price}</span>
                <span className={s.tierCardFeats}>{t.feats}</span>
              </span>
            </button>
          ))}
        </div>
      </>)

      case 'review': return (<>
        <div className={s.qNum}>Almost Done</div>
        <div className={s.qText}>Almost done! Review your profile</div>
        <div className={s.qDetail}>A quick look at what you&apos;ve shared. You can always edit after registering.</div>
        <div className={s.summaryGrid}>
          {([
            ['Name', f.name], ['Gender', f.gender], ['DOB', f.dob], ['Height', f.height],
            ['City', f.city], ['State', f.state], ['Gotra', f.gotra], ['Nakshatra', f.nakshatra],
            ['Education', f.highestQual], ['Occupation', f.occupation], ['Diet', f.diet], ['Plan', f.tier],
          ] as [string, string][]).filter(([,v]) => v).map(([k,v]) => (
            <div key={k} className={s.summaryItem}>
              <div className={s.summaryKey}>{k}</div>
              <div className={s.summaryVal}>{v}</div>
            </div>
          ))}
        </div>
        <div className={s.termsBox}>{TERMS}</div>
        <label className={s.tcRow}>
          <input type="checkbox" checked={f.tcAgreed} onChange={e => set('tcAgreed', e.target.checked)} />
          <span className={s.tcLabel}>I have read and agree to the Terms &amp; Conditions</span>
        </label>
      </>)
    }
  }

  const isLast = idx === total - 1
  const isOptional = OPTIONAL.includes(screen)

  return (
    <div className={s.page}>
      {/* Progress bar */}
      <div className={s.progressWrap}>
        <div className={s.progressTop}>
          <span className={s.progressMsg}>{progressMsg(pct)}</span>
          <span className={s.progressPct}>{pct}%</span>
        </div>
        <div className={s.progressBar}>
          <div ref={progressFillRef} className={s.progressFill} />
        </div>
      </div>

      {/* Local draft restore banner */}
      {showLocalDraft && (
        <div className={s.draftBanner}>
          <span className={s.draftText}>Welcome back — you have an unfinished profile. Continue where you left off?</span>
          <button type="button" className={s.draftYes} onClick={restoreLocalDraft}>Continue</button>
          <button type="button" className={s.draftNo} onClick={() => { setShowLocalDraft(false); localStorage.removeItem(LS_KEY) }}>Start fresh</button>
        </div>
      )}

      {/* Screen */}
      <div key={`${screen}-${dir}`} className={`${s.screen} ${dir === 'bck' ? s.screenBack : ''}`}>
        {error && <div className={s.error}>{error}</div>}
        {body()}
        <div className={s.signInLink}>Already registered? <Link href="/m/login">Sign In →</Link></div>
      </div>

      {/* Bottom nav */}
      <div className={s.bottomNav}>
        {idx > 0 && (
          <button type="button" className={s.backBtn} onClick={back} aria-label="Back">←</button>
        )}
        {isOptional && !isLast && (
          <button type="button" className={s.skipBtn} onClick={skip}>Skip</button>
        )}
        <button type="button" className={s.nextBtn}
          disabled={!canProceed() || loading}
          onClick={isLast ? submit : next}>
          {isLast ? (loading ? 'Creating…' : 'Create My Profile') : 'Continue →'}
        </button>
      </div>
    </div>
  )
}

export default function MobileSignup() {
  return (
    <Suspense fallback={<div className={s.pageLoading} />}>
      <Inner />
    </Suspense>
  )
}
