'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import s from './landing.module.css'

export default function LandingPage({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const signupPath = '/m/signup'
  const loginPath = mobile ? '/m/login' : '/d/login'

  return (
    <div>
      {/* ── Mobile top navbar (only shown on /m, desktop layout provides its own) ── */}
      {mobile && (
        <nav className={s.mobileNav}>
          <div className={s.mobileNavLeft} onClick={() => router.push('/m')}>
            <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={42} height={42} style={{ objectFit: 'contain' }} />
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
                <button key={href} type="button" className={s.menuLink} onClick={() => { router.push(href); setMenuOpen(false); }}>{label}</button>
              ))}
            </div>
            <div className={s.menuBtns}>
              <button type="button" className={s.menuBtnIn} onClick={() => { router.push(loginPath); setMenuOpen(false); }}>Login</button>
              <button type="button" className={s.menuBtnUp} onClick={() => { router.push(signupPath); setMenuOpen(false); }}>Sign Up</button>
            </div>
          </div>
        </>
      )}

      {/* ── Hero ── */}
      <div className={s.heroSection}>
        <div className={s.heroPhoto} />
        <div className={s.heroContent}>
          <div className={s.heroTag}>Exclusively Reddy Community · Est. 2000</div>
          <div className={s.heroBrand}>Naveen Reddy<br />Marriage Bureau</div>
          <h1 className={s.heroH1}>Where Sacred Traditions Meet Timeless Love</h1>
          <p className={s.heroH2}>Hyderabad · Warangal · Karimnagar · and across India</p>
          <div className={s.heroBtns}>
            <div className={s.heroCtaWrap}>
              <button
                type="button"
                className={`${s.hbtn} ${s.hbtnPrimary}`}
                onClick={() => router.push(signupPath)}
              >
                Begin Your Journey
              </button>
            </div>
          </div>
          <div className={s.heroTrustRow}>
            <div className={s.htrustPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified Profiles
            </div>
            <div className={s.htrustPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              100% Confidential
            </div>
            <div className={s.htrustPill}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Est. 2000
            </div>
          </div>
        </div>
      </div>

      {/* ── Below hero ── */}
      <div className={s.homeBelow}>

        {/* Stats + Features slide */}
        <div className={s.featSnapSlide}>
          <div className={s.statsBar}>
            <div className={s.statItem}><div className={s.statN}>10K+</div><div className={s.statL}>Registered Members</div></div>
            <div className={s.statItem}><div className={s.statN}>4.5K+</div><div className={s.statL}>Successful Matches</div></div>
            <div className={s.statItem}><div className={s.statN}>25+</div><div className={s.statL}>Years of Trust</div></div>
            <div className={s.statItem}><div className={s.statN}>100%</div><div className={s.statL}>Verified Profiles</div></div>
            <div className={s.statItem}><div className={s.statN}>50+</div><div className={s.statL}>Districts Covered</div></div>
          </div>

          <section className={s.featSection}>
            <div className={s.secHd}>
              <div className={s.ornDivider}><span>✦ &nbsp; &nbsp; ✦</span></div>
              <div className={s.secTag}>Why Families Trust Us</div>
              <div className={s.secTitle}>A Legacy of Honour Since 2000</div>
              <div className={s.secSub}>Serving the Reddy community with privacy, dignity and dedication</div>
            </div>
            <div className={s.featGrid}>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(123,31,46,0.12)" stroke="#7B1F2E" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#B8892A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className={s.featTitle}>Complete Privacy</div>
                <div className={s.featText}>Contact details never shared without mutual interest and bureau approval.</div>
              </div></div>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><polygon points="12 2 14.4 7.8 20.5 8.5 16 12.8 17.2 19 12 15.9 6.8 19 8 12.8 3.5 8.5 9.6 7.8 12 2" fill="rgba(184,137,42,0.14)" stroke="#B8892A" strokeWidth="1.4" strokeLinejoin="round"/><path d="M9.5 12l2 2 4-4" stroke="#7B1F2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className={s.featTitle}>100% Verified</div>
                <div className={s.featText}>Every profile is personally screened by our bureau team before going live.</div>
              </div></div>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="rgba(123,31,46,0.1)" stroke="#7B1F2E" strokeWidth="1.5" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="8" rx="0.5" fill="rgba(184,137,42,0.18)" stroke="#B8892A" strokeWidth="1.3"/></svg>
                </div>
                <div className={s.featTitle}>Community Exclusive</div>
                <div className={s.featText}>Exclusively for the Reddy community, ensuring cultural and traditional compatibility.</div>
              </div></div>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(123,31,46,0.1)" stroke="#7B1F2E" strokeWidth="1.5" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke="#B8892A" strokeWidth="1.6" strokeLinecap="round"/><line x1="8" y1="12.5" x2="13" y2="12.5" stroke="#B8892A" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </div>
                <div className={s.featTitle}>Family Conversation</div>
                <div className={s.featText}>Once contact is approved, families connect through our secure bureau channel.</div>
              </div></div>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(123,31,46,0.08)" stroke="#7B1F2E" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="3.5" ry="9" fill="rgba(184,137,42,0.12)" stroke="#B8892A" strokeWidth="1.3"/><line x1="3" y1="12" x2="21" y2="12" stroke="#7B1F2E" strokeWidth="1.3"/><line x1="3" y1="8" x2="21" y2="8" stroke="#B8892A" strokeWidth="0.9" strokeDasharray="2 3"/><line x1="3" y1="16" x2="21" y2="16" stroke="#B8892A" strokeWidth="0.9" strokeDasharray="2 3"/></svg>
                </div>
                <div className={s.featTitle}>NRI Profiles</div>
                <div className={s.featText}>Extensive database of NRI Reddy profiles from USA, UK, Canada, Australia and UAE.</div>
              </div></div>
              <div className={s.featOuter}><div className={s.featCard}>
                <div className={s.featIcon}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(184,137,42,0.15)" stroke="#B8892A" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
                <div className={s.featTitle}>Personal Service</div>
                <div className={s.featText}>Dedicated relationship managers guide you through every step of your journey.</div>
              </div></div>
            </div>
          </section>
        </div>

        {/* Process section */}
        <section className={s.processSection}>
          <div className={s.secHd}>
            <div className={s.ornDivider}><span>✦ &nbsp; &nbsp; ✦</span></div>
            <div className={s.secTag}>Simple &amp; Transparent</div>
            <div className={s.secTitle}>How We Work</div>
            <div className={s.secSub}>Four simple steps from registration to your perfect match</div>
          </div>
          <div className={s.processGrid}>
            <div className={s.processOuter}><div className={s.processCard}>
              <div className={s.processNum}>01</div>
              <div className={s.processIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" fill="rgba(123,31,46,0.12)" stroke="#7B1F2E" strokeWidth="1.5"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="#7B1F2E" strokeWidth="1.5" strokeLinecap="round"/><circle cx="19" cy="10" r="2.5" fill="rgba(184,137,42,0.2)" stroke="#B8892A" strokeWidth="1.4"/><line x1="19" y1="7.8" x2="19" y2="12.2" stroke="#B8892A" strokeWidth="1.5" strokeLinecap="round"/><line x1="16.8" y1="10" x2="21.2" y2="10" stroke="#B8892A" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div className={s.processTitle}>Begin Your Story</div>
              <div className={s.processText}>Create your profile for free in just a few minutes — we guide you through every field.</div>
            </div></div>
            <div className={s.processOuter}><div className={s.processCard}>
              <div className={s.processNum}>02</div>
              <div className={s.processIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 6.5v5c0 4.8 3.5 9.3 8 10.5 4.5-1.2 8-5.7 8-10.5v-5L12 3z" fill="rgba(123,31,46,0.1)" stroke="#7B1F2E" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#B8892A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className={s.processTitle}>Bureau Verifies You</div>
              <div className={s.processText}>Our team personally reviews and approves your profile before it becomes visible to others.</div>
            </div></div>
            <div className={s.processOuter}><div className={s.processCard}>
              <div className={s.processNum}>03</div>
              <div className={s.processIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" fill="rgba(123,31,46,0.1)" stroke="#7B1F2E" strokeWidth="1.5"/><circle cx="11" cy="11" r="3.5" fill="rgba(184,137,42,0.15)"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#B8892A" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </div>
              <div className={s.processTitle}>Meet Our Members</div>
              <div className={s.processText}>Browse verified profiles privately. Show interest to those who match your expectations.</div>
            </div></div>
            <div className={s.processOuter}><div className={s.processCard}>
              <div className={s.processNum}>04</div>
              <div className={s.processIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="rgba(184,137,42,0.15)" stroke="#B8892A" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
              <div className={s.processTitle}>Begin Your Journey</div>
              <div className={s.processText}>When both families show interest, our bureau facilitates the introduction and conversation.</div>
            </div></div>
          </div>
        </section>

        {/* Stories + CTA slide */}
        <div className={s.storiesCtaSlide}>
          <div>
            <div className={s.secHd}>
              <div className={s.ornDivider}><span>✦ &nbsp; &nbsp; ✦</span></div>
              <div className={s.secTag}>Happy Stories</div>
              <div className={s.secTitle}>Thousands of Blessed Unions</div>
              <div className={s.secSub}>Real couples, real happiness — facilitated by Naveen Reddy Marriage Bureau</div>
            </div>
            <div className={s.storiesGrid}>
              <div className={s.storyCard}>
                <div className={s.storyNames}>Priya &amp; Rahul Reddy</div>
                <div className={s.storyYear}>Married · December 2023 · Hyderabad</div>
                <div className={s.storyText}>&ldquo;NRMB&apos;s personal attention made all the difference. Within weeks we found the most perfect match.&rdquo;</div>
              </div>
              <div className={s.storyCard}>
                <div className={s.storyNames}>Ananya &amp; Kiran Reddy</div>
                <div className={s.storyYear}>Married · March 2024 · Bangalore</div>
                <div className={s.storyText}>&ldquo;The verification process gave us complete confidence. Forever grateful for this blessing.&rdquo;</div>
              </div>
              <div className={s.storyCard}>
                <div className={s.storyNames}>Deepa &amp; Vivek Reddy</div>
                <div className={s.storyYear}>Married · August 2023 · London</div>
                <div className={s.storyText}>&ldquo;Elite membership exceeded every expectation. As NRI members this was truly a premium experience.&rdquo;</div>
              </div>
            </div>
          </div>

          {/* CTA band */}
          <section className={s.ctaBand}>
            <div className={s.ctaBandTag}>Begin Your Story</div>
            <div className={s.ctaBandH}>Your Perfect Match Awaits</div>
            <p className={s.ctaBandSub}>
              Join thousands of Reddy families who found lifelong happiness through us.<br />
              Registration is free and takes less than five minutes.
            </p>
            <div className={s.ctaBandBtnWrap}>
              <button type="button" className={s.ctaBandBtn} onClick={() => router.push(signupPath)}>
                Create Your Profile
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className={s.siteFooter}>
          <div className={s.footerGrid}>
            <div className={s.fgBrand}>
              <div className={s.fbLogo}>
                <Image src="/Assets/Logo-transparent.webp" alt="NRMB" width={38} height={38} style={{ objectFit: 'contain' }} />
                <span className={s.fbName}>Naveen Reddy Marriage Bureau</span>
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
