'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV = [
  { href: '/browse', label: 'Browse' },
  { href: '/stories', label: 'Stories' },
  { href: '/about', label: 'About' },
  { href: '/membership', label: 'Membership' },
  { href: '/contact', label: 'Contact' },
]

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--nav-h)',
        background: 'rgba(255,251,245,0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: 'var(--sh-soft)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        gap: '2rem',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            color: 'var(--crimson)',
            fontWeight: 600,
          }}>REDDY ELITE MATRIMONY</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--crimson)' : 'var(--muted)',
                  textDecoration: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '4px',
                  transition: 'color var(--dur-fast) var(--ease-out), background var(--dur-fast)',
                  background: active ? 'var(--primary-light)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/dashboard"
          style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#FFF8DC',
            background: 'var(--crimson)',
            padding: '0.55rem 1.25rem',
            borderRadius: '4px',
            textDecoration: 'none',
            flexShrink: 0,
            boxShadow: '0 2px 12px rgba(123,31,46,0.28)',
            transition: 'background var(--dur-fast)',
          }}
        >
          My Profile
        </Link>
      </header>

      <main>{children}</main>
    </div>
  )
}
