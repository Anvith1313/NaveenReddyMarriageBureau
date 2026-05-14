'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import s from './login.module.css'

export default function DesktopLogin() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!identifier || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      let email = identifier
      if (!identifier.includes('@')) {
        const snap = await getDocs(query(collection(db, 'users'), where('u', '==', identifier)))
        if (snap.empty) { setError('Username not found.'); setLoading(false); return }
        email = snap.docs[0].data().email
      }
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (!cred.user.emailVerified) { router.push('/verify'); return }
      const delSnap = await getDoc(doc(db, 'deleted_accounts', cred.user.uid))
      if (delSnap.exists()) {
        setError('This account has been removed. Please contact the bureau.')
        setLoading(false); return
      }
      router.push('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      setError(
        code === 'auth/wrong-password' || code === 'auth/invalid-credential' ? 'Incorrect password.' :
        code === 'auth/user-not-found' ? 'No account found with this email.' :
        'Login failed. Please try again.'
      )
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setLoading(true); setError('')
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      router.push('/dashboard')
    } catch { setError('Google sign-in failed.') }
    setLoading(false)
  }

  async function handleForgotPassword() {
    if (!identifier || !identifier.includes('@')) {
      setError('Enter your email address above first.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, identifier)
      setError('')
      alert('Password reset email sent. Check your inbox.')
    } catch { setError('Could not send reset email.') }
  }

  return (
    <div className={s.page}>
      {/* Left — temple image */}
      <div className={s.imageSide}>
        <div className={s.imageCaption}>
          <p className={s.imageCaptionTitle}>
            Where two families<br />become one story
          </p>
          <p className={s.imageCaptionSub}>Reddy Elite Matrimony · Est. 2000</p>
        </div>
      </div>

      {/* Right — form */}
      <div className={s.formSide}>
        <div className={s.inner}>
          <div className={s.header}>
            <div className={s.logoRing}>
              <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={70} height={70} style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }} />
            </div>
            <p className={s.eyebrow}>Welcome Back</p>
            <h1 className={s.title}>Naveen Reddy Marriage Bureau</h1>
            <p className={s.subtitle}>A sacred journey continues here</p>
            <div className={s.dividerLine} />
          </div>

          <form className={s.form} onSubmit={handleLogin}>
            <div>
              <label className={s.fieldLabel} htmlFor="identifier">Email or Username</label>
              <input
                id="identifier"
                type="text"
                className={s.input}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter email or username"
                autoComplete="username"
              />
            </div>

            <div className={s.passwordWrap}>
              <label className={s.fieldLabel} htmlFor="password">Password</label>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className={s.inputPassword}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPass(v => !v)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>

            {error && <p className={s.errorBox}>{error}</p>}

            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className={s.orDivider}>
            <div className={s.orLine} />
            <span className={s.orText}>or</span>
            <div className={s.orLine} />
          </div>

          <button type="button" className={s.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <div className={s.footerLinks}>
            <Link href="/signup" className={s.createBtn}>Create New Account</Link>
            <div className={s.footerRow}>
              <button type="button" className={s.forgotBtn} onClick={handleForgotPassword}>
                Forgot Password?
              </button>
              <span className={s.since}>Since 2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
