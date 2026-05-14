'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import { useProfiles } from '@/lib/useProfiles'
import { Profile, Interest, htInches, formatIncome } from '@/lib/types'
import s from './browse.module.css'

interface Filters {
  tier: string[]
  age: string[]
  height: string[]
  income: string[]
  country: string[]
  state: string[]
}

const EMPTY_FILTERS: Filters = { tier: [], age: [], height: [], income: [], country: [], state: [] }

const FILTER_OPTIONS: Record<keyof Filters, string[]> = {
  tier: ['VIP', 'VVIP', 'Elite', 'Premium'],
  age: ['18–20', '21–25', '26–30', '31–35', '36–40', '40+'],
  height: ['4\'10"', '5\'0"', '5\'2"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'10"', '6\'0"', '6\'2"'],
  income: ['Below 3 Lakhs', '3–6 Lakhs', '6–10 Lakhs', '10–20 Lakhs', '20–50 Lakhs', '50L–1 Crore', '1 Crore+'],
  country: ['India', 'USA', 'UK', 'Canada', 'Australia', 'UAE', 'Singapore', 'Germany'],
  state: ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Gujarat', 'Kerala'],
}

const FILTER_LABELS: Record<keyof Filters, string> = {
  tier: 'Tier', age: 'Age', height: 'Height', income: 'Income', country: 'Country', state: 'State',
}

function parseAgeRange(r: string): { min: number; max: number } | null {
  if (r === '40+') return { min: 40, max: 999 }
  const m = r.match(/(\d+)[–\-](\d+)/)
  return m ? { min: +m[1], max: +m[2] } : null
}

function incOk(pInc: string, filter: string): boolean {
  const pl = pInc.toLowerCase()
  if (filter === '1 Crore+') return pl.includes('crore') || pl.includes('1 cr')
  if (filter === '50L–1 Crore') return pl.includes('50l') || pl.includes('crore')
  if (filter === '20–50 Lakhs') return /\b(20|30|40|50)\b/.test(pl)
  if (filter === '10–20 Lakhs') return /\b(10|15|20)\b/.test(pl)
  if (filter === '6–10 Lakhs') return /\b[6-9]\b|10/.test(pl)
  if (filter === '3–6 Lakhs') return /\b[3-6]\b/.test(pl)
  if (filter === 'Below 3 Lakhs') return /\b[12]\b|below|less/.test(pl)
  return false
}

function tierOk(myTier: string, pTier: string): boolean {
  const my = myTier.toLowerCase()
  const p = (pTier || 'vip').toLowerCase()
  if (my === 'elite') return true
  if (my === 'vvip') return p === 'vvip' || p === 'vip'
  return p === 'vip'
}

export default function BrowsePage({ desktop = false }: { desktop?: boolean }) {
  const { user, profile: me } = useAuth()
  const { pool: allProfiles, interests, engagements, savedProfiles: initSaved, loading, refetch } = useProfiles(me)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [openFilter, setOpenFilter] = useState<keyof Filters | null>(null)
  const [saved, setSaved] = useState<string[]>(initSaved)
  const [selected, setSelected] = useState<Profile | null>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setSaved(initSaved) }, [initSaved])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenFilter(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const myTier = (me?.tier as string) ?? 'VIP'
  const myG = me?.g ?? me?.gender ?? ''
  const targetG = myG === 'Male' ? 'Female' : myG === 'Female' ? 'Male' : ''

  const engagement = engagements.find(e => e.p1.u === me?.u || e.p2.u === me?.u) ?? null
  const partner = engagement ? (engagement.p1.u === me?.u ? engagement.p2 : engagement.p1) : null

  const q = search.toLowerCase().trim()

  const filtered = allProfiles.filter(p => {
    if (engagement) return false
    if (targetG && p.g !== targetG) return false
    if (!tierOk(myTier, p.tier ?? 'VIP')) return false
    if (filters.tier.length && !filters.tier.includes(p.tier ?? 'VIP')) return false
    if (filters.age.length) {
      const ok = filters.age.some(r => { const rng = parseAgeRange(r); return rng && +(p.age ?? 0) >= rng.min && +(p.age ?? 0) <= rng.max })
      if (!ok) return false
    }
    if (filters.height.length) {
      const hi = htInches(p.ht)
      if (!filters.height.some(h => htInches(h) === hi)) return false
    }
    if (filters.income.length) {
      const inc = p.inc ?? p.sal ?? ''
      if (!filters.income.some(f => incOk(inc, f))) return false
    }
    if (filters.country.length && !filters.country.includes(p.country ?? '')) return false
    if (filters.state.length && !filters.state.includes(p.state ?? '')) return false
    if (q && !`${p.name} ${p.city ?? ''} ${p.prof ?? p.occ ?? ''}`.toLowerCase().includes(q)) return false
    return true
  })

  function toggleFilter(key: keyof Filters, val: string) {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter(x => x !== val) : [...prev[key], val]
    }))
  }

  function removeTag(key: keyof Filters, val: string) {
    setFilters(prev => ({ ...prev, [key]: prev[key].filter(x => x !== val) }))
  }

  const activeTags: { key: keyof Filters; val: string }[] = (Object.keys(filters) as (keyof Filters)[]).flatMap(
    k => filters[k].map(v => ({ key: k, val: v }))
  )

  async function toggleSave(u: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!me) return
    const isSaved = saved.includes(u)
    setSaved(prev => isSaved ? prev.filter(x => x !== u) : [...prev, u])
    try {
      await updateDoc(doc(db, 'users', me.uid), { savedProfiles: isSaved ? arrayRemove(u) : arrayUnion(u) })
    } catch { setSaved(prev => isSaved ? [...prev, u] : prev.filter(x => x !== u)) }
  }

  async function sendInterest(toU: string) {
    if (!me?.u) return
    try {
      await setDoc(doc(db, 'interests', `${me.u}_${toU}`), { from: me.u, to: toU, status: 'pending', createdAt: serverTimestamp() })
      refetch()
      setSelected(null)
    } catch (e) { console.error(e) }
  }

  function myInterestFor(p: Profile): Interest | null {
    return interests.find(i => (i.from === me?.u && i.to === p.u) || (i.from === p.u && i.to === me?.u)) ?? null
  }

  if (loading || !user) return null

  const fanProps = {
    profiles: filtered,
    saved,
    interests,
    me: me as Profile | null,
    onSave: (u: string) => {
      const isSaved = saved.includes(u)
      setSaved(prev => isSaved ? prev.filter(x => x !== u) : [...prev, u])
      updateDoc(doc(db, 'users', (me as Profile).uid), { savedProfiles: isSaved ? arrayRemove(u) : arrayUnion(u) }).catch(() => {})
    },
    onInterest: (u: string) => sendInterest(u),
    onWhatsapp: (mob: string) => window.open(`https://wa.me/91${mob}?text=Hello, I found your profile on Reddy Elite Matrimony`, '_blank'),
  }

  return (
    <div className={s.page}>
      <div className={`${s.hdr} ${desktop ? s.hdrDesktop : ''}`}>
        <div className={s.srch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(184,137,42,0.7)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className={s.srchInput}
            type="search"
            placeholder="Search by name, city, profession…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={s.filterBar} ref={filterBarRef}>
          {(Object.keys(FILTER_OPTIONS) as (keyof Filters)[]).map(key => (
            <div key={key} className={s.dropWrap}>
              <button
                type="button"
                className={`${s.pill} ${filters[key].length > 0 ? s.pillActive : ''}`}
                onClick={() => setOpenFilter(openFilter === key ? null : key)}
              >
                {FILTER_LABELS[key]}
                {filters[key].length > 0 && ` (${filters[key].length})`}
                <svg width="8" height="6" viewBox="0 0 10 7"><path d="M0 0l5 7 5-7z" fill="currentColor" opacity="0.5"/></svg>
              </button>
              {/* Desktop dropdown — rendered inside dropWrap for absolute positioning */}
              {desktop && openFilter === key && (
                <div className={s.dropdown}>
                  {FILTER_OPTIONS[key].map(opt => (
                    <div
                      key={opt}
                      className={`${s.ddItem} ${filters[key].includes(opt) ? s.ddItemActive : ''}`}
                      onClick={() => toggleFilter(key, opt)}
                    >
                      <div className={`${s.ddCheck} ${filters[key].includes(opt) ? s.ddCheckActive : ''}`}>
                        {filters[key].includes(opt) && <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><polyline points="1,4 4,7 9,1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {activeTags.length > 0 && (
          <div className={s.tags}>
            {activeTags.map(({ key, val }) => (
              <button type="button" key={`${key}-${val}`} className={s.tag} onClick={() => removeTag(key, val)}>
                {val} ✕
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter bottom sheet */}
      {!desktop && openFilter && (
        <>
          <div className={s.sheetBackdrop} onClick={() => setOpenFilter(null)} />
          <div className={s.filterSheet}>
            <div className={s.filterSheetHdr}>
              <span className={s.filterSheetTitle}>{FILTER_LABELS[openFilter]}</span>
              <button type="button" className={s.filterSheetClose} onClick={() => setOpenFilter(null)}>✕</button>
            </div>
            <div className={s.filterSheetBody}>
              {FILTER_OPTIONS[openFilter].map(opt => (
                <button
                  type="button"
                  key={opt}
                  className={`${s.filterSheetItem} ${filters[openFilter].includes(opt) ? s.filterSheetItemActive : ''}`}
                  onClick={() => toggleFilter(openFilter, opt)}
                >
                  <div className={`${s.ddCheck} ${filters[openFilter].includes(opt) ? s.ddCheckActive : ''}`}>
                    {filters[openFilter].includes(opt) && <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><polyline points="1,4 4,7 9,1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
            <div className={s.filterSheetFooter}>
              <button type="button" className={s.filterSheetClear} onClick={() => { setFilters(prev => ({ ...prev, [openFilter!]: [] })); setOpenFilter(null) }}>
                Clear
              </button>
              <button type="button" className={s.filterSheetDone} onClick={() => setOpenFilter(null)}>
                Done
              </button>
            </div>
          </div>
        </>
      )}

      {!desktop && !engagement ? (
        filtered.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyEmoji}>🔍</div>
            <div className={s.emptyTitle}>No Profiles Found</div>
            <div className={s.emptyText}>Try adjusting your filters or search term.</div>
          </div>
        ) : (
          <FanBrowse {...fanProps} />
        )
      ) : (
        <div className={`${s.grid} ${desktop ? s.gridDesktop : ''}`}>
          {engagement && partner ? (
            <div className={s.empty}>
              <div className={s.emptyEmoji}>💍</div>
              <div className={s.emptyTitle}>Browsing Paused</div>
              <div className={s.emptyText}>Your account is on hold during the engagement process with <strong>{partner.name ?? 'your partner'}</strong>.</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className={s.empty}>
              <div className={s.emptyEmoji}>🔍</div>
              <div className={s.emptyTitle}>No Profiles Found</div>
              <div className={s.emptyText}>Try adjusting your filters or search term.</div>
            </div>
          ) : filtered.map(p => (
            <div key={p.u} className={s.card} onClick={() => setSelected(p)}>
              <div
                className={s.cardPhoto}
                style={{ ['--card-img' as string]: p.photos?.length ? `url('${p.photos[0]}')` : 'none', ['--card-bg' as string]: p.bg ?? '#fce4ec' }}
              >
                {!p.photos?.length && <span className={s.cardEmoji}>{p.em ?? '👤'}</span>}
              </div>
              <div className={s.cardGrad}>
                <div className={s.cardName}>{p.name}, {p.age}</div>
                {p.city && <div className={s.cardCity}>{p.city}{p.country && p.country !== 'India' ? ` · ${p.country}` : ''}</div>}
              </div>
              <div className={s.cardTier}>{p.tier ?? 'VIP'}</div>
              <button
                type="button"
                className={`${s.cardHeart} ${saved.includes(p.u) ? s.cardHeartSaved : ''}`}
                onClick={e => toggleSave(p.u, e)}
                aria-label={saved.includes(p.u) ? 'Unsave' : 'Save'}
              >
                {saved.includes(p.u) ? '♥' : '♡'}
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <ProfileOverlay
          p={selected}
          myInterest={myInterestFor(selected)}
          saved={saved.includes(selected.u)}
          desktop={desktop}
          onClose={() => setSelected(null)}
          onSave={() => { const u = selected.u; const isSaved = saved.includes(u); setSaved(prev => isSaved ? prev.filter(x => x !== u) : [...prev, u]) }}
          onInterest={() => sendInterest(selected.u)}
          onWhatsapp={() => window.open(`https://wa.me/91${selected.mob}?text=Hello, I found your profile on Reddy Elite Matrimony`, '_blank')}
        />
      )}
    </div>
  )
}

function FanBrowse({ profiles, saved, interests, me, onSave, onInterest, onWhatsapp }: {
  profiles: Profile[]
  saved: string[]
  interests: Interest[]
  me: Profile | null
  onSave: (u: string) => void
  onInterest: (u: string) => void
  onWhatsapp: (mob: string) => void
}) {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [fanOpen, setFanOpen] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const lastTapRef = useRef(0)

  useEffect(() => { const t = setTimeout(() => setShowHint(false), 3000); return () => clearTimeout(t) }, [])

  const p = profiles[idx]
  if (!p) return null

  const myInt = interests.find(i => (i.from === me?.u && i.to === p.u) || (i.from === p.u && i.to === me?.u)) ?? null
  const isPending = myInt?.status === 'pending'
  const isMutual = myInt?.status === 'mutual' || myInt?.status === 'contact_released'
  const isSaved = saved.includes(p.u)

  function goTo(newIdx: number) {
    setIdx(newIdx)
    setFanOpen(false)
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    touchRef.current = null

    if (absDx < 12 && absDy < 12) {
      const now = Date.now()
      if (now - lastTapRef.current < 380) {
        setFanOpen(prev => !prev)
        lastTapRef.current = 0
      } else {
        lastTapRef.current = now
      }
      return
    }
    if (absDx > 40 && absDx > absDy * 1.5) {
      if (dx < 0 && idx < profiles.length - 1) goTo(idx + 1)
      else if (dx > 0 && idx > 0) goTo(idx - 1)
      return
    }
    if (dy < -50 && absDy > absDx * 1.5) {
      if (idx < profiles.length - 1) goTo(idx + 1)
    }
  }

  const MAX_DOTS = 7
  const dotStart = Math.max(0, Math.min(idx - 3, profiles.length - MAX_DOTS))
  const dotSlice = profiles.slice(dotStart, dotStart + MAX_DOTS)

  return (
    <div
      className={s.fanWrap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={s.fanStage}>
        {/* ── Left: Details ── */}
        <div className={`${s.fanCard} ${s.fanCardLeft} ${fanOpen ? s.fanOpen : ''}`}>
          <div className={s.fanDetails}>
            <div className={s.fanDetTitle}>{p.name}, {p.age}</div>
            {p.prof || p.occ ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Profession</div>
                <div className={s.fanDetVal}>{p.prof ?? p.occ}</div>
              </div>
            ) : null}
            {p.city ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Location</div>
                <div className={s.fanDetVal}>{p.city}{p.country && p.country !== 'India' ? `, ${p.country}` : ''}</div>
              </div>
            ) : null}
            {p.edu ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Education</div>
                <div className={s.fanDetVal}>{p.edu}</div>
              </div>
            ) : null}
            {(p.gotra || p.fg) ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Gotra</div>
                <div className={s.fanDetVal}>{p.gotra ?? p.fg}</div>
              </div>
            ) : null}
            {p.nak ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Nakshatra</div>
                <div className={s.fanDetVal}>{p.nak}</div>
              </div>
            ) : null}
            {p.ht ? (
              <div className={s.fanDetRow}>
                <div className={s.fanDetLabel}>Height</div>
                <div className={s.fanDetVal}>{p.ht}</div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ── Center: Photo ── */}
        <div className={`${s.fanCard} ${s.fanCardCenter} ${fanOpen ? s.fanOpen : ''}`}>
          <div
            className={s.fanPhoto}
            style={{ ['--card-img' as string]: p.photos?.length ? `url('${p.photos[0]}')` : 'none', ['--card-bg' as string]: p.bg ?? '#fce4ec' }}
          >
            {!p.photos?.length && <span className={s.fanEmoji}>{p.em ?? '👤'}</span>}
          </div>
          <div className={s.fanGrad}>
            <div className={s.fanName}>{p.name}, {p.age}</div>
            {p.city && <div className={s.fanCity}>{p.city}{p.country && p.country !== 'India' ? ` · ${p.country}` : ''}</div>}
          </div>
          <div className={s.fanTier}>{p.tier ?? 'VIP'}</div>
          {showHint && <div className={s.fanDoubleTapHint}>Double-tap to explore</div>}
        </div>

        {/* ── Right: Actions ── */}
        <div className={`${s.fanCard} ${s.fanCardRight} ${fanOpen ? s.fanOpen : ''}`}>
          <div className={s.fanActions}>
            <div className={s.fanActTitle}>Quick Actions</div>
            {!isMutual && (isPending ? (
              <div className={`${s.fanActBtn} ${s.fanActBtnSent}`}>✓ Interest Sent</div>
            ) : (
              <button type="button" className={`${s.fanActBtn} ${s.fanActBtnPrimary}`} onClick={() => onInterest(p.u)}>
                Express Interest
              </button>
            ))}
            <button
              type="button"
              className={`${s.fanActBtn} ${isSaved ? s.fanActBtnSaved : s.fanActBtnSecondary}`}
              onClick={() => onSave(p.u)}
            >
              {isSaved ? '♥ Saved' : '♡ Save Profile'}
            </button>
            <button
              type="button"
              className={`${s.fanActBtn} ${s.fanActBtnSecondary}`}
              onClick={() => router.push(`/m/biodata/${p.uid}`)}
            >
              View Biodata
            </button>
            {myInt?.status === 'contact_released' && (
              <button
                type="button"
                className={`${s.fanActBtn} ${s.fanActBtnPrimary}`}
                onClick={() => onWhatsapp(p.mob ?? '')}
              >
                WhatsApp
              </button>
            )}
            <div className={s.fanActHint}>Swipe ← → to browse</div>
          </div>
        </div>
      </div>

      <div className={s.fanNav}>
        <div className={s.fanDots}>
          {dotSlice.map((_, i) => (
            <div key={dotStart + i} className={`${s.fanDot} ${dotStart + i === idx ? s.fanDotActive : ''}`} />
          ))}
        </div>
        <div className={`${s.fanHint} ${fanOpen ? s.fanHintOpen : ''}`}>
          {fanOpen ? 'Swipe ← → or ↑ to continue' : 'Double-tap center card to reveal options'}
        </div>
      </div>
    </div>
  )
}

function ProfileOverlay({ p, myInterest, saved, desktop, onClose, onSave, onInterest, onWhatsapp }: {
  p: Profile; myInterest: Interest | null; saved: boolean; desktop: boolean
  onClose: () => void; onSave: () => void; onInterest: () => void; onWhatsapp: () => void
}) {
  const contactOk = myInterest?.status === 'contact_released'
  const isMutual = myInterest?.status === 'mutual' || contactOk
  const isPending = myInterest?.status === 'pending'

  return (
    <div className={`${s.overlay} ${desktop ? s.overlayDesktop : ''}`} onClick={onClose}>
      <div className={`${s.sheet} ${desktop ? s.sheetDesktop : ''}`} onClick={e => e.stopPropagation()}>
        <div className={s.sheetHdr}>
          <div className={s.sheetTitle}>{p.name}, {p.age}</div>
          <button type="button" className={s.sheetClose} onClick={onClose}>✕</button>
        </div>
        <div className={s.sheetActions}>
          {!isMutual && (isPending ? (
            <div className={s.btnInterestSent}>✓ Interest Expressed</div>
          ) : (
            <button type="button" className={s.btnInterest} onClick={onInterest}>Express Interest</button>
          ))}
          {contactOk && (
            <button type="button" className={s.btnWa} onClick={onWhatsapp} aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
          )}
        </div>
        <div className={s.sheetBody}>
          <div className={s.sheetSec}>Personal</div>
          <div className={s.sheetGrid}>
            <div><div className={s.sheetDiL}>Age</div><div className={s.sheetDiV}>{p.age} Years</div></div>
            <div><div className={s.sheetDiL}>Height</div><div className={s.sheetDiV}>{p.ht ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Diet</div><div className={s.sheetDiV}>{p.diet ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Location</div><div className={s.sheetDiV}>{p.city ?? '—'}{p.country ? `, ${p.country}` : ''}</div></div>
          </div>
          <div className={s.sheetSec}>Career</div>
          <div className={s.sheetGrid}>
            <div><div className={s.sheetDiL}>Education</div><div className={s.sheetDiV}>{p.edu ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Profession</div><div className={s.sheetDiV}>{p.prof ?? p.occ ?? '—'}</div></div>
            <div className={s.sheetFull}><div className={s.sheetDiL}>Income</div><div className={s.sheetDiV}>{formatIncome(p.inc ?? p.sal)}</div></div>
          </div>
          <div className={s.sheetSec}>Astrological</div>
          <div className={s.sheetGrid}>
            <div><div className={s.sheetDiL}>Gotra</div><div className={s.sheetDiV}>{p.gotra ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Rashi</div><div className={s.sheetDiV}>{p.rashi ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Nakshatra</div><div className={s.sheetDiV}>{p.nak ?? '—'}</div></div>
            <div><div className={s.sheetDiL}>Native</div><div className={s.sheetDiV}>{p.nat ?? p.native ?? '—'}</div></div>
          </div>
          {contactOk && (
            <>
              <div className={s.sheetSec}>Contact</div>
              <div className={s.sheetGrid}>
                <div className={s.sheetFull}><div className={s.sheetDiL}>📞 Mobile</div><div className={s.sheetDiV}>{p.mob}</div></div>
                <div className={s.sheetFull}><div className={s.sheetDiL}>✉ Email</div><div className={s.sheetDiV}>{p.email}</div></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
