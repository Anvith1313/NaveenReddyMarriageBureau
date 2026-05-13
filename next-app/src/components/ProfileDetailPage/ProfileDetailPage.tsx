'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { Profile, formatIncome } from '@/lib/types'
import s from './profileDetail.module.css'

function Row({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null
  return (
    <div className={s.row}>
      <span className={s.rowLabel}>{label}</span>
      <span className={s.rowValue}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={s.section}>
      <div className={s.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

export default function ProfileDetailPage({ uid, desktop = false }: { uid: string; desktop?: boolean }) {
  const router = useRouter()
  const { user, profile: me } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [interestSent, setInterestSent] = useState(false)
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    async function load() {
      try {
        // Try fetching by uid first, then by username
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          setProfile({ ...snap.data(), uid: snap.id } as Profile)
        } else {
          // uid might actually be a username (u field)
          const { getDocs, query, collection, where } = await import('firebase/firestore')
          const q = query(collection(db, 'users'), where('u', '==', uid))
          const qSnap = await getDocs(q)
          if (!qSnap.empty) setProfile({ ...qSnap.docs[0].data(), uid: qSnap.docs[0].id } as Profile)
        }
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [uid, user, router])

  useEffect(() => {
    if (me && profile) {
      setSaved((me.savedProfiles as string[] | undefined ?? []).includes(profile.u ?? profile.uid))
    }
  }, [me, profile])

  useEffect(() => {
    if (!me || !profile) return
    async function checkInterest() {
      try {
        const { getDoc: gd, doc: d } = await import('firebase/firestore')
        const snap = await gd(d(db, 'interests', `${me!.u}_${profile!.u}`))
        if (snap.exists()) setInterestSent(true)
      } catch { /* no interest yet */ }
    }
    checkInterest()
  }, [me, profile])

  async function toggleSave() {
    if (!me || !profile) return
    const u = profile.u ?? profile.uid
    const isSaved = saved
    setSaved(!isSaved)
    try {
      await updateDoc(doc(db, 'users', me.uid), {
        savedProfiles: isSaved ? arrayRemove(u) : arrayUnion(u)
      })
    } catch { setSaved(isSaved) }
  }

  async function sendInterest() {
    if (!me?.u || !profile) return
    try {
      await setDoc(doc(db, 'interests', `${me.u}_${profile.u}`), {
        from: me.u, to: profile.u, status: 'pending', createdAt: serverTimestamp(),
      })
      setInterestSent(true)
    } catch (e) { console.error(e) }
  }

  if (loading) return <div className={s.loadWrap}><div className={s.spinner} /></div>
  if (!profile) return (
    <div className={s.notFound}>
      <p>Profile not found.</p>
      <button className={s.btnBack} onClick={() => router.back()}>← Go Back</button>
    </div>
  )

  const photos = profile.photos?.length ? profile.photos : []
  const currentPhoto = photos[photoIdx]
  const isMe = me?.uid === profile.uid

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <button className={s.backBtn} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={s.hero}>
        <div className={s.photoWrap}>
          {currentPhoto ? (
            <Image src={currentPhoto} alt={profile.name ?? ''} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div className={s.photoPlaceholder}>
              {profile.g === 'Female' ? '👰' : '🤵'}
            </div>
          )}
          {photos.length > 1 && (
            <div className={s.photoDots}>
              {photos.map((_, i) => (
                <button key={i} className={`${s.photoDot} ${i === photoIdx ? s.photoDotActive : ''}`} onClick={() => setPhotoIdx(i)} aria-label={`Photo ${i + 1}`} />
              ))}
            </div>
          )}
          {photos.length > 1 && (
            <>
              <button className={`${s.photoNav} ${s.photoNavLeft}`} onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)} aria-label="Previous photo">‹</button>
              <button className={`${s.photoNav} ${s.photoNavRight}`} onClick={() => setPhotoIdx(i => (i + 1) % photos.length)} aria-label="Next photo">›</button>
            </>
          )}
        </div>

        <div className={s.heroInfo}>
          <div className={s.tierBadge} data-tier={profile.tier}>{profile.tier}</div>
          <h1 className={s.name}>{profile.name}</h1>
          <p className={s.meta}>
            {[profile.age && `${profile.age} yrs`, profile.ht, profile.city, profile.state].filter(Boolean).join(' · ')}
          </p>
          {profile.edu && <p className={s.eduLine}>{profile.edu}</p>}

          {!isMe && (
            <div className={s.actions}>
              <button className={`${s.btnInterest} ${interestSent ? s.btnInterestSent : ''}`} onClick={sendInterest} disabled={interestSent}>
                {interestSent ? '✓ Interest Sent' : '💌 Send Interest'}
              </button>
              <button className={`${s.btnSave} ${saved ? s.btnSaveSaved : ''}`} onClick={toggleSave} aria-label={saved ? 'Unsave' : 'Save'}>
                {saved ? '♥' : '♡'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={s.body}>
        <Section title="Basic Details">
          <Row label="Age" value={profile.age} />
          <Row label="Date of Birth" value={profile.dob} />
          <Row label="Height" value={profile.ht} />
          <Row label="Marital Status" value={(profile as Record<string, unknown>).maritalStatus as string} />
          <Row label="Mother Tongue" value={(profile as Record<string, unknown>).motherTongue as string} />
          <Row label="Complexion" value={(profile as Record<string, unknown>).complexion as string} />
          <Row label="Body Type" value={(profile as Record<string, unknown>).bodyType as string} />
          <Row label="Blood Group" value={(profile as Record<string, unknown>).bloodGroup as string} />
          <Row label="Diet" value={profile.diet} />
        </Section>

        <Section title="Location">
          <Row label="City" value={profile.city} />
          <Row label="State" value={profile.state} />
          <Row label="Country" value={profile.country} />
          <Row label="Native Place" value={profile.nat ?? profile.native} />
          <Row label="Residential Status" value={(profile as Record<string, unknown>).residentialStatus as string} />
        </Section>

        <Section title="Community & Astrology">
          <Row label="Religion" value="Hindu" />
          <Row label="Community" value="Reddy" />
          <Row label="Gotra" value={profile.gotra} />
          <Row label="Father's Gotra" value={(profile as Record<string, unknown>).fatherGotra as string} />
          <Row label="Nakshatra" value={profile.nak} />
          <Row label="Rashi" value={profile.rashi} />
        </Section>

        <Section title="Education & Career">
          <Row label="Qualification" value={profile.edu} />
          <Row label="Occupation" value={profile.prof ?? profile.occ} />
          <Row label="Annual Income" value={formatIncome(profile.inc ?? profile.sal)} />
        </Section>

        {typeof (profile as Record<string, unknown>).aboutYourself === 'string' && (
          <Section title="About">
            <p className={s.about}>{(profile as Record<string, unknown>).aboutYourself as string}</p>
          </Section>
        )}

        {!isMe && (
          <div className={s.bottomActions}>
            <button className={`${s.btnInterestLg} ${interestSent ? s.btnInterestSentLg : ''}`} onClick={sendInterest} disabled={interestSent}>
              {interestSent ? '✓ Interest Sent' : '💌 Send Interest'}
            </button>
            <button className={`${s.btnSaveLg} ${saved ? s.btnSaveSavedLg : ''}`} onClick={toggleSave}>
              {saved ? '♥ Saved' : '♡ Save Profile'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
