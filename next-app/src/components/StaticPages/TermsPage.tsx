'use client'
import s from './static.module.css'

export default function TermsPage({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroInner}>
          <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>Terms &amp; Conditions</div>
          <div className={s.heroTag}>Home | Terms</div>
        </div>
      </div>

      <div className={s.legalBody}>
        <section className={s.legalSection}>
          <h2>1. Eligibility</h2>
          <p>Membership is exclusively for Reddy community members of Hindu religion. Misrepresentation of community, religion, or any personal details results in immediate termination of membership without refund.</p>
        </section>

        <section className={s.legalSection}>
          <h2>2. Membership Fees (Non-Refundable)</h2>
          <ul className={s.legalList}>
            <li><strong>VIP</strong> — ₹15,000 per year</li>
            <li><strong>Elite</strong> — ₹1,00,000 per year</li>
            <li><strong>VVIP</strong> — ₹30,000 per year</li>
          </ul>
          <p>All membership fees are strictly non-refundable once payment is made and profile is activated.</p>
        </section>

        <section className={s.legalSection}>
          <h2>3. Mandatory Post-Engagement Fee</h2>
          <p>Upon engagement facilitated by NRMB, each individual must pay their respective post-engagement fee within 7 days of the engagement:</p>
          <ul className={s.legalList}>
            <li><strong>VIP</strong> — ₹1,50,000 per person</li>
            <li><strong>Elite</strong> — ₹3,00,000 per person</li>
            <li><strong>VVIP</strong> — ₹10,00,000 per person</li>
          </ul>
          <p>Non-payment of the post-engagement fee may result in legal action as per applicable law.</p>
        </section>

        <section className={s.legalSection}>
          <h2>4. Privacy & Contact Policy</h2>
          <p>Contact details (mobile number and email) will NOT be shared unless both parties express mutual interest AND the bureau administrator explicitly approves the release. This is a mandatory two-step verification process.</p>
        </section>

        <section className={s.legalSection}>
          <h2>5. Profile Viewing Restriction (3-Account Rule)</h2>
          <p>A member's profile may be viewed by a maximum of 3 unique accounts at any time. Once 3 members have viewed a profile, it will not be shown to others until one of the viewing members removes or closes their interest.</p>
        </section>

        <section className={s.legalSection}>
          <h2>6. Profile Hold — Mutual Interest</h2>
          <p>When two members express mutual interest in each other, both profiles are placed on exclusive hold and removed from all other active searches. This hold remains in effect until the match is either finalised or dissolved by an administrator.</p>
        </section>

        <section className={s.legalSection}>
          <h2>7. Match Finalisation</h2>
          <p>Once an engagement is confirmed and recorded by the bureau, both profiles are permanently removed from the active member pool and archived.</p>
        </section>

        <section className={s.legalSection}>
          <h2>8. Code of Conduct</h2>
          <p>All members are required to treat other members and bureau staff with dignity, honesty, and respect. Any form of harassment, misuse of contact information, or fraudulent activity will result in immediate membership termination and may be reported to law enforcement.</p>
        </section>

        <section className={s.legalSection}>
          <h2>9. Bureau's Right to Refuse</h2>
          <p>The bureau reserves the right to refuse or revoke membership at its sole discretion if it believes a member has violated these terms or misrepresented themselves.</p>
        </section>

        <section className={s.legalSection}>
          <h2>10. Governing Law & Jurisdiction</h2>
          <p>These terms are governed by the laws of Telangana, India. Any disputes arising from membership are subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.</p>
        </section>

        <p className={s.legalUpdated}>Last updated: January 2025</p>
      </div>
    </div>
  )
}
