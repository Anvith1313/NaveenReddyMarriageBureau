'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import s from './membership.module.css'

const PLANS = [
  {
    tier: 'Personal Matchmaking',
    badge: 'VIP',
    tagline: 'Begin Your Journey',
    price: '₹15,000',
    period: 'Annual Membership',
    description: 'A dignified introduction to our exclusive community of verified Reddy families — guided by our bureau from the very first step.',
    features: [
      'Complete profile visibility to all members',
      'Browse and discover verified profiles',
      'Express sincere interest to families',
      'Personal bureau matchmaking support',
    ],
    engagement: 'Post-engagement: ₹1,50,000 per individual',
    featured: false,
  },
  {
    tier: 'Executive Matchmaking',
    badge: 'ELITE',
    tagline: 'Our Most Chosen Service',
    price: '₹1,00,000',
    period: 'Annual Membership',
    description: 'Priority matchmaking with a dedicated relationship manager who personally curates introductions suited to your family\'s values and expectations.',
    features: [
      'All Personal Matchmaking benefits',
      'Priority placement in every search',
      'Dedicated personal relationship manager',
      'Exclusive access to NRI Reddy profiles',
    ],
    engagement: 'Post-engagement: ₹3,00,000 per individual',
    featured: true,
  },
  {
    tier: 'Legacy Matchmaking',
    badge: 'VVIP',
    tagline: 'The Complete Experience',
    price: '₹30,000',
    period: 'Annual Membership',
    description: 'Our most comprehensive concierge service — white-glove, personally supervised matchmaking from first introduction through to the day of engagement.',
    features: [
      'All Executive Matchmaking benefits',
      'White-glove concierge at every step',
      'Background verification included',
      'Personally assisted family shortlisting',
    ],
    engagement: 'Post-engagement: ₹10,00,000 per individual',
    featured: false,
  },
]

export default function MobileMembership() {
  const router = useRouter()
  const { user } = useAuth()

  function handleJoin(tier: string) {
    if (!user) { router.push('/m/signup'); return }
    alert(`To enquire about ${tier}, please contact our bureau directly at +91 72079 99985 or +91 98482 21166.`)
  }

  return (
    <div className={s.page}>

      {/* Hero — ivory, no dark gradient */}
      <div className={s.hero}>
        <div className={s.heroOrnament} />
        <div className={s.heroInner}>
          <p className={s.heroEyebrow}>Naveen Reddy Marriage Bureau</p>
          <h1 className={s.heroTitle}>Our Services</h1>
          <p className={s.heroSub}>Concierge matchmaking for the Reddy community — since 2000</p>
          <div className={s.heroDivider} />
        </div>
      </div>

      {/* Intro copy */}
      <div className={s.intro}>
        <p className={s.introText}>
          We do not offer software subscriptions. We offer a personal relationship — with families, with values,
          and with the trust that comes from over two decades of sacred matchmaking service.
        </p>
      </div>

      {/* Service tier cards */}
      <div className={s.cards}>
        {PLANS.map(plan => (
          <div key={plan.tier} className={`${s.card} ${plan.featured ? s.cardFeatured : ''}`}>

            {plan.featured && (
              <div className={s.featuredRibbon}>Most Chosen</div>
            )}

            <div className={s.cardTop}>
              <span className={s.cardBadge}>{plan.badge}</span>
              <h2 className={s.cardTier}>{plan.tier}</h2>
              <p className={s.cardTagline}>{plan.tagline}</p>
            </div>

            <div className={s.cardDivider} />

            <p className={s.cardDescription}>{plan.description}</p>

            <ul className={s.feats}>
              {plan.features.map(f => (
                <li key={f} className={s.feat}>
                  <span className={s.featDot} />
                  {f}
                </li>
              ))}
            </ul>

            <div className={s.cardDivider} />

            <div className={s.priceRow}>
              <span className={s.price}>{plan.price}</span>
              <span className={s.period}>{plan.period}</span>
            </div>

            <p className={s.engagement}>{plan.engagement}</p>

            <button
              type="button"
              className={`${s.btn} ${plan.featured ? s.btnFeatured : ''}`}
              onClick={() => handleJoin(plan.tier)}
            >
              Enquire About {plan.badge}
            </button>
          </div>
        ))}
      </div>

      <div className={s.note}>
        All memberships are subject to personal verification by our bureau team.
        Contact us at <strong>+91 72079 99985</strong> for a confidential conversation.
      </div>

    </div>
  )
}
