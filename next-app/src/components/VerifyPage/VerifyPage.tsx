'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import s from './verify.module.css'

export default function VerifyPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) { router.replace('/login'); return }
      setEmail(user.email ?? '')
      if (user.emailVerified) router.replace('/dashboard')
    })
    return unsub
  }, [router])

  async function resend() {
    const user = auth.currentUser
    if (!user) return
    try {
      await sendEmailVerification(user)
      setSent(true); setError('')
    } catch { setError('Could not resend. Please wait a moment and try again.') }
  }

  async function checkVerified() {
    const user = auth.currentUser
    if (!user) return
    setChecking(true)
    try {
      await user.reload()
      if (user.emailVerified) router.replace('/dashboard')
      else setError('Email not yet verified. Check your inbox and click the link.')
    } catch { setError('Could not verify. Please try again.') }
    setChecking(false)
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.icon}>✉️</div>
        <h1 className={s.title}>Verify Your Email</h1>
        <p className={s.sub}>
          We sent a verification link to <strong>{email}</strong>.<br />
          Click the link in the email, then tap the button below.
        </p>
        {error && <p className={s.error}>{error}</p>}
        {sent && <p className={s.success}>Verification email sent!</p>}
        <button type="button" className={s.btnPrimary} onClick={checkVerified} disabled={checking}>
          {checking ? 'Checking…' : "I've Verified — Continue"}
        </button>
        <button type="button" className={s.btnSecondary} onClick={resend}>
          Resend Email
        </button>
        <p className={s.note}>Check your spam/junk folder if you don&apos;t see it.</p>
      </div>
    </div>
  )
}
