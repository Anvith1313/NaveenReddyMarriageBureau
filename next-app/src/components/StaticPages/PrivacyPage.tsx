'use client'
import s from './static.module.css'

export default function PrivacyPage({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={s.pageHeader}>
        <div className={s.pageEyebrow}>Legal</div>
        <h1 className={s.pageTitle}>Privacy Policy</h1>
        <p className={s.pageSub}>Naveen Reddy Marriage Bureau — How we protect your data</p>
      </div>

      <div className={s.legalBody}>
        <section className={s.legalSection}>
          <h2>1. Information We Collect</h2>
          <p>We collect personal information you provide during registration including name, date of birth, contact details, educational and professional background, family details, and partner preferences. We also collect photos you upload and messages exchanged through our platform.</p>
        </section>

        <section className={s.legalSection}>
          <h2>2. How We Use Your Information</h2>
          <p>Your information is used exclusively to facilitate matrimonial matchmaking within our bureau. We use your profile data to suggest compatible matches, manage appointment scheduling, and communicate important updates regarding your membership.</p>
        </section>

        <section className={s.legalSection}>
          <h2>3. Contact Information Sharing</h2>
          <p>Your mobile number and email address will NOT be shared with other members unless: (a) both parties express mutual interest AND (b) a bureau administrator explicitly approves the release. This dual-approval system ensures your privacy at all times.</p>
        </section>

        <section className={s.legalSection}>
          <h2>4. Profile Visibility</h2>
          <p>Your profile is visible only to active, verified members of the opposite gender within our bureau. Under our 3-Account Rule, a member's profile may be viewed by a maximum of 3 unique accounts at any time, protecting exclusivity.</p>
        </section>

        <section className={s.legalSection}>
          <h2>5. Data Security</h2>
          <p>All data is stored securely on Google Firebase (Firestore), hosted on Google Cloud infrastructure. We use industry-standard encryption for data in transit and at rest. Access to member data is restricted to authorized bureau staff only.</p>
        </section>

        <section className={s.legalSection}>
          <h2>6. Photographs</h2>
          <p>Photos you upload are stored securely and visible only to active members. We do not use your photographs for any marketing or advertising purposes without your explicit consent.</p>
        </section>

        <section className={s.legalSection}>
          <h2>7. Data Retention</h2>
          <p>Your data is retained for the duration of your active membership. Upon membership expiry or account closure, your data will be archived for a period of 2 years in compliance with legal requirements, after which it will be permanently deleted.</p>
        </section>

        <section className={s.legalSection}>
          <h2>8. Third-Party Services</h2>
          <p>We use Google Firebase for authentication and data storage, and Razorpay for payment processing. These providers have their own privacy policies and comply with applicable data protection laws. We do not sell your data to any third party.</p>
        </section>

        <section className={s.legalSection}>
          <h2>9. Your Rights</h2>
          <p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at the bureau office or via the contact details below. Profile deletion requests are processed within 7 business days.</p>
        </section>

        <section className={s.legalSection}>
          <h2>10. Contact</h2>
          <p>For privacy-related inquiries: <strong>Naveen Reddy Marriage Bureau, Somajiguda, Hyderabad, Telangana — 500082</strong>. Phone: +91 9966 11 5050.</p>
        </section>

        <p className={s.legalUpdated}>Last updated: January 2025</p>
      </div>
    </div>
  )
}
