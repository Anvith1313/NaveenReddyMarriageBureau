'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './layout.module.css'

const NAV = [
  { href: '/m', icon: '⌂', label: 'Home' },
  { href: '/m/browse', icon: '◈', label: 'Browse' },
  { href: '/m/liked', icon: '♥', label: 'Liked' },
  { href: '/m/my-profile', icon: '◉', label: 'Profile' },
  { href: '/m/membership', icon: '✦', label: 'Plans' },
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
