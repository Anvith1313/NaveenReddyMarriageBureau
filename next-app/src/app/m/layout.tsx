'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', icon: '⌂', label: 'Home' },
  { href: '/browse', icon: '◈', label: 'Browse' },
  { href: '/liked', icon: '♥', label: 'Liked' },
  { href: '/dashboard', icon: '◉', label: 'Profile' },
  { href: '/membership', icon: '✦', label: 'Plans' },
]

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: 'var(--bg)' }}>
      <main style={{ flex: 1, paddingBottom: 'var(--bottom-nav-h)' }}>
        {children}
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 'var(--bottom-nav-h)',
        background: 'rgba(255,251,245,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        zIndex: 100,
        boxShadow: '0 -4px 24px rgba(123,31,46,0.08)',
      }}>
        {NAV.map(({ href, icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                textDecoration: 'none',
                color: active ? 'var(--crimson)' : 'var(--muted)',
                transition: 'color var(--dur-fast) var(--ease-out)',
              }}
            >
              <span style={{ fontSize: active ? '1.25rem' : '1.1rem', transition: 'font-size var(--dur-fast) var(--ease-out)' }}>{icon}</span>
              <span style={{
                fontFamily: 'var(--font-label)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: active ? 600 : 400,
              }}>{label}</span>
              {active && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '24px',
                  height: '2px',
                  background: 'var(--crimson)',
                  borderRadius: '2px 2px 0 0',
                }} />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
