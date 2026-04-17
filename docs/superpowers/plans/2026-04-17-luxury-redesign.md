# Luxury Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken pink/mauve color tokens and tiny fonts across all 3 site files with a vibrant Burgundy & Gold palette and elderly-friendly typography — preserving the site's unique luxury serif aesthetic.

**Architecture:** All CSS is embedded in `<style>` blocks inside each HTML file. No build step, no external CSS. Changes are purely CSS edits (and 2 new HTML components added to `index.html`). JavaScript is never touched. The strategy is: replace the `:root` token block first, then sweep hardcoded rgba values, then refine each CSS section individually.

**Tech Stack:** Vanilla HTML/CSS — no framework. Firebase (untouched). Fonts: Cormorant Garamond, Cinzel, EB Garamond, Josefin Sans (unchanged). Deployed on Vercel (static).

**Design spec:** `docs/superpowers/specs/2026-04-17-luxury-redesign-design.md`

---

## File Map

| File | Lines | Role |
|---|---|---|
| `index.html` | 4558 | Main site — all public pages + CSS + JS |
| `Admin/index.html` | 2257 | Admin portal — member management |
| `landing.html` | 520 | Welcome/intro landing page |

CSS sections in `index.html` (by line):
- `:root` — L9–16
- NAV — L38–112
- HOME HERO — L119–198
- LOGIN PAGE — L199–331
- SIGNUP PAGES — L332–427
- DASHBOARD TOPBAR — L428–491
- DASHBOARD — L492–619
- MEMBERSHIP PAGE — L687–741
- FOOTER — L742–801
- MOBILE (`@media`) — L876–1158

---

## Task 1: Replace `:root` tokens in `index.html`

**Files:** Modify `index.html` L9–16

This is the most impactful single edit — updating the `:root` block automatically fixes every `var(--gold)`, `var(--crimson)`, `var(--border)` reference site-wide in one shot.

- [ ] **Step 1: Open `index.html` and locate the `:root` block (around line 9)**

It currently reads:
```css
:root{
  --gold:#7c3d52;--gold2:#a0445e;--gold3:#c87090;--gold4:#fdf0f3;
  --crimson:#8b0000;--crimson2:#a50000;
  --white:#fff;--offwhite:#fefcf8;--cream:#fdf8f0;
  --text:#1a0f00;--muted:#6b5340;
  --border:rgba(160,68,94,0.16);
  --nav-h:68px;
}
```

- [ ] **Step 2: Replace the entire `:root` block with the new tokens**

```css
:root{
  /* Burgundy primary */
  --crimson:#7B1F2E;--crimson2:#9B2F40;
  --primary:#7B1F2E;--primary2:#9B2F40;--primary-light:#FFF0F2;
  /* True warm gold (was mislabelled pink before) */
  --gold:#B8892A;--gold2:#8B5E3C;--gold3:#E8C4A0;--gold4:#FFF0F2;
  --gold-bg:#FDF3E0;
  /* Backgrounds */
  --white:#FFFFFF;--offwhite:#FAFAFA;--cream:#FFF8F5;
  --bg:#FAFAFA;--bg-warm:#FFF8F5;
  /* Text */
  --text:#1A0A08;--muted:#6B3A28;--text2:#4A2018;
  /* Borders & shadows */
  --border:#E8D5C8;
  --sh-soft:0 2px 16px rgba(123,31,46,0.08);
  --sh-card:0 4px 28px rgba(123,31,46,0.11);
  --sh-hover:0 12px 44px rgba(123,31,46,0.18);
  --sh-cta:0 6px 24px rgba(123,31,46,0.32);
  --nav-h:72px;
}
```

- [ ] **Step 3: Update `body` font-size from 17px to 18px**

Find (around line 19):
```css
body{font-family:'EB Garamond',serif;font-size:17px;
```
Change to:
```css
body{font-family:'EB Garamond',serif;font-size:18px;
```

- [ ] **Step 4: Update scrollbar thumb color**

Find:
```css
::-webkit-scrollbar-thumb{background:rgba(184,150,12,0.25);
```
Replace with:
```css
::-webkit-scrollbar-thumb{background:rgba(184,137,42,0.3);
```

- [ ] **Step 5: Open `index.html` in a browser and do a quick visual check**

At this point the whole site will shift — gold/pink labels become real amber gold, the crimson red becomes refined burgundy. The hero, nav, and cards should all show the new palette immediately. Confirm it looks warmer and more refined (not pink anymore).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "redesign: replace root CSS tokens — burgundy + gold palette, 18px base"
```

---

## Task 2: Sweep hardcoded rgba colors in `index.html`

**Files:** Modify `index.html`

~80 places in the file use raw `rgba(184,150,12,…)` and `rgba(212,175,55,…)` (old gold) and `rgba(139,0,0,…)` (old crimson) instead of CSS variables. This task replaces them all.

- [ ] **Step 1: Count occurrences to track progress**

```bash
grep -c "rgba(184,150,12\|rgba(212,175,55\|rgba(139,0,0\|rgba(160,68,94\|#8b0000\|#a50000" index.html
```

Note the number. It should reach 0 after this task.

- [ ] **Step 2: Replace all instances of the old gold `rgba(184,150,12` with the new gold**

In your editor, use Find & Replace (with regex if needed):

| Find | Replace with |
|---|---|
| `rgba(184,150,12,0.3)` | `rgba(184,137,42,0.3)` |
| `rgba(184,150,12,0.25)` | `rgba(184,137,42,0.25)` |
| `rgba(184,150,12,0.22)` | `rgba(184,137,42,0.22)` |
| `rgba(184,150,12,0.18)` | `rgba(184,137,42,0.18)` |
| `rgba(184,150,12,0.15)` | `rgba(184,137,42,0.15)` |
| `rgba(184,150,12,0.14)` | `rgba(184,137,42,0.14)` |
| `rgba(184,150,12,0.12)` | `rgba(184,137,42,0.12)` |
| `rgba(184,150,12,0.1)` | `rgba(184,137,42,0.1)` |
| `rgba(184,150,12,0.08)` | `rgba(184,137,42,0.08)` |
| `rgba(184,150,12,0.06)` | `rgba(184,137,42,0.06)` |

For any remaining `rgba(184,150,12,` variants not in the table above, replace the `184,150,12` part with `184,137,42`.

- [ ] **Step 3: Replace old amber `rgba(212,175,55`**

| Find | Replace with |
|---|---|
| `rgba(212,175,55,` | `rgba(184,137,42,` |

- [ ] **Step 4: Replace hardcoded crimson `#8b0000` and `#a50000`**

| Find | Replace with |
|---|---|
| `#8b0000` | `var(--primary)` |
| `#a50000` | `var(--primary2)` |
| `#600000` | `var(--primary)` |
| `rgba(139,0,0,` | `rgba(123,31,46,` |

- [ ] **Step 5: Replace old pink border color**

| Find | Replace with |
|---|---|
| `rgba(160,68,94,` | `rgba(184,137,42,` |

- [ ] **Step 6: Verify count is 0**

```bash
grep -c "rgba(184,150,12\|rgba(212,175,55\|rgba(139,0,0\|rgba(160,68,94\|#8b0000\|#a50000" index.html
```

Expected output: `0`

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "redesign: sweep all hardcoded color values in index.html"
```

---

## Task 3: Navbar CSS — `index.html`

**Files:** Modify `index.html` NAV section (~L38–112)

- [ ] **Step 1: Update `.navbar` background and shadow**

Find:
```css
.navbar{
  position:fixed;top:0;left:0;right:0;z-index:500;
  background:rgba(255,252,248,0.96);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  height:var(--nav-h);
```
Replace with:
```css
.navbar{
  position:fixed;top:0;left:0;right:0;z-index:500;
  background:rgba(255,255,255,0.97);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  height:var(--nav-h);
```

- [ ] **Step 2: Update `.nav-brand-text` sub label color**

Find:
```css
.nav-brand-text .nb-sub{font-family:'Josefin Sans',sans-serif;font-size:0.52rem;font-weight:300;letter-spacing:0.2em;color:#b8960c;
```
Replace with:
```css
.nav-brand-text .nb-sub{font-family:'Josefin Sans',sans-serif;font-size:0.55rem;font-weight:300;letter-spacing:0.2em;color:var(--gold2);
```

- [ ] **Step 3: Update nav link size**

Find:
```css
.nav-link{background:none;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:0.6rem;
```
Replace with:
```css
.nav-link{background:none;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:0.7rem;
```

- [ ] **Step 4: Update `.nav-brand-text .nb-main` color to use variable**

Find:
```css
.nav-brand-text .nb-main{
  font-family:'Cormorant Garamond',serif;
  font-size:1.12rem;font-weight:600;font-style:italic;
  color:var(--crimson);
```
This is already using `var(--crimson)` — the token update in Task 1 already fixed this. ✓ No change needed.

- [ ] **Step 5: Update nav button sizes for elderly readability**

Find `.btn-nav-in` and `.btn-nav-up`. Update their `font-size` from `0.48rem` to `0.62rem`:
```css
.btn-nav-in{
  ...
  font-size:0.62rem;font-weight:600;
  ...
}
.btn-nav-up{
  ...
  font-size:0.62rem;font-weight:600;
  ...
}
```

- [ ] **Step 6: Open browser, verify nav looks right**

Check: brand name in burgundy, nav links in warm brown → burgundy on hover/active, gold underline shimmer at bottom, buttons correctly sized.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "redesign: navbar — larger fonts, updated colors"
```

---

## Task 4: Hero section CSS — `index.html`

**Files:** Modify `index.html` HOME HERO section (~L119–198)

- [ ] **Step 1: Update hero overlay gradient**

Find:
```css
.hero-section::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.06) 25%,rgba(255,252,248,0.5) 72%,rgba(255,252,248,1) 100%);
}
```
Replace with:
```css
.hero-section::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(10,2,4,0.18) 0%,rgba(10,2,4,0.08) 35%,rgba(255,248,245,0.4) 78%,rgba(255,248,245,1) 100%);
}
```

- [ ] **Step 2: Update hero eyebrow tag — larger font**

Find:
```css
.hero-tag{font-family:'Cinzel',serif;font-size:0.52rem;font-weight:600;letter-spacing:0.38em;
```
Replace with:
```css
.hero-tag{font-family:'Cinzel',serif;font-size:0.62rem;font-weight:600;letter-spacing:0.32em;
```

- [ ] **Step 3: Update hero brand font size**

Find:
```css
.hero-brand{font-family:'Cinzel',serif;font-size:clamp(1.55rem,3.8vw,3rem);
```
Replace with:
```css
.hero-brand{font-family:'Cinzel',serif;font-size:clamp(2rem,4vw,3.2rem);
```

- [ ] **Step 4: Update hero subtitle size**

Find:
```css
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(1.6rem,3.2vw,2.6rem);
```
Replace with:
```css
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(1.3rem,2.5vw,1.6rem);
```

- [ ] **Step 5: Update hero button sizes**

Find:
```css
.hbtn{padding:0.88rem 2.4rem;cursor:pointer;font-family:'Cinzel',serif;font-size:0.53rem;font-weight:600;
```
Replace with:
```css
.hbtn{padding:0.88rem 2.4rem;cursor:pointer;font-family:'Cinzel',serif;font-size:0.68rem;font-weight:600;
```

- [ ] **Step 6: Update stats bar background**

Find:
```css
.stats-bar{background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1.8rem 4rem;
```
Replace with:
```css
.stats-bar{background:var(--gold-bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1.8rem 4rem;
```

- [ ] **Step 7: Update stat numbers and labels**

Find:
```css
.stat-n{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;color:var(--crimson);line-height:1;}
.stat-l{font-family:'Cinzel',serif;font-size:0.44rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);margin-top:0.3rem;}
```
Replace with:
```css
.stat-n{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:700;color:var(--primary);line-height:1;}
.stat-l{font-family:'EB Garamond',serif;font-size:1rem;font-weight:500;color:var(--text2);margin-top:0.25rem;}
```

- [ ] **Step 8: Update section headers**

Find:
```css
.sec-tag{font-family:'Cinzel',serif;font-size:0.48rem;font-weight:600;letter-spacing:0.26em;
```
Replace with:
```css
.sec-tag{font-family:'Cinzel',serif;font-size:0.65rem;font-weight:600;letter-spacing:0.22em;
```

Find:
```css
.sec-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:300;font-style:italic;color:var(--crimson);}
.sec-sub{font-family:'EB Garamond',serif;font-size:0.96rem;color:var(--muted);margin-top:0.5rem;}
```
Replace with:
```css
.sec-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;font-style:italic;color:var(--primary);}
.sec-sub{font-family:'EB Garamond',serif;font-size:1.05rem;color:var(--muted);margin-top:0.4rem;}
```

- [ ] **Step 9: Update feature card text sizes**

Find:
```css
.feat-title{font-family:'Cinzel',serif;font-size:0.65rem;font-weight:600;
```
Replace with:
```css
.feat-title{font-family:'Cinzel',serif;font-size:0.82rem;font-weight:600;
```

Find:
```css
.feat-text{font-family:'EB Garamond',serif;font-size:0.88rem;color:var(--muted);
```
Replace with:
```css
.feat-text{font-family:'EB Garamond',serif;font-size:1rem;color:var(--muted);
```

- [ ] **Step 10: Update story card text**

Find:
```css
.story-year{font-family:'Cinzel',serif;font-size:0.44rem;
```
Replace with:
```css
.story-year{font-family:'Cinzel',serif;font-size:0.62rem;
```

Find:
```css
.story-text{font-family:'EB Garamond',serif;font-size:0.88rem;
```
Replace with:
```css
.story-text{font-family:'EB Garamond',serif;font-size:1rem;
```

- [ ] **Step 11: Open browser, check home page**

Verify: stats bar has warm gold tint background, section titles are larger and burgundy, feature card titles readable, hero text bigger.

- [ ] **Step 12: Commit**

```bash
git add index.html
git commit -m "redesign: hero, stats, section headers, feature cards — larger fonts + new colors"
```

---

## Task 5: Login & Verify pages CSS — `index.html`

**Files:** Modify `index.html` LOGIN PAGE section (~L199–331)

- [ ] **Step 1: Update login glass card**

Find:
```css
.login-glass{
  position:relative;z-index:2;
  width:100%;max-width:420px;
  background:rgba(255,252,248,0.82);
```
Replace with:
```css
.login-glass{
  position:relative;z-index:2;
  width:100%;max-width:420px;
  background:rgba(255,255,255,0.9);
```

- [ ] **Step 2: Update login logo size**

Find:
```css
.lg-logo-inner{
  width:148px;height:148px;
```
Replace with:
```css
.lg-logo-inner{
  width:96px;height:96px;
```

Also find the outer ring and update to match:
```css
.lg-logo-ring::before{
  ...
  width:176px;height:176px;
```
Replace with:
```css
.lg-logo-ring::before{
  ...
  width:120px;height:120px;
```
And:
```css
.lg-logo-ring::after{
  ...
  width:160px;height:160px;
```
Replace with:
```css
.lg-logo-ring::after{
  ...
  width:108px;height:108px;
```

And the image inside:
```css
.lg-logo-inner img{
  width:128px;
```
Replace with:
```css
.lg-logo-inner img{
  width:80px;
```

- [ ] **Step 3: Update login form label sizes**

Find:
```css
.ui label{display:block;font-family:'Cinzel',serif;font-size:0.48rem;letter-spacing:0.18em;
```
Replace with:
```css
.ui label{display:block;font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:0.14em;
```

- [ ] **Step 4: Update login input text size**

Find:
```css
.ui input{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(184,150,12,0.22);outline:none;padding:0.52rem 0.2rem;font-family:'Cormorant Garamond',serif;font-size:1.05rem;
```
Replace with (note: rgba already updated in Task 2):
```css
.ui input{width:100%;background:transparent;border:none;border-bottom:1.5px solid var(--border);outline:none;padding:0.55rem 0.2rem;font-family:'Cormorant Garamond',serif;font-size:1.15rem;
```

- [ ] **Step 5: Update login title and subtitle**

Find:
```css
.lg-title{font-family:'Cinzel',serif;font-size:0.62rem;
```
Replace with:
```css
.lg-title{font-family:'Cinzel',serif;font-size:0.88rem;
```

Find:
```css
.lg-sub{font-family:'Cormorant Garamond',serif;font-size:0.82rem;font-style:italic;
```
Replace with:
```css
.lg-sub{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-style:italic;
```

- [ ] **Step 6: Update primary button size**

Find:
```css
.btn-prim{width:100%;padding:0.95rem;background:linear-gradient(135deg,var(--crimson),#600000);border:none;border-radius:50px;cursor:pointer;font-family:'Cinzel',serif;font-size:0.56rem;font-weight:600;letter-spacing:0.26em;
```
Replace with:
```css
.btn-prim{width:100%;padding:0.95rem;background:linear-gradient(135deg,var(--crimson),var(--crimson2));border:none;border-radius:50px;cursor:pointer;font-family:'Cinzel',serif;font-size:0.75rem;font-weight:600;letter-spacing:0.2em;
```

- [ ] **Step 7: Update secondary button**

Find:
```css
.btn-sec{width:100%;padding:0.82rem;background:transparent;border:1.5px solid rgba(184,150,12,0.32);border-radius:50px;cursor:pointer;font-family:'Cinzel',serif;font-size:0.52rem;
```
Replace with:
```css
.btn-sec{width:100%;padding:0.82rem;background:transparent;border:1.5px solid var(--border);border-radius:50px;cursor:pointer;font-family:'Cinzel',serif;font-size:0.65rem;
```

- [ ] **Step 8: Open browser, navigate to Login page and verify**

Check: card looks elegant over hero photo, logo is smaller and not dominating, labels are readable, input text is large, button text is clearly legible.

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "redesign: login card — larger inputs, labels, buttons; tighter logo"
```

---

## Task 6: Signup page CSS — `index.html`

**Files:** Modify `index.html` SIGNUP PAGES section (~L332–427)

- [ ] **Step 1: Update form section label sizes**

Find:
```css
.ff label{display:block;font-family:'Cinzel',serif;font-size:0.46rem;letter-spacing:0.16em;
```
Replace with:
```css
.ff label{display:block;font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:0.12em;
```

- [ ] **Step 2: Update form input text size**

Find:
```css
.ff input,.ff select,.ff textarea{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(184,150,12,0.18);outline:none;padding:0.48rem 0.2rem;font-family:'Cormorant Garamond',serif;font-size:0.98rem;
```
Replace with:
```css
.ff input,.ff select,.ff textarea{width:100%;background:transparent;border:none;border-bottom:1.5px solid var(--border);outline:none;padding:0.52rem 0.2rem;font-family:'Cormorant Garamond',serif;font-size:1.1rem;
```

- [ ] **Step 3: Update form section title**

Find:
```css
.form-sec-title{font-family:'Cinzel',serif;font-size:0.68rem;font-weight:600;letter-spacing:0.14em;
```
Replace with:
```css
.form-sec-title{font-family:'Cinzel',serif;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;
```

- [ ] **Step 4: Update step indicator styles**

Find:
```css
.step-circle{width:36px;height:36px;border:1.5px solid rgba(184,150,12,0.22);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.4rem;font-family:'Cinzel',serif;font-size:0.6rem;color:var(--muted);
```
Replace with:
```css
.step-circle{width:38px;height:38px;border:2px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.4rem;font-family:'Cinzel',serif;font-size:0.72rem;font-weight:600;color:var(--muted);
```

Find:
```css
.step-item.active .step-circle{background:var(--crimson);border-color:var(--crimson);color:#fff;}
.step-item.done .step-circle{background:var(--gold4);border-color:var(--gold2);color:var(--gold);}
```
Replace with:
```css
.step-item.active .step-circle{background:var(--white);border-color:var(--primary);color:var(--primary);box-shadow:0 0 0 4px rgba(123,31,46,0.12);}
.step-item.done .step-circle{background:var(--primary);border-color:var(--primary);color:#fff;}
```

- [ ] **Step 5: Update step labels**

Find:
```css
.step-item.active .step-lbl{color:var(--crimson);}
.step-item.done .step-lbl{color:var(--gold);}
```
Replace with:
```css
.step-item.active .step-lbl{color:var(--primary);font-weight:600;}
.step-item.done .step-lbl{color:var(--primary);}
```

- [ ] **Step 6: Update review section labels**

Find:
```css
.rev-sec-title{font-family:'Cinzel',serif;font-size:0.52rem;font-weight:700;letter-spacing:0.14em;
```
Replace with:
```css
.rev-sec-title{font-family:'Cinzel',serif;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;
```

Find:
```css
.rev-lbl{font-family:'Cinzel',serif;font-size:0.42rem;letter-spacing:0.12em;
```
Replace with:
```css
.rev-lbl{font-family:'Cinzel',serif;font-size:0.62rem;letter-spacing:0.08em;
```

- [ ] **Step 7: Update membership tier cards on signup**

Find:
```css
.tc-tier{border:1px solid rgba(184,150,12,0.2);border-radius:16px;padding:1.2rem 0.8rem;text-align:center;cursor:pointer;transition:all 0.3s;background:#fff;position:relative;overflow:hidden;}
```
Replace with:
```css
.tc-tier{border:1px solid var(--border);border-radius:16px;padding:1.4rem 0.9rem;text-align:center;cursor:pointer;transition:all 0.3s;background:var(--white);position:relative;overflow:hidden;box-shadow:var(--sh-soft);}
```

- [ ] **Step 8: Open browser, go to Register page, verify**

Check: step indicator — done steps solid burgundy with ✓, active step white circle with burgundy ring, form labels larger and clearly readable, input text comfortable size.

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "redesign: signup form — larger labels, inputs, step indicator restyle"
```

---

## Task 7: Browse page & profile cards CSS — `index.html`

**Files:** Modify `index.html` around browse/profile card section

- [ ] **Step 1: Find and update browse page filter labels**

Search for filter form label sizes in the browse section. Find any `font-size:0.4` or `font-size:0.5` Cinzel labels in `.fb-` prefixed classes:
```css
.fb-label{font-family:'Cinzel',serif;font-size:0.44rem;
```
Replace with:
```css
.fb-label{font-family:'Cinzel',serif;font-size:0.65rem;
```

- [ ] **Step 2: Update profile card name size**

Find:
```css
.prof-name{font-family:'Cormorant Garamond',serif;
```
(or similar — search for the profile card name class in your file)

Set to: `font-size:1.2rem; font-weight:700;`

- [ ] **Step 3: Update profile card meta text**

Any `.prof-meta` or similar detail text — update to `font-size:0.95rem`.

- [ ] **Step 4: Update verified badge**

Find the `.verified-badge` or similar class (text that says "✓ Verified"). Update its font-size from any value below 0.7rem to `font-size:0.82rem` using EB Garamond instead of Cinzel if currently using Cinzel.

- [ ] **Step 5: Update connect/interest buttons in browse**

Find browse page CTA buttons. Update font-size to `0.62rem` minimum, keep pill shape (border-radius:50px).

- [ ] **Step 6: Update membership tier badges on profile cards (Elite/Premium/VVIP tags)**

Find `.tier-badge` or similar tag on profile cards. Update `font-size` to `0.82rem` using EB Garamond.

- [ ] **Step 7: Open browser, go to Browse page, verify**

Check: filter labels readable, profile names large and clear, verified badge clearly visible, connect button easy to tap.

- [ ] **Step 8: Commit**

```bash
git add index.html
git commit -m "redesign: browse page — larger profile card text, filter labels, badges"
```

---

## Task 8: Dashboard & Membership pages CSS — `index.html`

**Files:** Modify `index.html` DASHBOARD section (~L492–619) and MEMBERSHIP PAGE (~L687–741)

- [ ] **Step 1: Update dashboard hero/topbar**

Find `.dash-hero` and related styles. Ensure background uses `var(--primary)` or warm gradient, not the old crimson. The token change in Task 1 handles most of this automatically — verify visually.

- [ ] **Step 2: Update dashboard stat card numbers**

Find any stat number class in dashboard (e.g., `.ds-n` or similar):
```css
font-size:2rem;  /* or whatever it currently is */
```
Update to `font-size:2.2rem; font-weight:700;`

- [ ] **Step 3: Update membership tier card text sizes**

Find `.mem-tier` or `.price-card` or similar membership tier styles. Update:
- Tier name: `font-size:1.05rem` Cinzel
- Price: `font-size:2.2rem` Cormorant
- Feature list: `font-size:0.95rem` EB Garamond, `line-height:2.1`
- CTA button: `font-size:0.65rem` Cinzel, pill shape

- [ ] **Step 4: Update membership tier feature bullet style**

Find existing feature list items in membership CSS. Change any dash `-` based pseudo-element bullets to checkmarks:
```css
.tier-feature li::before{content:'✓';color:var(--primary);font-weight:700;}
```

- [ ] **Step 5: Update the Elite "featured" tier card**

Find the `.tier-elite` or `.tc-tier.featured` or similar class. Ensure it has:
```css
border:2px solid var(--primary);
box-shadow:var(--sh-card), 0 0 0 1px rgba(123,31,46,0.2);
```

- [ ] **Step 6: Open browser, verify Dashboard and Membership pages**

Check: dashboard stats legible, membership tier cards clear, Elite card stands out cleanly, feature items readable.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "redesign: dashboard + membership tier cards — text sizes, checkmark bullets"
```

---

## Task 9: Footer CSS — `index.html`

**Files:** Modify `index.html` FOOTER section (~L742–801)

- [ ] **Step 1: Update footer container background**

Find:
```css
.site-footer{background:
```
(or whatever the footer class is). Change any dark background (`#1a0f00`, `#1c0a0a`, `var(--text)`) to `var(--white)`. Add border-top:

```css
.site-footer{background:var(--white);border-top:1px solid var(--border);}
```

- [ ] **Step 2: Update footer column headings**

Find footer heading styles. Update to:
```css
font-family:'Cinzel',serif;font-size:0.68rem;font-weight:600;letter-spacing:0.12em;color:var(--primary);
padding-bottom:0.5rem;border-bottom:1px solid var(--border);margin-bottom:0.8rem;
```

- [ ] **Step 3: Update footer link text**

Footer nav links: `font-family:'EB Garamond',serif; font-size:0.95rem; color:var(--text2);`

- [ ] **Step 4: Update footer brand name**

Footer brand: `font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; font-style:italic; color:var(--primary);`

- [ ] **Step 5: Update or add footer bottom strip**

The very bottom copyright row:
```css
.footer-bottom{
  background:var(--primary);
  padding:0.9rem 2.5rem;
  display:flex;justify-content:space-between;align-items:center;
}
.footer-copy{font-family:'EB Garamond',serif;font-size:0.9rem;color:rgba(255,217,160,0.75);}
.footer-tagline{font-family:'Cormorant Garamond',serif;font-size:0.95rem;font-style:italic;color:rgba(255,217,160,0.9);}
```

- [ ] **Step 6: Open browser, scroll to footer, verify**

Check: white footer body (not dark), burgundy bottom strip, column headings legible, link text readable.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "redesign: footer — light body with burgundy bottom strip"
```

---

## Task 10: Mobile responsive overrides — `index.html`

**Files:** Modify `index.html` `@media` section (~L876–1158)

- [ ] **Step 1: Update nav height in mobile query**

In the `@media` block, find any override of `--nav-h`. Update to `72px` to match the new desktop value, or if a smaller mobile value is preferred: `64px`.

- [ ] **Step 2: Update hero font sizes in mobile**

In the mobile `@media` block, find:
```css
/* ── HERO TEXT ── */
```
Ensure hero brand is at least `1.6rem` on mobile (it was smaller before). Update hero button font-size to `0.62rem` minimum on mobile.

- [ ] **Step 3: Update mobile stat labels**

In mobile query, ensure `.stat-l` is still at least `0.85rem` on mobile (not overridden to something tiny).

- [ ] **Step 4: Update mobile nav font sizes**

In mobile query, ensure any `.nav-link` overrides are at least `0.7rem`.

- [ ] **Step 5: Check form labels on mobile**

In mobile query, ensure `.ff label` and `.ui label` are not overridden below `0.62rem`.

- [ ] **Step 6: Open browser, resize to mobile width (375px), verify all pages**

Check: nav readable on mobile, hero text legible, form labels large enough, profile cards display correctly on 2 columns.

- [ ] **Step 7: Commit**

```bash
git add index.html
git commit -m "redesign: mobile responsive overrides — font size floors"
```

---

## Task 11: Full visual QA pass — `index.html`

**Files:** Read-only review of `index.html`

- [ ] **Step 1: Grep for any remaining old hex colors**

```bash
grep -n "#7c3d52\|#a0445e\|#c87090\|#8b0000\|#a50000\|#b8960c\|#d4af37" index.html
```

Expected: 0 results. If any remain, replace inline:
- `#b8960c` → `var(--gold)`
- `#d4af37` → `var(--gold)`
- Any remaining old values → appropriate new variable

- [ ] **Step 2: Grep for any remaining old rgba gold values**

```bash
grep -n "rgba(184,150,12\|rgba(212,175,55" index.html
```

Expected: 0 results.

- [ ] **Step 3: Check Cinzel font sizes — none below 0.6rem**

```bash
grep -n "Cinzel.*font-size:0\.[0-5][0-9]*rem\|font-size:0\.[0-5][0-9]*rem.*Cinzel" index.html
```

For any matches below `0.6rem`, update to `0.62rem` minimum.

- [ ] **Step 4: Open all pages in browser and do a walkthrough**

Navigate through: Home → Login → Signup (all steps) → Browse → Dashboard → Membership → Stories → Appointments

For each page check:
- No pink/mauve anywhere
- All labels readable without squinting
- All buttons have warm burgundy color
- Background is white/very warm white (not ash or dull cream)

- [ ] **Step 5: Commit final QA fixes**

```bash
git add index.html
git commit -m "redesign: index.html QA — final color sweep and font floor checks"
```

---

## Task 12: Admin portal — `Admin/index.html` tokens + sidebar

**Files:** Modify `Admin/index.html`

- [ ] **Step 1: Replace the `:root` block in `Admin/index.html`**

Find the `:root` block (will be near the top of the `<style>` tag). Replace with the same token set as `index.html` Task 1:

```css
:root{
  --crimson:#7B1F2E;--crimson2:#9B2F40;
  --primary:#7B1F2E;--primary2:#9B2F40;--primary-light:#FFF0F2;
  --gold:#B8892A;--gold2:#8B5E3C;--gold3:#E8C4A0;--gold4:#FFF0F2;
  --gold-bg:#FDF3E0;
  --white:#FFFFFF;--offwhite:#FAFAFA;--cream:#FFF8F5;
  --bg:#FAFAFA;--bg-warm:#FFF8F5;
  --text:#1A0A08;--muted:#6B3A28;--text2:#4A2018;
  --border:#E8D5C8;
  --sh-soft:0 2px 16px rgba(123,31,46,0.08);
  --sh-card:0 4px 28px rgba(123,31,46,0.11);
  --sh-hover:0 12px 44px rgba(123,31,46,0.18);
  --sh-cta:0 6px 24px rgba(123,31,46,0.32);
  --nav-h:72px;
}
```

- [ ] **Step 2: Sweep hardcoded colors in Admin/index.html**

```bash
grep -c "rgba(184,150,12\|rgba(212,175,55\|rgba(139,0,0\|#8b0000\|#a50000" Admin/index.html
```

Apply the same find-and-replace as Task 2 (replace `184,150,12` → `184,137,42`, `212,175,55` → `184,137,42`, `139,0,0` → `123,31,46`, `#8b0000` → `var(--primary)`).

- [ ] **Step 3: Update admin sidebar background**

Find the admin sidebar CSS (`/* ── ADMIN LAYOUT ──*/` section around L70). Find the sidebar background color — if it is dark (`#1a0f00`, `#1c0a0a`, or similar), update:
```css
.admin-sidebar{background:var(--bg-warm);border-right:1px solid var(--border);}
```

- [ ] **Step 4: Update admin sidebar nav item text**

Find sidebar nav item styles. Update text color to `var(--text2)` and font-size to `1rem`:
```css
.admin-nav-item{font-family:'EB Garamond',serif;font-size:1rem;font-weight:500;color:var(--text2);padding:0.55rem 0.8rem;border-radius:7px;}
```

- [ ] **Step 5: Update admin sidebar active state**

Find `.admin-nav-item.active` or `.admin-nav-item.act`:
```css
.admin-nav-item.active{background:var(--primary);color:#fff;}
```

- [ ] **Step 6: Update admin login page (if separate login form exists in Admin)**

Find `/* ── ADMIN LOGIN ──*/` section (~L20). Update form label sizes to `0.65rem`, input text to `1.1rem`, button text to `0.72rem`.

- [ ] **Step 7: Open Admin in browser, verify sidebar is light and readable**

Check: ivory sidebar with burgundy text, active item clearly highlighted in solid burgundy, no dark backgrounds.

- [ ] **Step 8: Commit**

```bash
git add Admin/index.html
git commit -m "redesign: admin portal — tokens, light sidebar, readable nav text"
```

---

## Task 13: Admin dashboard tables and modals — `Admin/index.html`

**Files:** Modify `Admin/index.html`

- [ ] **Step 1: Update admin stat cards**

Find stat/count cards in the admin dashboard. Update:
- Number: `font-family:'Cormorant Garamond',serif; font-size:1.7rem; font-weight:700; color:var(--primary);`
- Label: `font-family:'EB Garamond',serif; font-size:0.9rem; color:var(--muted);`
- Card background: `var(--white)`; border: `1px solid var(--border)`

- [ ] **Step 2: Update member table header**

Find table header row. Update:
```css
font-family:'Cinzel',serif;font-size:0.62rem;letter-spacing:0.1em;color:var(--gold2);
background:var(--bg-warm);
```

- [ ] **Step 3: Update table body text sizes**

Member name in table: `font-family:'Cormorant Garamond',serif; font-size:1.05rem; font-weight:600;`
Tier/status text: `font-family:'EB Garamond',serif; font-size:0.95rem;`

- [ ] **Step 4: Update status badge styles**

Find pending/approved badge classes. Replace:
- Approved: `background:rgba(0,130,60,0.1); color:#00823C; border:1px solid rgba(0,130,60,0.25);` — green is universally understood
- Pending: `background:rgba(184,137,42,0.12); color:var(--gold2); border:1px solid var(--border);`

- [ ] **Step 5: Update modal/overlay backgrounds**

Find any modal overlay — if background is dark, change to `rgba(26,10,8,0.45)` (warm dark scrim instead of pure black).

- [ ] **Step 6: Update form labels throughout admin**

Find admin form labels. Update any below `0.62rem` to `0.65rem` Cinzel. Update input text to `1.05rem`.

- [ ] **Step 7: Update custom dropdown styles**

Find `/* ── CUSTOM SELECT DROPDOWN (admin) ──*/` section. Ensure dropdown option text is at least `1rem` and border uses `var(--border)`.

- [ ] **Step 8: Run final color grep on Admin file**

```bash
grep -n "#7c3d52\|#a0445e\|#c87090\|#8b0000\|rgba(184,150,12\|rgba(212,175,55" Admin/index.html
```

Expected: 0 results.

- [ ] **Step 9: Open admin, do a full walkthrough**

Check: dashboard, member list, edit modal, appointments table. All text readable, no pink/mauve colors, sidebar light.

- [ ] **Step 10: Commit**

```bash
git add Admin/index.html
git commit -m "redesign: admin tables, modals, badges — green approved, gold pending, larger text"
```

---

## Task 14: Landing page — `landing.html`

**Files:** Modify `landing.html`

- [ ] **Step 1: Check if landing.html has its own `:root` block**

```bash
grep -n ":root" landing.html
```

If it has one, replace fully (same as Task 1). If it has none (inherits nothing since it's a separate file), add the full `:root` block from Task 1 inside its `<style>` tag.

- [ ] **Step 2: Sweep hardcoded colors**

```bash
grep -c "rgba(184,150,12\|rgba(212,175,55\|rgba(139,0,0\|#8b0000\|#7c3d52" landing.html
```

Apply the same replacements as Task 2.

- [ ] **Step 3: Update font sizes**

Grep for small Cinzel font-sizes:
```bash
grep -n "Cinzel.*0\.[0-5][0-9]*rem\|0\.[0-5][0-9]*rem.*Cinzel" landing.html
```

Update anything below `0.6rem` to at least `0.65rem`. Update body text below `0.9rem` to `1rem`.

- [ ] **Step 4: Update CTA button styles on landing page**

Find the main CTA button(s). Ensure:
- `font-size:0.68rem`
- `background:var(--primary)`
- Pill shape maintained

- [ ] **Step 5: Open `landing.html` in browser, verify**

Check: hero looks correct, text readable, CTA buttons burgundy and well-sized.

- [ ] **Step 6: Run final grep on landing.html**

```bash
grep -n "#7c3d52\|#a0445e\|#8b0000\|rgba(184,150,12\|rgba(212,175,55" landing.html
```

Expected: 0 results.

- [ ] **Step 7: Commit**

```bash
git add landing.html
git commit -m "redesign: landing.html — token sweep + font size updates"
```

---

## Task 15: Final cross-file QA and wrap-up

- [ ] **Step 1: Run color grep across all 3 files**

```bash
grep -rn "#7c3d52\|#a0445e\|#c87090\|#8b0000\|rgba(184,150,12\|rgba(212,175,55" index.html Admin/index.html landing.html
```

Expected: 0 results.

- [ ] **Step 2: Check nav height variable is consistent**

```bash
grep -n "nav-h\|68px" index.html Admin/index.html landing.html
```

All should use `72px` or `var(--nav-h)`.

- [ ] **Step 3: Open all 3 files side-by-side and do a final visual check**

For each file verify:
- ✅ No pink/mauve colors visible anywhere
- ✅ Stats and numbers are large and clear
- ✅ Form labels readable without squinting
- ✅ Buttons are pill-shaped and burgundy
- ✅ Login card frosted glass effect intact and beautiful
- ✅ Admin sidebar is warm light (not dark)
- ✅ Ornamental decorators (✦, italic titles, gold lines) still present
- ✅ Footer has warm light body + burgundy bottom strip

- [ ] **Step 4: Check mobile on all 3 files**

Open each in browser, resize to 375px width. Verify all text remains readable at mobile size.

- [ ] **Step 5: Final commit**

```bash
git add index.html Admin/index.html landing.html
git commit -m "redesign: final QA — all 3 files verified, luxury light theme complete"
```

---

## Self-Review Notes

**Spec coverage check:**
- ✅ Color system (CSS variables): Tasks 1, 12, 14
- ✅ Hardcoded color sweep: Tasks 2, 12, 14
- ✅ Typography scale (all sizes raised): Tasks 3–10
- ✅ Navbar: Task 3
- ✅ Hero + stats + features: Task 4
- ✅ Login card (frosted glass preserved): Task 5
- ✅ Signup + step indicator: Task 6
- ✅ Browse + profile cards: Task 7
- ✅ Dashboard + membership tiers: Task 8
- ✅ Footer (light + burgundy strip): Task 9
- ✅ Mobile overrides: Task 10
- ✅ Admin sidebar (light): Task 12
- ✅ Admin tables + badges: Task 13
- ✅ Landing page: Task 14
- ✅ Cross-file QA: Task 15

**What's NOT in this plan (intentionally):**
- New JS components (Quick Search Bar was removed from scope)
- Trust Bar (removed from scope)
- Any changes to Firebase, Razorpay, or page routing JS
