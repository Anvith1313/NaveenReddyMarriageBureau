'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './layout.module.css'

const NAV = [
  {
    href: '/m',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/m/browse',
    label: 'Browse',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    href: '/m/liked',
    label: 'Liked',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    href: '/m/my-profile',
    label: 'Profile',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    href: '/m/membership',
    label: 'Plans',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
]

const AUTH_PATHS = ['/m/login', '/m/signup', '/m/forgot-password']

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p))

  return (
    <div className={isAuth ? s.shellAuth : s.shell}>
      <main className={isAuth ? s.mainAuth : s.main}>
        {children}
      </main>

      {!isAuth && (
        <nav className={s.nav}>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname === href || (href !== '/m' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} className={active ? s.navLinkActive : s.navLink}>
                <span className={active ? s.navIconActive : s.navIcon}>{icon}</span>
                <span className={active ? s.navLabelActive : s.navLabel}>{label}</span>
                {active && <span className={s.navActiveDot} />}
              </Link>
            )
          })}
        </nav>
      )}
    </div>
  )
}
