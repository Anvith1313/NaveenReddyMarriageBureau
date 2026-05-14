'use client'

import { useState, useId } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import {
  useSignupForm, MAIN_STEPS, STEP_LABELS,
  INDIA_STATES, HEIGHTS, GOTRAS, NAKSHATRAS, RASHIS,
} from '@/lib/useSignupForm'
import DatePicker from '@/components/DatePicker/DatePicker'
import s from './signup.module.css'

const TERMS = `1. Eligibility: Membership is exclusively for Reddy community members of Hindu religion. Misrepresentation results in immediate termination without refund.

2. Membership Fees (Non-Refundable): VIP – ₹15,000/yr · Elite – ₹1,00,000/yr · VVIP – ₹30,000/yr.

3. Mandatory Post-Engagement Fee: Upon engagement facilitated by NRMB, each individual must pay within 7 days: VIP – ₹1,50,000 · Elite – ₹3,00,000 · VVIP – ₹10,00,000. Non-payment may result in legal action.

4. Privacy & Contact Policy: Contact details will NOT be shared unless both parties express interest AND the bureau administrator approves.

5. Profile Viewing Restriction (3-Account Rule): A member's profile may be viewed by a maximum of 3 unique accounts at any time.

6. Profile Hold: Mutual interest places both profiles on exclusive hold, removed from all other searches.

7. Match Finalisation: Finalised profiles are permanently removed from the active pool.

8. Code of Conduct: Dignity, honesty and respect are mandatory. Misuse leads to termination and possible legal action.

9. Governing Law: Telangana, India. Disputes subject to Hyderabad jurisdiction.`

function Field({ label, hint, className, children }: {
  label: React.ReactNode
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  const id = useId()
  const childArr = React.Children.toArray(children)
  const first = childArr[0]
  const rest = childArr.slice(1)
  return (
    <div className={`${s.field} ${className ?? ''}`}>
      <label className={s.fieldLabel} htmlFor={id}>{label}</label>
      {React.isValidElement(first)
        ? React.cloneElement(first as React.ReactElement<{ id?: string }>, { id })
        : first}
      {rest}
      {hint && <small className={s.hint}>{hint}</small>}
    </div>
  )
}

export default function DesktopSignup() {
  const router = useRouter()
  const { step, go, f, set, loading, setLoading, error, setError } = useSignupForm()
  const [showPass, setShowPass] = useState(false)

  const stepIdx = MAIN_STEPS.indexOf(step)
  const isMainStep = stepIdx >= 0

  function err(msg: string) { setError(msg); if (typeof window !== 'undefined') window.scrollTo(0, 0) }

  function pickProfileFor(pf: string, g: string) {
    set('profileFor', pf)
    if (g) set('gender', g)
    if (pf === 'Myself') go('basics')
    else go('rel')
  }

  function validateBasics() {
    if (!f.name.trim()) { err('Please enter your full name.'); return false }
    if (!f.email.includes('@')) { err('Please enter a valid email address.'); return false }
    return true
  }
  function validateAbout() {
    if (!f.maritalStatus) { err('Please select marital status.'); return false }
    if (!f.dob) { err('Please enter date of birth.'); return false }
    if (!f.height) { err('Please select height.'); return false }
    if (!f.motherTongue) { err('Please select mother tongue.'); return false }
    return true
  }
  function validateLocation() {
    if (!f.city.trim()) { err('Please enter your city.'); return false }
    if (!f.nativePlace.trim()) { err('Please enter native place / district.'); return false }
    return true
  }
  function validateCommunity() {
    if (!f.gotra.trim()) { err('Please enter your gotra.'); return false }
    if (!f.nakshatra) { err('Please select nakshatra.'); return false }
    if (!f.rashi) { err('Please select rashi.'); return false }
    return true
  }
  function validateCareer() {
    if (!f.highestQual) { err('Please select highest qualification.'); return false }
    if (!f.employedIn) { err('Please select employment type.'); return false }
    if (!f.occupation.trim()) { err('Please enter occupation.'); return false }
    if (!f.annualIncome) { err('Please enter annual income.'); return false }
    if (!f.diet) { err('Please select diet.'); return false }
    return true
  }
  function validateAccount() {
    if (!f.mobile.trim()) { err('Please enter your mobile number.'); return false }
    if (!f.username.trim() || f.username.length < 3) { err('Username must be at least 3 characters.'); return false }
    if (f.password.length < 8) { err('Password must be at least 8 characters.'); return false }
    return true
  }

  async function handleAccountNext() {
    if (!validateAccount()) return
    setLoading(true)
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('u', '==', f.username.trim())))
      if (!snap.empty) { err('This username is already taken.'); setLoading(false); return }
      go('membership')
    } catch { err('Could not verify username. Please try again.') }
    setLoading(false)
  }

  function handleMembershipNext() {
    if (!f.tier) { err('Please select a membership tier.'); return }
    if (!f.tcAgreed) { err('Please agree to the Terms & Conditions.'); return }
    go('review')
  }

  async function doRegister() {
    setLoading(true); setError('')
    try {
      const snap = await getDocs(query(collection(db, 'users'), where('u', '==', f.username.trim())))
      if (!snap.empty) { err('Username was taken. Please go back and choose another.'); setLoading(false); return }
      const cred = await createUserWithEmailAndPassword(auth, f.email, f.password)
      await sendEmailVerification(cred.user)
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, email: f.email, name: f.name.trim(), u: f.username.trim(),
        gender: f.gender, profileFor: f.profileFor, relationship: f.relationship,
        maritalStatus: f.maritalStatus, dob: f.dob, height: f.height, motherTongue: f.motherTongue,
        complexion: f.complexion, bodyType: f.bodyType, bloodGroup: f.bloodGroup, differentlyAbled: f.differentlyAbled,
        tob: f.tobH && f.tobM && f.tobAP ? `${f.tobH}:${f.tobM} ${f.tobAP}` : '', placeOfBirth: f.placeOfBirth,
        country: f.country, state: f.state, city: f.city, nativePlace: f.nativePlace, residentialStatus: f.residentialStatus,
        gotra: f.gotra, fatherGotra: f.fatherGotra, nakshatra: f.nakshatra, rashi: f.rashi,
        education: { schoolBoard: f.schoolBoard, schoolName: f.schoolName, interCollege: f.interCollege, highestQual: f.highestQual, degreeCollege: f.degreeCollege, pgCollege: f.pgCollege },
        career: { employedIn: f.employedIn, occupation: f.occupation, company: f.company, workCountry: f.workCountry, workState: f.workState, workCity: f.workCity, annualIncome: f.annualIncome, visaStatus: f.visaStatus },
        lifestyle: { diet: f.diet, smoking: f.smoking, drinking: f.drinking },
        aboutYourself: f.aboutYourself,
        family: { familyType: f.familyType, familyValues: f.familyValues, familyStatus: f.familyStatus, fatherName: f.fatherName, fatherStatus: f.fatherStatus, fatherOcc: f.fatherOcc, motherName: f.motherName, motherStatus: f.motherStatus, motherOcc: f.motherOcc, parentMobile1: f.parentMobile1, parentMobile2: f.parentMobile2, brothers: f.brothers, brothersMarried: f.brothersMarried, sisters: f.sisters, sistersMarried: f.sistersMarried, propertyValue: f.propertyValue },
        partner: { ppAgeFrom: f.ppAgeFrom, ppAgeTo: f.ppAgeTo, ppHeight: f.ppHeight, ppEducation: f.ppEducation, ppProfession: f.ppProfession, ppIncome: f.ppIncome, ppLocation: f.ppLocation, ppNRI: f.ppNRI, ppNotes: f.ppNotes },
        mobile: f.mobile, tier: f.tier, approved: false, savedProfiles: [], createdAt: new Date().toISOString(),
      })
      router.push('/verify')
    } catch (e: unknown) {
      const code = (e as { code?: string }).code
      err(
        code === 'auth/email-already-in-use' ? 'This email is already registered. Please sign in.' :
        code === 'auth/weak-password' ? 'Password is too weak.' :
        'Registration failed. Please try again.'
      )
    }
    setLoading(false)
  }

  const sidebarSteps = [
    { key: 'about', label: 'About You', icon: '👤' },
    { key: 'location', label: 'Location', icon: '📍' },
    { key: 'community', label: 'Community', icon: '🕉' },
    { key: 'career', label: 'Career', icon: '💼' },
    { key: 'family', label: 'Family', icon: '🏠' },
    { key: 'partner', label: 'Partner', icon: '💑' },
    { key: 'account', label: 'Account', icon: '🔐' },
    { key: 'membership', label: 'Plan', icon: '👑' },
  ]

  // ── PRE-STEP SCREENS ──
  if (!isMainStep && step !== 'review') {
    return (
      <div className={s.prePage}>
        <div className={s.preLeft}>
          <div className={s.preLeftInner}>
            <div className={s.logoRing}>
              <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={56} height={56} style={{ objectFit: 'contain' }} />
            </div>
            <p className={s.preLeftTitle}>Where two families<br />become one story</p>
            <p className={s.preLeftSub}>Naveen Reddy Marriage Bureau · Est. 2000</p>
            <div className={s.preLeftDivider} />
            <p className={s.preLeftNote}>Exclusively for Reddy Community<br />Hindu Religion · Since 2000</p>
          </div>
        </div>
        <div className={s.preRight}>
          {error && <div className={s.errorBox}>{error}</div>}

          {step === 'who' && (
            <div className={s.preForm}>
              <p className={s.preEyebrow}>Registration</p>
              <h1 className={s.preHeading}>Create a Profile For</h1>
              <p className={s.preDesc}>Tell us who you are registering today</p>
              <div className={s.whoGrid}>
                {[
                  { label: 'My Son', sub: 'Male' },
                  { label: 'My Daughter', sub: 'Female' },
                  { label: 'My Brother', sub: 'Male' },
                  { label: 'Myself', sub: '' },
                  { label: 'My Sister', sub: 'Female' },
                  { label: 'My Relative', sub: '' },
                  { label: 'A Friend', sub: '' },
                ].map(({ label, sub }) => (
                  <button type="button" key={label} className={s.whoCard} onClick={() => pickProfileFor(label, sub)}>
                    <span className={s.whoLabel}>{label}</span>
                    {sub && <span className={s.whoSub}>{sub}</span>}
                  </button>
                ))}
              </div>
              <p className={s.preLoginRow}>Already registered? <Link href="/login">Sign In →</Link></p>
            </div>
          )}

          {step === 'rel' && (
            <div className={s.preForm}>
              <button type="button" className={s.backLink} onClick={() => go('who')}>← Back</button>
              <p className={s.preEyebrow}>Relationship</p>
              <h1 className={s.preHeading}>Your Relationship</h1>
              <p className={s.preDesc}>Registering {f.profileFor} — how are you related?</p>
              <div className={s.relGrid}>
                {['Parent', 'Sibling', 'Uncle / Aunt', 'Other Relative', 'Family Friend', 'Other'].map(rel => (
                  <button type="button" key={rel} className={s.relCard} onClick={() => { set('relationship', rel); go('basics') }}>
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'basics' && (
            <div className={s.preForm}>
              <button type="button" className={s.backLink} onClick={() => go(f.profileFor === 'Myself' ? 'who' : 'rel')}>← Back</button>
              <p className={s.preEyebrow}>Getting Started</p>
              <h1 className={s.preHeading}>Basic Details</h1>
              <p className={s.preDesc}>Enter the candidate&apos;s details to begin</p>
              <div className={s.genderRow}>
                <button type="button" className={`${s.genderBtn} ${f.gender === 'Male' ? s.genderBtnActive : ''}`} onClick={() => set('gender', 'Male')}>♂ Male</button>
                <button type="button" className={`${s.genderBtn} ${f.gender === 'Female' ? s.genderBtnActive : ''}`} onClick={() => set('gender', 'Female')}>♀ Female</button>
              </div>
              <Field label="Full Name *">
                <input className={s.input} type="text" value={f.name} onChange={e => set('name', e.target.value)} placeholder="As per Aadhaar card" autoComplete="name" />
              </Field>
              <Field label="Email Address *">
                <input className={s.input} type="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" autoComplete="email" />
              </Field>
              <button type="button" className={s.btnPrimary} onClick={() => { if (validateBasics()) go('about') }}>Continue →</button>
              <p className={s.saveNote}>Progress is saved automatically.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── REVIEW SCREEN ──
  if (step === 'review') {
    return (
      <div className={s.reviewPage}>
        <div className={s.reviewHero}>
          <h1 className={s.reviewTitle}>Review Your Details</h1>
          <p className={s.reviewSub}>Please verify everything carefully. Click Edit to go back and change any section.</p>
        </div>
        {error && <div className={s.errorBoxCentered}>{error}</div>}
        <div className={s.reviewGrid}>
          {[
            { label: 'Personal', target: 'basics' as const, rows: [['Name', f.name], ['Email', f.email], ['Gender', f.gender], ['Profile For', f.profileFor]] },
            { label: 'About', target: 'about' as const, rows: [['Marital Status', f.maritalStatus], ['Date of Birth', f.dob], ['Height', f.height], ['Mother Tongue', f.motherTongue], ['Complexion', f.complexion], ['Body Type', f.bodyType], ['Blood Group', f.bloodGroup]] },
            { label: 'Location', target: 'location' as const, rows: [['Country', f.country], ['State', f.state], ['City', f.city], ['Native Place', f.nativePlace], ['Residential Status', f.residentialStatus]] },
            { label: 'Community', target: 'community' as const, rows: [['Gotra', f.gotra], ["Father's Gotra", f.fatherGotra], ['Nakshatra', f.nakshatra], ['Rashi', f.rashi]] },
            { label: 'Career', target: 'career' as const, rows: [['Qualification', f.highestQual], ['Employed In', f.employedIn], ['Occupation', f.occupation], ['Work City', f.workCity], ['Annual Income', f.annualIncome ? `₹${parseInt(f.annualIncome).toLocaleString('en-IN')}` : ''], ['Diet', f.diet]] },
            { label: 'Family', target: 'family' as const, rows: [['Family Type', f.familyType], ['Family Values', f.familyValues], ['Family Status', f.familyStatus], ['Father', f.fatherName], ['Mother', f.motherName]] },
            { label: 'Partner Preferences', target: 'partner' as const, rows: [['Age Range', f.ppAgeFrom && f.ppAgeTo ? `${f.ppAgeFrom}–${f.ppAgeTo} yrs` : ''], ['Min Height', f.ppHeight || 'Any'], ['Education', f.ppEducation || 'Any'], ['Income', f.ppIncome || 'Any'], ['NRI', f.ppNRI]] },
            { label: 'Account', target: 'account' as const, rows: [['Mobile', f.mobile], ['Username', f.username]] },
            { label: 'Membership', target: 'membership' as const, rows: [['Selected Plan', f.tier]] },
          ].map(({ label, target, rows }) => (
            <div key={label} className={s.reviewCard}>
              <div className={s.reviewCardHead}>
                <span className={s.reviewCardLabel}>{label}</span>
                <button type="button" className={s.reviewEditBtn} onClick={() => go(target)}>Edit</button>
              </div>
              {rows.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className={s.reviewRow}>
                  <span className={s.reviewKey}>{k}</span>
                  <span className={s.reviewVal}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={s.reviewSubmit}>
          <button type="button" className={s.btnSubmit} onClick={doRegister} disabled={loading}>
            {loading ? 'Creating Your Profile…' : 'Confirm & Complete Registration'}
          </button>
          <p className={s.reviewDisclaimer}>By submitting you agree to all Terms & Conditions. Your profile will be reviewed before going live.</p>
        </div>
      </div>
    )
  }

  // ── MAIN STEP LAYOUT (sidebar + content) ──
  return (
    <div className={s.mainPage}>
      <aside className={s.sidebar}>
        <div className={s.sidebarInner}>
          <div className={s.sidebarLogoRing}>
            <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={44} height={44} style={{ objectFit: 'contain' }} />
          </div>
          <p className={s.sidebarTitle}>Create Profile</p>
          <p className={s.sidebarName}>{f.name || 'New Member'}</p>
          <div className={s.sidebarDivider} />
          <nav className={s.sidebarNav} aria-label="Registration steps">
            {sidebarSteps.map(({ key, label, icon }, i) => (
              <div key={key} className={`${s.sidebarStep} ${key === step ? s.sidebarStepActive : i < stepIdx ? s.sidebarStepDone : ''}`}>
                <div className={s.sidebarStepDot}>{i < stepIdx ? '✓' : icon}</div>
                <span className={s.sidebarStepLabel}>{label}</span>
              </div>
            ))}
          </nav>
          <div className={s.sidebarProgress}>
            <div className={s.sidebarProgressTrack}>
              <div className={s.sidebarProgressFill} style={{ ['--fill' as string]: `${Math.round(((stepIdx + 1) / 8) * 100)}%` }} />
            </div>
            <span className={s.sidebarProgressLabel}>{Math.round(((stepIdx + 1) / 8) * 100)}% complete</span>
          </div>
        </div>
      </aside>

      <main className={s.content}>
        {error && <div className={s.errorBox}>{error}</div>}

        {/* ── STEP 1: About ── */}
        {step === 'about' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>💍 About You</h2><p className={s.stepPaneDesc}>Personal details of the candidate</p></div>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Marital Status *</h3>
              <div className={s.msCards}>
                {[{v:'Never Married',ic:'💍'},{v:'Divorced',ic:'📄'},{v:'Widowed',ic:'🕊️'},{v:'Awaiting Divorce',ic:'⚖️'}].map(({v,ic}) => (
                  <button type="button" key={v} className={`${s.msCard} ${f.maritalStatus === v ? s.msCardActive : ''}`} onClick={() => set('maritalStatus', v)}>
                    <span className={s.msIcon}>{ic}</span><span className={s.msLabel}>{v}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Basic Details</h3>
              <div className={s.grid3}>
                <Field label="Date of Birth *" hint="Min age: 21 (Male) · 18 (Female)">
                  <DatePicker
                    value={f.dob}
                    onChange={v => set('dob', v)}
                    placeholder="Select date of birth"
                    maxYear={new Date().getFullYear() - 18}
                  />
                </Field>
                <Field label="Height *">
                  <select className={s.select} value={f.height} onChange={e => set('height', e.target.value)}>
                    <option value="">Select</option>
                    {HEIGHTS.map(h => <option key={h}>{h}</option>)}
                  </select>
                </Field>
                <Field label="Mother Tongue *">
                  <select className={s.select} value={f.motherTongue} onChange={e => set('motherTongue', e.target.value)}>
                    <option value="">Select</option>
                    {['Telugu','Kannada','Tamil','Hindi','Marathi','Gujarati','Bengali','Malayalam','Odia','Punjabi','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Complexion">
                  <select className={s.select} value={f.complexion} onChange={e => set('complexion', e.target.value)}>
                    <option value="">Select</option>
                    {['Very Fair','Fair','Wheatish','Wheatish Brown','Dark'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Body Type">
                  <select className={s.select} value={f.bodyType} onChange={e => set('bodyType', e.target.value)}>
                    <option value="">Select</option>
                    {['Slim','Athletic','Average','Heavy'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Blood Group">
                  <select className={s.select} value={f.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Differently Abled">
                  <select className={s.select} value={f.differentlyAbled} onChange={e => set('differentlyAbled', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </Field>
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Astrology <span className={s.sectionNote}>(for Kundali matching)</span></h3>
              <div className={s.grid3}>
                <div className={s.field}>
                  <span className={s.fieldLabel}>Time of Birth <span className={s.optLabel}>(optional)</span></span>
                  <div className={s.tobInputs}>
                    <select className={s.selectSm} aria-label="Hour" value={f.tobH} onChange={e => set('tobH', e.target.value)}>
                      <option value="">HH</option>
                      {['01','02','03','04','05','06','07','08','09','10','11','12'].map(v => <option key={v}>{v}</option>)}
                    </select>
                    <span className={s.tobColon}>:</span>
                    <select className={s.selectSm} aria-label="Minute" value={f.tobM} onChange={e => set('tobM', e.target.value)}>
                      <option value="">MM</option>
                      {['00','05','10','15','20','25','30','35','40','45','50','55'].map(v => <option key={v}>{v}</option>)}
                    </select>
                    <select className={s.selectSm} aria-label="AM or PM" value={f.tobAP} onChange={e => set('tobAP', e.target.value)}>
                      <option value="">AM/PM</option>
                      <option>AM</option><option>PM</option>
                    </select>
                  </div>
                </div>
                <Field label="Place of Birth">
                  <input className={s.input} type="text" value={f.placeOfBirth} onChange={e => set('placeOfBirth', e.target.value)} placeholder="e.g. Hyderabad" />
                </Field>
              </div>
            </section>
            <div className={s.navRow}><div /><button type="button" className={s.btnNext} onClick={() => { if (validateAbout()) go('location') }}>Next: Location →</button></div>
          </div>
        )}

        {/* ── STEP 2: Location ── */}
        {step === 'location' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>🌍 Location Details</h2><p className={s.stepPaneDesc}>Where does the candidate live and come from?</p></div>
            <section className={s.section}>
              <div className={s.grid3}>
                <Field label="Country *" className={s.spanFull}>
                  <select className={s.select} value={f.country} onChange={e => { set('country', e.target.value); set('state', '') }}>
                    {['India','United States','United Kingdom','Canada','Australia','United Arab Emirates','Singapore','Germany','New Zealand','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                {f.country === 'India' && (
                  <Field label="State *">
                    <select className={s.select} value={f.state} onChange={e => set('state', e.target.value)}>
                      <option value="">Select State</option>
                      {INDIA_STATES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="City *">
                  <input className={s.input} type="text" value={f.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Hyderabad" />
                </Field>
                <Field label="Native Place / District *">
                  <input className={s.input} type="text" value={f.nativePlace} onChange={e => set('nativePlace', e.target.value)} placeholder="e.g. Nalgonda, Warangal" />
                </Field>
                <Field label="Residential Status">
                  <select className={s.select} value={f.residentialStatus} onChange={e => set('residentialStatus', e.target.value)}>
                    {['Permanent Resident','NRI','Student Abroad','Work Visa'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('about')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={() => { if (validateLocation()) go('community') }}>Next: Community →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Community ── */}
        {step === 'community' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>🕉 Community & Astrology</h2><p className={s.stepPaneDesc}>Community details for compatible matching</p></div>
            <section className={s.section}>
              <div className={s.communityPills}><span className={s.pill}>Hindu</span><span className={s.pill}>Reddy</span></div>
              <p className={s.communityNote}>This bureau is exclusively for Reddy community members of Hindu religion.</p>
              <div className={s.grid3}>
                <Field label="Sub-Caste / Gotra *">
                  <input className={s.input} list="gotraListD" value={f.gotra} onChange={e => set('gotra', e.target.value)} placeholder="Type or search gotra…" />
                  <datalist id="gotraListD">{GOTRAS.map(g => <option key={g}>{g}</option>)}</datalist>
                </Field>
                <Field label="Father's Gotra">
                  <input className={s.input} list="fGotraListD" value={f.fatherGotra} onChange={e => set('fatherGotra', e.target.value)} placeholder="Type gotra…" />
                  <datalist id="fGotraListD">{GOTRAS.map(g => <option key={g}>{g}</option>)}</datalist>
                </Field>
                <Field label="Nakshatra *">
                  <select className={s.select} value={f.nakshatra} onChange={e => set('nakshatra', e.target.value)}>
                    <option value="">Select</option>
                    {NAKSHATRAS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Rashi (Moon Sign) *">
                  <select className={s.select} value={f.rashi} onChange={e => set('rashi', e.target.value)}>
                    <option value="">Select</option>
                    {RASHIS.map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('location')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={() => { if (validateCommunity()) go('career') }}>Next: Career →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Career ── */}
        {step === 'career' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>🎓 Education & Career</h2><p className={s.stepPaneDesc}>Academic qualifications and professional background</p></div>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Education</h3>
              <div className={s.grid3}>
                <Field label="Schooling Board">
                  <select className={s.select} value={f.schoolBoard} onChange={e => set('schoolBoard', e.target.value)}>
                    <option value="">Select Board</option>
                    {['SSC','CBSE','ICSE','State Board','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="School Name">
                  <input className={s.input} type="text" value={f.schoolName} onChange={e => set('schoolName', e.target.value)} placeholder="e.g. Delhi Public School" />
                </Field>
                <Field label="Intermediate / 12th College">
                  <input className={s.input} type="text" value={f.interCollege} onChange={e => set('interCollege', e.target.value)} placeholder="e.g. Sri Chaitanya" />
                </Field>
                <Field label="Highest Qualification *">
                  <select className={s.select} value={f.highestQual} onChange={e => set('highestQual', e.target.value)}>
                    <option value="">Select</option>
                    {['10th / SSC','Intermediate / 12th','Diploma','B.Tech / B.E.','B.Sc / B.Com / B.A.','MBBS','LLB','CA / CMA / CS','M.Tech / M.E.','M.Sc / M.Com / M.A.','M.B.A.','MD / MS','MS (USA/UK)','LLM','Ph.D.','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Degree / Engineering College">
                  <input className={s.input} type="text" value={f.degreeCollege} onChange={e => set('degreeCollege', e.target.value)} placeholder="e.g. Osmania University, IIT" />
                </Field>
                <Field label="PG / Higher Education College">
                  <input className={s.input} type="text" value={f.pgCollege} onChange={e => set('pgCollege', e.target.value)} placeholder="e.g. UTD Dallas, IIT Bombay" />
                </Field>
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Career</h3>
              <div className={s.grid3}>
                <Field label="Employed In *">
                  <select className={s.select} value={f.employedIn} onChange={e => set('employedIn', e.target.value)}>
                    <option value="">Select</option>
                    {['Government / PSU','Private Sector','Business / Self-Employed','Defence','Civil Services','IT / Software','Teaching / Professor','Agriculture','Not Working','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Occupation *">
                  <input className={s.input} type="text" value={f.occupation} onChange={e => set('occupation', e.target.value)} placeholder="e.g. Software Engineer" />
                </Field>
                <Field label="Company / Organisation">
                  <input className={s.input} type="text" value={f.company} onChange={e => set('company', e.target.value)} placeholder="e.g. TCS, Govt of TS" />
                </Field>
                <Field label="Work Country">
                  <select className={s.select} value={f.workCountry} onChange={e => { set('workCountry', e.target.value); set('workState', '') }}>
                    {['India','United States','United Kingdom','Canada','Australia','UAE','Singapore','Germany','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                {f.workCountry === 'India' && (
                  <Field label="Work State">
                    <select className={s.select} value={f.workState} onChange={e => set('workState', e.target.value)}>
                      <option value="">Select State</option>
                      {INDIA_STATES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="Work City">
                  <input className={s.input} type="text" value={f.workCity} onChange={e => set('workCity', e.target.value)} placeholder="e.g. Hyderabad, Austin" />
                </Field>
                <Field label="Annual Income (₹) *">
                  <input className={s.input} type="number" min="0" value={f.annualIncome} onChange={e => set('annualIncome', e.target.value)} placeholder="e.g. 600000" />
                </Field>
                {f.residentialStatus !== 'Permanent Resident' && (
                  <Field label="Visa Status">
                    <input className={s.input} type="text" value={f.visaStatus} onChange={e => set('visaStatus', e.target.value)} placeholder="e.g. H1B, PR, Citizen" />
                  </Field>
                )}
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Lifestyle</h3>
              <div className={s.grid3}>
                <Field label="Diet *">
                  <select className={s.select} value={f.diet} onChange={e => set('diet', e.target.value)}>
                    <option value="">Select</option>
                    {['Vegetarian','Non-Vegetarian','Eggetarian','Vegan'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Smoking">
                  <select className={s.select} value={f.smoking} onChange={e => set('smoking', e.target.value)}>
                    {['Never','Occasionally','Regularly'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Drinking">
                  <select className={s.select} value={f.drinking} onChange={e => set('drinking', e.target.value)}>
                    {['Never','Occasionally','Regularly'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="About Yourself" className={s.spanFull}>
                  <textarea className={s.textarea} value={f.aboutYourself} onChange={e => set('aboutYourself', e.target.value)} placeholder="Describe yourself, your interests, hobbies, values and what you seek in a life partner…" rows={4} />
                </Field>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('community')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={() => { if (validateCareer()) go('family') }}>Next: Family →</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Family ── */}
        {step === 'family' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>🏠 Family Background</h2><p className={s.stepPaneDesc}>Family details help ensure compatibility and trust</p></div>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Family Overview</h3>
              <div className={s.grid3}>
                <Field label="Family Type">
                  <select className={s.select} value={f.familyType} onChange={e => set('familyType', e.target.value)}>
                    <option>Nuclear Family</option><option>Joint Family</option>
                  </select>
                </Field>
                <Field label="Family Values">
                  <select className={s.select} value={f.familyValues} onChange={e => set('familyValues', e.target.value)}>
                    {['Orthodox','Traditional','Moderate','Liberal'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Family Status">
                  <select className={s.select} value={f.familyStatus} onChange={e => set('familyStatus', e.target.value)}>
                    <option value="">Select</option>
                    {['Middle Class','Upper Middle Class','Rich / Affluent','Wealthy'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Parents</h3>
              <div className={s.grid3}>
                <Field label="Father's Name">
                  <input className={s.input} type="text" value={f.fatherName} onChange={e => set('fatherName', e.target.value)} placeholder="Father's full name" />
                </Field>
                <Field label="Father's Status">
                  <select className={s.select} value={f.fatherStatus} onChange={e => set('fatherStatus', e.target.value)}>
                    <option value="">Select</option>
                    {['Employed','Business','Retired','Farmer','Passed Away'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                {f.fatherStatus && f.fatherStatus !== 'Passed Away' && (
                  <Field label="Father's Occupation">
                    <input className={s.input} type="text" value={f.fatherOcc} onChange={e => set('fatherOcc', e.target.value)} placeholder="e.g. Govt Officer, Business" />
                  </Field>
                )}
                <Field label="Mother's Name">
                  <input className={s.input} type="text" value={f.motherName} onChange={e => set('motherName', e.target.value)} placeholder="Mother's full name" />
                </Field>
                <Field label="Mother's Status">
                  <select className={s.select} value={f.motherStatus} onChange={e => set('motherStatus', e.target.value)}>
                    <option value="">Select</option>
                    {['Homemaker','Employed','Business','Retired','Passed Away'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                {f.motherStatus && f.motherStatus !== 'Homemaker' && f.motherStatus !== 'Passed Away' && (
                  <Field label="Mother's Occupation">
                    <input className={s.input} type="text" value={f.motherOcc} onChange={e => set('motherOcc', e.target.value)} placeholder="e.g. Teacher, Doctor" />
                  </Field>
                )}
                <Field label="Parent Mobile 1">
                  <input className={s.input} type="tel" value={f.parentMobile1} onChange={e => set('parentMobile1', e.target.value)} placeholder="+91 98765 43210" />
                </Field>
                <Field label={<>Parent Mobile 2 <span className={s.optLabel}>(optional)</span></>}>
                  <input className={s.input} type="tel" value={f.parentMobile2} onChange={e => set('parentMobile2', e.target.value)} placeholder="+91 98765 43210" />
                </Field>
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Siblings & Property</h3>
              <div className={s.grid3}>
                <Field label="Brothers"><select className={s.select} value={f.brothers} onChange={e => set('brothers', e.target.value)}>{['0','1','2','3','4+'].map(v => <option key={v}>{v}</option>)}</select></Field>
                <Field label="Brothers Married"><select className={s.select} value={f.brothersMarried} onChange={e => set('brothersMarried', e.target.value)}>{['0','1','2','3','4+'].map(v => <option key={v}>{v}</option>)}</select></Field>
                <Field label="Sisters"><select className={s.select} value={f.sisters} onChange={e => set('sisters', e.target.value)}>{['0','1','2','3','4+'].map(v => <option key={v}>{v}</option>)}</select></Field>
                <Field label="Sisters Married"><select className={s.select} value={f.sistersMarried} onChange={e => set('sistersMarried', e.target.value)}>{['0','1','2','3','4+'].map(v => <option key={v}>{v}</option>)}</select></Field>
                <Field label={<>Total Property Value <span className={s.optLabel}>(optional)</span></>} className={s.spanFull}>
                  <input className={s.input} type="text" value={f.propertyValue} onChange={e => set('propertyValue', e.target.value)} placeholder="e.g. 2 Crores, 50 Lakhs, Agricultural land" />
                </Field>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('career')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={() => go('partner')}>Next: Partner →</button>
            </div>
          </div>
        )}

        {/* ── STEP 6: Partner ── */}
        {step === 'partner' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>💑 Partner Preferences</h2><p className={s.stepPaneDesc}>What qualities are you looking for in a life partner?</p></div>
            <section className={s.section}>
              <div className={s.grid3}>
                <Field label="Preferred Age From"><input className={s.input} type="number" min="18" max="70" value={f.ppAgeFrom} onChange={e => set('ppAgeFrom', e.target.value)} placeholder="e.g. 22" /></Field>
                <Field label="Preferred Age To"><input className={s.input} type="number" min="18" max="80" value={f.ppAgeTo} onChange={e => set('ppAgeTo', e.target.value)} placeholder="e.g. 30" /></Field>
                <Field label="Min Height">
                  <select className={s.select} value={f.ppHeight} onChange={e => set('ppHeight', e.target.value)}>
                    <option value="">Any</option>
                    {["4'0\"","4'6\"","4'10\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Expected Education">
                  <select className={s.select} value={f.ppEducation} onChange={e => set('ppEducation', e.target.value)}>
                    <option value="">Any</option>
                    {['Graduate & Above','Post Graduate','Professional Degree','Doctorate'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Expected Profession"><input className={s.input} type="text" value={f.ppProfession} onChange={e => set('ppProfession', e.target.value)} placeholder="e.g. Doctor, Engineer, Any" /></Field>
                <Field label="Expected Income">
                  <select className={s.select} value={f.ppIncome} onChange={e => set('ppIncome', e.target.value)}>
                    <option value="">Any</option>
                    {['Below 2 L','2 L+','3 L+','5 L+','7 L+','10 L+','15 L+','20 L+','30 L+','50 L+','75 L+','1 Cr+','2 Cr+','5 Cr+','10 Cr+'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Location"><input className={s.input} type="text" value={f.ppLocation} onChange={e => set('ppLocation', e.target.value)} placeholder="e.g. Hyderabad, London, Any" /></Field>
                <Field label="NRI Acceptable?">
                  <select className={s.select} value={f.ppNRI} onChange={e => set('ppNRI', e.target.value)}>
                    {['Open to NRI','Prefer India-based','No Preference'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Other Expectations" className={s.spanFull}>
                  <textarea className={s.textarea} value={f.ppNotes} onChange={e => set('ppNotes', e.target.value)} placeholder="Any specific expectations about partner or family…" rows={3} />
                </Field>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('family')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={() => go('account')}>Next: Account →</button>
            </div>
          </div>
        )}

        {/* ── STEP 7: Account ── */}
        {step === 'account' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>🔐 Your Account</h2><p className={s.stepPaneDesc}>Set up login credentials for your profile</p></div>
            <section className={s.section}>
              <div className={s.grid3}>
                <Field label="Mobile Number *">
                  <input className={s.input} type="tel" value={f.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
                </Field>
                <Field label="Username *" hint="Letters, numbers, underscore and dot only">
                  <input className={s.input} type="text" value={f.username} onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))} placeholder="Choose a unique username" autoComplete="username" />
                </Field>
                <div className={s.passwordWrap}>
                  <span className={s.fieldLabel}>Password *</span>
                  <input className={s.inputPassword} type={showPass ? 'text' : 'password'} value={f.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" autoComplete="new-password" aria-label="Password" />
                  <button type="button" className={s.eyeBtn} onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('partner')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={handleAccountNext} disabled={loading}>{loading ? 'Checking…' : 'Next: Plan →'}</button>
            </div>
          </div>
        )}

        {/* ── STEP 8: Membership ── */}
        {step === 'membership' && (
          <div className={s.stepPane}>
            <div className={s.stepPaneHeader}><h2 className={s.stepPaneTitle}>👑 Select Your Plan</h2><p className={s.stepPaneDesc}>Choose the membership tier that suits your requirements</p></div>
            <section className={s.section}>
              <div className={s.tierRow}>
                {[
                  { id: 'VIP', icon: '👑', price: '₹15,000/yr', post: 'Post-engagement: ₹1,50,000/person' },
                  { id: 'Elite', icon: '🔱', price: '₹1,00,000/yr', post: 'Post-engagement: ₹3,00,000/person', featured: true },
                  { id: 'VVIP', icon: '💎', price: '₹30,000/yr', post: 'Post-engagement: ₹10,00,000/person' },
                ].map(({ id, icon, price, post, featured }) => (
                  <button type="button" key={id} className={`${s.tierCard} ${f.tier === id ? s.tierCardActive : ''} ${featured ? s.tierFeatured : ''}`} onClick={() => set('tier', id)}>
                    {featured && <div className={s.tierBadge}>RECOMMENDED</div>}
                    <div className={s.tierIcon}>{icon}</div>
                    <div className={s.tierName}>{id}</div>
                    <div className={s.tierPrice}>{price}</div>
                    <div className={s.tierNote}>{post}</div>
                  </button>
                ))}
              </div>
            </section>
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Terms & Conditions</h3>
              <div className={s.tcScroll}><pre className={s.tcText}>{TERMS}</pre></div>
              <label className={s.checkRow}>
                <input type="checkbox" checked={f.tcAgreed} onChange={e => set('tcAgreed', e.target.checked)} className={s.checkbox} />
                <span>I agree to all Terms & Conditions. I confirm I belong to the <strong>Reddy community, Hindu religion</strong>. I understand the post-engagement payment and 3-account viewing restriction.</span>
              </label>
            </section>
            <div className={s.navRow}>
              <button type="button" className={s.btnBack} onClick={() => go('account')}>← Back</button>
              <button type="button" className={s.btnNext} onClick={handleMembershipNext}>Review My Details →</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
