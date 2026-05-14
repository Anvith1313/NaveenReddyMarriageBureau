'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import s from './layout.module.css'

const NAV = [
  { href: '/d/browse', label: 'Browse' },
  { href: '/d/stories', label: 'Stories' },
  { href: '/d/about', label: 'About' },
  { href: '/d/membership', label: 'Membership' },
  { href: '/d/contact', label: 'Contact' },
]

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={s.shell}>
      <header className={s.header}>
        <Link href="/d/dashboard" className={s.logo}>
          <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={42} height={42} style={{ objectFit: 'contain' }} />
          <div className={s.brandText}>
            <span className={s.brandMain}>Naveen Reddy Marriage Bureau</span>
            <span className={s.brandSub}>Reddy Community · Est. 2000</span>
          </div>
        </Link>

        <nav className={s.nav}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href} className={active ? s.navLinkActive : s.navLink}>
                {label}
              </Link>
            )
          })}
        </nav>

        <Link href="/d/my-profile" className={s.ctaBtn}>
          My Profile
        </Link>
      </header>

      <main>{children}</main>
    </div>
  )
}
