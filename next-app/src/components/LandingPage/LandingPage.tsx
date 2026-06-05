'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import s from './landing.module.css'
import { useReveal, useCountUp } from '@/lib/useReveal'

export default function LandingPage({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const signupPath = '/m/signup'
  const loginPath = mobile ? '/m/login' : '/d/login'

  useReveal()
  const refMembers = useCountUp(10,   1800, 'K+')
  const refMatches = useCountUp(4500, 1800, '+')
  const refYears   = useCountUp(25,   1500, '+')
  const refDistr   = useCountUp(50,   1500, '+')

  return (
    <div>
      {/* ── Mobile top navbar ── */}
      {mobile && (
        <nav className={s.mobileNav}>
          <div className={s.mobileNavLeft} onClick={() => router.push('/m')}>
            <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={40} height={40} style={{ objectFit: 'contain' }} />
            <div className={s.mobileNavBrand}>
              <span className={s.mobileNavMain}>Naveen Reddy Marriage Bureau</span>
              <span className={s.mobileNavSub}>Exclusively · Reddy Community · Est. 2000</span>
            </div>
          </div>
          <button type="button" className={`${s.hamburger} ${menuOpen ? s.hamburgerOpen : ''}`} aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </nav>
      )}

      {/* ── Mobile slide-out menu ── */}
      {mobile && menuOpen && (
        <>
          <div className={s.menuOverlay} onClick={() => setMenuOpen(false)} />
          <div className={s.menuPanel}>
            <div className={s.menuLinks}>
              {[['Home', '/m'], ['About', '/m/about'], ['Membership', '/m/membership'], ['Our Branches', '/m/branches'], ['Happy Stories', '/m/stories'], ['Contact', '/m/contact']].map(([label, href]) => (
                <button key={href} type="button" className={s.menuLink} onClick={() => { router.push(href); setMenuOpen(false) }}>{label}</button>
              ))}
            </div>
            <div className={s.menuBtns}>
              <button type="button" className={s.menuBtnIn} onClick={() => { router.push(loginPath); setMenuOpen(false) }}>Login</button>
              <button type="button" className={s.menuBtnUp} onClick={() => { router.push(signupPath); setMenuOpen(false) }}>Sign Up</button>
            </div>
          </div>
        </>
      )}

      {/* ── Hero ── */}
      <div className={s.heroSection}>
        {/* Real photo background */}
        <Image
          src="/Assets/couple.jpg"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          className={s.heroImg}
        />
        {/* Multi-layer overlay for readability */}
        <div className={s.heroOverlay} />
        {/* Grain texture */}
        <div className={s.heroGrain} />
        {/* Gold top accent */}
        <div className={s.heroTopLine} />

        <div className={s.heroContent}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowLine} />
            Exclusively Reddy Community · Est. 2000
            <span className={s.heroEyebrowLine} />
          </div>

          <h1 className={s.heroBrand}>
            Naveen Reddy<br />Marriage Bureau
          </h1>

          <p className={s.heroTagline}>Where Sacred Traditions Meet Timeless Love</p>

          <p className={s.heroLocations}>Hyderabad · Warangal · Karimnagar · and across India</p>

          <div className={s.heroCta}>
            <button type="button" className={s.hbtnPrimary} onClick={() => router.push(signupPath)}>
              Begin Your Journey
            </button>
            <button type="button" className={s.hbtnOutline} onClick={() => router.push(loginPath)}>
              Sign In
            </button>
          </div>

          <div className={s.heroTrustRow}>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Profiles
            </div>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              100% Confidential
            </div>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Est. 2000
            </div>
          </div>
        </div>
      </div>

      {/* ── Below hero ── */}
      <div className={s.homeBelow}>

        {/* ── Stats ── */}
        <div className={`${s.statsBar} reveal`}>
          <div className={s.statItem}>
            <div className={s.statN}><span ref={refMembers}>10K+</span></div>
            <div className={s.statL}>Registered Members</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statN}><span ref={refMatches}>4,500+</span></div>
            <div className={s.statL}>Successful Matches</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statN}><span ref={refYears}>25+</span></div>
            <div className={s.statL}>Years of Trust</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statN}>100%</div>
            <div className={s.statL}>Verified Profiles</div>
          </div>
          <div className={s.statDivider} />
          <div className={s.statItem}>
            <div className={s.statN}><span ref={refDistr}>50+</span></div>
            <div className={s.statL}>Districts Covered</div>
          </div>
        </div>

        {/* ── Features ── */}
        <section className={s.featSection}>
          <div className={`${s.secHd} reveal`}>
            <p className={s.secTag}>Why Families Trust Us</p>
            <h2 className={s.secTitle}>A Legacy of Honour<br />Since 2000</h2>
            <p className={s.secSub}>Serving the Reddy community with privacy, dignity and dedication</p>
          </div>

          <div className={s.featGrid}>
            {[
              {
                n: '01', title: 'Complete Privacy',
                text: 'Contact details never shared without mutual interest and bureau approval.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(139,30,63,0.1)" stroke="#8B1E3F" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              },
              {
                n: '02', title: '100% Verified',
                text: 'Every profile is personally screened by our bureau team before going live.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polygon points="12 2 14.4 7.8 20.5 8.5 16 12.8 17.2 19 12 15.9 6.8 19 8 12.8 3.5 8.5 9.6 7.8 12 2" fill="rgba(212,175,55,0.12)" stroke="#D4AF37" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9.5 12l2 2 4-4" stroke="#8B1E3F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              },
              {
                n: '03', title: 'Community Exclusive',
                text: 'Exclusively for the Reddy community, ensuring cultural and traditional compatibility.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="rgba(139,30,63,0.08)" stroke="#8B1E3F" strokeWidth="1.5" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="8" rx="0.5" fill="rgba(212,175,55,0.15)" stroke="#D4AF37" strokeWidth="1.3"/></svg>,
              },
              {
                n: '04', title: 'Family Conversation',
                text: 'Once contact is approved, families connect through our secure bureau channel.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(139,30,63,0.08)" stroke="#8B1E3F" strokeWidth="1.5" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="12.5" x2="13" y2="12.5" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round"/></svg>,
              },
              {
                n: '05', title: 'NRI Profiles',
                text: 'Extensive database of NRI Reddy profiles from USA, UK, Canada, Australia and UAE.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(139,30,63,0.06)" stroke="#8B1E3F" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="3.5" ry="9" fill="rgba(212,175,55,0.1)" stroke="#D4AF37" strokeWidth="1.3"/><line x1="3" y1="12" x2="21" y2="12" stroke="#8B1E3F" strokeWidth="1.3"/></svg>,
              },
              {
                n: '06', title: 'Personal Service',
                text: 'Dedicated relationship managers guide you through every step of your journey.',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(212,175,55,0.12)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
              },
            ].map((f, i) => (
              <div key={f.n} className={`${s.featItem} reveal reveal-d${Math.min(i + 1, 6)}`}>
                <div className={s.featNum}>{f.n}</div>
                <div className={s.featIconWrap}>{f.icon}</div>
                <div className={s.featTitle}>{f.title}</div>
                <div className={s.featText}>{f.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Process ── */}
        <section className={s.processSection}>
          <div className={`${s.secHd} reveal`}>
            <p className={s.secTag}>Simple &amp; Transparent</p>
            <h2 className={s.secTitle}>How We Work</h2>
            <p className={s.secSub}>Four steps from registration to your perfect match</p>
          </div>

          <div className={s.processGrid}>
            {[
              { n: '01', title: 'Begin Your Story', text: 'Create your profile in just a few minutes — we guide you through every field.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="rgba(139,30,63,0.1)" stroke="#8B1E3F" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#8B1E3F" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { n: '02', title: 'Bureau Verifies You', text: 'Our team personally reviews and approves your profile before it becomes visible.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 6.5v5c0 4.8 3.5 9.3 8 10.5 4.5-1.2 8-5.7 8-10.5v-5L12 3z" fill="rgba(139,30,63,0.08)" stroke="#8B1E3F" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { n: '03', title: 'Meet Our Members', text: 'Browse verified profiles privately. Show interest to those who match your expectations.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" fill="rgba(139,30,63,0.08)" stroke="#8B1E3F" strokeWidth="1.5"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round"/></svg> },
              { n: '04', title: 'Begin Your Journey', text: 'When both families show interest, our bureau facilitates the introduction.',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="rgba(212,175,55,0.12)" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
            ].map((step, i) => (
              <div key={step.n} className={`${s.processCard} reveal reveal-d${i + 1}`}>
                <div className={s.processNumGhost}>{step.n}</div>
                <div className={s.processIconWrap}>{step.icon}</div>
                <div className={s.processTitle}>{step.title}</div>
                <div className={s.processText}>{step.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stories ── */}
        <section className={s.storiesSection}>
          <div className={`${s.secHd} reveal`}>
            <p className={s.secTag}>Happy Stories</p>
            <h2 className={s.secTitle}>Thousands of<br />Blessed Unions</h2>
            <p className={s.secSub}>Real couples, real happiness — facilitated by Naveen Reddy Marriage Bureau</p>
          </div>

          <div className={s.storiesGrid}>
            {[
              { names: 'Priya & Rahul Reddy', year: 'Married · December 2023 · Hyderabad', text: '"NRMB\'s personal attention made all the difference. Within weeks we found the most perfect match."' },
              { names: 'Ananya & Kiran Reddy', year: 'Married · March 2024 · Bangalore', text: '"The verification process gave us complete confidence. Forever grateful for this blessing."' },
              { names: 'Deepa & Vivek Reddy', year: 'Married · August 2023 · London', text: '"Elite membership exceeded every expectation. As NRI members this was truly a premium experience."' },
            ].map((st, i) => (
              <div key={st.names} className={`${s.storyCard} reveal reveal-d${i + 1}`}>
                <div className={s.storyQuote}>&ldquo;</div>
                <p className={s.storyText}>{st.text}</p>
                <div className={s.storyMeta}>
                  <div className={s.storyNames}>{st.names}</div>
                  <div className={s.storyYear}>{st.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className={`${s.ctaBand} reveal`}>
          <div className={s.ctaBandInner}>
            <p className={s.ctaBandTag}>Your Journey Begins Here</p>
            <h2 className={s.ctaBandH}>Your Perfect Match<br />Awaits</h2>
            <p className={s.ctaBandSub}>
              Join an exclusive community of verified Reddy families.<br />
              Begin with a personal consultation and let us guide your journey.
            </p>
            <button type="button" className={s.ctaBandBtn} onClick={() => router.push(signupPath)}>
              Begin Your Journey
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className={s.siteFooter}>
          <div className={s.footerGrid}>
            <div className={s.fgBrand}>
              <div className={s.fbLogo}>
                <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={36} height={36} style={{ objectFit: 'contain' }} />
                <span className={s.fbName}>Naveen Reddy<br />Marriage Bureau</span>
              </div>
              <p>Serving the Reddy community with trust, honour and dedication since 2000. Making happy marriages happen throughout Telangana and beyond.</p>
            </div>
            <div className={s.fgCol}>
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:naveenreddy0033@yahoo.com">naveenreddy0033@yahoo.com</a></li>
                <li><a href="tel:+917207999985">+91 72079 99985</a></li>
                <li><a href="tel:+919848221166">+91 98482 21166</a></li>
                <li><button type="button" onClick={() => router.push(mobile ? '/m/branches' : '/d/branches')}>Our Branch Offices</button></li>
                <li><button type="button" onClick={() => router.push(mobile ? '/m/privacy' : '/d/privacy')}>Privacy Policy</button></li>
                <li><button type="button" onClick={() => router.push(mobile ? '/m/terms' : '/d/terms')}>Terms &amp; Conditions</button></li>
              </ul>
            </div>
          </div>
          <div className={s.footerBottom}>
            <p>© 2025 Naveen Reddy Marriage Bureau. All rights reserved. · Exclusively for Reddy Community · Hindu Religion.</p>
            <p>Head of Bureau: Mr. Naveen Reddy Ravula · +91 98482 21166 · Governing Law: Hyderabad, Telangana, India</p>
          </div>
        </footer>

      </div>
    </div>
  )
}
