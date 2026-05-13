# HTML-to-Next.js Conversion Workflow

**Objective**: Systematically convert the Reddy Elite Matrimony platform from vanilla HTML/CSS/JS to a Next.js (React/TypeScript) app while preserving all functionality, maintaining Firebase compatibility, and ensuring cross-site consistency.

**Scope**: Main site, Admin portal, Mobile views + shared utilities

**Success Criteria**:
- ✅ All pages render without errors
- ✅ Firebase auth, Firestore, and Realtime DB operations work
- ✅ Responsive design holds across all breakpoints
- ✅ All interactive features (browse, like, book appointments, etc.) functional
- ✅ Admin panel stats and member management operational
- ✅ Zero breaking changes to user experience or data flow

---

## Phase 1: Foundation Setup

### 1.1 Environment & Dependencies
- **Status**: [Not Started / In Progress / Complete]
- **Task**: Ensure Next.js project is initialized with:
  - TypeScript enabled
  - Tailwind CSS configured
  - Firebase packages installed (`firebase`, `firebase-admin`)
  - Required dependencies: GSAP, Lottie, Razorpay SDK, Google Sign-In
  - ESLint and Prettier configured

**Checklist**:
- [ ] `next-app/package.json` has all Firebase packages
- [ ] `next-app/tailwind.config.js` includes all custom colors/fonts from original
- [ ] `next-app/tsconfig.json` configured for path aliases (`@/`, `@/lib/`)
- [ ] `.env.local` contains Firebase config and API keys
- [ ] Dev server runs without errors: `npm run dev`

**Tools & Resources**:
- Firebase setup: `next-app/src/lib/firebase.ts` (already exists)
- Auth context: `next-app/src/lib/AuthProvider.tsx` (reference/validate)

---

## Phase 2: Core Architecture

### 2.1 Auth System
- **Original**: `index.html` lines 1200-1400 (signUp, signIn, Google login, draft saves)
- **Target**: `next-app/src/lib/auth.ts`, `next-app/src/lib/AuthProvider.tsx`, forms in pages
- **Key Points**:
  - Email/password auth via Firebase
  - Google Sign-In integration
  - Draft form saves to Firestore
  - Session persistence with tokens

**Checklist**:
- [ ] Firebase auth initialization in `AuthProvider.tsx`
- [ ] Google Sign-In button works and returns user object
- [ ] Email/password signup stores user in Firestore
- [ ] Form draft auto-save on field blur
- [ ] Session persists on page reload

**Conversion Notes**:
- Use `useContext(AuthContext)` instead of `window.user`
- Replace `firebase.auth().onAuthStateChanged()` with `useEffect` + `useContext`
- Move form state to React component with `useState`
- Test: Sign up → see user in Firestore, refresh page → user still logged in

---

### 2.2 Layout & Navigation
- **Original**: Header, sidebar, footer in every HTML file (~300 lines each)
- **Target**: Shared layout component, routing via Next.js
- **Key Points**:
  - Desktop and mobile navigation
  - Active route highlighting
  - User profile dropdown
  - Logout functionality

**Checklist**:
- [ ] Root layout wraps all pages
- [ ] Mobile hamburger menu works
- [ ] Active links highlight based on current route
- [ ] User profile picture loads from Firestore `users/{uid}.photoURL`
- [ ] Logout clears session and redirects

**Files**:
- `next-app/src/app/layout.tsx` (root layout)
- `next-app/src/app/d/layout.tsx` (desktop layout wrapper)
- `next-app/src/app/m/layout.tsx` (mobile layout wrapper)
- `next-app/src/app/admin/layout.tsx` (admin layout)

---

### 2.3 Global State Management
- **Original**: Scattered across pages (window globals, localStorage, DOM state)
- **Target**: React Context or Zustand store
- **Key State**:
  - Current user object
  - Liked profiles (array of UIDs)
  - Browsed profiles cache
  - Admin dashboard data (member count, stats)
  - Referral link & code
  - Notifications (real-time from Realtime DB)

**Checklist**:
- [ ] Context provider wraps app (or Zustand store initialized)
- [ ] User auth state persists across page navigation
- [ ] Liked profiles list syncs with Firestore
- [ ] Admin data fetches on admin page load
- [ ] Real-time listeners attach and cleanup properly

**Files**:
- `next-app/src/contexts/AppContext.tsx` or `next-app/src/lib/store.ts`

---

## Phase 3: Page Conversion (Ordered by Priority)

### 3.1 Login / Signup Pages
- **Original**: `index.html` (embedded, ~800 lines)
- **Target**: `next-app/src/app/d/login/page.tsx`, `next-app/src/app/d/signup/page.tsx`
- **Features**:
  - Email/password input validation
  - Google Sign-In button
  - Form draft auto-save
  - Multi-step signup (profile info, photos, preferences)
  - Phone number OTP verification (if implemented)

**Conversion Guidance**:
- Convert form state to `useState` hook
- Use Firebase auth methods (not REST API calls)
- Replace GSAP slide animations with CSS transitions or Framer Motion
- Validate email format, password strength on client
- Store form drafts to Firestore on each field change (debounced)

**Testing**:
- [ ] Sign up with email → see draft saved in Firestore
- [ ] Google Sign-In → redirect to dashboard
- [ ] Invalid email rejected
- [ ] Password < 8 chars rejected
- [ ] Refresh during signup → draft restored

---

### 3.2 Browse / Discover Page
- **Original**: `index.html` (profile cards, like button, filter, ~600 lines)
- **Target**: `next-app/src/app/d/browse/page.tsx` + `src/components/ProfileCard.tsx`
- **Features**:
  - Fetch profiles from Firestore (paginated, filtered by gender/age/location)
  - Like/unlike functionality (real-time UI update)
  - Profile card animations
  - Verified badge
  - Filter by membership tier
  - Infinite scroll or pagination

**Conversion Guidance**:
- Use `useEffect` to fetch profiles on component mount
- Implement pagination with Firestore cursors
- Like button: update Firestore `users/{uid}/likes` array in real-time
- Extract profile card to separate component with props
- Use Lottie animation library for like button state
- Fallback images via placeholder.co

**Testing**:
- [ ] 10 profiles load on initial render
- [ ] Like button updates UI instantly
- [ ] Dislike reverses the like
- [ ] Scroll to bottom → next 10 profiles load
- [ ] Liked profiles list visible in "Liked" page

---

### 3.3 Profile / Dashboard
- **Original**: `index.html` (user info, stats, edit profile, ~500 lines)
- **Target**: `next-app/src/app/d/dashboard/page.tsx`
- **Features**:
  - Display current user profile
  - Show viewed/like count
  - Edit profile (modal or separate page)
  - Upload profile photos
  - Membership status
  - Upgrade button

**Conversion Guidance**:
- Fetch user from Firestore on load via context
- Form edit state: `useState` or controlled form component
- Photo upload: File input → compress → upload to Firebase Storage
- Show loading state during upload
- Fallback to default avatar

**Testing**:
- [ ] Current user data displays
- [ ] Edit profile saves to Firestore
- [ ] Photo upload works, displays in profile

---

### 3.4 Admin Portal
- **Original**: `Admin/index.html` (~2500 lines)
- **Target**: `next-app/src/app/admin/page.tsx` + component modules
- **Features**:
  - Member list with search/filter
  - Member detail modal (edit, approve, ban)
  - Stats dashboard (total members, verified, this month)
  - Success stories moderation (approve/reject)
  - Referral tracking
  - Admin authentication (role-based access)

**Conversion Guidance**:
- Admin auth check: redirect if `user.role !== "admin"` in layout
- Fetch members list from Firestore: `collection("users").where("status", "==", "active")`
- Search: client-side filtering or Firestore query
- Member edit: modal with form, save changes to Firestore
- Stats: aggregate queries or Firestore Functions
- Success stories: `collection("stories").where("status", "==", "pending")`

**Testing**:
- [ ] Non-admin redirected to login
- [ ] Member list loads and searches
- [ ] Edit member saves changes
- [ ] Approve story updates status in Firestore
- [ ] Stats dashboard shows accurate counts

---

### 3.5 Supporting Pages
- **Appointments**: Book appointment, calendar (block Tuesdays)
- **Referred**: Show referral code, copy to clipboard, WhatsApp share
- **Stories**: Browse success stories, submit new (with photo/video)
- **Membership**: Show tiers, upgrade button → Razorpay
- **Branches**: Office locations with map or directions
- **Contact**: Form to send support message
- **About / Privacy / Terms**: Static content

**Conversion Guidance**:
- Use form components for each page
- Firebase Firestore for data persistence
- Razorpay for payments (integrate SDK, set up webhook listener)
- Clipboard.js or native API for copy-to-clipboard
- WhatsApp share: generate link via `https://wa.me/919XXXXXXXXX?text=...`
- Static pages: convert HTML to JSX, use Tailwind for styles

---

## Phase 4: Features & Integrations

### 4.1 Real-Time Features
- **Appointments**: Booked slots update in real-time
- **Notifications**: Incoming messages, likes, profile views
- **Live Search**: As-you-type member search

**Implementation**:
- Use Firestore real-time listeners in `useEffect`
- Attach in component mount, detach in cleanup
- Update local state on data change
- Handle loading and error states

**Testing**:
- [ ] Open app in two browsers
- [ ] Like profile in one → other shows update instantly
- [ ] Book appointment → slot becomes unavailable in other browser

---

### 4.2 Firebase Storage (Photos)
- **Upload**: Profile photos, story media
- **Display**: Optimized image URLs with Firebase CDN

**Implementation**:
- Create Storage references: `storage().ref('users/' + uid + '/photo.jpg')`
- Upload: `ref.put(file)`
- Display: `ref.getDownloadURL()`
- Use Next.js `next/image` component

**Testing**:
- [ ] Upload profile photo → appears in profile
- [ ] Upload story image → appears in stories list

---

### 4.3 Firebase Functions (Backend)
- **Aggregate Stats**: Count members, active today, new this month
- **Email Notifications**: Send verification, appointment reminders
- **Webhook Handler**: Razorpay payment status updates

**Implementation**:
- Deploy Cloud Functions (or use Firestore Security Rules + triggers)
- Frontend calls functions: `firebase.functions().httpsCallable('functionName')(data)`
- Listen for Realtime DB changes if triggering notifications

**Testing**:
- [ ] Stats update on new member signup
- [ ] Payment verified → membership tier updates in Firestore

---

### 4.4 Third-Party Integrations
- **Razorpay**: Payment checkout for membership upgrades
- **Google Sign-In**: OAuth login
- **WhatsApp**: Share referral link
- **Maps/Directions**: Branch location

**Implementation**:
- Razorpay: Load SDK, create order, handle success/failure
- Google Sign-In: Use `next-auth` or Firebase Auth (already integrated)
- WhatsApp: Generate share link with query params
- Maps: Embed Google Map iframe or use React component

**Testing**:
- [ ] Razorpay checkout opens and processes payment
- [ ] Google Sign-In works
- [ ] WhatsApp share generates correct link

---

## Phase 5: Validation & Testing

### 5.1 Functionality Testing

**Auth Flow**:
- [ ] Sign up with email → draft saves → complete → user created in Firestore
- [ ] Login with email/password works
- [ ] Google Sign-In works
- [ ] Session persists on page reload
- [ ] Logout clears session

**Browse & Like**:
- [ ] Browse page loads 10 profiles
- [ ] Like/unlike updates Firestore in real-time
- [ ] Pagination works
- [ ] Filters (gender, age, location) work

**Profile & Dashboard**:
- [ ] Current user data displays
- [ ] Edit profile saves to Firestore
- [ ] Photo upload works
- [ ] Stats show (viewed, likes, profile views)

**Admin Portal**:
- [ ] Non-admin redirected
- [ ] Member list loads and searches
- [ ] Edit member updates Firestore
- [ ] Approve/reject story works
- [ ] Stats dashboard accurate

**Appointments**:
- [ ] Book appointment → saved in Firestore
- [ ] Tuesdays blocked (unclickable)
- [ ] Booked slots unavailable

**Payments**:
- [ ] Upgrade button opens Razorpay
- [ ] Payment verified → membership updated
- [ ] Failed payment handled gracefully

**Real-Time**:
- [ ] Like/unlike visible instantly in two browsers
- [ ] Appointment booked → slot updates in other browser

### 5.2 Responsive Design Testing

**Breakpoints**:
- [ ] Mobile (375px): stacked layout, mobile nav, 44px touch targets
- [ ] Tablet (768px): 2-column grid for browse
- [ ] Desktop (1024px): 3-column grid, sidebar nav

**Interactions**:
- [ ] Hamburger menu opens/closes on mobile
- [ ] Swipe/scroll on mobile works
- [ ] Touch targets ≥ 44px on mobile

### 5.3 Performance Testing

**Metrics**:
- [ ] Initial load < 3s
- [ ] Like/unlike response < 500ms
- [ ] Profile image load optimized (compress, lazy load)
- [ ] No memory leaks (listeners cleaned up on unmount)

**DevTools Audit**:
- [ ] Lighthouse score > 80
- [ ] No console errors or warnings
- [ ] No unused CSS or JS

### 5.4 Firebase Compatibility

**Auth**:
- [ ] Email/password auth works
- [ ] Google Sign-In works
- [ ] Auth state persists via Firebase tokens

**Firestore**:
- [ ] Read: user profile, profiles list, stories, appointments
- [ ] Write: user profile, likes, appointments, stories
- [ ] Security Rules enforced (user can only write their own data)

**Realtime DB**:
- [ ] Listeners attach and detach properly
- [ ] No memory leaks from persistent listeners

**Storage**:
- [ ] Photos upload to Firebase Storage
- [ ] Images load from CDN URLs

---

## Phase 6: Cross-Site Compatibility

### 6.1 Main Site (`/d/`)
- All user-facing features (browse, profile, appointments, etc.)
- Tested on desktop and responsive

### 6.2 Admin Site (`/admin/`)
- Member management, stats, story moderation
- Role-based access control
- Responsive (admin typically uses desktop, but mobile fallback needed)

### 6.3 Mobile Site (`/m/`)
- Alternate responsive layout for mobile (if different from `/d/`)
- All features accessible on mobile
- Touch-optimized

### 6.4 Shared Assets & APIs
- [ ] Both `/d/` and `/admin/` use same `AuthProvider.tsx`
- [ ] Both use same Firebase project and config
- [ ] Both can read/write to same Firestore collections
- [ ] TypeScript types shared across both apps

---

## Conversion Checklist (Use with Conversion Guide Agent)

For each page/feature, invoke the **Conversion Guide** agent:

```
@ConversionGuide Review the browse page conversion from index.html to next-app/src/app/d/browse/page.tsx
```

The agent will:
1. Read the original HTML (lines and logic)
2. Review the Next.js code
3. Check for breaking changes
4. Verify Firebase compatibility
5. Flag responsive design issues
6. Provide fixes and next steps

**Checklist**:
- [ ] Phase 1: Foundation (auth, layout, state)
- [ ] Phase 2: Core features (browse, profile, dashboard)
- [ ] Phase 3: Admin portal
- [ ] Phase 4: Supporting pages
- [ ] Phase 5: Integrations (Razorpay, storage, functions)
- [ ] Phase 6: Full testing suite
- [ ] Phase 7: Cross-site validation
- [ ] Phase 8: Deploy

---

## Rollback Plan

If conversion breaks a critical feature:

1. **Identify** which feature broke (auth? browse? admin?)
2. **Revert** the affected page to original HTML (temporarily)
3. **Debug** the Next.js code with Conversion Guide
4. **Fix** and re-test before re-deploying
5. **Document** the issue so it doesn't happen again

---

## References

- Firebase docs: https://firebase.google.com/docs
- Next.js docs: https://nextjs.org/docs
- React hooks: https://react.dev/reference/react
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/

---

**Last Updated**: May 13, 2026  
**Status**: Active — Update as you progress through phases
