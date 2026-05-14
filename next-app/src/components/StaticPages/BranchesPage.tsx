'use client'

import { useState } from 'react'
import s from './static.module.css'

const BRANCHES = [
  {
    id: 'hyd',
    city: 'Somajiguda',
    state: 'Hyderabad — Head Office',
    address: 'G-6 Amruthaville, Opp. Yashoda Hospital, Somajiguda, Hyderabad — 500 082',
    phone: '+91 72079 99985',
    mapsUrl: 'https://maps.app.goo.gl/GBsdFySAJ2pNANFw9?g_st=iw',
    svgId: 'sky1',
    svgContent: (
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" className={s.branchSvg}>
        <defs><linearGradient id="bsky1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDF3E0"/><stop offset="100%" stopColor="#FAF0E6"/></linearGradient></defs>
        <rect width="220" height="130" fill="url(#bsky1)"/>
        <ellipse cx="110" cy="112" rx="22" ry="8" fill="#7B1F2E" opacity="0.85"/>
        <rect x="95" y="94" width="30" height="20" rx="3" fill="#7B1F2E" opacity="0.85"/>
        <ellipse cx="110" cy="90" rx="18" ry="6" fill="#7B1F2E"/>
        <path d="M96,89 Q102,55 118,89 Z" fill="#7B1F2E"/>
        <circle cx="110" cy="56" r="13" fill="#7B1F2E"/>
        <ellipse cx="110" cy="44" rx="6" ry="9" fill="#7B1F2E"/>
      </svg>
    ),
  },
  {
    id: 'ktp',
    city: 'Kothapet',
    state: 'Dilsukhnagar, Hyderabad',
    address: 'Kothapet Branch, Dilsukhnagar, Hyderabad',
    phone: '+91 72079 99985',
    mapsUrl: 'https://maps.google.com',
    svgContent: (
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" className={s.branchSvg}>
        <defs><linearGradient id="bsky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FDF8EC"/><stop offset="100%" stopColor="#FAF0E6"/></linearGradient></defs>
        <rect width="220" height="130" fill="url(#bsky2)"/>
        <rect x="88" y="68" width="44" height="52" fill="#7B1F2E" opacity="0.85"/>
        <path d="M96,118 L96,85 Q110,72 124,85 L124,118 Z" fill="url(#bsky2)"/>
        <rect x="60" y="80" width="14" height="40" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="67" cy="76" rx="5" ry="5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M64,72 L67,62 L70,72Z" fill="#B8892A"/>
        <rect x="146" y="80" width="14" height="40" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="153" cy="76" rx="5" ry="5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M150,72 L153,62 L156,72Z" fill="#B8892A"/>
      </svg>
    ),
  },
  {
    id: 'wgl',
    city: 'Warangal',
    state: 'Hanamkonda, Telangana',
    address: 'Hanamkonda, Warangal, Telangana',
    phone: '+91 72079 99985',
    mapsUrl: 'https://maps.google.com',
    svgContent: (
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" className={s.branchSvg}>
        <defs><linearGradient id="bsky3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFF5F5"/><stop offset="100%" stopColor="#FAEAE6"/></linearGradient></defs>
        <rect width="220" height="130" fill="url(#bsky3)"/>
        <rect x="88" y="60" width="22" height="58" rx="2" fill="#7B1F2E" opacity="0.9"/>
        <path d="M88,80 Q99,44 110,80" fill="none" stroke="#7B1F2E" strokeWidth="10" strokeLinecap="round" opacity="0.9"/>
        <path d="M96,55 L99,40 L102,55Z" fill="#B8892A"/>
        <circle cx="99" cy="39" r="4" fill="#D4AF37"/>
        <rect x="110" y="60" width="22" height="58" rx="2" fill="#7B1F2E" opacity="0.9"/>
        <path d="M110,80 Q121,44 132,80" fill="none" stroke="#7B1F2E" strokeWidth="10" strokeLinecap="round" opacity="0.9"/>
        <path d="M118,55 L121,40 L124,55Z" fill="#B8892A"/>
        <circle cx="121" cy="39" r="4" fill="#D4AF37"/>
      </svg>
    ),
  },
  {
    id: 'krm',
    city: 'Karimnagar',
    state: 'Telangana',
    address: 'Karimnagar, Telangana',
    phone: '+91 72079 99985',
    mapsUrl: 'https://maps.google.com',
    svgContent: (
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" className={s.branchSvg}>
        <defs><linearGradient id="bsky4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FEF9EC"/><stop offset="100%" stopColor="#FAF0E0"/></linearGradient></defs>
        <rect width="220" height="130" fill="url(#bsky4)"/>
        <path d="M85,72 L85,58 L90,58 L90,62 L96,62 L96,58 L102,58 L102,62 L108,62 L108,58 L112,58 L112,62 L118,62 L118,58 L124,58 L124,62 L130,62 L130,58 L135,58 L135,72Z" fill="#7B1F2E" opacity="0.88"/>
        <rect x="82" y="72" width="56" height="8" rx="1" fill="#7B1F2E" opacity="0.85"/>
        <rect x="78" y="54" width="14" height="26" rx="2" fill="#9B2F40" opacity="0.85"/>
        <rect x="128" y="54" width="14" height="26" rx="2" fill="#9B2F40" opacity="0.85"/>
        <line x1="110" y1="47" x2="110" y2="28" stroke="#B8892A" strokeWidth="1.5"/>
        <path d="M110,28 L122,33 L110,38Z" fill="#D4AF37"/>
      </svg>
    ),
  },
]

export default function BranchesPage({ desktop = false }: { desktop?: boolean }) {
  const [selected, setSelected] = useState<typeof BRANCHES[0] | null>(null)

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroInner}>
          <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>Our Branches</div>
          <div className={s.heroTag}>Home | Our Branches</div>
        </div>
      </div>

      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        <div className={s.secHd}>
          <div className={s.secTag}>Serving You Throughout Telangana</div>
          <div className={s.secTitle}>Our Branch Offices</div>
          <div className={s.secSub}>
            All profiles registered at <em>any branch</em> are accessible through every branch.
            Visit <strong>any office</strong> regardless of where your profile was registered.
            <br /><strong>Please call the branch before visiting.</strong>
          </div>
        </div>

        <div className={`${s.branchGrid} ${desktop ? s.branchGridDesktop : ''}`}>
          {BRANCHES.map(branch => (
            <div key={branch.id} className={s.branchCard} onClick={() => setSelected(branch)}>
              {branch.svgContent}
              <div className={s.branchCity}>{branch.city}</div>
              <div className={s.branchState}>{branch.state}</div>
              <div className={s.branchTap}>Tap to view details →</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className={s.overlay} onClick={() => setSelected(null)}>
          <div className={`${s.sheet} ${desktop ? s.sheetDesktop : ''}`} onClick={e => e.stopPropagation()}>
            <div className={s.shHdr}>
              <div className={s.shTitle}>{selected.city}</div>
              <button type="button" className={s.shClose} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={s.shBody}>
              <div className={s.shRow}><span className={s.shLabel}>Location</span><span>{selected.state}</span></div>
              <div className={s.shRow}><span className={s.shLabel}>Address</span><span>{selected.address}</span></div>
              <div className={s.shRow}><span className={s.shLabel}>Phone</span><span><a href={`tel:${selected.phone}`} style={{ color: 'var(--crimson)', textDecoration: 'none' }}>{selected.phone}</a></span></div>
              <div className={s.shRow}><span className={s.shLabel}>Hours</span><span>Mon–Sun 10am–6:30pm<br /><em style={{ color: 'var(--gold)' }}>Tuesday: Weekly Off</em></span></div>
              <button type="button" className={s.btnMap} onClick={() => window.open(selected.mapsUrl, '_blank')}>
                Open in Maps →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
