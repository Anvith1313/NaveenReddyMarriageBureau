'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import LandingPage from '@/components/LandingPage/LandingPage'

export default function DesktopHome() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.replace('/d/dashboard')
    }
  }, [user, loading, router])

  if (loading) return null
  if (user) return null

  return <LandingPage mobile={false} />
}
