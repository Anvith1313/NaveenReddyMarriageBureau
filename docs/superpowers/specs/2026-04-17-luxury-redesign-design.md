# Reddy Elite Matrimony — Luxury Redesign Design Spec
**Date:** 2026-04-17  
**Scope:** Full visual overhaul — `index.html`, `Admin/index.html`, `landing.html`  
**Approach:** Section-by-section rewrite (Approach 2) — design tokens first, then each page section independently  

---

## 1. Design Philosophy

The redesign has three goals:

1. **Fix what's broken, preserve what's unique** — The site already has a strong identity: the couple.jpg hero photo, elegant serif typography (Cormorant Garamond, Cinzel, EB Garamond), ornamental decorators, frosted glass cards. These stay. Only the broken color tokens, tiny font sizes, and dull ash tones get fixed.
2. **Elderly accessibility** — All text readable without glasses. No Cinzel below 0.6rem, no low-contrast labels, base font raised to 18px.
3. **Light and vibrant** — Pure white card surfaces with full-saturation burgundy and warm true-gold accents. No dull ivory, no ash grey. The couple photo, ornate fonts, and pill-shaped buttons make the site look luxurious and distinctive — not like any other platform.

---

## 2. Color System

### CSS Variables (complete replacement)

```css
:root {
  /* Primary — Burgundy */
  --primary:       #7B1F2E;   /* main CTA, headings, active states */
  --primary2:      #9B2F40;   /* hover states, gradients */
  --primary-light: #FFF0F2;   /* tint backgrounds, tags */

  /* Gold — True warm amber (not champagne/beige) */
  --gold:          #B8892A;   /* section tags, ornamental lines, tier dividers */
  --gold-light:    #FFF8EC;   /* subtle tint */
  --gold-bg:       #FDF3E0;   /* stats bar background, gold section backgrounds */

  /* Backgrounds */
  --white:         #FFFFFF;   /* primary surface — cards, nav, all cards */
  --bg:            #FAFAFA;   /* page body background (very slightly warm) */
  --bg-warm:       #FFF8F5;   /* secondary section backgrounds, input fields */

  /* Text */
  --text:          #1A0A08;   /* body text — near-black warm */
  --text2:         #4A2018;   /* secondary body text */
  --muted:         #6B3A28;   /* supporting text, meta, placeholders */

  /* Borders */
  --border:        #E8D5C8;   /* default card/input borders */
  --border-strong: rgba(184,137,42,0.35);  /* gold-tinted borders */

  /* Shadows */
  --sh-soft:  0 2px 16px rgba(123,31,46,0.08);
  --sh-card:  0 4px 28px rgba(123,31,46,0.11);
  --sh-hover: 0 12px 44px rgba(123,31,46,0.18);
  --sh-cta:   0 6px 24px rgba(123,31,46,0.32);
}
```

### What Changes vs Current

| Variable | Was | Now | Reason |
|---|---|---|---|
| `--gold` | `#7c3d52` (mauve pink) | `#B8892A` (warm gold) | Was mislabelled — it was pink |
| `--gold2` | `#a0445e` (rose) | *(removed)* | Consolidated |
| `--gold3` | `#c87090` (pink) | *(removed)* | Consolidated |
| `--crimson` | `#8b0000` | `#7B1F2E` as `--primary` | More refined burgundy |
| `--border` | `rgba(160,68,94,0.16)` pink-tinted | `#E8D5C8` warm neutral | Warmer, not pink |
| Hardcoded `rgba(184,150,12,…)` | ~80 scattered instances | All → `var(--gold)` | Single source of truth |
| Hardcoded `rgba(212,175,55,…)` | ~40 scattered instances | All → `var(--gold)` | Single source of truth |

---

## 3. Typography

**Fonts kept** — Cormorant Garamond, Cinzel, EB Garamond, Josefin Sans are correct for a luxury matrimony brand. No changes.

**Base font size raised:** `17px` → `18px`

### Size Scale

| Element | Old size | New size | Font |
|---|---|---|---|
| Hero brand | `clamp(1.55rem,3.8vw,3rem)` | `clamp(2rem,4vw,3.2rem)` | Cinzel 700 |
| Hero subtitle | `clamp(1.6rem,3.2vw,2.6rem)` | `clamp(1.3rem,2.5vw,1.6rem)` | Cormorant italic |
| Section title | `clamp(1.8rem,3vw,2.6rem)` | `2.2rem` | Cormorant 600i |
| Section eyebrow | `0.48rem` | `0.65rem` | Cinzel 600, ls 0.22em |
| Nav links | `0.6rem` | `0.7rem` | Cinzel 500, ls 0.10em |
| Card titles | `0.65rem` | `0.82rem` | Cinzel 600, ls 0.08em |
| Button text | `0.48–0.56rem` | `0.65–0.75rem` | Cinzel 600 |
| Body text | `0.88–0.96rem` | `1rem` | EB Garamond 400 |
| Form labels | `0.46–0.48rem` | `0.65rem` | Cinzel 600 |
| Form inputs | `0.98–1.05rem` | `1.1rem` | EB Garamond / Cormorant |
| Profile name | varies | `1.2rem` | Cormorant 700 |
| Stats numbers | `2.2rem` | `2.5rem` | Cormorant 700 |
| Tier price | varies | `2.2rem` | Cormorant 700 |
| Admin table text | varies | `1.05rem` | Cormorant / EB Garamond |

**Rule:** No Cinzel text below `0.6rem`. EB Garamond used instead of Cinzel for tags, badges, and meta text (more legible at small sizes).

---

## 4. Component Specifications

### 4.1 Navigation Bar
- **Background:** `rgba(255,255,255,0.96)` + `backdrop-filter:blur(14px)` — keep frosted feel
- **Height:** 72px (up from 68px)
- **Border-bottom:** 1px `var(--border)` + 1px gold gradient shimmer line
- **Logo circle:** 48px, warm gradient fill, gold ring shadow — keep existing treatment
- **Brand name:** Cormorant Garamond 600 italic, 1.2rem, `var(--primary)`
- **Nav links:** Cinzel 500, 0.7rem, `var(--text2)` → `var(--primary)` on active
- **Active indicator:** 1.5px burgundy underline sliding in on hover/active
- **Sign In button:** **Pill-shaped** (50px radius), burgundy border + text — elegant
- **Register button:** **Pill-shaped** (50px radius), solid burgundy fill, white text, `var(--sh-cta)`

### 4.2 Hero Section
- **Overlay:** `linear-gradient(180deg, rgba(10,2,4,0.22) 0%, rgba(10,2,4,0.1) 40%, rgba(255,248,245,0.38) 80%, rgba(255,248,245,1) 100%)`
- **Couple photo opacity:** ~55% — clearly visible
- **Eyebrow tag:** Cinzel 0.6rem, warm gold `rgba(255,213,130,0.95)`, flanked by gold lines
- **Brand name:** Cinzel 700, `clamp(2rem,4vw,3.2rem)`, white, text-shadow
- **Subtitle:** Cormorant italic 400, 1.4rem, `rgba(255,240,210,0.93)`
- **Buttons:** Solid rectangle, 6px radius (not pill). Primary: full burgundy. Secondary: transparent with gold border, white text.

### 4.3 Stats Bar
- **Background:** `var(--gold-bg)` — warm gold tint (not white, not dark)
- **Numbers:** Cormorant 700, 2.5rem, `var(--primary)`
- **Labels:** EB Garamond 500, 1rem, `var(--text2)`
- **Dividers:** 1px vertical `rgba(184,137,42,0.25)`, 40px tall

### 4.4 Feature Cards
- **Card:** White, 1px `var(--border)`, 12px radius, `var(--sh-soft)`
- **Icon container:** 56×56px, 12px radius, `var(--primary-light)` background
- **Top stripe on hover:** 3px burgundy→gold gradient, `scaleX` reveal
- **Title:** Cinzel 600, 0.82rem, `var(--primary)`
- **Body:** EB Garamond 400, 1rem, `var(--muted)`, lh 1.75

### 4.5 Profile Cards (Browse)
- **Grid:** 3 columns on desktop (keep existing), 2 on tablet, 1 on mobile
- **Photo area:** 130px tall, warm gradient placeholder
- **Verified badge:** Pill-shaped, EB Garamond 600, 0.82rem, `var(--primary)`, white bg + burgundy border
- **Heart button:** 34px circle, white bg — keep existing position
- **Name:** Cormorant 700, 1.2rem
- **Meta:** EB Garamond, 0.9rem, `var(--muted)`
- **Tags:** Pill-shaped, `var(--primary-light)` bg, EB Garamond 600, 0.82rem, `var(--primary)`
- **Connect button:** Pill-shaped solid burgundy, Cinzel 0.6rem

### 4.6 Membership Tiers
- **All backgrounds:** `var(--white)` — no dark treatment
- **Elite featured card:** 2px `var(--primary)` border + 4px gradient top stripe (burgundy→gold→rose)
- **Recommended badge:** Solid burgundy rectangle, Cinzel 0.6rem
- **Tier name:** Cinzel 600, 1.05rem, `var(--primary)`
- **Price:** Cormorant 700, 2.2rem, `var(--primary)`
- **Period:** EB Garamond, 0.95rem, `var(--muted)`
- **Feature list:** EB Garamond 400, 0.95rem, lh 2.1. Bullets: `✓` in `var(--primary)`
- **Outline CTA:** Pill-shaped, 1.5px burgundy border, transparent bg, burgundy text
- **Solid CTA:** Pill-shaped, burgundy fill, white text, `var(--sh-cta)`

### 4.7 Login / Verify Card
- **Card:** Frosted glass — `rgba(255,255,255,0.88)`, `backdrop-filter:blur(32px)`, 24px radius, `var(--sh-card)` — keep over hero photo
- **Top stripe:** 3px, `linear-gradient(90deg, var(--primary), var(--gold), var(--primary2))`
- **Logo badge:** 88px circle, warm gradient, gold ring glow — keep existing treatment
- **Title:** Cinzel 600, 0.88rem, `var(--primary)`
- **Inputs:** Underline style (keeps the elegant feel) — focus line animates to full width in `var(--primary)`
- **Input text:** Cormorant Garamond, 1.1rem
- **Labels:** Cinzel 600, 0.65rem, `var(--gold2)` (dark amber — readable)
- **Submit button:** Pill-shaped, solid burgundy, Cinzel 600, 0.75rem, `var(--sh-cta)`

### 4.8 Signup Step Indicator
- **Done step:** Solid burgundy circle, white ✓
- **Active step:** White circle, 2px burgundy border, 4px burgundy glow ring
- **Pending step:** White circle, 2px `var(--border)` border, `var(--muted)` number
- **Connector line:** 2px, `var(--border)` → `var(--primary)` for done steps
- **Labels:** EB Garamond 600, 0.85rem

### 4.9 Admin Portal
- **Sidebar:** `var(--bg-warm)` background — warm white, not dark
- **Sidebar width:** 220px
- **Brand in sidebar:** Cormorant italic 700, 1.15rem, `var(--primary)` + Cinzel sub 0.52rem gold
- **Nav items:** EB Garamond 500, 1rem, `var(--text2)`
- **Active nav item:** Solid `var(--primary)` background, white text
- **Main area:** `#FAFAFA` background
- **Stat cards:** White, 1px `var(--border)`, 10px radius. Number: Cormorant 700, 1.7rem. Label: EB Garamond, 0.9rem.
- **Table header:** Cinzel, 0.6rem, `var(--gold)`, `var(--bg-warm)` row
- **Table body text:** Cormorant 700, 1.05rem for name; EB Garamond, 0.95rem for tier
- **Approved badge:** Green `#00823C` bg tint — universally understood
- **Pending badge:** Gold tint — `var(--gold)`

### 4.10 Footer
- **Top section:** `var(--white)` bg, 4 columns (Brand + Quick Links + Support + Contact)
- **Brand name:** Cormorant italic 700, 1.5rem, `var(--primary)`
- **Column headings:** Cinzel 600, 0.68rem, `var(--primary)`, underline `var(--border)`
- **Link text:** EB Garamond, 0.95rem, `var(--text2)`
- **Bottom strip:** `var(--primary)` full burgundy. Copyright: EB Garamond 0.9rem `rgba(255,217,160,0.75)`. Tagline: Cormorant italic 0.95rem gold.

---

## 5. Page-by-Page Scope

### 5.1 `index.html` (main site)
Sections to rewrite in order:
1. CSS variables block (`:root`) — full replacement
2. Global body/scrollbar/typography defaults
3. Navbar + mobile hamburger
4. Home page: Trust bar (new), Hero, Search bar (new), Stats, Features, Stories, About
5. Login page + Verify page
6. Signup page: Pre-steps, Step indicator, Form sections, Review/submit
7. Browse page: Filters, Profile card grid
8. Profile detail page
9. Dashboard page
10. Membership/tier page
11. Success stories page
12. Appointments page
13. Mobile responsive overrides

### 5.2 `Admin/index.html`
1. CSS variables (same token set)
2. Sidebar (light `var(--bg-warm)` — remove any dark treatment)
3. Dashboard stat cards
4. Member table
5. All form inputs and dropdowns
6. Modals and overlays

### 5.3 `landing.html`
1. CSS variables
2. Hero section
3. All cards and CTA sections
4. Footer

---

## 6. Implementation Rules

- **Never delete JavaScript** — only CSS and HTML structure changes. All IDs and classes referenced in JS must be preserved or aliased.
- **Grep before renaming any class** — check `index.html` JS section for references.
- **No new external dependencies** — same CDN fonts, same Firebase, same Razorpay.
- **Mobile-first** — all desktop styles already exist. Verify mobile overrides after each section.
- **One section at a time** — complete, test (visually), then move to next.
- **Hardcoded color sweep** — after CSS variables are replaced, grep for remaining `rgba(184,150,12`, `rgba(212,175,55`, `#8b0000`, `#7c3d52`, `#a0445e`, `#c87090` and replace all.

---

## 7. New / Changed Components

| Change | Location | Note |
|---|---|---|
| ✓ Checkmark bullets | Tier feature lists | Replace generic dashes — cleaner and more positive |
| Green/amber status badges | Admin table | Universally understood approved/pending signals |
| Pill buttons kept | Site-wide | More elegant than rectangles for a luxury matrimony brand |
| Frosted glass login card kept | Login page | Looks beautiful over the hero photo — distinctive |
| Ornamental decorators kept | Section headers, dividers | ✦ lines, italic tags — site's unique character |

---

## 8. What Does NOT Change

- All JavaScript logic and Firebase integration
- All HTML element IDs and data attributes
- All page routing (show/hide page logic)
- All form validation
- All Razorpay payment flows
- Font families (Cormorant Garamond, Cinzel, EB Garamond, Josefin Sans)
- Overall page/section structure and layout
