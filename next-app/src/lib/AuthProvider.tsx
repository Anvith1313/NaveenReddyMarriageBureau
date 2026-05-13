'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { Profile } from './types'

export type UserProfile = Profile

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
      setProfile(snap.exists() ? { ...snap.data(), uid: u.uid } as Profile : { uid: u.uid, u: u.uid, name: '', email: u.email ?? '' } as Profile)
    } catch {
      setProfile({ uid: u.uid, u: u.uid, name: '', email: u.email ?? '' } as Profile)
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
