'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { Profile } from '@/lib/types'
import s from './edit.module.css'

const HEIGHTS = ["4'6\"","4'8\"","4'10\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""]
const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanus','Makara','Kumbha','Meena']
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']
const INDIA_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','J&K','Ladakh','Other']

type F = Record<string, string>

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={s.field}>
      <label className={s.label}>{label}</label>
      {children}
    </div>
  )
}

export default function EditProfilePage({ desktop = false }: { desktop?: boolean }) {
  const router = useRouter()
  const { user, profile: me, loading, refreshProfile } = useAuth()
  const [form, setForm] = useState<F>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSavedMsg] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) { router.replace('/login'); return }
    if (me) {
      const p = me as Profile & Record<string, unknown>
      const edu = p.education as Record<string, string> | undefined
      const car = p.career as Record<string, string> | undefined
      const fam = p.family as Record<string, string> | undefined
      const partner = p.partner as Record<string, string> | undefined
      setForm({
        name: p.name ?? '',
        dob: p.dob ?? '',
        g: p.g ?? p.gender ?? '',
        ht: p.ht ?? '',
        maritalStatus: p.maritalStatus as string ?? '',
        motherTongue: p.motherTongue as string ?? '',
        complexion: p.complexion as string ?? '',
        bodyType: p.bodyType as string ?? '',
        bloodGroup: p.bg ?? p.bloodGroup as string ?? '',
        diet: p.diet ?? '',
        placeOfBirth: p.placeOfBirth as string ?? '',
        city: p.city ?? '',
        state: p.state ?? '',
        country: p.country ?? 'India',
        nativePlace: p.nat ?? p.native ?? '',
        residentialStatus: p.residentialStatus as string ?? '',
        gotra: p.gotra ?? '',
        fatherGotra: p.fatherGotra as string ?? '',
        nakshatra: p.nak ?? '',
        rashi: p.rashi ?? '',
        mobile: p.mob ?? '',
        aboutYourself: p.aboutYourself as string ?? '',
        highestQual: edu?.highestQual ?? p.edu ?? '',
        occupation: car?.occupation ?? p.prof ?? p.occ ?? '',
        company: car?.company ?? '',
        workCity: car?.workCity ?? '',
        annualIncome: car?.annualIncome ?? p.inc ?? p.sal ?? '',
        fatherName: fam?.fatherName ?? p.fn ?? '',
        motherName: fam?.motherName ?? p.mn ?? '',
        ppAgeFrom: partner?.ppAgeFrom ?? `${p.pp_af ?? ''}`,
        ppAgeTo: partner?.ppAgeTo ?? `${p.pp_at ?? ''}`,
        ppHeight: partner?.ppHeight ?? p.pp_hf as string ?? '',
        ppIncome: partner?.ppIncome ?? p.pp_inc as string ?? '',
        ppLocation: partner?.ppLocation ?? p.pp_loc as string ?? p.pploc as string ?? '',
        ppNRI: partner?.ppNRI ?? p.pp_nri as string ?? '',
      })
    }
  }, [me, loading, user, router])

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function save() {
    if (!user || !me) return
    setSaving(true); setError(''); setSavedMsg(false)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: form.name,
        dob: form.dob,
        g: form.g,
        gender: form.g,
        ht: form.ht,
        maritalStatus: form.maritalStatus,
        motherTongue: form.motherTongue,
        complexion: form.complexion,
        bodyType: form.bodyType,
        bg: form.bloodGroup,
        diet: form.diet,
        placeOfBirth: form.placeOfBirth,
        city: form.city,
        state: form.state,
        country: form.country,
        nat: form.nativePlace,
        native: form.nativePlace,
        residentialStatus: form.residentialStatus,
        gotra: form.gotra,
        fatherGotra: form.fatherGotra,
        nak: form.nakshatra,
        rashi: form.rashi,
        mob: form.mobile,
        aboutYourself: form.aboutYourself,
        edu: form.highestQual,
        prof: form.occupation,
        occ: form.occupation,
        inc: form.annualIncome,
        fn: form.fatherName,
        mn: form.motherName,
        pp_af: form.ppAgeFrom,
        pp_at: form.ppAgeTo,
        pp_hf: form.ppHeight,
        pp_inc: form.ppIncome,
        pp_loc: form.ppLocation,
        pp_nri: form.ppNRI,
      })
      await refreshProfile()
      setSavedMsg(true)
      setTimeout(() => router.push('/my-profile'), 1200)
    } catch (e: unknown) {
      setError('Save failed. Please try again.')
      console.error(e)
    }
    setSaving(false)
  }

  if (loading || !me) return <div className={s.loadWrap}><div className={s.spinner} /></div>

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={s.topBar}>
        <button type="button" className={s.backBtn} onClick={() => router.back()}>← Back</button>
        <h1 className={s.title}>Edit Profile</h1>
      </div>

      {error && <div className={s.errorBanner}>{error}</div>}
      {saved && <div className={s.successBanner}>✓ Profile saved!</div>}

      <div className={s.body}>
        <div className={s.section}>
          <div className={s.sectionTitle}>Personal Details</div>
          <div className={s.grid2}>
            <Field label="Full Name *">
              <input className={s.input} type="text" value={form.name ?? ''} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Date of Birth">
              <input className={s.input} type="date" value={form.dob ?? ''} onChange={e => set('dob', e.target.value)} />
            </Field>
            <Field label="Gender">
              <div className={s.genderRow}>
                <button type="button" className={`${s.genderBtn} ${form.g === 'Male' ? s.genderActive : ''}`} onClick={() => set('g', 'Male')}>♂ Male</button>
                <button type="button" className={`${s.genderBtn} ${form.g === 'Female' ? s.genderActive : ''}`} onClick={() => set('g', 'Female')}>♀ Female</button>
              </div>
            </Field>
            <Field label="Height">
              <select className={s.select} value={form.ht ?? ''} onChange={e => set('ht', e.target.value)}>
                <option value="">Select</option>
                {HEIGHTS.map(h => <option key={h}>{h}</option>)}
              </select>
            </Field>
            <Field label="Marital Status">
              <select className={s.select} value={form.maritalStatus ?? ''} onChange={e => set('maritalStatus', e.target.value)}>
                <option value="">Select</option>
                {['Never Married','Divorced','Widowed','Awaiting Divorce'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Mother Tongue">
              <select className={s.select} value={form.motherTongue ?? ''} onChange={e => set('motherTongue', e.target.value)}>
                <option value="">Select</option>
                {['Telugu','Kannada','Tamil','Hindi','Marathi','Other'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Complexion">
              <select className={s.select} value={form.complexion ?? ''} onChange={e => set('complexion', e.target.value)}>
                <option value="">Select</option>
                {['Very Fair','Fair','Wheatish','Wheatish Brown','Dark'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Body Type">
              <select className={s.select} value={form.bodyType ?? ''} onChange={e => set('bodyType', e.target.value)}>
                <option value="">Select</option>
                {['Slim','Athletic','Average','Heavy'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Blood Group">
              <select className={s.select} value={form.bloodGroup ?? ''} onChange={e => set('bloodGroup', e.target.value)}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Diet">
              <select className={s.select} value={form.diet ?? ''} onChange={e => set('diet', e.target.value)}>
                <option value="">Select</option>
                {['Vegetarian','Non-Vegetarian','Eggetarian','Vegan'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="About Yourself">
            <textarea className={`${s.input} ${s.textarea}`} value={form.aboutYourself ?? ''} onChange={e => set('aboutYourself', e.target.value)} rows={4} placeholder="Describe yourself, interests, values…" />
          </Field>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Location</div>
          <div className={s.grid2}>
            <Field label="Country">
              <select className={s.select} value={form.country ?? 'India'} onChange={e => { set('country', e.target.value); set('state', '') }}>
                {['India','United States','United Kingdom','Canada','Australia','UAE','Singapore','Germany','Other'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            {form.country === 'India' && (
              <Field label="State">
                <select className={s.select} value={form.state ?? ''} onChange={e => set('state', e.target.value)}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
            )}
            <Field label="City">
              <input className={s.input} type="text" value={form.city ?? ''} onChange={e => set('city', e.target.value)} />
            </Field>
            <Field label="Native Place / District">
              <input className={s.input} type="text" value={form.nativePlace ?? ''} onChange={e => set('nativePlace', e.target.value)} />
            </Field>
            <Field label="Residential Status">
              <select className={s.select} value={form.residentialStatus ?? ''} onChange={e => set('residentialStatus', e.target.value)}>
                {['Permanent Resident','NRI','Student Abroad','Work Visa'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Community & Astrology</div>
          <div className={s.grid2}>
            <Field label="Gotra">
              <input className={s.input} type="text" value={form.gotra ?? ''} onChange={e => set('gotra', e.target.value)} />
            </Field>
            <Field label="Father's Gotra">
              <input className={s.input} type="text" value={form.fatherGotra ?? ''} onChange={e => set('fatherGotra', e.target.value)} />
            </Field>
            <Field label="Nakshatra">
              <select className={s.select} value={form.nakshatra ?? ''} onChange={e => set('nakshatra', e.target.value)}>
                <option value="">Select</option>
                {NAKSHATRAS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Rashi">
              <select className={s.select} value={form.rashi ?? ''} onChange={e => set('rashi', e.target.value)}>
                <option value="">Select</option>
                {RASHIS.map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Career</div>
          <div className={s.grid2}>
            <Field label="Highest Qualification">
              <select className={s.select} value={form.highestQual ?? ''} onChange={e => set('highestQual', e.target.value)}>
                <option value="">Select</option>
                {['10th / SSC','Intermediate','Diploma','B.Tech / B.E.','B.Sc / B.Com / B.A.','MBBS','LLB','CA','M.Tech','M.Sc / M.Com / M.A.','M.B.A.','MD / MS','Ph.D.','Other'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Occupation">
              <input className={s.input} type="text" value={form.occupation ?? ''} onChange={e => set('occupation', e.target.value)} />
            </Field>
            <Field label="Company">
              <input className={s.input} type="text" value={form.company ?? ''} onChange={e => set('company', e.target.value)} />
            </Field>
            <Field label="Work City">
              <input className={s.input} type="text" value={form.workCity ?? ''} onChange={e => set('workCity', e.target.value)} />
            </Field>
            <Field label="Annual Income (₹)">
              <input className={s.input} type="text" value={form.annualIncome ?? ''} onChange={e => set('annualIncome', e.target.value)} placeholder="e.g. 600000" />
            </Field>
            <Field label="Mobile Number">
              <input className={s.input} type="tel" value={form.mobile ?? ''} onChange={e => set('mobile', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Family</div>
          <div className={s.grid2}>
            <Field label="Father's Name">
              <input className={s.input} type="text" value={form.fatherName ?? ''} onChange={e => set('fatherName', e.target.value)} />
            </Field>
            <Field label="Mother's Name">
              <input className={s.input} type="text" value={form.motherName ?? ''} onChange={e => set('motherName', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Partner Preferences</div>
          <div className={s.grid2}>
            <Field label="Preferred Age From">
              <input className={s.input} type="number" value={form.ppAgeFrom ?? ''} onChange={e => set('ppAgeFrom', e.target.value)} placeholder="e.g. 22" />
            </Field>
            <Field label="Preferred Age To">
              <input className={s.input} type="number" value={form.ppAgeTo ?? ''} onChange={e => set('ppAgeTo', e.target.value)} placeholder="e.g. 30" />
            </Field>
            <Field label="Min Height">
              <select className={s.select} value={form.ppHeight ?? ''} onChange={e => set('ppHeight', e.target.value)}>
                <option value="">Any</option>
                {HEIGHTS.map(h => <option key={h}>{h}</option>)}
              </select>
            </Field>
            <Field label="Expected Income">
              <select className={s.select} value={form.ppIncome ?? ''} onChange={e => set('ppIncome', e.target.value)}>
                <option value="">Any</option>
                {['Below 2 L','2 L+','5 L+','10 L+','20 L+','50 L+','1 Cr+'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Preferred Location">
              <input className={s.input} type="text" value={form.ppLocation ?? ''} onChange={e => set('ppLocation', e.target.value)} placeholder="e.g. Hyderabad, Any" />
            </Field>
            <Field label="NRI Acceptable">
              <select className={s.select} value={form.ppNRI ?? ''} onChange={e => set('ppNRI', e.target.value)}>
                {['Open to NRI','Prefer India-based','No Preference'].map(v => <option key={v}>{v}</option>)}
              </select>
            </Field>
          </div>
        </div>

        <div className={s.saveRow}>
          <button type="button" className={s.btnSave} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
