'use client'

import s from '../admin.module.css'
import { SectionProps } from '../sectionProps'
import { profileEm, profileName, tsToString } from '../adminTypes'

export default function Dashboard({ profiles, interests, engaged, archived, isSuper }: SectionProps) {
  const mutualCount = interests.filter(i => i.status === 'mutual' || i.status === 'contact_released').length
  const pendingPayment = engaged.filter(e => !e.p1_paid || !e.p2_paid).length

  // Estimate revenue: VVIP=5000, Elite=3000, Premium=1500
  const tierPrice: Record<string, number> = { VVIP: 5000, Elite: 3000, Premium: 1500, VIP: 2000 }
  const revenue = profiles.reduce((sum, p) => sum + (tierPrice[p.tier ?? ''] ?? 0), 0)

  // Recent activity from profiles
  type ActivityEntry = { em: string; name: string; desc: string; ts: string }
  const recentActs: ActivityEntry[] = [
    ...profiles
      .filter(p => p.createdAt)
      .map(p => ({
        em: profileEm(p),
        name: profileName(p),
        desc: 'New member registered',
        ts: tsToString(p.createdAt),
      })),
    ...engaged.map(e => ({
      em: '💍',
      name: `${e.p1?.name ?? '—'} & ${e.p2?.name ?? '—'}`,
      desc: 'Engagement confirmed',
      ts: e.engDate ?? '—',
    })),
  ]
    .sort((a, b) => b.ts.localeCompare(a.ts))
    .slice(0, 8)

  return (
    <div>
      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={s.statNum}>{profiles.length}</div>
          <div className={s.statLabel}>Active Members</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statNum}>{mutualCount}</div>
          <div className={s.statLabel}>Mutual Matches</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statNum}>{engaged.length}</div>
          <div className={s.statLabel}>Engaged Couples</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statNum}>{archived.length}</div>
          <div className={s.statLabel}>Archived Profiles</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statNum}>{pendingPayment}</div>
          <div className={s.statLabel}>Pending Payments</div>
        </div>
        {isSuper && (
          <div className={s.statCard}>
            <div className={s.statNum}>₹{(revenue / 1000).toFixed(0)}k</div>
            <div className={s.statLabel}>Est. Revenue</div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', fontWeight: 600, color: 'var(--a-crimson)', letterSpacing: '0.06em', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
          Recent Activity
        </div>
        <div className={s.actLogFeed}>
          {recentActs.length === 0 ? (
            <div className={s.actLogEmpty}>No recent activity.</div>
          ) : recentActs.map((act, i) => (
            <div key={i} className={s.actLogItem}>
              <div className={s.actLogAvatar}>{act.em}</div>
              <div className={s.actLogMain}>
                <span className={s.actLogName}>{act.name}</span>
                <div className={s.actLogDesc}>{act.desc}</div>
              </div>
              <div className={s.actLogTime}>{act.ts}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
