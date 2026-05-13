'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminProfile } from '../adminTypes'

type Form = Record<string, string>

const INITIAL: Form = {
  name: '', age: '', g: '', dob: '', ht: '', diet: '',
  edu: '', prof: '', inc: '', mob: '', email: '',
  city: '', state: '', country: '', nat: '',
  gotra: '', nak: '', rashi: '',
  fn: '', mn: '', pgmob1: '', pgmob2: '',
  ft: '', fv: '', fst: '', br: '', brm: '', sr: '', srm: '',
  tier: 'Premium', pval: '', notes: '', em: '👤',
}

function generateUsername(name: string, dob: string): string {
  const first = (name.split(' ')[0] ?? 'member').toLowerCase().replace(/[^a-z]/g, '')
  const year = dob ? dob.replace(/\D/g, '').slice(4, 8) : String(new Date().getFullYear()).slice(-2)
  return `${first}${year}`
}

function generatePassword(name: string, dob: string): string {
  const first = (name.split(' ')[0] ?? 'NRMB').replace(/[^a-zA-Z]/g, '')
  const digits = dob ? dob.replace(/\D/g, '').slice(0, 4) : '2024'
  return `${first.charAt(0).toUpperCase()}${first.slice(1)}@${digits}#`
}

export default function AddOffline({ profiles, setProfiles, showToast }: SectionProps) {
  const [form, setForm] = useState<Form>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [creds, setCreds] = useState<{ u: string; p: string; uid: string } | null>(null)

  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit() {
    if (!form.name || !form.g) { showToast('Name and Gender are required.'); return }
    if (profiles.find(p => p.u === form.email?.split('@')[0])) { showToast('Username already exists.'); return }

    const u = generateUsername(form.name, form.dob)
    const p = generatePassword(form.name, form.dob)
    const uid = `offline_${u}_${Date.now()}`

    setSaving(true)
    try {
      const profileData: Partial<AdminProfile> = {
        ...form,
        u, uid,
        age: Number(form.age) || undefined,
        source: 'offline',
        status: 'active',
      } as Partial<AdminProfile>

      await setDoc(doc(db, 'users', uid), {
        ...profileData,
        password: p,
        createdAt: serverTimestamp(),
      })

      const newProfile = { ...profileData, uid, u } as AdminProfile
      setProfiles([...profiles, newProfile])
      setCreds({ u, p, uid })
      setForm(INITIAL)
      showToast('✅ Member registered successfully')
    } catch (e: unknown) {
      showToast('Error: ' + (e instanceof Error ? e.message : String(e)))
    }
    setSaving(false)
  }

  return (
    <div className={s.offForm}>
      <div className={s.offFormTitle}>Register Offline / Walk-In Member</div>
      <div className={s.offFormSub}>Manually register members who visit the bureau office or contact us by phone.</div>

      {creds && (
        <div className={s.credBox} style={{ marginBottom: '1.4rem' }}>
          <div className={s.credTitle}>✅ Member Registered — Login Credentials</div>
          <div className={s.credRow}>Username: <span className={s.credVal}>{creds.u}</span></div>
          <div className={s.credRow}>Password: <span className={s.credVal}>{creds.p}</span></div>
          <div className={s.credRow} style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--a-muted)' }}>Share these credentials with the member. They can change their password after login.</div>
          <button className={`${s.actBtn} ${s.actBtnPrim}`} style={{ marginTop: '0.6rem' }} onClick={() => setCreds(null)}>Dismiss</button>
        </div>
      )}

      {/* Tier */}
      <div className={s.formSectionTitle}>Membership Tier</div>
      <div className={s.tierMiniRow}>
        {['Premium', 'VIP', 'Elite', 'VVIP'].map(t => (
          <div key={t} className={`${s.tierMini} ${form.tier === t ? s.tierMiniSel : ''}`} onClick={() => setF('tier', t)}>
            <div className={s.tierMiniName}>{t}</div>
          </div>
        ))}
      </div>

      {/* Personal */}
      <div className={s.formSectionTitle}>Personal Details</div>
      <div className={s.formGrid2}>
        <div className={s.formGroup}><label className={s.formLabel}>Full Name *</label><input className={s.formInput} value={form.name} onChange={e => setF('name', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Age</label><input className={s.formInput} type="number" value={form.age} onChange={e => setF('age', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Date of Birth (DD-MM-YYYY)</label><input className={s.formInput} placeholder="15-06-1995" value={form.dob} onChange={e => setF('dob', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Height</label><input className={s.formInput} placeholder="5ft 4in" value={form.ht} onChange={e => setF('ht', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Gender *</label>
          <select className={s.formSelect} value={form.g} onChange={e => setF('g', e.target.value)}>
            <option value="">Select Gender</option><option>Male</option><option>Female</option>
          </select>
        </div>
        <div className={s.formGroup}><label className={s.formLabel}>Diet</label>
          <select className={s.formSelect} value={form.diet} onChange={e => setF('diet', e.target.value)}>
            <option value="">Select</option><option>Vegetarian</option><option>Non-Vegetarian</option><option>Eggetarian</option>
          </select>
        </div>
        <div className={s.formGroup}><label className={s.formLabel}>Mobile</label><input className={s.formInput} type="tel" value={form.mob} onChange={e => setF('mob', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Email</label><input className={s.formInput} type="email" value={form.email} onChange={e => setF('email', e.target.value)} /></div>
      </div>

      {/* Location */}
      <div className={s.formSectionTitle}>Location</div>
      <div className={s.formGrid3}>
        <div className={s.formGroup}><label className={s.formLabel}>City</label><input className={s.formInput} value={form.city} onChange={e => setF('city', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>State</label><input className={s.formInput} value={form.state} onChange={e => setF('state', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Country</label><input className={s.formInput} value={form.country} onChange={e => setF('country', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Native Place</label><input className={s.formInput} value={form.nat} onChange={e => setF('nat', e.target.value)} /></div>
      </div>

      {/* Education & Career */}
      <div className={s.formSectionTitle}>Education & Career</div>
      <div className={s.formGrid2}>
        <div className={s.formGroup}><label className={s.formLabel}>Qualification</label><input className={s.formInput} value={form.edu} onChange={e => setF('edu', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Profession / Occupation</label><input className={s.formInput} value={form.prof} onChange={e => setF('prof', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Annual Income</label><input className={s.formInput} placeholder="e.g. 8 LPA" value={form.inc} onChange={e => setF('inc', e.target.value)} /></div>
      </div>

      {/* Astrology */}
      <div className={s.formSectionTitle}>Community & Astrology</div>
      <div className={s.formGrid3}>
        <div className={s.formGroup}><label className={s.formLabel}>Gotra</label><input className={s.formInput} value={form.gotra} onChange={e => setF('gotra', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Nakshatra</label><input className={s.formInput} value={form.nak} onChange={e => setF('nak', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Rashi</label><input className={s.formInput} value={form.rashi} onChange={e => setF('rashi', e.target.value)} /></div>
      </div>

      {/* Family */}
      <div className={s.formSectionTitle}>Family Details</div>
      <div className={s.formGrid2}>
        <div className={s.formGroup}><label className={s.formLabel}>Father Name</label><input className={s.formInput} value={form.fn} onChange={e => setF('fn', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Father Mobile</label><input className={s.formInput} value={form.pgmob1} onChange={e => setF('pgmob1', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Mother Name</label><input className={s.formInput} value={form.mn} onChange={e => setF('mn', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Mother Mobile</label><input className={s.formInput} value={form.pgmob2} onChange={e => setF('pgmob2', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Family Type</label>
          <select className={s.formSelect} value={form.ft} onChange={e => setF('ft', e.target.value)}>
            <option value="">Select</option><option>Joint</option><option>Nuclear</option>
          </select>
        </div>
        <div className={s.formGroup}><label className={s.formLabel}>Family Values</label>
          <select className={s.formSelect} value={form.fv} onChange={e => setF('fv', e.target.value)}>
            <option value="">Select</option><option>Traditional</option><option>Moderate</option><option>Liberal</option>
          </select>
        </div>
        <div className={s.formGroup}><label className={s.formLabel}>Brothers</label><input className={s.formInput} type="number" min="0" max="10" value={form.br} onChange={e => setF('br', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Brothers Married</label><input className={s.formInput} type="number" min="0" max="10" value={form.brm} onChange={e => setF('brm', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Sisters</label><input className={s.formInput} type="number" min="0" max="10" value={form.sr} onChange={e => setF('sr', e.target.value)} /></div>
        <div className={s.formGroup}><label className={s.formLabel}>Sisters Married</label><input className={s.formInput} type="number" min="0" max="10" value={form.srm} onChange={e => setF('srm', e.target.value)} /></div>
      </div>

      {/* Partner Preferences & Notes */}
      <div className={s.formSectionTitle}>Partner Preferences & Notes</div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Partner Preferences</label>
        <textarea className={s.formInput} rows={3} value={form.pval} onChange={e => setF('pval', e.target.value)} style={{ resize: 'vertical' }} />
      </div>
      <div className={s.formGroup}>
        <label className={s.formLabel}>Admin Notes</label>
        <textarea className={s.formInput} rows={2} value={form.notes} onChange={e => setF('notes', e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <button className={s.btnLux} onClick={handleSubmit} disabled={saving} style={{ marginTop: '1rem' }}>
        {saving ? 'Registering…' : 'Register Member'}
      </button>
    </div>
  )
}
