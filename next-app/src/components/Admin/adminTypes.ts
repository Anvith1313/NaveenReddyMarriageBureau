export interface AdminCred {
  u: string
  p: string
  branch: string
  role: 'superadmin' | 'branch'
}

export interface AdminProfile {
  uid: string
  u: string
  name?: string
  age?: number
  g?: string
  ht?: string
  prof?: string
  occ?: string
  city?: string
  state?: string
  country?: string
  tier?: string
  em?: string
  emoji?: string
  gotra?: string
  fg?: string
  nak?: string
  rashi?: string
  mob?: string
  email?: string
  pgmob1?: string
  fmob?: string
  pgmob2?: string
  mmob?: string
  edu?: string
  nat?: string
  native?: string
  inc?: string
  sal?: string
  fn?: string
  mn?: string
  fas?: string
  fo?: string
  mas?: string
  mo?: string
  ft?: string
  fv?: string
  fst?: string
  br?: string
  brm?: string
  sr?: string
  srm?: string
  pval?: string
  notes?: string
  photos?: string[]
  dob?: string
  slid?: string
  status?: string
  diet?: string
  closedDate?: string
  reason?: string
  createdAt?: string | { seconds: number }
  updatedAt?: string | { seconds: number }
  lastLogin?: string | { seconds: number }
  displayName?: string
}

export interface AdminInterest {
  from: string
  to: string
  status: 'pending' | 'mutual' | 'contact_released' | 'released'
  date?: string
  createdAt?: string | { seconds: number }
  _docId?: string
}

export interface AdminEngaged {
  p1: { name: string; u: string; tier?: string; em?: string }
  p2: { name: string; u: string; tier?: string; em?: string }
  engDate?: string
  p1_paid?: boolean
  p2_paid?: boolean
  docId?: string
}

export interface AdminAppointment {
  name: string
  mob: string
  username?: string
  date: string
  time?: string
  branch?: string
  purpose?: string
  msg?: string
  status: 'pending' | 'confirmed' | 'cancelled'
  ts?: string
  docId: string
}

export interface AdminStory {
  names: string
  year: string
  location?: string
  text: string
  contact?: string
  submittedBy?: string
  status: 'pending' | 'approved' | 'dismissed'
  ts?: string
  docId: string
}

export interface AdminEditRequest {
  from: string
  changes: Record<string, string>
  status: 'pending' | 'approved' | 'rejected'
  ts?: string
  docId: string
}

export interface ActivityItem {
  type: string
  icon: string
  name: string
  desc: string
  ts: string | { seconds: number }
  uid?: string
}

export type AdminSection =
  | 'dashboard'
  | 'profiles'
  | 'addOffline'
  | 'interests'
  | 'mutual'
  | 'engaged'
  | 'editReqs'
  | 'appointments'
  | 'stories'
  | 'activity'
  | 'archived'

export const ACRED: AdminCred[] = [
  { u: 'nrmb_mainadmin', p: 'MainNRMB@2024#', branch: 'Main Admin', role: 'superadmin' },
  { u: 'nrmb_somajiguda', p: 'Soma@NRMB2024#', branch: 'Somajiguda Branch', role: 'branch' },
  { u: 'nrmb_warangal', p: 'Wrngl@NRMB2024#', branch: 'Warangal Branch', role: 'branch' },
  { u: 'nrmb_karimnagar', p: 'Krmgr@NRMB2024#', branch: 'Karimnagar Branch', role: 'branch' },
  { u: 'nrmb_kothapet', p: 'Kthpt@NRMB2024#', branch: 'Kothapet Branch', role: 'branch' },
]

export function tsToString(ts: string | { seconds: number } | undefined): string {
  if (!ts) return '—'
  if (typeof ts === 'string') return new Date(ts).toLocaleString('en-IN')
  if (typeof ts === 'object' && 'seconds' in ts) return new Date(ts.seconds * 1000).toLocaleString('en-IN')
  return '—'
}

export function profileName(p: AdminProfile): string {
  return p.name || p.displayName || p.email || p.u || p.uid
}

export function profileEm(p: AdminProfile): string {
  return p.em || p.emoji || (p.g === 'Female' ? '👰' : '🤵')
}
