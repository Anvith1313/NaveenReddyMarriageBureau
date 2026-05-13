'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { db, storage } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { ref as stRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { AdminProfile, profileEm, profileName, tsToString } from '../adminTypes'
import { formatIncome } from '@/lib/types'

type ModalType = 'view' | 'edit' | 'biodata' | null

const TIERS = ['Premium', 'VIP', 'Elite', 'VVIP']
const GENDERS = ['Male', 'Female']

function DetailChip({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className={s.profileChip}>
      <div className={s.profileChipLabel}>{label}</div>
      <div className={`${s.profileChipValue} ${!value ? s.profileChipEmpty : ''}`}>{value || '— not filled —'}</div>
    </div>
  )
}

export default function Profiles({ profiles, setProfiles, showToast }: SectionProps) {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [modal, setModal] = useState<ModalType>(null)
  const [selected, setSelected] = useState<AdminProfile | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)

  const filtered = useMemo(() => {
    return profiles.filter(p => {
      const matchSearch = !search || JSON.stringify(p).toLowerCase().includes(search.toLowerCase())
      const matchTier = !tierFilter || p.tier === tierFilter
      const matchGender = !genderFilter || p.g === genderFilter
      return matchSearch && matchTier && matchGender
    })
  }, [profiles, search, tierFilter, genderFilter])

  function openView(p: AdminProfile) { setSelected(p); setModal('view') }
  function openEdit(p: AdminProfile) {
    setSelected(p)
    setEditForm({
      name: p.name ?? '', age: String(p.age ?? ''), g: p.g ?? '', ht: p.ht ?? '',
      dob: p.dob ?? '', edu: p.edu ?? '', prof: p.prof ?? p.occ ?? '',
      inc: p.inc ?? p.sal ?? '', city: p.city ?? '', state: p.state ?? '',
      country: p.country ?? '', nat: p.nat ?? p.native ?? '',
      mob: p.mob ?? '', email: p.email ?? '', tier: p.tier ?? '',
      gotra: p.gotra ?? '', nak: p.nak ?? '', rashi: p.rashi ?? '',
      fn: p.fn ?? '', mn: p.mn ?? '', pgmob1: p.pgmob1 ?? p.fmob ?? '',
      pgmob2: p.pgmob2 ?? p.mmob ?? '', ft: p.ft ?? '', fv: p.fv ?? '',
      diet: p.diet ?? '', notes: p.notes ?? '', pval: p.pval ?? '',
    })
    setModal('edit')
  }
  function openBiodata(p: AdminProfile) { setSelected(p); setModal('biodata') }
  function closeModal() { setModal(null); setSelected(null) }

  async function saveEdit() {
    if (!selected) return
    try {
      const updates: Record<string, string | number> = { ...editForm }
      if (editForm.age) updates.age = Number(editForm.age)
      await updateDoc(doc(db, 'users', selected.uid), { ...updates, updatedAt: serverTimestamp() })
      setProfiles(profiles.map(p => p.uid === selected.uid ? { ...p, ...editForm, age: Number(editForm.age) || p.age } : p))
      showToast('✅ Profile updated')
      closeModal()
    } catch (e: unknown) {
      showToast('Error: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  async function uploadPhoto(file: File) {
    if (!selected) return
    setUploading(true)
    try {
      const path = `photos/${selected.uid}/${Date.now()}_${file.name}`
      const snap = await uploadBytes(stRef(storage, path), file)
      const url = await getDownloadURL(snap.ref)
      const newPhotos = [...(selected.photos ?? []), url]
      await updateDoc(doc(db, 'users', selected.uid), { photos: newPhotos })
      const updated = { ...selected, photos: newPhotos }
      setSelected(updated)
      setProfiles(profiles.map(p => p.uid === selected.uid ? updated : p))
      showToast('Photo uploaded')
    } catch (e: unknown) {
      showToast('Upload failed: ' + (e instanceof Error ? e.message : String(e)))
    }
    setUploading(false)
  }

  async function deletePhoto(idx: number) {
    if (!selected) return
    const newPhotos = (selected.photos ?? []).filter((_, i) => i !== idx)
    try {
      await updateDoc(doc(db, 'users', selected.uid), { photos: newPhotos })
      const updated = { ...selected, photos: newPhotos }
      setSelected(updated)
      setProfiles(profiles.map(p => p.uid === selected.uid ? updated : p))
      showToast('Photo removed')
    } catch (e: unknown) {
      showToast('Error: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  async function archiveProfile(p: AdminProfile) {
    if (!confirm(`Archive ${profileName(p)}? They will be moved to archived profiles.`)) return
    try {
      await updateDoc(doc(db, 'users', p.uid), { status: 'archived', closedDate: new Date().toISOString().split('T')[0] })
      setProfiles(profiles.filter(x => x.uid !== p.uid))
      showToast(`${profileName(p)} archived`)
      closeModal()
    } catch (e: unknown) {
      showToast('Error: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  async function deleteProfile(p: AdminProfile) {
    if (!confirm(`Permanently DELETE ${profileName(p)}? This cannot be undone.`)) return
    try {
      await deleteDoc(doc(db, 'users', p.uid))
      setProfiles(profiles.filter(x => x.uid !== p.uid))
      showToast(`${profileName(p)} deleted`)
      closeModal()
    } catch (e: unknown) {
      showToast('Error: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const ef = (k: string) => editForm[k] ?? ''
  const setEf = (k: string, v: string) => setEditForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <div className={s.secTools}>
        <input
          className={s.secSearch}
          placeholder="Search by name, city, profession…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={s.secFilter} value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="">All Tiers</option>
          {TIERS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className={s.secFilter} value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
          <option value="">All Genders</option>
          {GENDERS.map(g => <option key={g}>{g}</option>)}
        </select>
        <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)' }}>
          {filtered.length} of {profiles.length} profiles
        </span>
      </div>

      <div className={s.cardGrid}>
        {filtered.map(p => (
          <div key={p.uid} className={s.card}>
            <div className={s.cardTop}>
              <div className={s.cardAvatar}>{profileEm(p)}</div>
              <div>
                <div className={s.cardName}>{profileName(p)}</div>
                <div className={s.cardStatus} style={{ color: 'var(--a-gold)', borderColor: 'rgba(184,137,42,.2)', background: 'rgba(184,137,42,.06)' }}>
                  {p.tier ?? 'No Tier'}
                </div>
              </div>
            </div>
            <div className={s.cardDetail}>
              <strong>Age:</strong> {p.age ?? '—'} · <strong>Gender:</strong> {p.g ?? '—'}<br />
              <strong>City:</strong> {p.city ?? '—'} · <strong>State:</strong> {p.state ?? '—'}<br />
              <strong>Mobile:</strong> {p.mob ?? '—'}<br />
              <strong>Joined:</strong> {tsToString(p.createdAt)}
            </div>
            <div className={s.cardActions}>
              <button className={s.actBtn} onClick={() => openView(p)}>👁 View</button>
              <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => openEdit(p)}>✏ Edit</button>
              <button className={s.actBtn} onClick={() => openBiodata(p)}>📄 Biodata</button>
              <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => archiveProfile(p)}>🗄 Archive</button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {modal === 'view' && selected && (
        <div className={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={`${s.modal} ${s.modalWide}`}>
            <div className={s.modalHead}>
              <div className={s.modalTitle}>{profileName(selected)}</div>
              <div className={s.modalSub}>{selected.tier} · {selected.g} · {selected.age} yrs</div>
              <button className={s.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={s.modalBody}>
              {(selected.photos?.length ?? 0) > 0 && (
                <div className={s.photoRow}>
                  {selected.photos!.map((url, i) => (
                    <div key={i} className={s.photoThumb}>
                      <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--a-gold)', marginBottom: '0.3rem' }}>Basic Details</div>
              <div className={s.profileGrid}>
                <DetailChip label="Name" value={selected.name} />
                <DetailChip label="Age" value={selected.age} />
                <DetailChip label="DOB" value={selected.dob} />
                <DetailChip label="Height" value={selected.ht} />
                <DetailChip label="Gender" value={selected.g} />
                <DetailChip label="Diet" value={selected.diet} />
                <DetailChip label="Education" value={selected.edu} />
                <DetailChip label="Profession" value={selected.prof ?? selected.occ} />
                <DetailChip label="Income" value={formatIncome(selected.inc ?? selected.sal)} />
                <DetailChip label="Mobile" value={selected.mob} />
                <DetailChip label="Email" value={selected.email} />
                <DetailChip label="City" value={selected.city} />
                <DetailChip label="State" value={selected.state} />
                <DetailChip label="Country" value={selected.country} />
                <DetailChip label="Native" value={selected.nat ?? selected.native} />
                <DetailChip label="Tier" value={selected.tier} />
                <DetailChip label="Gotra" value={selected.gotra} />
                <DetailChip label="Nakshatra" value={selected.nak} />
                <DetailChip label="Rashi" value={selected.rashi} />
                <DetailChip label="Father Name" value={selected.fn} />
                <DetailChip label="Mother Name" value={selected.mn} />
                <DetailChip label="Father Mobile" value={selected.pgmob1 ?? selected.fmob} />
                <DetailChip label="Mother Mobile" value={selected.pgmob2 ?? selected.mmob} />
                <DetailChip label="Joined" value={tsToString(selected.createdAt)} />
                <DetailChip label="Updated" value={tsToString(selected.updatedAt)} />
              </div>
              {selected.notes && (
                <div style={{ marginTop: '1rem', fontFamily: "'EB Garamond', serif", fontSize: '0.9rem', color: 'var(--a-muted)', fontStyle: 'italic' }}>
                  <strong style={{ color: 'var(--a-gold)' }}>Admin Notes:</strong> {selected.notes}
                </div>
              )}
              <div className={s.cardActions} style={{ marginTop: '1.4rem' }}>
                <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => openEdit(selected)}>✏ Edit Profile</button>
                <button className={s.actBtn} onClick={() => openBiodata(selected)}>📄 View Biodata</button>
                <button className={`${s.actBtn} ${s.actBtnDanger}`} onClick={() => deleteProfile(selected)}>🗑 Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modal === 'edit' && selected && (
        <div className={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={`${s.modal} ${s.modalWide}`}>
            <div className={s.modalHead}>
              <div className={s.modalTitle}>Edit: {profileName(selected)}</div>
              <div className={s.modalSub}>@{selected.u}</div>
              <button className={s.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={s.modalBody}>
              {/* Photos */}
              <div className={s.formSectionTitle}>Photos</div>
              <div className={s.photoRow}>
                {(selected.photos ?? []).map((url, i) => (
                  <div key={i} className={s.photoThumb}>
                    <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                    <div className={s.photoThumbDel} onClick={() => deletePhoto(i)}>×</div>
                  </div>
                ))}
                <label className={s.photoUpload}>
                  {uploading ? 'Uploading…' : '+ Add Photo'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
                </label>
              </div>

              {/* Tier */}
              <div className={s.formSectionTitle}>Membership Tier</div>
              <div className={s.tierMiniRow}>
                {TIERS.map(t => (
                  <div key={t} className={`${s.tierMini} ${ef('tier') === t ? s.tierMiniSel : ''}`} onClick={() => setEf('tier', t)}>
                    <div className={s.tierMiniName}>{t}</div>
                  </div>
                ))}
              </div>

              {/* Personal */}
              <div className={s.formSectionTitle}>Personal Details</div>
              <div className={s.formGrid2}>
                <div className={s.formGroup}><label className={s.formLabel}>Full Name</label><input className={s.formInput} value={ef('name')} onChange={e => setEf('name', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Age</label><input className={s.formInput} type="number" value={ef('age')} onChange={e => setEf('age', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Date of Birth</label><input className={s.formInput} value={ef('dob')} onChange={e => setEf('dob', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Height</label><input className={s.formInput} placeholder="5ft 4in" value={ef('ht')} onChange={e => setEf('ht', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Gender</label>
                  <select className={s.formSelect} value={ef('g')} onChange={e => setEf('g', e.target.value)}>
                    <option value="">Select</option><option>Male</option><option>Female</option>
                  </select>
                </div>
                <div className={s.formGroup}><label className={s.formLabel}>Diet</label>
                  <select className={s.formSelect} value={ef('diet')} onChange={e => setEf('diet', e.target.value)}>
                    <option value="">Select</option><option>Vegetarian</option><option>Non-Vegetarian</option><option>Eggetarian</option>
                  </select>
                </div>
                <div className={s.formGroup}><label className={s.formLabel}>Mobile</label><input className={s.formInput} value={ef('mob')} onChange={e => setEf('mob', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Email</label><input className={s.formInput} value={ef('email')} onChange={e => setEf('email', e.target.value)} /></div>
              </div>

              {/* Location */}
              <div className={s.formSectionTitle}>Location</div>
              <div className={s.formGrid3}>
                <div className={s.formGroup}><label className={s.formLabel}>City</label><input className={s.formInput} value={ef('city')} onChange={e => setEf('city', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>State</label><input className={s.formInput} value={ef('state')} onChange={e => setEf('state', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Country</label><input className={s.formInput} value={ef('country')} onChange={e => setEf('country', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Native Place</label><input className={s.formInput} value={ef('nat')} onChange={e => setEf('nat', e.target.value)} /></div>
              </div>

              {/* Community */}
              <div className={s.formSectionTitle}>Community & Astrology</div>
              <div className={s.formGrid3}>
                <div className={s.formGroup}><label className={s.formLabel}>Gotra</label><input className={s.formInput} value={ef('gotra')} onChange={e => setEf('gotra', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Nakshatra</label><input className={s.formInput} value={ef('nak')} onChange={e => setEf('nak', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Rashi</label><input className={s.formInput} value={ef('rashi')} onChange={e => setEf('rashi', e.target.value)} /></div>
              </div>

              {/* Career */}
              <div className={s.formSectionTitle}>Education & Career</div>
              <div className={s.formGrid2}>
                <div className={s.formGroup}><label className={s.formLabel}>Qualification</label><input className={s.formInput} value={ef('edu')} onChange={e => setEf('edu', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Profession</label><input className={s.formInput} value={ef('prof')} onChange={e => setEf('prof', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Annual Income</label><input className={s.formInput} placeholder="e.g. 8 LPA" value={ef('inc')} onChange={e => setEf('inc', e.target.value)} /></div>
              </div>

              {/* Family */}
              <div className={s.formSectionTitle}>Family</div>
              <div className={s.formGrid2}>
                <div className={s.formGroup}><label className={s.formLabel}>Father Name</label><input className={s.formInput} value={ef('fn')} onChange={e => setEf('fn', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Father Mobile</label><input className={s.formInput} value={ef('pgmob1')} onChange={e => setEf('pgmob1', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Mother Name</label><input className={s.formInput} value={ef('mn')} onChange={e => setEf('mn', e.target.value)} /></div>
                <div className={s.formGroup}><label className={s.formLabel}>Mother Mobile</label><input className={s.formInput} value={ef('pgmob2')} onChange={e => setEf('pgmob2', e.target.value)} /></div>
              </div>

              {/* Notes */}
              <div className={s.formSectionTitle}>Admin Notes</div>
              <div className={s.formGroup}>
                <textarea className={s.formInput} rows={3} value={ef('notes')} onChange={e => setEf('notes', e.target.value)} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={saveEdit} style={{ padding: '0.6rem 1.8rem' }}>Save Changes</button>
                <button className={s.actBtn} onClick={closeModal} style={{ padding: '0.6rem 1.4rem' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BIODATA MODAL */}
      {modal === 'biodata' && selected && (
        <div className={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className={`${s.modal} ${s.modalWide}`}>
            <div className={s.modalHead}>
              <div className={s.modalTitle}>Biodata — {profileName(selected)}</div>
              <button className={s.modalClose} onClick={closeModal}>×</button>
            </div>
            <div className={s.modalBody}>
              <div style={{ fontFamily: 'Cambria, serif', border: '4px double #E60000', padding: '1rem' }}>
                <div style={{ textAlign: 'center', fontFamily: 'Cinzel, serif', color: '#E60000', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Biodata</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Cambria, serif', fontSize: '0.95rem' }}>
                  <tbody>
                    {[
                      ['Name', selected.name], ['Age', selected.age], ['DOB', selected.dob],
                      ['Height', selected.ht], ['Gender', selected.g], ['Education', selected.edu],
                      ['Profession', selected.prof ?? selected.occ], ['Income', formatIncome(selected.inc ?? selected.sal)],
                      ['City', selected.city], ['State', selected.state], ['Native', selected.nat ?? selected.native],
                      ['Gotra', selected.gotra], ['Nakshatra', selected.nak], ['Rashi', selected.rashi],
                      ['Father', selected.fn], ['Father Mobile', selected.pgmob1 ?? selected.fmob],
                      ['Mother', selected.mn], ['Mother Mobile', selected.pgmob2 ?? selected.mmob],
                      ['Mobile', selected.mob],
                    ].map(([lbl, val]) => val ? (
                      <tr key={String(lbl)}>
                        <td style={{ color: '#E60000', fontStyle: 'italic', fontWeight: 700, padding: '0.2rem 0.5rem 0.2rem 0', width: '40%' }}>{lbl}</td>
                        <td style={{ padding: '0.2rem 0' }}>: {val}</td>
                      </tr>
                    ) : null)}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                <button className={`${s.actBtn} ${s.actBtnPrim}`} onClick={() => window.print()}>🖨 Print Biodata</button>
                <button className={s.actBtn} onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
