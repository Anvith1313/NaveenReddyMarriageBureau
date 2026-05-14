'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthProvider'
import s from './membership.module.css'

const PLANS = [
  {
    icon: '👑', tier: 'VIP', price: '₹15,000', period: 'per year',
    features: ['Full profile visibility', 'Browse verified profiles', 'Express interest', 'Bureau matchmaking'],
    engagement: '₹1,50,000 / person post-engagement',
    featured: false,
  },
  {
    icon: '🔱', tier: 'ELITE', price: '₹1,00,000', period: 'per year',
    features: ['All VIP benefits', 'Priority search results', 'Dedicated manager', 'NRI profile access'],
    engagement: '₹3,00,000 / person post-engagement',
    featured: true,
  },
  {
    icon: '💎', tier: 'VVIP', price: '₹30,000', period: 'per year',
    features: ['All Elite benefits', 'White-glove service', 'Background verification', 'Assisted shortlisting'],
    engagement: '₹10,00,000 / person post-engagement',
    featured: false,
  },
]

export default function MobileMembership() {
  const router = useRouter()
  const { user } = useAuth()

  function handleJoin(tier: string) {
    if (!user) { router.push('/signup'); return }
    alert(`Membership upgrade to ${tier} — contact our bureau at +91 72079 99985 to proceed.`)
  }

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.heroTitle}>Membership Plans</div>
          <div className={s.heroTag}>Home | Membership</div>
        </div>
      </div>

      <div className={s.cards}>
        {PLANS.map(plan => (
          <div key={plan.tier} className={`${s.card} ${plan.featured ? s.featured : ''}`}>
            {plan.featured && <div className={s.badge}>Most Popular</div>}
            <div className={s.icon}>{plan.icon}</div>
            <div className={s.tierName}>{plan.tier}</div>
            <div className={s.price}>{plan.price}</div>
            <div className={s.period}>{plan.period}</div>
            <ul className={s.feats}>
              {plan.features.map(f => (
                <li key={f} className={s.feat}><span className={s.check}>✓</span>{f}</li>
              ))}
            </ul>
            <div className={s.engagement}>{plan.engagement}</div>
            <button
              type="button"
              className={`${s.btn} ${plan.featured ? s.btnFeatured : ''}`}
              onClick={() => handleJoin(plan.tier)}
            >
              Join {plan.tier}
            </button>
          </div>
        ))}
      </div>

      <div className={s.note}>
        All memberships are subject to verification by the bureau.
        Payments are processed securely. Contact us for any queries.
      </div>
    </div>
  )
}
