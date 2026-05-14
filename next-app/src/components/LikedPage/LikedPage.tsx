'use client'

import { useState, useEffect } from 'react'
import { doc, updateDoc, arrayRemove, setDoc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { useProfiles } from '@/lib/useProfiles'
import { Profile, Interest } from '@/lib/types'
import s from './liked.module.css'

type Tab = 'saved' | 'interests'

interface InboundInterest extends Interest {
  fromProfile?: Profile
}

export default function LikedPage({ desktop = false, defaultTab = 'saved' }: { desktop?: boolean; defaultTab?: Tab }) {
  const { profile: me } = useAuth()
  const { pool, interests, savedProfiles: initSaved, loading, refetch } = useProfiles(me)
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [saved, setSaved] = useState<string[]>(initSaved)
  const [inbound, setInbound] = useState<InboundInterest[]>([])
  const [loadingInbound, setLoadingInbound] = useState(false)

  useEffect(() => { setSaved(initSaved) }, [initSaved])

  useEffect(() => {
    if (!me?.u) return
    setLoadingInbound(true)
    getDocs(query(collection(db, 'interests'), where('to', '==', me.u)))
      .then(snap => {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Interest))
        const enriched: InboundInterest[] = docs.map(i => ({
          ...i,
          fromProfile: pool.find(p => p.u === i.from),
        }))
        setInbound(enriched)
      })
      .catch(console.error)
      .finally(() => setLoadingInbound(false))
  }, [me?.u, pool.length])

  const savedProfiles = pool.filter(p => saved.includes(p.u))

  async function unsave(u: string) {
    if (!me) return
    setSaved(prev => prev.filter(x => x !== u))
    await updateDoc(doc(db, 'users', me.uid), { savedProfiles: arrayRemove(u) }).catch(console.error)
  }

  async function acceptInterest(interest: InboundInterest) {
    if (!me?.u) return
    await setDoc(doc(db, 'interests', interest.id), { ...interest, status: 'mutual', acceptedAt: serverTimestamp() }, { merge: true })
      .catch(console.error)
    setInbound(prev => prev.map(i => i.id === interest.id ? { ...i, status: 'mutual' } : i))
    refetch()
  }

  async function declineInterest(interest: InboundInterest) {
    if (!me?.u) return
    await setDoc(doc(db, 'interests', interest.id), { ...interest, status: 'rejected', rejectedAt: serverTimestamp() }, { merge: true })
      .catch(console.error)
    setInbound(prev => prev.filter(i => i.id !== interest.id))
  }

  const pendingInbound = inbound.filter(i => i.status === 'pending')
  const mutualInbound = inbound.filter(i => i.status === 'mutual' || i.status === 'contact_released')

  if (loading) return null

  const heroTitle = defaultTab === 'interests' ? 'Interests' : 'Liked Profiles'
  const heroTag = defaultTab === 'interests' ? 'Home | Interests' : 'Home | Liked'

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroTitle}>{heroTitle}</div>
          <div className={s.heroTag}>{heroTag}</div>
        </div>
      </div>
      <div className={`${s.tabs} ${desktop ? s.tabsDesktop : ''}`}>
        <button type="button" className={`${s.tab} ${tab === 'saved' ? s.tabActive : ''}`} onClick={() => setTab('saved')}>
          Saved Profiles {savedProfiles.length > 0 && `(${savedProfiles.length})`}
        </button>
        <button type="button" className={`${s.tab} ${tab === 'interests' ? s.tabActive : ''}`} onClick={() => setTab('interests')}>
          Interested In Me {pendingInbound.length > 0 && `(${pendingInbound.length})`}
        </button>
      </div>

      {tab === 'saved' && (
        savedProfiles.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyEmoji}>♡</div>
            <div className={s.emptyTitle}>No Saved Profiles</div>
            <div className={s.emptyText}>Tap the heart on any profile card while browsing to save them here.</div>
          </div>
        ) : (
          <div className={`${s.grid} ${desktop ? s.gridDesktop : ''}`}>
            {savedProfiles.map(p => (
              <SavedCard key={p.u} p={p} onRemove={() => unsave(p.u)} />
            ))}
          </div>
        )
      )}

      {tab === 'interests' && (
        loadingInbound ? null : inbound.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyEmoji}>💌</div>
            <div className={s.emptyTitle}>No Interests Yet</div>
            <div className={s.emptyText}>When someone expresses interest in your profile, they&apos;ll appear here.</div>
          </div>
        ) : (
          <div className={`${s.list} ${desktop ? s.listDesktop : ''}`}>
            {pendingInbound.length > 0 && pendingInbound.map(i => (
              <InterestCard
                key={i.id}
                interest={i}
                onAccept={() => acceptInterest(i)}
                onDecline={() => declineInterest(i)}
              />
            ))}
            {mutualInbound.length > 0 && mutualInbound.map(i => (
              <InterestCard key={i.id} interest={i} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

function SavedCard({ p, onRemove }: { p: Profile; onRemove: () => void }) {
  const hasPhoto = (p.photos?.length ?? 0) > 0
  return (
    <div className={s.card}>
      <div
        className={s.cardPhoto}
        style={hasPhoto
          ? { backgroundImage: `url('${p.photos![0]}')`, backgroundColor: p.bg ?? '#fce4ec' } as React.CSSProperties
          : { backgroundColor: p.bg ?? '#fce4ec' } as React.CSSProperties
        }
      >
        {!hasPhoto && <span className={s.cardEmoji}>{p.em ?? '👤'}</span>}
      </div>
      <div className={s.cardGrad}>
        <div className={s.cardName}>{p.name}, {p.age}</div>
        {p.city && <div className={s.cardCity}>{p.city}</div>}
      </div>
      <div className={s.cardTier}>{p.tier ?? 'VIP'}</div>
      <button type="button" className={s.cardRemove} onClick={onRemove} aria-label="Remove from saved">✕</button>
    </div>
  )
}

function InterestCard({ interest, onAccept, onDecline }: {
  interest: InboundInterest
  onAccept?: () => void
  onDecline?: () => void
}) {
  const p = interest.fromProfile
  const isMutual = interest.status === 'mutual' || interest.status === 'contact_released'
  const isContact = interest.status === 'contact_released'

  return (
    <div className={s.intCard}>
      <div className={s.intAvatar}>
        {p?.photos?.[0]
          ? <img src={p.photos[0]} alt={p.name} className={s.intAvatarImg} />
          : <span>{p?.em ?? '👤'}</span>
        }
      </div>
      <div className={s.intInfo}>
        <div className={s.intName}>{p?.name ?? interest.from}, {p?.age}</div>
        <div className={s.intMeta}>{p?.prof ?? p?.occ ?? '—'} · {p?.city ?? '—'}</div>
        <div className={`${s.intStatus} ${isContact ? s.intStatusContact : isMutual ? s.intStatusMutual : s.intStatusPending}`}>
          {isContact ? '📞 Contact Released' : isMutual ? '✓ Matched' : '💌 Interested'}
        </div>
      </div>
      {!isMutual && onAccept && onDecline && (
        <div className={s.intActions}>
          <button type="button" className={s.btnAccept} onClick={onAccept}>Accept</button>
          <button type="button" className={s.btnDecline} onClick={onDecline}>Decline</button>
        </div>
      )}
      {isMutual && p?.mob && isContact && (
        <div className={s.intActions}>
          <button
            type="button"
            className={s.btnAccept}
            onClick={() => window.open(`https://wa.me/91${p.mob}`, '_blank')}
          >
            WhatsApp
          </button>
        </div>
      )}
    </div>
  )
}
