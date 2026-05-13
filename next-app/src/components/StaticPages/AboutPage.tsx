'use client'
import s from './static.module.css'

export default function AboutPage({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroTag}>Who We Are</div>
        <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>About Us</div>
      </div>

      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        <div className={s.secHd}>
          <div className={s.secTag}>Our Story</div>
          <div className={s.secTitle}>Making Happy Marriages Since 2000</div>
        </div>

        <div className={`${s.aboutGrid} ${desktop ? s.aboutGridDesktop : ''}`}>
          <div className={s.aboutText}>
            <p>Naveen Reddy Marriage Bureau was established in 2000 in Hyderabad, Telangana, with a single sacred mission — to facilitate blessed unions within the Reddy community with honour, trust and absolute privacy.</p>
            <p>For over two decades, we have been the most trusted name in Reddy matrimony. Our personalised, high-touch approach to matchmaking sets us apart from digital platforms.</p>
            <p>Every profile is personally verified. Every match is made with care. Every union we facilitate carries our name and honour.</p>
            <p><strong>One Network, Four Branches:</strong> All profiles registered at any branch — Somajiguda, Kothapet, Warangal or Karimnagar — are accessible through every branch. You can visit any office closest to you, regardless of where your profile was registered. Our entire member database is unified throughout Telangana.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={s.aboutOrnament}>
              <span className={s.aboutOrnamentEmoji}>💍</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
