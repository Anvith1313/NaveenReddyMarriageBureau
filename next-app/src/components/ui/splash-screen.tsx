'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

/**
 * SplashScreen — CSS-only animations, zero framer-motion inside.
 * - Returns null on the server (mounted: false) so SSR never renders
 *   invisible elements.
 * - On client mount, the overlay appears with CSS keyframe animations.
 * - After 3.4 s, a CSS transition slides the panel up off-screen.
 */
export function SplashScreen() {
  // Never render on server — prevents framer-motion/SSR opacity:0 flash
  const [mounted, setMounted] = useState(false)
  // Controls the slide-up exit transition
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setExiting(true), 3400)
    return () => clearTimeout(t)
  }, [])

  if (!mounted) return null

  return (
    <div className={`splash-overlay${exiting ? ' splash-exit' : ''}`}>

      {/* Ornamental trellis background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23C8A24A' stroke-width='0.4'/%3E%3Cpath d='M40 20L60 40L40 60L20 40Z' fill='none' stroke='%23C8A24A' stroke-width='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          opacity: 0.07,
        }}
      />

      {/* Gold top edge */}
      <div
        className="splash-line"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
        }}
      />

      {/* Logo — drops in from above via .splash-logo keyframe */}
      <div className="splash-logo" style={{ marginBottom: '1.75rem' }}>
        <Image
          src="/Assets/Logo-transparent.webp"
          alt="Naveen Reddy Marriage Bureau"
          width={110}
          height={110}
          priority
          style={{ objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* Bureau name */}
      <h1
        className="splash-title"
        style={{
          fontFamily: "var(--font-playfair), 'Playfair Display', serif",
          fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#7B1E3C',
          letterSpacing: '-0.01em',
          lineHeight: 1.1,
          textAlign: 'center',
          margin: 0,
        }}
      >
        Naveen Reddy
      </h1>

      {/* "Marriage Bureau" flanked by gold rules */}
      <div
        className="splash-sub"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          margin: '0.9rem 0 0.6rem',
        }}
      >
        <span style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #C8A24A)', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
            fontSize: '0.82rem', fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase' as const,
            color: '#C8A24A', whiteSpace: 'nowrap' as const,
          }}
        >
          Marriage Bureau
        </span>
        <span style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, #C8A24A)', flexShrink: 0 }} />
      </div>

      {/* Tagline */}
      <p
        className="splash-tag"
        style={{
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontSize: '0.58rem', fontWeight: 600,
          letterSpacing: '0.28em', textTransform: 'uppercase' as const,
          color: '#6B5C52', margin: 0,
        }}
      >
        Est. 2000 &nbsp;·&nbsp; Exclusively Reddy Community
      </p>

      {/* Animated progress line — sweeps left to right */}
      <div
        className="splash-line"
        style={{
          position: 'absolute', bottom: '12%', left: '50%',
          width: 80, height: 1.5, marginLeft: -40,
          background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
          animationDelay: '1.3s',
        }}
      />

      {/* Gold bottom edge */}
      <div
        className="splash-line"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
          animationDelay: '0.4s',
        }}
      />
    </div>
  )
}
