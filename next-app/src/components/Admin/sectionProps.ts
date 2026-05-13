import { AdminProfile, AdminInterest, AdminEngaged } from './adminTypes'

export interface SectionProps {
  profiles: AdminProfile[]
  interests: AdminInterest[]
  engaged: AdminEngaged[]
  archived: AdminProfile[]
  isSuper: boolean
  showToast: (msg: string) => void
  setProfiles: (p: AdminProfile[]) => void
  setInterests: (i: AdminInterest[]) => void
  setEngaged: (e: AdminEngaged[]) => void
  setArchived: (a: AdminProfile[]) => void
}
