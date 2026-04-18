# Design Spec: index.html Homepage & Core Pages Overhaul
**Date:** 2026-04-18  
**Scope:** index.html only (landing.html untouched)  
**Status:** Approved by user

---

## 1. Context & Goals

Naveen Reddy Marriage Bureau is a luxury matrimony platform serving the Reddy community across Telangana and Andhra Pradesh. The primary users are **Indian families, often parents aged 45–65**, browsing on mobile. The site must communicate trust, legitimacy, and premium quality simultaneously.

**Core insight:** A dark theme signals complexity and dishonesty to this demographic. Luxury must be expressed through *quality of light* — warm ivories, rich golds, bold typography — not darkness. Think 5-star hotel lobby, not nightclub.

**Landing.html is NOT touched.** All changes are to index.html.

---

## 2. Design System

### 2.1 Color Palette (No grey/ash — everything warm)

```css
:root {
  /* Primaries */
  --primary:       #7B1F2E;   /* Deep crimson — headings, primary buttons */
  --primary-hover: #9B2F40;   /* Crimson hover */
  --primary-light: #FFF0F2;   /* Blush — subtle section tints */

  /* Gold accents */
  --gold:          #B8892A;   /* Rich warm gold — borders, icons */
  --gold-bright:   #D4AF37;   /* Bright gold — shimmer highlights */
  --gold-bg:       #FDF3E0;   /* Gold-tinted bg for feature sections */

  /* Backgrounds — all warm, zero ash */
  --bg:            #FFFBF5;   /* Warm ivory — main page background */
  --bg-warm:       #FDF8EF;   /* Warm cream — card surfaces */
  --bg-champagne:  #FAF0E6;   /* Deep champagne — carousel section */
  --bg-blush:      #FFF8F5;   /* Soft blush — alternating sections */

  /* Text — all warm brown, zero grey */
  --text:          #1A0A08;   /* Near-black warm — primary headings */
  --text-body:     #3D1C0E;   /* Deep warm brown — body paragraphs */
  --text-sub:      #5C2E1A;   /* Medium warm brown — secondary labels */
  --text-muted:    #7A4030;   /* Warm terracotta — captions, hints */

  /* Borders */
  --border:        #E8C98A;   /* Gold-tinted border */
  --border-light:  #F5E4CC;   /* Light gold border */

  /* Shadows */
  --sh-card:  0 4px 28px rgba(123,31,46,0.10);
  --sh-hover: 0 12px 44px rgba(123,31,46,0.18);
  --sh-gold:  0 8px 32px rgba(184,137,42,0.22);
  --sh-cta:   0 6px 24px rgba(123,31,46,0.30);
}
```

### 2.2 Typography

**Three-font system** — already partially in use, now enforced consistently:

| Role | Font | Weight | Min Size | Color |
|------|------|--------|----------|-------|
| Brand / display headings | Cinzel | 700 | 2.8rem | `--primary` or `#fff` on photo |
| Section headings | Cinzel | 600 | 1.8rem | `--primary` |
| Subheadings / quotes | Cormorant Garamond | 500 italic | 1.2rem | `--text-body` |
| Body / card text | EB Garamond | 400 | 18px (1.125rem) | `--text-body` |
| Labels / tags / caps | Josefin Sans | 400 | 0.78rem | `--text-sub` |

**Critical rules:**
- Section headings minimum **1.8rem / bold 600** — readable for a 60-year-old on mobile
- Body text minimum **18px** everywhere — never below this
- Line-height body: **1.75** for comfortable senior reading
- Zero grey text anywhere — warmest muted color is `--text-muted: #7A4030`
- All font colours must meet WCAG 4.5:1 contrast on their background

### 2.3 Icon System

Replace all emoji icons (🔒 ✅ 🏛 etc.) with **Lucide SVG icons**. Reasons:
- Emojis render inconsistently across Android/iOS
- SVGs are colourable (can be crimson or gold to match theme)
- Looks professional, not like a WhatsApp message

Icon sizes: 24px (nav), 28px (feature cards), 32px (process steps).  
Stroke: 1.5px, colour: `--primary` or `--gold`.

---

## 3. Global Micro-interactions & Effects

These apply site-wide, built with GSAP + CSS:

### 3.1 Shimmer Button Effect
All primary and outline buttons get a gold light-sweep animation on hover:
```css
/* Pseudo-element sweeps left→right on hover (200ms) */
.btn::after { background: linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.35) 50%, transparent 60%); }
.btn:hover::after { animation: shimmer 0.6s ease; }
```

### 3.2 Animated Gradient Border (Carousel Cards)
Gold shimmer chases around the card perimeter using `@property` and `conic-gradient`:
```css
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.feat-card::before { background: conic-gradient(from var(--angle), transparent 70%, var(--gold-bright) 80%, transparent 90%); animation: spin-border 3s linear infinite; }
@keyframes spin-border { to { --angle: 360deg; } }
```

### 3.3 Card Hover — Lift + Gold Glow
```css
.feat-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--sh-hover), 0 0 0 1.5px var(--gold), var(--sh-gold);
}
```

### 3.4 GSAP Scroll Reveal (all sections)
Every section uses `ScrollTrigger` with stagger:
```js
gsap.from('.feat-card', { y: 40, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out',
  scrollTrigger: { trigger: '.carousel-section', start: 'top 78%' }
});
```

### 3.5 Count-up Stats Animation
Numbers roll up from 0 on first scroll into view. Uses `IntersectionObserver` + `requestAnimationFrame`.

### 3.6 Warm Aurora Gradient (Carousel Section Background)
Multi-layer radial gradients create a soft aurora of warm champagne, blush, and ivory — replacing flat/grey backgrounds:
```css
background:
  radial-gradient(ellipse 80% 60% at 20% 30%, rgba(253,243,224,0.9) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 80% 70%, rgba(255,240,242,0.7) 0%, transparent 55%),
  radial-gradient(ellipse 100% 80% at 50% 50%, #FAF0E6 0%, #FDF8EF 100%);
```

### 3.7 Magnetic Button Effect
CTA buttons subtly follow cursor position (max 8px displacement) giving a "alive" premium feel.

### 3.8 Reduced-Motion Respect
All animations wrapped:
```css
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
```

---

## 4. Section-by-Section Design

### 4.1 Navigation Bar (enhanced)

**Current issue:** Logo looks copy-pasted. Nav link text is too small (0.7rem).

**Changes:**
- Logo: SVG **double golden ring frame** — inner ring 1px, outer ring 1.5px, four `◆` ornament glyphs at compass points (top/bottom/left/right). Subtle warm radial glow (`rgba(184,137,42,0.15)`) behind the ring. Logo image remains inside, unchanged.
- Nav links: bumped to `0.78rem`, weight 500, colour `--text-body` (warm brown, not grey)
- Active link indicator: gold underline `2px` solid
- Nav buttons: `0.68rem` → `0.72rem`, min-height `44px` touch target

### 4.2 Hero Section (enhanced)

**Current issues:** Black bars visible (image not covering full viewport). Overlay too dark on some sizes.

**Changes:**
- `background-size: cover; background-position: center center;` enforced
- CSS gradient fallback for when photo underruns: `linear-gradient(135deg, #7B1F2E 0%, #2D1810 100%)`
- Overlay: warm champagne vignette (`rgba(253,243,224,0.15)` edge fade, centre transparent) — keeps photo bright, removes black bleed
- Add **three floating trust badge pills** over the hero:
  - `✓ Verified Profiles` | `🔐 100% Confidential` | `⭐ Est. 2000`
  - Style: warm white glass pill (`background: rgba(255,251,245,0.88); backdrop-filter: blur(12px); border: 1px solid rgba(184,137,42,0.4)`)
  - GSAP entrance: stagger fade-in from bottom, delay after hero title
- Hero brand text: Cinzel 700, `clamp(2.4rem, 6vw, 5rem)` — bigger than current
- Scroll chevron: animated gold double-chevron replacing plain arrow
- Hero subheading ("Where Sacred Traditions Meet Timeless Love"): **typewriter reveal effect** — characters appear one by one at 40ms intervals, cursor blinks gold, then cursor fades out after completion. Only runs once on page load. Graceful no-op if `prefers-reduced-motion` is set.

### 4.3 Stats Bar (enhanced)

- Background: `--bg` warm ivory, thin gold top/bottom borders
- **Count-up animation:** numbers animate from 0 to final value over 1.8s on first scroll-in
- Gold `◆` separator between each stat
- Stat numbers: Cinzel 700, `clamp(1.8rem, 4vw, 2.6rem)`, colour `--primary`
- Stat labels: Josefin Sans 400, `0.78rem`, uppercase, `--text-sub`

### 4.4 3D Revolving Feature Carousel ★ NEW SECTION

**Replaces** the current flat `.features-grid`.

**Section wrapper:**
- Padding: `6rem 0`
- Background: Warm aurora gradient (see §3.6)
- Very faint silk lace texture overlay at `3% opacity` (inline SVG pattern)
- Gold ornamental SVG divider above and below the section

**Section heading block:**
```
[Gold ◆ —————— ◆ Gold]
    WHY FAMILIES TRUST US          ← Josefin Sans 0.72rem uppercase, --gold
  A Legacy of Honour Since 2000    ← Cinzel 600, clamp(1.8rem, 4vw, 2.4rem), --primary
Serving the Reddy community...     ← EB Garamond 18px italic, --text-body
```

**Carousel implementation (GSAP + CSS 3D):**
- 6 cards arranged in a circle on a tilted 3D plane (rotateX: 12deg)
- Perspective parent: `1200px`
- Card positions: `rotateY(i * 60deg) translateZ(320px)` for desktop, `translateZ(200px)` for mobile
- `transform-style: preserve-3d` on scene container
- **Drag control:** `pointerdown` / `pointermove` / `pointerup` + `touchstart` / `touchmove` — drag left/right rotates the carousel on Y axis
- Momentum: on release, GSAP animates remaining velocity with `power3.out` deceleration
- Active card (facing front): slightly larger scale `1.05`, full opacity `1.0`
- Background cards: scale `0.88`, opacity `0.7`, blur `0px` (no blur — text always sharp)
- **Card design:**
  - Size: `220px × 260px` desktop, `180px × 220px` mobile
  - Background: `rgba(255, 251, 245, 0.92)` warm white
  - `backdrop-filter: blur(18px) saturate(1.2)`
  - Border: `1.5px solid transparent` with animated conic-gradient (gold shimmer chase)
  - Border-radius: `18px`
  - Shadow: `var(--sh-card)` + gold glow on active
  - Icon: Lucide SVG, 28px, `--primary` colour
  - Title: Cinzel 600, `1rem`, `--primary` — **bold and legible**
  - Body text: EB Garamond, `17px`, `--text-body`, line-height `1.7`
- **Navigation dots:** 6 warm gold dots below carousel, active dot expands to pill shape
- **Drag hint:** "Drag to explore →" in Josefin Sans italic, fades out after first interaction

**Cards content (with SVG icons):**
1. Shield icon — Complete Privacy
2. Badge-check icon — 100% Verified  
3. Building icon — Community Exclusive  
4. Message-circle icon — Family Chat  
5. Globe icon — NRI Profiles  
6. Star icon — Personal Service  

### 4.5 "How We Work" Process Steps ★ NEW SECTION

**Purpose:** Addresses user's request to show *how the company works* — critical for older users who need step-by-step reassurance before trusting.

**Layout:** 4 horizontal cards (2×2 on mobile), connected by a dashed gold line

**Steps:**
1. **Register Free** — Create your profile in minutes, completely free
2. **Bureau Verifies You** — Our team personally screens every member
3. **Browse Matches** — Explore compatible profiles in privacy
4. **Begin Your Journey** — Connect families and start the conversation

**Each step card:**
- White card, gold top border `4px`, `border-radius: 16px`
- Large step number: Cinzel 700, `3.5rem`, `rgba(184,137,42,0.2)` (gold, light — background watermark style)
- Lucide icon: 32px, `--primary`
- Title: Cinzel 600, `1.1rem`, `--primary`
- Description: EB Garamond, `17px`, `--text-body`
- GSAP: cards stagger-enter from left with `0.15s` between each

### 4.6 Success Stories — Swipe Carousel (enhanced)

**Current:** 3 static story cards in a grid.

**New:**
- Horizontal swipe carousel (touch on mobile, drag on desktop)
- Cards: warm white, `border-radius: 20px`, subtle `--sh-card`
- Large opening quote mark `"` in Cormorant, `5rem`, `rgba(184,137,42,0.15)` — decorative watermark
- Quote text: Cormorant Garamond italic, `1.1rem`, `--text-body`
- Names: Cinzel 600, `0.95rem`, `--primary`
- Date/location: Josefin Sans, `0.7rem`, `--gold`, uppercase
- Navigation: gold dot indicators + left/right arrow buttons
- Section background: `--primary-light` (soft blush `#FFF0F2`)

### 4.7 Login Page — Complete Redesign ★

**Current problem:** Plain white card floating on a plain page — isolated, cold, untrustworthy.

**New design:**
- **Background:** Couple photo (from hero), blurred `blur(24px)`, with warm golden overlay `rgba(253,243,224,0.4)` — gives a beautiful warm-bokeh look
- **Card:**
  - `background: rgba(255, 251, 245, 0.90)`
  - `backdrop-filter: blur(32px) saturate(1.4)`
  - `border: 1.5px solid rgba(184,137,42,0.45)`
  - `border-radius: 24px`
  - `box-shadow: 0 0 0 1px rgba(255,251,245,0.5), var(--sh-hover), 0 0 80px rgba(184,137,42,0.15)` — the outer glow makes it look luminous, not isolated
  - Max-width: `420px`, centred
- **Logo at top of card:** Full ornamental ring version (large, `80px`)
- **Welcome copy:**
  - "Welcome Back" — Josefin Sans 0.72rem uppercase gold
  - "Naveen Reddy Marriage Bureau" — Cinzel 700 1.3rem crimson
  - "A sacred journey continues here" — Cormorant italic 1rem warm brown
  - Thin gold rule
- **Inputs:**
  - Underline-style (no box border) — `border-bottom: 1.5px solid var(--border)`
  - Floating label that lifts on focus
  - Gold `box-shadow: 0 2px 0 var(--gold)` on focus
  - Min-height `52px` (touch target)
- **Sign In button:** Full-width, crimson fill, shimmer sweep on hover
- **Google button:** White fill, gold border, no grey

### 4.8 Logo Frame (all appearances)

**SVG ornamental ring component:**
```
Outer ring: 2px stroke, --gold, circle r=52
Inner ring: 1px stroke, rgba(gold,0.5), circle r=44
4 diamond glyphs ◆ at top/bottom/left/right (12px, --gold)
Radial glow behind: radial-gradient(circle, rgba(184,137,42,0.12) 0%, transparent 65%)
Logo image: 50px × 50px, object-fit: contain, centred inside rings
```

Nav size: 58px total diameter  
Login card size: 88px total diameter  
Footer size: 64px total diameter

### 4.9 Post-Login Page Banners (Browse, Dashboard, My Profile)

For all pages a user lands on after logging in:
- **Muted hero banner:** 28vh height, couple photo background, `background-size: cover`, warm champagne overlay `rgba(253,243,224,0.35)`
- Page title overlaid: Cinzel 600, white, `clamp(1.8rem, 5vw, 2.8rem)`, centred
- Breadcrumb under title: Josefin Sans 0.7rem, `rgba(255,248,220,0.7)`, e.g. "Home · Browse Profiles"
- This is consistent across all post-login pages

### 4.10 Footer (enhanced)

- Background: deep crimson `#5A1520` (warm, not grey, not black)
- Gold top border `2px`
- Brand name: Cinzel 600, gold — large and proud
- Body text: EB Garamond 17px, `rgba(255,248,220,0.8)` — warm cream on dark
- Links: warm cream, hover → gold, underline on hover
- Logo: ornamental ring version, 64px, at footer top
- Bottom strip: `#3D0E17`, copyright in Josefin Sans 0.7rem cream

---

## 5. Mobile & Accessibility Requirements

- All body text `≥ 18px` — non-negotiable
- All interactive elements min `48px × 48px` touch target
- `touch-action: manipulation` on all buttons (eliminates 300ms tap delay)
- Carousel drag works with both `pointer` events and `touch` events
- Carousel snap: on touchend, snaps to nearest card
- Momentum deceleration: feels natural on both Android and iOS
- No horizontal scroll anywhere
- Font-sizes use `clamp()` — never fixed px for headings
- All foreground/background pairs tested at WCAG 4.5:1

---

## 6. Implementation Scope

### Files changed:
- `index.html` — all CSS and HTML changes inline (no build step)

### GSAP plugins needed (already loaded via CDN):
- `gsap.min.js` — add to index.html if not present
- `ScrollTrigger.min.js`

### New SVG assets needed (inline in HTML):
- Lucide icons for 6 feature cards (Shield, BadgeCheck, Building2, MessageCircle, Globe, Star)
- Lucide icons for 4 process steps
- Gold ornamental divider SVG (reusable)
- Logo ring frame SVG (reusable)

### Sections added/replaced:
| Old | New |
|-----|-----|
| `.features-grid` (flat grid) | 3D Revolving Carousel |
| — | "How We Work" 4-step process |
| `.stories-grid` (static) | Horizontal swipe testimonial carousel |
| Login page (isolated) | Glassmorphism card on blurred photo |
| Nav logo (plain) | Ornamental ring frame |

---

---

## 9. Branches Page — Landmark Image Cards ★ NEW TREATMENT

**Current problem:** Branch cards show meaningless generic emojis (🏛 🏙 🌿 🏺) that give no sense of place or prestige.

**New design:** Each branch card has a **landmark header image zone** — a 140px tall card header showing a stylised SVG silhouette of a famous local landmark, on a warm gradient sky background. This makes each office feel rooted in its city and builds geographic trust.

### Landmark assignments:
| Branch | Landmark | SVG Silhouette |
|--------|----------|----------------|
| **Somajiguda, Hyderabad** (Head Office) | Charminar | Iconic four-minaret arch silhouette — crimson fill on champagne sky gradient |
| **Kothapet, Hyderabad** | Golconda Fort | Hilltop fort silhouette with crenellated walls — crimson on warm amber gradient |
| **Warangal** | Kakatiya Kala Thoranam (stone arch gateway) | Three-arch stone gate silhouette — crimson on blush-to-ivory gradient |
| **Karimnagar** | Elgandal Fort | Hilltop fort with river below silhouette — crimson on soft rose-to-cream gradient |

### Card redesign:
- **Header zone (140px):** SVG landmark silhouette centred, `sky gradient` background unique per city
- **Gold top accent bar** (3px) that animates `scaleX(0→1)` on hover — already exists, keep it
- On hover: landmark silhouette subtly scales `1.0 → 1.06` with `transition: 0.3s ease`
- **City name:** Cinzel 600, 1.1rem, `--primary` — bigger than current
- **Branch label:** Josefin Sans 0.7rem uppercase, `--gold` — "Head Office" / "Branch Office"
- **"Tap to view details →":** EB Garamond italic, 0.82rem, `--text-sub` — warmer than current grey muted

### Why SVG not photos:
SVG silhouettes are inline, zero-dependency, load instantly, and look prestigious (like a luxury hotel's city map illustration). They scale perfectly on all screens and can be recoloured with CSS. Real photos would require hosting and may appear low-quality on some devices.

---

## 10. Signup Page — "Who Is This For?" Card Redesign ★

**Current problem:** Six cards use emojis (🙋 👦 👧 👨 👩 🤝) — inconsistent across Android/iOS, look unprofessional on a luxury site.

**New design:** Replace emojis with **Lucide SVG icons** styled in crimson, inside a warm circular badge.

### Icon replacements:
| Option | Old Emoji | New Lucide Icon | Reasoning |
|--------|-----------|-----------------|-----------|
| Myself | 🙋 | `<User />` | Person silhouette — universal self-reference |
| My Son | 👦 | `<UserCheck />` + small "♂" tag | Verified male addition |
| My Daughter | 👧 | `<UserCheck />` + small "♀" tag | Verified female addition |
| My Brother | 👨 | `<Users />` + "♂" tag | Two-person icon, male |
| My Sister | 👩 | `<Users />` + "♀" tag | Two-person icon, female |
| A Friend | 🤝 | `<Heart />` | Heart = care/connection, warmer than handshake |

### Card redesign:
- Icon container: `48px × 48px` warm circle, `background: rgba(123,31,46,0.07)`, `border-radius: 50%`
- SVG icon: 24px, `--primary` colour, stroke `1.5px`
- On selected: circle fills to `--primary`, icon turns white, card gets gold border
- Label: Cinzel 600, 0.85rem, `--text` — bigger and bolder than current
- Pre-step screen header icon (currently 💐 flower emoji): replace with ornamental SVG mandala/lotus in crimson

### Additional signup UX improvements:
- **Progress bar at top of multi-step form:** thin gold bar showing completion `0% → 100%` as steps advance. Current step number shown: "Step 3 of 6" in Josefin Sans above the bar.
- **Step labels:** small breadcrumb row below progress bar — "Personal · Family · Career · Preferences · Photos · Review" — current step highlighted in crimson
- **Auto-save toast:** warm toast notification "Progress saved ✓" appears at bottom whenever a draft is auto-saved (already fires in code, just needs better visual treatment)
- **Gender selector:** replace ♂/♀ symbol buttons with Lucide `<User />` (Male) and `<User />` (Female) SVG pill buttons — styled more clearly

---

## 11. Site-Wide UX Clarity Improvements ★

**Problem:** Users (especially older parents) can get lost — they don't know where they are, what to do next, or how the service works.

### 11.1 Floating WhatsApp Quick-Contact Button
- Fixed position: `bottom: 24px, right: 24px`
- Circle button: `56px × 56px`, green `#25D366`, white WhatsApp SVG icon
- On hover: expands to pill with text "Chat with Us" sliding in from left
- On tap (mobile): opens `https://wa.me/917207999985` directly
- Tooltip on first visit: "Have questions? Chat with us →" fades in after 4 seconds, auto-dismisses
- Z-index: above everything except modals

### 11.2 Floating "?" Help Button
- Fixed position: `bottom: 24px, left: 24px`
- Circle button: `48px × 48px`, `--primary` fill, white `?` in Cinzel
- Opens a **Help Drawer** (slides in from bottom) with:
  - "How does NRMB work?" — 4 bullet points, one per process step
  - "How do I find matches?" — 2 bullet points
  - "Is my information safe?" — 2 bullet points
  - Call-to-action: "Call us: +91 72079 99985"
- Dismiss: tap outside or `×` button

### 11.3 Page Breadcrumb on All Inner Pages
Every non-home page shows a warm breadcrumb bar just below the hero banner:
```
Home  ›  Browse Profiles
```
- Background: `--bg` warm ivory
- Font: Josefin Sans 0.7rem, `--text-sub`
- Home link: `--gold`, underline on hover
- Current page: `--primary`, no underline, bold
- Helps users always know where they are

### 11.4 "Back to Home" Persistent Link
On all inner pages, a subtle "← Back to Home" text link appears in the top-left below the nav. Styled as: Josefin Sans 0.7rem, `--text-muted`, `← arrow` in gold. Tapping takes user to `pgHome`.

### 11.5 Browse Page — Guidance State
When a newly registered user first visits Browse and has ≤3 matches showing, show a warm instructional card at top:
```
🔍 Here's How Browsing Works
Profiles matching your community and preferences appear here.
Heart a profile to show interest. Once both sides express interest, 
contact details are shared by the bureau.
[Got it — Continue Browsing]
```
Card: warm cream, gold border, EB Garamond 17px, dismissible.

### 11.6 Empty State Improvements
- **Liked Profiles (empty):** Large Lucide `<Heart />` icon in blush, "No profiles liked yet" in Cinzel, "Browse profiles and tap ♡ to shortlist" in EB Garamond italic. Link button: "Browse Profiles →"
- **Interests Received (empty):** Lucide `<Mail />` in blush, "No interests received yet" text, "Complete your profile to attract more matches →" button

### 11.7 First-Visit Welcome Toast
On the very first page load (checked via `localStorage`), a warm welcome toast appears at bottom:
```
Welcome to Naveen Reddy Marriage Bureau
Start by creating your profile — it takes just 5 minutes.
[Create Profile]  [Maybe Later]
```
Toast: warm cream, gold border, rounded 20px, slides up from bottom. Auto-dismisses after 12 seconds.

---

## 7. What Is NOT Changed
- `landing.html` — completely untouched
- Firebase logic, auth, routing, Firestore queries
- Admin submodule
- Signup flow structure (only styling updated)
- Razorpay integration
- Vercel config

---

## 8. Anti-Patterns to Avoid
- No grey or ash in any colour value
- No emojis as structural icons (use Lucide SVG)
- No hard-coded px for body text — use rem/clamp
- No `blur()` filter on text (only on card *backgrounds*)
- No dark sections appearing in isolation — footer is the only dark region and it's at the end (intentional termination)
- No animations that block user interaction
- No animations on width/height — only transform/opacity
