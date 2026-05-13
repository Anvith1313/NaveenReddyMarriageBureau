'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { Profile, Interest, Engagement, prefScore } from './types'

interface UseProfilesResult {
  pool: Profile[]
  interests: Interest[]
  engagements: Engagement[]
  savedProfiles: string[]
  loading: boolean
  refetch: () => void
}

export function useProfiles(currentUser: Profile | null): UseProfilesResult {
  const [pool, setPool] = useState<Profile[]>([])
  const [interests, setInterests] = useState<Interest[]>([])
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [savedProfiles, setSavedProfiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  function refetch() { setTick(t => t + 1) }

  useEffect(() => {
    if (!currentUser) { setLoading(false); return }

    async function load() {
      setLoading(true)
      try {
        const [profilesSnap, intSnap, engSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'), where('status', '!=', 'deleted'))),
          getDocs(query(collection(db, 'interests'),
            where('from', '==', currentUser.u ?? currentUser.uid)
          )).then(s => s).catch(() => ({ docs: [] })),
          getDocs(collection(db, 'engagements')).catch(() => ({ docs: [] })),
        ])

        const allProfiles: Profile[] = profilesSnap.docs.map(d => ({ ...d.data(), uid: d.id } as Profile))
        const myInterests: Interest[] = (intSnap as { docs: Array<{ id: string; data: () => object }> }).docs.map(d => ({ id: d.id, ...d.data() } as Interest))
        const myEngagements: Engagement[] = (engSnap as { docs: Array<{ id: string; data: () => object }> }).docs.map(d => ({ id: d.id, ...d.data() } as Engagement))

        const held = new Set<string>()
        myEngagements.forEach(e => { held.add(e.p1.u); held.add(e.p2.u) })

        const myG = currentUser.g ?? currentUser.gender ?? ''
        const myU = currentUser.u ?? ''
        const myUid = currentUser.uid ?? ''

        let filtered = allProfiles.filter(p => {
          if (p.u === myU || p.uid === myUid) return false
          if (held.has(p.u) || held.has(p.uid)) return false
          const pg = p.g ?? p.gender ?? ''
          if (myG && pg && pg === myG) return false
          return true
        })

        if (!filtered.length && myG) {
          filtered = allProfiles.filter(p => {
            if (p.u === myU || p.uid === myUid) return false
            if (held.has(p.u) || held.has(p.uid)) return false
            return true
          })
        }

        filtered.sort((a, b) => prefScore(b, currentUser) - prefScore(a, currentUser))

        setPool(filtered)
        setInterests(myInterests)
        setEngagements(myEngagements)
        setSavedProfiles((currentUser.savedProfiles as string[]) ?? [])
      } catch (e) {
        console.error('useProfiles error', e)
      }
      setLoading(false)
    }

    load()
  }, [currentUser?.uid, tick])

  return { pool, interests, engagements, savedProfiles, loading, refetch }
}
