'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import s from './layout.module.css'

const NAV_PUBLIC = [
  { href: '/d', label: 'Home' },
  { href: '/d/about', label: 'About' },
  { href: '/d/membership', label: 'Membership' },
  { href: '/d/branches', label: 'Our Branches' },
  { href: '/d/stories', label: 'Stories' },
  { href: '/d/contact', label: 'Contact' },
]

const NAV_AUTH = [
  { href: '/d/dashboard', label: 'Home' },
  { href: '/d/browse', label: 'Browse' },
  { href: '/d/stories', label: 'Stories' },
  { href: '/d/about', label: 'About' },
  { href: '/d/membership', label: 'Membership' },
  { href: '/d/contact', label: 'Contact' },
]

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  const isLanding = pathname === '/d'
  const NAV = user ? NAV_AUTH : NAV_PUBLIC

  return (
    <div className={s.shell}>
      <header className={s.header}>
        <Link href={user ? '/d/dashboard' : '/d'} className={s.logo}>
          <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={42} height={42} style={{ objectFit: 'contain' }} />
          <div className={s.brandText}>
            <span className={s.brandMain}>Naveen Reddy Marriage Bureau</span>
            <span className={s.brandSub}>Exclusively · Reddy Community · Est. 2000</span>
          </div>
        </Link>

        <nav className={s.nav}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== '/d' && href !== '/d/dashboard' && pathname.startsWith(href + '/'))
            return (
              <Link key={href} href={href} className={active ? s.navLinkActive : s.navLink}>
                {label}
              </Link>
            )
          })}
        </nav>

        {!loading && (
          user ? (
            <Link href="/d/my-profile" className={s.ctaBtn}>
              My Profile
            </Link>
          ) : (
            <div className={s.navBtns}>
              <Link href="/d/login" className={s.btnNavIn}>Login</Link>
              <Link href="/m/signup" className={s.ctaBtn}>Sign Up</Link>
            </div>
          )
        )}
      </header>

      <main>{children}</main>
    </div>
  )
}
