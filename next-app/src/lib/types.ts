export interface Profile {
  uid: string
  u: string
  name: string
  age?: number
  g?: string
  gender?: string
  ht?: string
  edu?: string
  inc?: string
  sal?: string
  nat?: string
  native?: string
  diet?: string
  rashi?: string
  nak?: string
  gotra?: string
  fg?: string
  city?: string
  state?: string
  country?: string
  mob?: string
  email?: string
  tier?: string
  status?: string
  photos?: string[]
  bg?: string
  em?: string
  prof?: string
  occ?: string
  dob?: string
  cx?: string
  fn?: string
  mn?: string
  views?: number
  lastViewedAt?: number
  // preference fields
  pp_af?: string | number
  pp_at?: string | number
  pp_hf?: string
  pploc?: string
  pp_loc?: string
  pp_inc?: string
  pp_nri?: string
  savedProfiles?: string[]
  [key: string]: unknown
}

export interface Interest {
  id: string
  from: string
  to: string
  status: 'pending' | 'mutual' | 'contact_released' | 'rejected'
  createdAt?: number
}

export interface Engagement {
  id: string
  p1: { u: string; name?: string }
  p2: { u: string; name?: string }
  createdAt?: number
}

export function prefScore(p: Profile, user: Profile): number {
  const ppAf = +(user.pp_af ?? 0)
  const ppAt = +(user.pp_at ?? 99)
  const ppHfIn = htInches(user.pp_hf && user.pp_hf !== 'Any' ? user.pp_hf : '')
  const ppLoc = ((user.pploc ?? user.pp_loc ?? '') as string).toLowerCase().trim()
  const ppInc = user.pp_inc && user.pp_inc !== 'Any' ? (user.pp_inc as string) : ''
  const ppNri = (user.pp_nri as string) ?? 'No Preference'

  let s = 0
  const age = +(p.age ?? 0) || 0
  if (ppAf && ppAt < 90) {
    if (age >= ppAf && age <= ppAt) s += 40
    else if (age >= ppAf - 3 && age <= ppAt + 3) s += 20
    else if (age >= ppAf - 7 && age <= ppAt + 7) s += 8
  } else s += 20

  if (ppHfIn) {
    const ph = htInches(p.ht)
    if (ph >= ppHfIn) s += 25
    else if (ph >= ppHfIn - 2) s += 12
  } else s += 25

  if (ppInc) {
    const pl = (p.inc ?? '').toLowerCase()
    if (ppInc === '1 Crore+' && (pl.includes('crore') || pl.includes('1 cr'))) s += 15
    else if (ppInc === '50L–1 Crore' && (pl.includes('50l') || pl.includes('crore'))) s += 15
    else if (ppInc === '20–50 Lakhs' && (pl.includes('20') || pl.includes('30') || pl.includes('40') || pl.includes('50'))) s += 15
    else if (ppInc === '10–20 Lakhs' && (pl.includes('10') || pl.includes('15') || pl.includes('20'))) s += 15
    else s += 5
  } else s += 15

  if (ppLoc && ppLoc !== 'any') {
    const hay = ((p.state ?? '') + (p.city ?? '') + (p.nat ?? '')).toLowerCase()
    if (hay.includes(ppLoc)) s += 15
  } else s += 8

  const isNri = p.country && p.country !== 'India'
  if (ppNri === 'NRI Preferred' && isNri) s += 5
  else if (ppNri === 'India Only' && !isNri) s += 5
  else s += 3

  return s
}

export function htInches(ht?: string): number {
  if (!ht) return 0
  const m = ht.match(/(\d+)'(\d+)"?/)
  if (!m) return 0
  return parseInt(m[1]) * 12 + parseInt(m[2])
}

export function formatIncome(inc?: string): string {
  if (!inc) return '—'
  return inc
}
