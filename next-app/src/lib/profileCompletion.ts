import { Profile } from './types'

export interface CompletionResult {
  pct: number        // 0–100
  filled: number
  total: number
  missing: string[]  // human-readable missing field labels
  canRequestVerification: boolean  // true when pct >= 80
}

const FIELDS: { key: string; label: string; weight: number }[] = [
  // Core identity (high weight)
  { key: 'name',         label: 'Full name',        weight: 4 },
  { key: 'gender',       label: 'Gender',           weight: 3 },
  { key: 'dob',          label: 'Date of birth',    weight: 4 },
  { key: 'height',       label: 'Height',           weight: 2 },
  { key: 'maritalStatus',label: 'Marital status',   weight: 2 },
  { key: 'mobile',       label: 'Mobile number',    weight: 4 },
  // Location
  { key: 'city',         label: 'City',             weight: 2 },
  { key: 'state',        label: 'State',            weight: 2 },
  { key: 'country',      label: 'Country',          weight: 1 },
  { key: 'nativePlace',  label: 'Native place',     weight: 2 },
  // Community
  { key: 'gotra',        label: 'Gotra',            weight: 2 },
  { key: 'nakshatra',    label: 'Nakshatra',        weight: 2 },
  { key: 'rashi',        label: 'Rashi',            weight: 2 },
  // Career (nested inside career object)
  { key: 'career.occupation', label: 'Occupation',  weight: 3 },
  { key: 'career.annualIncome', label: 'Annual income', weight: 2 },
  // Education (nested)
  { key: 'education.highestQual', label: 'Highest qualification', weight: 2 },
  // Lifestyle
  { key: 'lifestyle.diet', label: 'Diet preference', weight: 1 },
  // About
  { key: 'aboutYourself', label: 'About yourself',  weight: 2 },
  // Family (nested)
  { key: 'family.fatherName', label: "Father's name", weight: 1 },
  { key: 'family.motherName', label: "Mother's name", weight: 1 },
]

function getNestedValue(profile: Profile, dotKey: string): unknown {
  const parts = dotKey.split('.')
  if (parts.length === 1) return profile[dotKey as keyof Profile]
  // Two levels: e.g. 'career.occupation'
  const [parent, child] = parts
  const parentVal = profile[parent as keyof Profile]
  if (parentVal && typeof parentVal === 'object') {
    return (parentVal as Record<string, unknown>)[child]
  }
  return undefined
}

function isFilled(val: unknown): boolean {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (typeof val === 'number') return val > 0
  if (typeof val === 'boolean') return true
  return false
}

export function getProfileCompletion(profile: Profile | null): CompletionResult {
  if (!profile) return { pct: 0, filled: 0, total: 0, missing: [], canRequestVerification: false }

  let totalWeight = 0
  let filledWeight = 0
  const missing: string[] = []

  for (const field of FIELDS) {
    totalWeight += field.weight
    const val = getNestedValue(profile, field.key)
    if (isFilled(val)) {
      filledWeight += field.weight
    } else {
      missing.push(field.label)
    }
  }

  const pct = Math.round((filledWeight / totalWeight) * 100)
  return {
    pct,
    filled: filledWeight,
    total: totalWeight,
    missing,
    canRequestVerification: pct >= 80,
  }
}

export function completionMessage(pct: number): { text: string; sub: string } {
  if (pct < 20) return {
    text: "Let's build your profile!",
    sub: "A complete profile gets 5× more matches. Just a few minutes away.",
  }
  if (pct < 40) return {
    text: "Great start!",
    sub: "You're on your way. Add a few more details to stand out.",
  }
  if (pct < 60) return {
    text: "You're making good progress!",
    sub: "Almost halfway there — keep going, it's worth it.",
  }
  if (pct < 80) return {
    text: "More than halfway there!",
    sub: "Just a little more and you'll be ready for verification.",
  }
  if (pct < 100) return {
    text: "Almost complete! 🎉",
    sub: "Your profile is ready for verification. Call your nearest branch to get verified.",
  }
  return {
    text: "Profile complete!",
    sub: "Contact your branch to complete verification and go live.",
  }
}
