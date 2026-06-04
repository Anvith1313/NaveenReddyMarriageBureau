'use client'
import Image from 'next/image'
import s from './static.module.css'

export default function AboutPage({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroInner}>
          <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>About Us</div>
          <div className={s.heroTag}>Home &nbsp;|&nbsp; About</div>
        </div>
      </div>

      {/* ── Who we are ── */}
      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        <div className={s.secHd}>
          <div className={s.secTag}>Our Story</div>
          <div className={s.secTitle}>Making Happy Marriages Since 2000</div>
          <div className={s.secSub}>
            A sacred tradition of trust, honour and blessed unions for the Reddy community.
          </div>
        </div>

        <div className={`${s.aboutGrid} ${desktop ? s.aboutGridDesktop : ''}`}>
          <div className={s.aboutText}>
            <p>
              Naveen Reddy Marriage Bureau was established in <strong>2000 in Hyderabad, Telangana</strong>,
              with a single sacred mission — to facilitate blessed unions within the Reddy community
              with honour, trust and absolute privacy.
            </p>
            <p>
              For over two decades, we have been the <strong>most trusted name in Reddy matrimony</strong>.
              Our personalised, high-touch approach to matchmaking sets us apart from any digital platform.
              We do not merely connect profiles — we nurture relationships that honour family values and cultural heritage.
            </p>
            <p>
              Every profile is <strong>personally verified by our counsellors</strong>. Every match
              is made with care and discretion. Every union we facilitate carries our name and honour.
            </p>
            <p>
              <strong>One Network, Four Branches:</strong> All profiles registered at any branch —
              Somajiguda, Kothapet, Warangal or Karimnagar — are accessible through every branch.
              Our entire member database is unified throughout Telangana.
            </p>
          </div>
          <div className={s.aboutLogoWrap}>
            <div className={s.aboutOrnament}>
              <Image
                src="/Assets/Logo-transparent.webp"
                alt="Naveen Reddy Marriage Bureau"
                width={130}
                height={130}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>

        {/* Stats highlights */}
        <div className={`${s.hlWrap} ${s.aboutHighlights} ${desktop ? s.aboutHighlightsDesktop : ''}`}>
          {[
            { num: '10,000+', label: 'Profiles Registered' },
            { num: '4,500+',  label: 'Successful Matches' },
            { num: '25+',     label: 'Years of Trust' },
            { num: '4',       label: 'Branch Offices' },
          ].map(h => (
            <div key={h.label} className={s.hlCard}>
              <div className={s.hlNum}>{h.num}</div>
              <div className={s.hlLabel}>{h.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Our Values ── */}
      <div className={s.valuesSection}>
        <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
          <div className={s.secHd}>
            <div className={s.secTag}>Why Choose Us</div>
            <div className={s.secTitle}>The NRMB Promise</div>
          </div>

          <div className={`${s.valuesGrid} ${desktop ? s.valuesGridDesktop : ''}`}>
            {[
              { icon: '🛡️', title: '100% Verified Profiles',  text: 'Every member is personally interviewed and verified by our counsellors before their profile is made visible.' },
              { icon: '🔒', title: 'Complete Privacy',         text: 'Contact details are never shared without mutual consent and bureau approval. Your privacy is sacred to us.' },
              { icon: '🤝', title: 'Dedicated Counsellor',     text: 'Each family is assigned a personal matrimony counsellor who guides you through the entire journey.' },
            ].map(v => (
              <div key={v.title} className={`${s.card} ${s.valCard}`}>
                <div className={s.valIcon}>{v.icon}</div>
                <div className={s.valTitle}>{v.title}</div>
                <div className={s.valText}>{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
