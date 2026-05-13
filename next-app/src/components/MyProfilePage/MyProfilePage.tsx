'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import { Profile, formatIncome } from '@/lib/types'
import s from './profile.module.css'

const COMPLETENESS_FIELDS: [keyof Profile, string][] = [
  ['name', 'Name'], ['dob', 'Date of Birth'], ['g', 'Gender'], ['ht', 'Height'],
  ['edu', 'Education'], ['prof', 'Profession'], ['inc', 'Income'], ['city', 'City'],
  ['state', 'State'], ['country', 'Country'], ['mob', 'Mobile'], ['diet', 'Diet'],
  ['rashi', 'Rashi'], ['nak', 'Nakshatra'], ['gotra', 'Gotra'], ['nat', 'Native'],
]

function completeness(p: Profile): { pct: number; missing: string[] } {
  const missing = COMPLETENESS_FIELDS.filter(([k]) => !p[k]).map(([, label]) => label)
  const pct = Math.round(((COMPLETENESS_FIELDS.length - missing.length) / COMPLETENESS_FIELDS.length) * 100)
  return { pct, missing }
}

function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className={s.gridItem}>
      <div className={s.diL}>{label}</div>
      <div className={`${s.diV} ${!value ? s.diVMuted : ''}`}>{value ?? '—'}</div>
    </div>
  )
}

export default function MyProfilePage({ desktop = false }: { desktop?: boolean }) {
  const router = useRouter()
  const { user, profile: me, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !me) return null

  const p = me as Profile
  const { pct, missing } = completeness(p)
  const tierLabel = p.tier === 'Elite' ? '💎 Elite Account' : p.tier === 'VVIP' ? '⭐ VVIP Account' : '🪔 VIP Account'

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={s.topBar}>
        <div className={s.topInner}>
          <div className={`${s.pageTitle} ${desktop ? s.pageTitleDesktop : ''}`}>My Profile</div>
          <div className={s.actions}>
            <button type="button" className={s.btnPrimary} onClick={() => router.push('/biodata/me')}>
              📄 View Biodata
            </button>
            <button type="button" className={s.btnGold} onClick={() => router.push('/edit-profile')}>
              ✏ Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        {/* Completeness bar */}
        <div className={`${s.card} ${desktop ? s.cardFullWidth : ''}`}>
          <div className={s.complBar}>
            <div className={s.complTitle}>Profile Completeness</div>
            <div className={s.complPct}>{pct}%</div>
          </div>
          <div className={s.complTrack}>
            <div className={s.complFill} style={{ ['--compl-pct' as string]: `${pct}%` }} />
          </div>
          {missing.length > 0 && (
            <div className={s.missingList}>
              {missing.map(m => <span key={m} className={s.missingItem}>{m}</span>)}
            </div>
          )}
        </div>

        {/* Photos */}
        {(p.photos?.length ?? 0) > 0 && (
          <div className={s.card}>
            <div className={s.secTitle}>📸 My Photos</div>
            <div className={s.photosGrid}>
              {(p.photos ?? []).map((url, i) => (
                <div key={i} className={s.photoThumb}>
                  <img src={url} alt={`Photo ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main info card */}
        <div className={s.card}>
          <div className={s.cardHdr}>
            <div className={s.avatar}>
              {p.photos?.[0]
                ? <img src={p.photos[0]} alt={p.name} className={s.avatarImg} />
                : <span>{p.em ?? '👤'}</span>
              }
            </div>
            <div>
              <div className={s.profileName}>{p.name ?? '—'}</div>
              <div className={s.tierBadge}>{tierLabel}</div>
              {typeof p.views === 'number' && (
                <div className={s.viewCount}>{p.views} profile views</div>
              )}
            </div>
          </div>
          <div className={s.secTitle}>Basic Information</div>
          <div className={s.grid}>
            <Row label="Age" value={p.age ? `${p.age} years` : undefined} />
            <Row label="Date of Birth" value={p.dob} />
            <Row label="Gender" value={p.g ?? p.gender} />
            <Row label="Height" value={p.ht} />
            <Row label="Complexion" value={p.cx as string} />
          </div>
        </div>

        {/* Contact & Location */}
        <div className={s.card}>
          <div className={s.secTitle}>Contact &amp; Location</div>
          <div className={s.grid}>
            <Row label="Mobile" value={p.mob} />
            <Row label="Email" value={p.email as string} />
            <Row label="City" value={p.city} />
            <Row label="State" value={p.state} />
            <Row label="Country" value={p.country} />
            <Row label="Native" value={p.nat ?? p.native} />
          </div>
        </div>

        {/* Education & Career */}
        <div className={s.card}>
          <div className={s.secTitle}>Education &amp; Career</div>
          <div className={s.grid}>
            <Row label="Education" value={p.edu} />
            <Row label="Profession" value={p.prof ?? p.occ} />
            <Row label="Annual Income" value={formatIncome(p.inc ?? p.sal)} />
          </div>
        </div>

        {/* Lifestyle */}
        <div className={s.card}>
          <div className={s.secTitle}>Lifestyle</div>
          <div className={s.grid}>
            <Row label="Diet" value={p.diet} />
          </div>
        </div>

        {/* Astrological */}
        <div className={s.card}>
          <div className={s.secTitle}>Spiritual &amp; Astrological</div>
          <div className={s.grid}>
            <Row label="Gotra" value={p.gotra} />
            <Row label="Rashi" value={p.rashi} />
            <Row label="Nakshatra" value={p.nak} />
            <Row label="Father's Gotra" value={p.fg as string} />
          </div>
        </div>

        {/* Family */}
        <div className={s.card}>
          <div className={s.secTitle}>Family Details</div>
          <div className={s.grid}>
            <Row label="Father's Name" value={p.fn as string} />
            <Row label="Mother's Name" value={p.mn as string} />
          </div>
        </div>

        {/* Partner Preferences */}
        <div className={s.card}>
          <div className={s.secTitle}>Partner Preferences</div>
          <div className={s.grid}>
            <Row label="Age Range" value={p.pp_af || p.pp_at ? `${p.pp_af ?? '—'} – ${p.pp_at ?? '—'}` : undefined} />
            <Row label="Min Height" value={p.pp_hf as string} />
            <Row label="Income Pref." value={p.pp_inc as string} />
            <Row label="Location Pref." value={(p.pploc ?? p.pp_loc) as string} />
            <Row label="NRI Pref." value={p.pp_nri as string} />
          </div>
        </div>
      </div>
    </div>
  )
}
