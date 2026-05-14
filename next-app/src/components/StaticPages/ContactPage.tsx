'use client'
import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/AuthProvider'
import s from './static.module.css'

const BRANCHES = ['Somajiguda (Main)', 'Kothapet', 'Warangal', 'Karimnagar']
const PURPOSES = ['Profile Registration', 'Profile Review', 'Match Discussion', 'Upgrade Membership', 'Engagement Follow-up', 'General Enquiry']

function isTuesday(dateStr: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr).getDay() === 2
}

function minDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function ContactPage({ desktop = false }: { desktop?: boolean }) {
  const { user, profile: me } = useAuth()
  const [apptName, setApptName] = useState((me?.name as string) ?? '')
  const [apptMob, setApptMob] = useState((me?.mobile as string) ?? '')
  const [apptBranch, setApptBranch] = useState('')
  const [apptDate, setApptDate] = useState('')
  const [apptTime, setApptTime] = useState('')
  const [apptPurpose, setApptPurpose] = useState('')
  const [apptMsg, setApptMsg] = useState('')
  const [apptLoading, setApptLoading] = useState(false)
  const [apptToast, setApptToast] = useState('')

  function toast(msg: string) {
    setApptToast(msg)
    setTimeout(() => setApptToast(''), 3500)
  }

  async function bookAppointment() {
    if (!apptName.trim() || !apptMob.trim() || !apptBranch || !apptDate) {
      toast('Please fill in Name, Mobile, Branch and Date.')
      return
    }
    if (isTuesday(apptDate)) {
      toast('Tuesdays are our weekly off — please choose another day.')
      return
    }
    setApptLoading(true)
    try {
      await addDoc(collection(db, 'appointments'), {
        name: apptName.trim(),
        mob: apptMob.trim(),
        branch: apptBranch,
        date: apptDate,
        time: apptTime,
        purpose: apptPurpose,
        msg: apptMsg.trim(),
        uid: user?.uid ?? '',
        username: (me?.u as string) ?? 'guest',
        status: 'pending',
        ts: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      toast('✅ Appointment requested! We will call you to confirm.')
      setApptName(''); setApptMob(''); setApptBranch('')
      setApptDate(''); setApptTime(''); setApptPurpose(''); setApptMsg('')
    } catch {
      toast('Could not save — please call us directly: +91 72079 99985')
    }
    setApptLoading(false)
  }

  return (
    <div className={`${s.page} ${desktop ? s.pageDesktop : ''}`}>
      <div className={`${s.hero} ${desktop ? s.heroDesktop : ''}`}>
        <div className={s.heroInner}>
          <div className={`${s.heroTitle} ${desktop ? s.heroTitleDesktop : ''}`}>Contact Us</div>
          <div className={s.heroTag}>Home | Contact</div>
        </div>
      </div>

      <div className={`${s.inner} ${desktop ? s.innerDesktop : ''}`}>
        <div className={s.secHd}>
          <div className={s.secTag}>Get in Touch</div>
          <div className={s.secTitle}>We Are Here for You</div>
        </div>

        <div className={`${s.contactGrid} ${desktop ? s.contactGridDesktop : ''}`}>
          <div className={s.ciCard} onClick={() => window.open('https://maps.app.goo.gl/GBsdFySAJ2pNANFw9?g_st=iw', '_blank')}>
            <span className={s.ciIcon}>📍</span>
            <div className={s.ciLabel}>Head Office</div>
            <div className={s.ciVal}>G-6 Amruthaville, Opp. Yashoda Hospital,<br />Somajiguda, Hyderabad — 500 082</div>
          </div>
          <div className={s.ciCard}>
            <span className={s.ciIcon}>📞</span>
            <div className={s.ciLabel}>Phone &amp; Mobile</div>
            <div className={s.ciVal}>
              <a href="tel:+917207999985" className={s.ciLink}>+91 72079 99985</a>
              <a href="tel:+919848221166" className={s.ciLinkMt}>+91 98482 21166</a>
            </div>
          </div>
          <div className={s.ciCard} onClick={() => { window.location.href = 'mailto:naveenreddy0033@yahoo.com' }}>
            <span className={s.ciIcon}>✉</span>
            <div className={s.ciLabel}>Email</div>
            <div className={s.ciVal}>naveenreddy0033@yahoo.com</div>
          </div>
          <div className={s.ciCard}>
            <span className={s.ciIcon}>🕐</span>
            <div className={s.ciLabel}>Working Hours</div>
            <div className={s.ciVal}>Mon–Sun: 10:00 AM – 6:30 PM<br /><em className={s.apptNote}>Tuesday: Weekly Off</em></div>
          </div>
          <div className={s.ciCard}>
            <span className={s.ciIcon}>👤</span>
            <div className={s.ciLabel}>Head of Bureau</div>
            <div className={s.ciVal}>Mr. Naveen Reddy Ravula</div>
          </div>
        </div>

        {/* ── Appointment Booking ── */}
        <div className={s.apptSection}>
          <div className={`${s.secHd} ${s.apptSecHdMt}`}>
            <div className={s.secTag}>Book a Visit</div>
            <div className={s.secTitle}>Request an Appointment</div>
            <div className={s.secSub}>Visit any of our branches for a personal consultation. We will call you to confirm your slot.</div>
          </div>

          {apptToast && (
            <div className={`${s.apptToast} ${apptToast.startsWith('✅') ? s.apptToastOk : s.apptToastErr}`}>
              {apptToast}
            </div>
          )}

          <div className={s.apptForm}>
            <div className={s.apptGrid}>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Full Name *</label>
                <input
                  className={s.apptInput}
                  type="text"
                  value={apptName}
                  onChange={e => setApptName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Mobile Number *</label>
                <input
                  className={s.apptInput}
                  type="tel"
                  value={apptMob}
                  onChange={e => setApptMob(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Branch *</label>
                <select className={s.apptSelect} value={apptBranch} onChange={e => setApptBranch(e.target.value)} aria-label="Branch">
                  <option value="">Select Branch</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Preferred Date * <span className={s.apptNote}>(Tuesdays off)</span></label>
                <input
                  className={`${s.apptInput} ${isTuesday(apptDate) ? s.apptInputErr : ''}`}
                  type="date"
                  value={apptDate}
                  min={minDate()}
                  onChange={e => setApptDate(e.target.value)}
                />
                {isTuesday(apptDate) && <span className={s.apptErrMsg}>Tuesdays are weekly off — please choose another day.</span>}
              </div>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Preferred Time <span className={s.apptNote}>(optional)</span></label>
                <select className={s.apptSelect} value={apptTime} onChange={e => setApptTime(e.target.value)} aria-label="Preferred Time">
                  <option value="">Any time (10am–6:30pm)</option>
                  {['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM',
                    '1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
                    '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className={s.apptField}>
                <label className={s.apptLabel}>Purpose <span className={s.apptNote}>(optional)</span></label>
                <select className={s.apptSelect} value={apptPurpose} onChange={e => setApptPurpose(e.target.value)} aria-label="Purpose">
                  <option value="">Select Purpose</option>
                  {PURPOSES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className={`${s.apptField} ${s.apptSpan}`}>
                <label className={s.apptLabel}>Message <span className={s.apptNote}>(optional)</span></label>
                <textarea
                  className={s.apptTextarea}
                  value={apptMsg}
                  onChange={e => setApptMsg(e.target.value)}
                  placeholder="Any specific questions or requirements…"
                  rows={3}
                />
              </div>
            </div>
            <button type="button" className={s.apptBtn} onClick={bookAppointment} disabled={apptLoading}>
              {apptLoading ? 'Requesting…' : 'Request Appointment →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
