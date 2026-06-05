'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import s from './landing.module.css'
import { useReveal, useCountUp } from '@/lib/useReveal'

function VerifiedBadge({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Verified">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        fill="rgba(123,30,60,0.12)" stroke="#7B1E3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="#7B1E3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const FEATURES = [
  { n: '01', title: 'Complete Privacy',
    text: 'Contact details are never shared without mutual interest and bureau approval. Your privacy is our highest commitment.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(123,30,60,0.08)" stroke="#7B1E3C" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#C8A24A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { n: '02', title: '100% Verified',
    text: 'Every single profile is personally screened and approved by our bureau team before it becomes visible to other members.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" fill="rgba(200,162,74,0.1)" stroke="#C8A24A" strokeWidth="1.6"/><path d="M9 12l2 2 4-4" stroke="#7B1E3C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { n: '03', title: 'Community Exclusive',
    text: 'Serving exclusively the Reddy community of Hindu religion, ensuring deep cultural, traditional and family value alignment.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="rgba(123,30,60,0.07)" stroke="#7B1E3C" strokeWidth="1.6" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="8" rx="1" fill="rgba(200,162,74,0.15)" stroke="#C8A24A" strokeWidth="1.3"/></svg> },
  { n: '04', title: 'Family Conversation',
    text: 'Once mutual interest is confirmed, families connect through our secure, personally supervised bureau channel.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(123,30,60,0.07)" stroke="#7B1E3C" strokeWidth="1.6" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke="#C8A24A" strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="13" x2="13" y2="13" stroke="#C8A24A" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { n: '05', title: 'NRI Profiles',
    text: 'Extensive curated database of NRI Reddy profiles from USA, UK, Canada, Australia, UAE and across the globe.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(123,30,60,0.06)" stroke="#7B1E3C" strokeWidth="1.6"/><ellipse cx="12" cy="12" rx="3.5" ry="9" fill="rgba(200,162,74,0.1)" stroke="#C8A24A" strokeWidth="1.3"/><line x1="3" y1="12" x2="21" y2="12" stroke="#7B1E3C" strokeWidth="1.3"/></svg> },
  { n: '06', title: 'Personal Service',
    text: 'Dedicated relationship managers guide your family personally through every step of the journey, from registration to engagement.',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#7B1E3C" strokeWidth="1.6" strokeLinecap="round"/><circle cx="9" cy="7" r="4" fill="rgba(123,30,60,0.08)" stroke="#7B1E3C" strokeWidth="1.6"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#C8A24A" strokeWidth="1.6" strokeLinecap="round"/></svg> },
]

const STEPS = [
  { n: '01', title: 'Begin Your Story',    text: 'Create your profile — we guide you through every detail with care and precision.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="rgba(123,30,60,0.1)" stroke="#7B1E3C" strokeWidth="1.6"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#7B1E3C" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { n: '02', title: 'Bureau Verifies You', text: 'Our team personally reviews your profile before it becomes visible to other members.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 6.5v5c0 4.8 3.5 9.3 8 10.5 4.5-1.2 8-5.7 8-10.5v-5L12 3z" fill="rgba(123,30,60,0.08)" stroke="#7B1E3C" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#C8A24A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { n: '03', title: 'Meet Our Members',   text: 'Browse verified profiles privately. Express genuine interest in those who meet your expectations.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" fill="rgba(123,30,60,0.07)" stroke="#7B1E3C" strokeWidth="1.6"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#C8A24A" strokeWidth="2.2" strokeLinecap="round"/></svg> },
  { n: '04', title: 'Begin Your Journey', text: 'When both families show interest, our bureau facilitates the warm, personal introduction.',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="rgba(200,162,74,0.12)" stroke="#C8A24A" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
]

const STORIES = [
  { names: 'Priya & Rahul Reddy',  year: 'December 2023 · Hyderabad', text: '"NRMB\'s personal attention made all the difference. Within just a few weeks we found the most perfect match our family could have hoped for."' },
  { names: 'Ananya & Kiran Reddy', year: 'March 2024 · Bangalore',    text: '"The verification process gave our families complete confidence. We are truly and forever grateful for this beautiful blessing in our lives."' },
  { names: 'Deepa & Vivek Reddy',  year: 'August 2023 · London',      text: '"As NRI members, the Elite service exceeded every single expectation. Truly a premium, personal experience unlike anything else we tried."' },
]

export default function LandingPage({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const signupPath = mobile ? '/m/signup' : '/d/signup'
  const loginPath  = mobile ? '/m/login'  : '/d/login'

  useReveal()
  const refMembers = useCountUp(10,   1800, 'K+')
  const refMatches = useCountUp(4500, 1800, '+')
  const refYears   = useCountUp(25,   1500, '+')
  const refDistr   = useCountUp(50,   1500, '+')

  return (
    <div className={s.root}>

      {/* ── Mobile nav ─────────────────────────────── */}
      {mobile && (
        <nav className={s.mobileNav}>
          <div className={s.mobileNavLeft} onClick={() => router.push('/m')}>
            <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={36} height={36} style={{ objectFit: 'contain' }} />
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
              <button type="button" className={s.menuBtnOutline} onClick={() => { router.push(loginPath); setMenuOpen(false) }}>Login</button>
              <button type="button" className={s.menuBtnSolid} onClick={() => { router.push(signupPath); setMenuOpen(false) }}>Sign Up</button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          HERO — split layout: photo left, text right
      ══════════════════════════════════════════════ */}
      <section className={s.hero}>

        {/* Photo panel */}
        <div className={s.heroPhoto}>
          <Image src="/Assets/couple.jpg" alt="A happily married Reddy couple" fill priority
            style={{ objectFit: 'cover', objectPosition: 'center 18%' }} />
          <div className={s.heroPhotoVignette} />
        </div>

        {/* Text panel */}
        <div className={s.heroText}>
          <div className={s.heroTextInner}>

            <p className={s.heroEyebrow}>
              <span className={s.heroEyebrowRule} />
              Est. 2000 &nbsp;·&nbsp; Exclusively Reddy Community
              <span className={s.heroEyebrowRule} />
            </p>

            <h1 className={s.heroHeading}>
              Naveen<br />Reddy
            </h1>

            <div className={s.heroSubRule}>
              <span className={s.heroSubRuleLine} />
              <span className={s.heroSubRuleText}>Marriage Bureau</span>
              <span className={s.heroSubRuleLine} />
            </div>

            <p className={s.heroTagline}>
              Where Sacred Traditions<br />Meet Timeless Love
            </p>

            <div className={s.heroActions}>
              <button type="button" className={s.heroBtnPrimary} onClick={() => router.push(signupPath)}>
                Begin Your Journey
              </button>
              <button type="button" className={s.heroBtnGhost} onClick={() => router.push(loginPath)}>
                Sign In
              </button>
            </div>

            <div className={s.heroTrust}>
              <span className={s.heroTrustItem}>
                <VerifiedBadge size={13} />
                Verified Profiles
              </span>
              <span className={s.heroTrustDot} />
              <span className={s.heroTrustItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Confidential
              </span>
              <span className={s.heroTrustDot} />
              <span className={s.heroTrustItem}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                25+ Years
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS — dark strip
      ══════════════════════════════════════════════ */}
      <div className={`${s.statsStrip} reveal`}>
        <div className={s.statItem}>
          <span className={s.statN}><span ref={refMembers}>10K+</span></span>
          <span className={s.statL}>Registered Members</span>
        </div>
        <span className={s.statRule} />
        <div className={s.statItem}>
          <span className={s.statN}><span ref={refMatches}>4,500+</span></span>
          <span className={s.statL}>Successful Matches</span>
        </div>
        <span className={s.statRule} />
        <div className={s.statItem}>
          <span className={s.statN}><span ref={refYears}>25+</span></span>
          <span className={s.statL}>Years of Trust</span>
        </div>
        <span className={s.statRule} />
        <div className={s.statItem}>
          <span className={s.statN}>100%</span>
          <span className={s.statL}>Verified</span>
        </div>
        <span className={s.statRule} />
        <div className={s.statItem}>
          <span className={s.statN}><span ref={refDistr}>50+</span></span>
          <span className={s.statL}>Districts Covered</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FEATURES — editorial list, no boxes
      ══════════════════════════════════════════════ */}
      <section className={s.featSection}>
        <div className={`${s.featHeader} reveal`}>
          <p className={s.sectionTag}>Why Families Trust Us</p>
          <h2 className={s.sectionTitle}>A Legacy of Honour<br />Since 2000</h2>
          <p className={s.sectionSub}>Serving the Reddy community with privacy, dignity and personal attention for over two decades</p>
        </div>

        <div className={s.featList}>
          {FEATURES.map((f, i) => (
            <div key={f.n} className={`${s.featRow} reveal`} style={{ transitionDelay: `${i * 0.06}s` }}>
              <span className={s.featRowNum}>{f.n}</span>
              <div className={s.featRowBody}>
                <div className={s.featRowTop}>
                  <span className={s.featRowIcon}>{f.icon}</span>
                  <h3 className={s.featRowTitle}>{f.title}</h3>
                </div>
                <p className={s.featRowText}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROCESS — horizontal timeline
      ══════════════════════════════════════════════ */}
      <section className={s.processSection}>
        <div className={`${s.processHeader} reveal`}>
          <p className={s.sectionTagLight}>Simple &amp; Transparent</p>
          <h2 className={s.sectionTitleLight}>How We Work</h2>
          <p className={s.sectionSubLight}>Four thoughtful steps from registration to your perfect match</p>
        </div>

        <div className={s.processTimeline}>
          {STEPS.map((step, i) => (
            <div key={step.n} className={`${s.processStep} reveal reveal-d${i + 1}`}>
              <div className={s.processCircleWrap}>
                <div className={s.processCircle}>
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && <div className={s.processConnector} />}
              </div>
              <span className={s.processNum}>{step.n}</span>
              <h3 className={s.processTitle}>{step.title}</h3>
              <p className={s.processText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STORIES — editorial quotes, no boxes
      ══════════════════════════════════════════════ */}
      <section className={s.storiesSection}>
        <div className={`${s.storiesHeader} reveal`}>
          <p className={s.sectionTag}>Happy Stories</p>
          <h2 className={s.sectionTitle}>Thousands of<br />Blessed Unions</h2>
          <p className={s.sectionSub}>Real couples, real happiness — facilitated by Naveen Reddy Marriage Bureau</p>
        </div>

        <div className={s.storiesGrid}>
          {STORIES.map((st, i) => (
            <div key={st.names} className={`${s.storyItem} reveal reveal-d${i + 1}`}>
              <div className={s.storyAccent} />
              <div className={s.storyBody}>
                <p className={s.storyText}>{st.text}</p>
                <div className={s.storyMeta}>
                  <div className={s.storyBadge} aria-label="Verified">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className={s.storyNames}>{st.names}</div>
                    <div className={s.storyYear}>Married · {st.year}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════════════ */}
      <section className={`${s.ctaBand} reveal`}>
        <div className={s.ctaBandInner}>
          <p className={s.ctaBandTag}>Your Journey Begins Here</p>
          <h2 className={s.ctaBandHeading}>
            Your Perfect Match<br />Awaits
          </h2>
          <p className={s.ctaBandSub}>
            Join an exclusive community of verified Reddy families.<br />
            Begin with a personal consultation and let us guide your journey.
          </p>
          <button type="button" className={s.ctaBandBtn} onClick={() => router.push(signupPath)}>
            Begin Your Journey
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      <footer className={s.footer}>
        <div className={s.footerGrid}>
          <div className={s.footerBrand}>
            <div className={s.footerLogo}>
              <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={34} height={34} style={{ objectFit: 'contain' }} />
              <span className={s.footerLogoName}>Naveen Reddy<br />Marriage Bureau</span>
            </div>
            <p className={s.footerTagline}>Serving the Reddy community with trust, honour and dedication since 2000. Making happy marriages happen throughout Telangana and beyond.</p>
          </div>
          <div className={s.footerContact}>
            <h4 className={s.footerColHead}>Contact Us</h4>
            <ul className={s.footerLinks}>
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
  )
}
