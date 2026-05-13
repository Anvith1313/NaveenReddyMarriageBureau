'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
export default function MobileBiodataIndex() {
  const router = useRouter()
  const { user, profile: me, loading } = useAuth()
  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }
    if (me?.u) router.replace(`/biodata/${me.u}`)
    else if (me?.uid) router.replace(`/biodata/${me.uid}`)
  }, [loading, user, me, router])
  return null
}
