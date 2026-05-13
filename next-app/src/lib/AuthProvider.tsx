'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface UserProfile {
  uid: string
  email?: string
  name?: string
  u?: string
  tier?: string
  em?: string
  gender?: string
  dob?: string
  phone?: string
  photoURL?: string
  savedProfiles?: string[]
  [key: string]: unknown
}

interface AuthCtx {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(u: User) {
    try {
      const snap = await getDoc(doc(db, 'users', u.uid))
      setProfile(snap.exists() ? { ...snap.data(), uid: u.uid } : { uid: u.uid, email: u.email ?? '' })
    } catch {
      setProfile({ uid: u.uid, email: u.email ?? '' })
    }
  }

  async function refreshProfile() {
    if (user) await loadProfile(user)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        await loadProfile(u)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <Ctx.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
