'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

/**
 * SplashScreen — premium logo entrance, shown on every page load.
 * The logo drops in from above, bureau name fades in, then the panel
 * slides up after ~3.4 seconds to reveal the website beneath.
 *
 * Place this at the top of the page component (LandingPage or layout).
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Total time: 3.4s visible, then 0.8s slide-up exit = ~4.2s total
    const t = setTimeout(() => setVisible(false), 3400)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#FFFDF8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            overflow: 'hidden',
          }}
        >
          {/* Ornamental background trellis */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%23C8A24A' stroke-width='0.4'/%3E%3Cpath d='M40 20L60 40L40 60L20 40Z' fill='none' stroke='%23C8A24A' stroke-width='0.3'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
              opacity: 0.07,
              pointerEvents: 'none',
            }}
          />

          {/* Gold top line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
              transformOrigin: 'left',
            }}
          />

          {/* Logo drops in from above */}
          <motion.div
            initial={{ y: -90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.15,
              type: 'spring',
              stiffness: 110,
              damping: 18,
              mass: 1,
            }}
            style={{ marginBottom: '1.75rem' }}
          >
            <Image
              src="/Assets/Logo-transparent.webp"
              alt="Naveen Reddy Marriage Bureau"
              width={110}
              height={110}
              priority
              style={{ objectFit: 'contain' }}
            />
          </motion.div>

          {/* Bureau name */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: 'easeOut' }}
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
          </motion.h1>

          {/* "Marriage Bureau" with flanking rules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '0.9rem 0 0.6rem',
            }}
          >
            <span style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #C8A24A)', display: 'block' }} />
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#C8A24A',
                whiteSpace: 'nowrap',
              }}
            >
              Marriage Bureau
            </span>
            <span style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, #C8A24A)', display: 'block' }} />
          </motion.div>

          {/* Eyebrow tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: '0.58rem',
              fontWeight: 600,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#6B5C52',
              margin: 0,
            }}
          >
            Est. 2000 &nbsp;·&nbsp; Exclusively Reddy Community
          </motion.p>

          {/* Animated gold bottom divider — loading indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.3, duration: 1.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              bottom: '12%',
              left: '50%',
              width: 80,
              height: 1.5,
              background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
              transformOrigin: 'center',
              marginLeft: -40,
            }}
          />

          {/* Gold bottom line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #C8A24A, transparent)',
              transformOrigin: 'right',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
