'use client'

import { useState, useEffect, useCallback } from 'react'
import s from './admin.module.css'
import { ACRED, AdminCred, AdminSection, AdminProfile, AdminInterest, AdminEngaged } from './adminTypes'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Dashboard from './sections/Dashboard'
import Profiles from './sections/Profiles'
import AddOffline from './sections/AddOffline'
import Interests from './sections/Interests'
import MutualMatches from './sections/MutualMatches'
import EngagedCouples from './sections/EngagedCouples'
import EditRequests from './sections/EditRequests'
import Appointments from './sections/Appointments'
import Stories from './sections/Stories'
import ActivityLog from './sections/ActivityLog'
import Archived from './sections/Archived'

const SEC_TITLES: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  profiles: 'All Member Profiles',
  addOffline: 'Add Offline Member',
  interests: 'All Interest Records',
  mutual: 'Mutual Matches',
  engaged: 'Engaged Couples',
  editReqs: 'Member Edit Requests',
  appointments: 'Appointments',
  stories: 'Pending Stories',
  activity: 'Activity Log',
  archived: 'Archived Profiles',
}

interface ToastState { msg: string; key: number }

export default function AdminPortal() {
  const [admin, setAdmin] = useState<AdminCred | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  // Shared data loaded once
  const [profiles, setProfiles] = useState<AdminProfile[]>([])
  const [interests, setInterests] = useState<AdminInterest[]>([])
  const [engaged, setEngaged] = useState<AdminEngaged[]>([])
  const [archived, setArchived] = useState<AdminProfile[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem('nrmb_admin')
    if (saved) {
      try {
        const cred = JSON.parse(saved) as AdminCred
        const match = ACRED.find(a => a.u === cred.u && a.p === cred.p)
        if (match) setAdmin(match)
      } catch { /* invalid */ }
    }
  }, [])

  // Load data after login
  useEffect(() => {
    if (admin && !dataLoaded) loadAllData()
  }, [admin]) // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = useCallback((msg: string) => {
    setToast({ msg, key: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }, [])

  async function loadAllData() {
    try {
      // Profiles (skip deleted/merged)
      const profSnap = await getDocs(collection(db, 'users'))
      const profs: AdminProfile[] = []
      profSnap.forEach(d => {
        const data = d.data()
        if (data.status === 'deleted' || data.status === 'merged') return
        profs.push({ ...data, uid: d.id, u: data.u || d.id } as AdminProfile)
      })
      setProfiles(profs)

      // Interests
      const intSnap = await getDocs(collection(db, 'interests'))
      const ints: AdminInterest[] = []
      const seen = new Set<string>()
      intSnap.forEach(d => {
        const i = d.data()
        const key = `${i.from}_${i.to}`
        if (!seen.has(key)) { seen.add(key); ints.push({ ...i, _docId: d.id } as AdminInterest) }
      })
      setInterests(ints)

      // Engaged
      const engSnap = await getDocs(collection(db, 'engagements'))
      const engs: AdminEngaged[] = []
      engSnap.forEach(d => engs.push({ ...d.data(), docId: d.id } as AdminEngaged))
      setEngaged(engs)

      // Archived
      const archSnap = await getDocs(query(collection(db, 'users'), where('status', '==', 'archived')))
      const archs: AdminProfile[] = []
      archSnap.forEach(d => archs.push({ ...d.data(), uid: d.id } as AdminProfile))
      setArchived(archs)

      setDataLoaded(true)
      showToast(`✅ ${profs.length} profiles loaded`)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      showToast('Firebase error: ' + msg)
    }
  }

  function handleLogin() {
    setLoginError('')
    const match = ACRED.find(a => a.u === username && a.p === password)
    if (!match) { setLoginError('Invalid credentials. Please try again.'); return }
    setAdmin(match)
    sessionStorage.setItem('nrmb_admin', JSON.stringify(match))
  }

  function handleLogout() {
    setAdmin(null)
    sessionStorage.removeItem('nrmb_admin')
    setDataLoaded(false)
    setProfiles([])
    setInterests([])
    setEngaged([])
    setArchived([])
  }

  function goSection(sec: AdminSection) {
    setSection(sec)
    setMobileSidebarOpen(false)
  }

  if (!admin) {
    return (
      <div className={s.loginWrap}>
        <div className={s.loginCard}>
          <div className={s.loginLogo}>
            <span style={{ fontSize: '3rem' }}>👑</span>
          </div>
          <div className={s.loginTitle}>NRMB Admin Portal</div>
          <div className={s.loginSub}>Restricted access — authorised staff only</div>
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Username</label>
            <input
              className={s.inputField}
              type="text"
              placeholder="nrmb_username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="username"
            />
          </div>
          <div className={s.inputGroup}>
            <label className={s.inputLabel}>Password</label>
            <input
              className={s.inputField}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="current-password"
            />
          </div>
          <button className={s.btnLux} onClick={handleLogin}>Access Admin Portal</button>
          {loginError && <div className={s.loginError}>{loginError}</div>}
        </div>
      </div>
    )
  }

  const mutualCount = interests.filter(i => i.status === 'mutual' || i.status === 'contact_released').length

  const sidebarContent = (
    <>
      <div className={s.sbLogo}><span style={{ fontSize: '2.5rem' }}>👑</span></div>
      <div className={s.sbBrand}>NRMB Admin</div>
      <div className={s.sbEst}>{admin.branch}</div>

      <div className={s.sbSectionLabel}>Members</div>
      <button className={`${s.sbBtn} ${section === 'dashboard' ? s.sbBtnActive : ''}`} onClick={() => goSection('dashboard')}>📊 &nbsp;Dashboard</button>
      <button className={`${s.sbBtn} ${section === 'profiles' ? s.sbBtnActive : ''}`} onClick={() => goSection('profiles')}>
        👥 &nbsp;All Profiles <span className={s.sbBadge}>{profiles.length}</span>
      </button>
      <button className={`${s.sbBtn} ${section === 'addOffline' ? s.sbBtnActive : ''}`} onClick={() => goSection('addOffline')}>➕ &nbsp;Add Offline Member</button>

      <div className={s.sbSectionLabel}>Matchmaking</div>
      <button className={`${s.sbBtn} ${section === 'interests' ? s.sbBtnActive : ''}`} onClick={() => goSection('interests')}>
        💌 &nbsp;All Interests <span className={s.sbBadge}>{interests.length}</span>
      </button>
      <button className={`${s.sbBtn} ${section === 'mutual' ? s.sbBtnActive : ''}`} onClick={() => goSection('mutual')}>
        ❤ &nbsp;Mutual Matches {mutualCount > 0 && <span className={s.sbBadge}>{mutualCount}</span>}
      </button>

      <div className={s.sbSectionLabel}>Records</div>
      <button className={`${s.sbBtn} ${section === 'engaged' ? s.sbBtnActive : ''}`} onClick={() => goSection('engaged')}>💍 &nbsp;Engaged Couples</button>
      <button className={`${s.sbBtn} ${section === 'editReqs' ? s.sbBtnActive : ''}`} onClick={() => goSection('editReqs')}>✏ &nbsp;Edit Requests</button>
      <button className={`${s.sbBtn} ${section === 'appointments' ? s.sbBtnActive : ''}`} onClick={() => goSection('appointments')}>📅 &nbsp;Appointments</button>
      <button className={`${s.sbBtn} ${section === 'stories' ? s.sbBtnActive : ''}`} onClick={() => goSection('stories')}>💐 &nbsp;Pending Stories</button>
      <button className={`${s.sbBtn} ${section === 'activity' ? s.sbBtnActive : ''}`} onClick={() => goSection('activity')}>📋 &nbsp;Activity Log</button>
      <button className={`${s.sbBtn} ${section === 'archived' ? s.sbBtnActive : ''}`} onClick={() => goSection('archived')}>🗄 &nbsp;Archived</button>

      <button className={s.logoutBtn} onClick={handleLogout}>🚪 &nbsp;Sign Out</button>
    </>
  )

  const sharedProps = { profiles, interests, engaged, archived, showToast, isSuper: admin.role === 'superadmin', setProfiles, setInterests, setEngaged, setArchived }

  return (
    <div className={s.appWrap}>
      {/* Mobile topbar */}
      <div className={s.mobileTopbar}>
        <button className={s.mobileHamb} onClick={() => setMobileSidebarOpen(true)}>☰</button>
        <span className={s.mobileBrand}>NRMB Admin</span>
        <span />
      </div>

      {/* Sidebar overlay (mobile) */}
      {mobileSidebarOpen && (
        <div className={`${s.sidebarOverlay} ${s.sidebarOverlayOpen}`} onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`${s.sidebar} ${mobileSidebarOpen ? s.sidebarOpen : ''}`}>
        {sidebarContent}
      </nav>

      {/* Main */}
      <main className={s.main}>
        <div className={s.topbar}>
          <div className={s.topbarTitle}>{SEC_TITLES[section]}</div>
          <div className={s.topbarMeta}>{admin.branch} · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>

        {section === 'dashboard' && <Dashboard {...sharedProps} />}
        {section === 'profiles' && <Profiles {...sharedProps} />}
        {section === 'addOffline' && <AddOffline {...sharedProps} />}
        {section === 'interests' && <Interests {...sharedProps} />}
        {section === 'mutual' && <MutualMatches {...sharedProps} />}
        {section === 'engaged' && <EngagedCouples {...sharedProps} />}
        {section === 'editReqs' && <EditRequests {...sharedProps} />}
        {section === 'appointments' && <Appointments {...sharedProps} />}
        {section === 'stories' && <Stories {...sharedProps} />}
        {section === 'activity' && <ActivityLog {...sharedProps} />}
        {section === 'archived' && <Archived {...sharedProps} />}
      </main>

      {/* Toast */}
      {toast && (
        <div key={toast.key} className={s.toast}>{toast.msg}</div>
      )}
    </div>
  )
}
