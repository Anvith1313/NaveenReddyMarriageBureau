'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import s from './landing.module.css'
import { useReveal, useCountUp } from '@/lib/useReveal'

/* ── Verified badge SVG ───────────────────────────────────────── */
function VerifiedBadge({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-label="Verified">
      <path
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        fill="rgba(200,130,26,0.15)"
        stroke="#F0A830"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="#F0A830" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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

      {/* ── Mobile nav ─────────────────────────────────── */}
      {mobile && (
        <nav className={s.mobileNav}>
          <div className={s.mobileNavLeft} onClick={() => router.push('/m')}>
            <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={38} height={38} style={{ objectFit: 'contain' }} />
            <div className={s.mobileNavBrand}>
              <span className={s.mobileNavMain}>Naveen Reddy Marriage Bureau</span>
              <span className={s.mobileNavSub}>Exclusively · Reddy · Est. 2000</span>
            </div>
          </div>
          <button type="button" className={`${s.hamburger} ${menuOpen ? s.hamburgerOpen : ''}`} aria-label="Menu" onClick={() => setMenuOpen(v => !v)}>
            <span /><span /><span />
          </button>
        </nav>
      )}

      {mobile && menuOpen && (
        <>
          <div className={s.menuOverlay} onClick={() => setMenuOpen(false)} />
          <div className={s.menuPanel}>
            <div className={s.menuLinks}>
              {[['Home','/m'],['About','/m/about'],['Membership','/m/membership'],['Our Branches','/m/branches'],['Happy Stories','/m/stories'],['Contact','/m/contact']].map(([label,href]) => (
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

      {/* ── Hero ───────────────────────────────────────── */}
      <div className={s.heroSection}>
        <Image src="/Assets/couple.jpg" alt="" fill priority
          style={{ objectFit: 'cover', objectPosition: 'center 22%' }}
          className={s.heroImg}
        />
        <div className={s.heroOverlay} />
        <div className={s.heroGrain} />
        <div className={s.heroGlow} />
        <div className={s.heroTopLine} />

        <div className={s.heroContent}>

          {/* Eyebrow */}
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowLine} />
            <span className={s.heroEyebrowDot} />
            Exclusively Reddy Community · Est. 2000
            <span className={s.heroEyebrowDot} />
            <span className={s.heroEyebrowLine} />
          </div>

          {/* Heading: italic Cormorant + Cinzel caps subline */}
          <h1 className={s.heroBrand}>
            Naveen Reddy
            <span className={s.heroBrandStrong}>Marriage Bureau</span>
          </h1>

          {/* Amber diamond rule */}
          <div className={s.heroRule}>
            <span className={s.heroRuleLine} />
            <span className={s.heroRuleDiamond} />
            <span className={s.heroRuleLine} />
          </div>

          <p className={s.heroTagline}>Where Sacred Traditions Meet Timeless Love</p>
          <p className={s.heroLocations}>Hyderabad · Warangal · Karimnagar · and across India</p>

          {/* CTAs */}
          <div className={s.heroCta}>
            <button type="button" className={s.hbtnPrimary} onClick={() => router.push(signupPath)}>
              Begin Your Journey
            </button>
            <button type="button" className={s.hbtnOutline} onClick={() => router.push(loginPath)}>
              Sign In
            </button>
          </div>

          {/* Trust pills with verified badge */}
          <div className={s.heroTrustRow}>
            <div className={`${s.htrustPill} ${s.htrustPillVerified}`}>
              <VerifiedBadge size={13} />
              Verified Profiles
            </div>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,252,245,0.7)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              100% Confidential
            </div>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,252,245,0.7)" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Est. 2000
            </div>
            <div className={s.htrustPill}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,252,245,0.7)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              25+ Years Serving Families
            </div>
          </div>

        </div>
      </div>

      {/* ── Below hero ─────────────────────────────────── */}
      <div className={s.homeBelow}>

        {/* Stats — dark section */}
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

        {/* Features — ivory section */}
        <section className={s.featSection}>
          <div className={`${s.secHd} reveal`}>
            <p className={s.secTag}>Why Families Trust Us</p>
            <h2 className={s.secTitle}>A Legacy of Honour<br />Since 2000</h2>
            <p className={s.secSub}>Serving the Reddy community with privacy, dignity and personal attention for over two decades</p>
          </div>

          <div className={s.featGrid}>
            {[
              { n:'01', title:'Complete Privacy', text:'Contact details never shared without mutual interest and bureau approval.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(200,130,26,0.1)" stroke="#C8821A" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#F0A830" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { n:'02', title:'100% Verified', text:'Every profile is personally screened by our bureau team before it goes live.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" fill="rgba(200,130,26,0.1)" stroke="#C8821A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#F0A830" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { n:'03', title:'Community Exclusive', text:'Exclusively for the Reddy community, ensuring cultural and traditional compatibility.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="rgba(200,130,26,0.08)" stroke="#C8821A" strokeWidth="1.6" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="8" rx="1" fill="rgba(200,130,26,0.15)" stroke="#F0A830" strokeWidth="1.3"/></svg> },
              { n:'04', title:'Family Conversation', text:'Once contact is approved, families connect through our secure bureau channel.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(200,130,26,0.08)" stroke="#C8821A" strokeWidth="1.6" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke="#F0A830" strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="13" x2="13" y2="13" stroke="#F0A830" strokeWidth="1.6" strokeLinecap="round"/></svg> },
              { n:'05', title:'NRI Profiles', text:'Extensive database of NRI Reddy profiles from USA, UK, Canada, Australia and UAE.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(200,130,26,0.06)" stroke="#C8821A" strokeWidth="1.6"/><ellipse cx="12" cy="12" rx="3.5" ry="9" fill="rgba(200,130,26,0.1)" stroke="#F0A830" strokeWidth="1.3"/><line x1="3" y1="12" x2="21" y2="12" stroke="#C8821A" strokeWidth="1.3"/></svg> },
              { n:'06', title:'Personal Service', text:'Dedicated relationship managers guide you personally through every step of your journey.',
                icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#C8821A" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="7" r="4" fill="rgba(200,130,26,0.1)" stroke="#C8821A" strokeWidth="1.6"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="#F0A830" strokeWidth="1.6" strokeLinecap="round"/><path d="M16 3.13a4 4 0 010 7.75" stroke="#F0A830" strokeWidth="1.6" strokeLinecap="round"/></svg> },
            ].map((f, i) => (
              <div key={f.n} className={`${s.featItem} reveal reveal-d${Math.min(i+1,6)}`}>
                <div className={s.featNum}>{f.n}</div>
                <div className={s.featIconWrap}>{f.icon}</div>
                <div className={s.featTitle}>{f.title}</div>
                <div className={s.featText}>{f.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Process — dark section */}
        <section className={s.processSection}>
          <div className={`${s.secHd} ${s.secHdDark} reveal`}>
            <p className={s.secTag}>Simple &amp; Transparent</p>
            <h2 className={s.secTitle}>How We Work</h2>
            <p className={s.secSub}>Four steps from registration to your perfect match</p>
          </div>

          <div className={s.processGrid}>
            {[
              { n:'01', title:'Begin Your Story', text:'Create your profile — we guide you through every detail with care and precision.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="rgba(200,130,26,0.12)" stroke="#C8821A" strokeWidth="1.6"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#C8821A" strokeWidth="1.6" strokeLinecap="round"/></svg> },
              { n:'02', title:'Bureau Verifies You', text:'Our team personally reviews your profile before it becomes visible to other members.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 6.5v5c0 4.8 3.5 9.3 8 10.5 4.5-1.2 8-5.7 8-10.5v-5L12 3z" fill="rgba(200,130,26,0.1)" stroke="#C8821A" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#F0A830" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { n:'03', title:'Meet Our Members', text:'Browse verified profiles privately. Express interest in those who meet your expectations.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" fill="rgba(200,130,26,0.08)" stroke="#C8821A" strokeWidth="1.6"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#F0A830" strokeWidth="2.2" strokeLinecap="round"/></svg> },
              { n:'04', title:'Begin Your Journey', text:'When both families show interest, our bureau facilitates the personal introduction.',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="rgba(200,130,26,0.12)" stroke="#F0A830" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
            ].map((step, i) => (
              <div key={step.n} className={`${s.processCard} reveal reveal-d${i+1}`}>
                <div className={s.processNumGhost}>{step.n}</div>
                <div className={s.processIconWrap}>{step.icon}</div>
                <div className={s.processTitle}>{step.title}</div>
                <div className={s.processText}>{step.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stories — ivory section */}
        <section className={s.storiesSection}>
          <div className={`${s.secHd} reveal`}>
            <p className={s.secTag}>Happy Stories</p>
            <h2 className={s.secTitle}>Thousands of<br />Blessed Unions</h2>
            <p className={s.secSub}>Real couples, real happiness — facilitated by Naveen Reddy Marriage Bureau</p>
          </div>

          <div className={s.storiesGrid}>
            {[
              { names:'Priya & Rahul Reddy', year:'Married · December 2023 · Hyderabad', text:'"NRMB\'s personal attention made all the difference. Within weeks we found the most perfect match for our family."' },
              { names:'Ananya & Kiran Reddy', year:'Married · March 2024 · Bangalore', text:'"The verification process gave our families complete confidence. We are forever grateful for this beautiful blessing."' },
              { names:'Deepa & Vivek Reddy', year:'Married · August 2023 · London', text:'"As NRI members, their Elite service exceeded every expectation. Truly a premium, personal experience unlike any other."' },
            ].map((st, i) => (
              <div key={st.names} className={`${s.storyCard} reveal reveal-d${i+1}`}>
                <div className={s.storyQuote}>&ldquo;</div>
                <p className={s.storyText}>{st.text}</p>
                <div className={s.storyMeta}>
                  <div className={s.storyVerified} aria-label="Verified couple">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#0D1B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={s.storyMetaText}>
                    <div className={s.storyNames}>{st.names}</div>
                    <div className={s.storyYear}>{st.year}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA band — dark */}
        <section className={`${s.ctaBand} reveal`}>
          <div className={s.ctaBandInner}>
            <p className={s.ctaBandTag}>Your Journey Begins Here</p>
            <h2 className={s.ctaBandH}>Your Perfect Match<br />Awaits</h2>
            <p className={s.ctaBandSub}>
              Join an exclusive community of verified Reddy families.<br />
              Begin with a personal consultation and let us guide every step.
            </p>
            <button type="button" className={s.ctaBandBtn} onClick={() => router.push(signupPath)}>
              Begin Your Journey
            </button>
          </div>
        </section>

        {/* Footer */}
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
              <h4>Contact Us</h4>
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
