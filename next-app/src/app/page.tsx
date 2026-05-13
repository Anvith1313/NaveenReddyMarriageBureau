'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Middleware handles server-side routing to /m or /d.
// This client-side fallback covers cases where middleware doesn't fire (e.g. cached static visits).
export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    router.replace(isMobile ? '/m' : '/d')
  }, [router])
  return null
}
