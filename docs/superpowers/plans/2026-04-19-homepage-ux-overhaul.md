# Homepage & UX Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `Main/index.html` into a warm luxury light-themed matrimony platform with a GSAP 3D drag carousel, landmark branch cards, traditional Indian aesthetic, and comprehensive UX improvements — while keeping all Firebase logic untouched.

**Architecture:** All CSS and JS changes are inline in `Main/index.html` (no build step). GSAP is already loaded via CDN. Lucide icons are added via CDN `<script>` tag. SVG landmarks are inline. Every change replaces or augments existing CSS/HTML blocks — no new files created.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP 3.12 + ScrollTrigger, Lucide Icons CDN, Firebase (untouched), Google Fonts (Cinzel, Cormorant Garamond, EB Garamond, Josefin Sans — all already loaded)

---

## File Map

| File | What changes |
|------|-------------|
| `Main/index.html` | CSS design system tokens, global effects, hero, stats, 3D carousel (replaces features-grid), process steps section, testimonials carousel, login redesign, logo ring, branches landmark SVGs, signup icon replacement + progress bar, dashboard welcome, browse enhancements, bottom nav, site-wide UX (WhatsApp, help, breadcrumbs, toasts) |
| `Main/landing.html` | **NOT TOUCHED** |
| `Admin/index.html` | **NOT TOUCHED** (admin sync is a separate plan) |

---

## Task 1: Design System — CSS Tokens & Typography

**Files:**
- Modify: `Main/index.html` — `:root` CSS block at top of `<style>` tag

### Goal
Replace all grey/ash values, establish warm color palette, enforce font sizes for senior accessibility, add global animation tokens.

- [ ] **Step 1: Add GSAP and Lucide to `<head>`**

Find the `<head>` section of `Main/index.html`. GSAP may already be there — check. Add what's missing:

```html
<!-- Add after existing Google Fonts link if not already present -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
<!-- Lucide icons — replaces all emoji structural icons -->
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js" defer></script>
```

- [ ] **Step 2: Replace the `:root` block**

Find the existing `:root { ... }` block (first occurrence in `<style>`). Replace it entirely with:

```css
:root{
  /* ── Primaries ── */
  --primary:       #7B1F2E;
  --primary-hover: #9B2F40;
  --primary-light: #FFF0F2;

  /* ── Gold — multi-stop metallic, never flat ── */
  --gold:          #B8892A;
  --gold-bright:   #D4AF37;
  --gold-metal:    linear-gradient(135deg,#C9A84C 0%,#E8C96A 28%,#B8892A 55%,#D4AF37 80%,#9A6C1A 100%);
  --gold-bg:       #FDF3E0;

  /* ── Backgrounds — all warm, zero ash or grey ── */
  --bg:            #FFFBF5;
  --bg-warm:       #FDF8EF;
  --bg-champagne:  #FAF0E6;
  --bg-blush:      #FFF8F5;
  --offwhite:      #FFFBF5;
  --cream:         #FDF8EF;
  --white:         #FFFFFF;

  /* ── Text — all warm brown, zero grey ── */
  --text:          #1A0A08;
  --text-body:     #3D1C0E;
  --text-sub:      #5C2E1A;
  --text-muted:    #7A4030;
  --muted:         #7A4030;

  /* ── Borders ── */
  --border:        #E8C98A;
  --border-light:  #F5E4CC;
  --crimson:       #7B1F2E;
  --crimson2:      #9B2F40;
  --gold2:         #8B5E3C;
  --gold3:         #E8C4A0;
  --gold4:         #FFF8EC;

  /* ── Shadows ── */
  --sh-soft:  0 2px 16px rgba(123,31,46,0.07);
  --sh-card:  0 4px 28px rgba(123,31,46,0.10);
  --sh-hover: 0 12px 44px rgba(123,31,46,0.18);
  --sh-gold:  0 8px 32px rgba(184,137,42,0.22);
  --sh-cta:   0 6px 24px rgba(123,31,46,0.30);

  /* ── Layout ── */
  --nav-h:72px;

  /* ── Animation tokens ── */
  --dur-fast:  150ms;
  --dur-mid:   280ms;
  --dur-slow:  500ms;
  --ease-out:  cubic-bezier(0.22,1,0.36,1);
}
```

- [ ] **Step 3: Update global body and base styles**

Find the `body { ... }` rule. Replace or update:
```css
body{
  font-family:'EB Garamond',serif;
  font-size:18px;          /* Senior-accessible — never below this */
  line-height:1.78;
  background:var(--bg);
  color:var(--text-body);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
}
```

Find any rule setting `color:var(--muted)` and confirm `--muted` now maps to warm terracotta `#7A4030` (not grey). No further change needed since the token is updated.

- [ ] **Step 4: Add global shimmer button effect**

Add this CSS block after the `:root` block:

```css
/* ── Shimmer sweep on all primary buttons ── */
.btn-prim,.hbtn.primary,.btn-nav-up{position:relative;overflow:hidden;}
.btn-prim::after,.hbtn.primary::after,.btn-nav-up::after{
  content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(105deg,transparent 40%,rgba(212,175,55,0.35) 50%,transparent 60%);
  transition:left 0.55s var(--ease-out);pointer-events:none;
}
.btn-prim:hover::after,.hbtn.primary:hover::after,.btn-nav-up:hover::after{left:140%;}

/* ── Reduced motion safety net ── */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
}

/* ── Gold card lift on hover ── */
.feat-card:hover,.story-card:hover,.branch-card:hover{
  transform:translateY(-8px);
  box-shadow:var(--sh-hover),0 0 0 1.5px var(--gold),var(--sh-gold);
}
```

- [ ] **Step 5: Verify in browser**

Open `Main/index.html` directly in Chrome. Confirm:
- Background is warm ivory (not white or ash)
- Body text is warm brown (not grey)
- Hovering a primary button shows a gold shimmer sweep

- [ ] **Step 6: Commit**

```bash
git add Main/index.html
git commit -m "feat: design system — warm tokens, no grey/ash, shimmer buttons

Replaces entire :root with warm ivory/gold/crimson palette.
All --muted and text colours are warm brown, zero grey.
Global shimmer sweep added to all primary buttons.
Body font-size 18px for senior accessibility."
```

---

## Task 2: Logo — Ornamental Gold Ring Frame

**Files:**
- Modify: `Main/index.html` — nav logo HTML (~line 1425), CSS for `.nav-logo-img` and new `.logo-ring`

### Goal
Wrap the existing logo image in a double golden ring SVG frame so it looks crafted and premium, not pasted-in.

- [ ] **Step 1: Add the logo ring CSS**

Add this CSS after the navbar styles:
```css
/* ── Logo ring frame ── */
.logo-ring-wrap{
  position:relative;display:inline-flex;align-items:center;justify-content:center;
  width:58px;height:58px;flex-shrink:0;
}
.logo-ring-wrap .logo-ring-svg{
  position:absolute;inset:0;width:100%;height:100%;pointer-events:none;
}
.logo-ring-wrap img{
  width:40px;height:40px;object-fit:contain;border-radius:50%;
  position:relative;z-index:1;
}
/* Large version for login card */
.logo-ring-wrap.lg{width:88px;height:88px;}
.logo-ring-wrap.lg img{width:62px;height:62px;}
/* Medium for footer */
.logo-ring-wrap.md{width:68px;height:68px;}
.logo-ring-wrap.md img{width:48px;height:48px;}
```

- [ ] **Step 2: Create the reusable logo ring HTML snippet**

Wherever the logo `<img>` appears in the nav (search for `nav-logo-img` or `navLogo`), replace the plain `<img>` tag with:

```html
<div class="logo-ring-wrap">
  <svg class="logo-ring-svg" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer glow -->
    <circle cx="29" cy="29" r="27" fill="rgba(184,137,42,0.08)"/>
    <!-- Outer ring -->
    <circle cx="29" cy="29" r="26" fill="none" stroke="url(#goldRing)" stroke-width="1.5"/>
    <!-- Inner ring -->
    <circle cx="29" cy="29" r="21" fill="none" stroke="rgba(184,137,42,0.45)" stroke-width="1"/>
    <!-- 4 diamond ornaments at compass points -->
    <path d="M29,3 L30.4,5.2 L29,7.4 L27.6,5.2Z" fill="#D4AF37"/>
    <path d="M29,51 L30.4,53.2 L29,55.4 L27.6,53.2Z" fill="#D4AF37"/>
    <path d="M3,29 L5.2,30.4 L7.4,29 L5.2,27.6Z" fill="#D4AF37"/>
    <path d="M51,29 L53.2,30.4 L55.4,29 L53.2,27.6Z" fill="#D4AF37"/>
    <defs>
      <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#C9A84C"/>
        <stop offset="30%" stop-color="#E8C96A"/>
        <stop offset="55%" stop-color="#B8892A"/>
        <stop offset="80%" stop-color="#D4AF37"/>
        <stop offset="100%" stop-color="#9A6C1A"/>
      </linearGradient>
    </defs>
  </svg>
  <img id="navLogo" src="" alt="NRMB Logo">
</div>
```

Note: if the logo loads dynamically (via JS setting `src`), keep the `id="navLogo"` on the `<img>` so existing JS still works.

- [ ] **Step 3: Verify in browser**

Confirm the logo appears with the double ring, four diamond ornaments, and a subtle warm glow. Logo image is clearly visible inside the ring.

- [ ] **Step 4: Commit**

```bash
git add Main/index.html
git commit -m "feat: logo — ornamental double gold ring SVG frame

Wraps nav logo in inline SVG double ring with four diamond ornaments
at compass points and metallic gold gradient. Logo image visible inside."
```

---

## Task 3: Hero Section — Fix Black Bars + Trust Badges + Typewriter

**Files:**
- Modify: `Main/index.html` — `.hero-section` CSS, hero HTML block

- [ ] **Step 1: Fix hero background image covering**

Find `.hero-section` CSS. Ensure these properties are set:
```css
.hero-section{
  background-size:cover;
  background-position:center center;
  background-repeat:no-repeat;
  /* Warm champagne fallback if photo doesn't load */
  background-color:#5A1520;
}
```

Also find where the hero background image URL is set via JS (search for `heroSec` or `backgroundImage` near the hero). Confirm it uses `background-size:cover` in both CSS and any inline style override. Remove any inline `background-size` that overrides the CSS rule.

- [ ] **Step 2: Add warm vignette overlay to hero**

Find the `.hero-section::before` rule. Replace with a warm champagne vignette (not dark):
```css
.hero-section::before{
  content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:
    /* Top edge — warm ivory fade */
    linear-gradient(to bottom, rgba(255,251,245,0.55) 0%, transparent 22%),
    /* Bottom edge — warm ivory fade to page */
    linear-gradient(to top, rgba(255,251,245,0.85) 0%, transparent 35%),
    /* Left/right soft edges */
    linear-gradient(to right, rgba(123,31,46,0.18) 0%, transparent 18%, transparent 82%, rgba(123,31,46,0.18) 100%);
}
```

- [ ] **Step 3: Add floating trust badge pills HTML**

Find the `.hero-content` div and add trust badges AFTER the CTA buttons:
```html
<div class="hero-trust-row">
  <div class="htrust-pill">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
    Verified Profiles
  </div>
  <div class="htrust-pill">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
    100% Confidential
  </div>
  <div class="htrust-pill">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    Est. 2000
  </div>
</div>
```

Add CSS:
```css
.hero-trust-row{
  display:flex;gap:0.7rem;justify-content:center;flex-wrap:wrap;
  margin-top:1.8rem;position:relative;z-index:2;
}
.htrust-pill{
  display:inline-flex;align-items:center;gap:0.4rem;
  background:rgba(255,251,245,0.88);backdrop-filter:blur(12px);
  border:1px solid rgba(184,137,42,0.4);border-radius:50px;
  padding:0.38rem 1rem;
  font-family:'Josefin Sans',sans-serif;font-size:0.7rem;font-weight:400;
  letter-spacing:0.08em;text-transform:uppercase;color:var(--primary);
}
.htrust-pill svg{color:var(--gold);flex-shrink:0;}
```

- [ ] **Step 4: Add typewriter effect to hero subheading**

Find `.hero-h1` element in HTML. Add `id="heroH1"` to it:
```html
<h1 class="hero-h1" id="heroH1"></h1>
```

Add this JS just before `</script>` near the top GSAP scripts, or after DOMContentLoaded fires:
```js
(function(){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.getElementById('heroH1').textContent='Where Sacred Traditions Meet Timeless Love';
    return;
  }
  const el=document.getElementById('heroH1');
  if(!el)return;
  const txt='Where Sacred Traditions Meet Timeless Love';
  let i=0;
  el.innerHTML='<span class="tw-cursor">|</span>';
  const iv=setInterval(()=>{
    if(i<=txt.length){
      el.innerHTML=txt.slice(0,i)+'<span class="tw-cursor">|</span>';
      i++;
    } else {
      clearInterval(iv);
      setTimeout(()=>{const c=el.querySelector('.tw-cursor');if(c)c.style.display='none';},900);
    }
  },42);
})();
```

Add CSS:
```css
.tw-cursor{
  display:inline-block;color:var(--gold-bright);
  animation:twBlink 0.8s step-end infinite;
  font-weight:300;margin-left:1px;
}
@keyframes twBlink{0%,100%{opacity:1;}50%{opacity:0;}}
```

- [ ] **Step 5: GSAP entrance for trust badges**

Add to existing GSAP hero entrance timeline (after `.from('.scroll-hint', ...)` or at the end of the hero tl):
```js
gsap.from('.htrust-pill',{
  opacity:0,y:14,stagger:0.12,duration:0.6,ease:'power2.out',delay:2.2
});
```

- [ ] **Step 6: Test in browser**

1. Open main site, confirm no black bars in hero on both desktop and mobile (DevTools → 375px iPhone view)
2. Confirm typewriter text plays once then cursor fades
3. Confirm three trust badge pills appear with GSAP entrance

- [ ] **Step 7: Commit**

```bash
git add Main/index.html
git commit -m "feat: hero — fix black bars, warm vignette, trust badge pills, typewriter"
```

---

## Task 4: Stats Bar — Count-up Animation + Gold Separators

**Files:**
- Modify: `Main/index.html` — `.stats-bar` CSS and JS

- [ ] **Step 1: Update stats bar CSS**

Find `.stats-bar` CSS rule. Replace/update:
```css
.stats-bar{
  background:var(--bg);
  border-top:1px solid var(--border-light);
  border-bottom:1px solid var(--border-light);
  display:flex;align-items:center;justify-content:center;
  flex-wrap:wrap;gap:0;
  padding:2rem 1rem;
}
.stat-item{
  text-align:center;
  padding:0.8rem 2.2rem;
  position:relative;
}
.stat-item:not(:last-child)::after{
  content:'◆';
  position:absolute;right:-0.2rem;top:50%;transform:translateY(-50%);
  color:var(--gold);font-size:0.55rem;opacity:0.6;
}
.stat-n{
  font-family:'Cinzel',serif;font-size:clamp(1.8rem,4vw,2.6rem);
  font-weight:700;color:var(--primary);line-height:1;
}
.stat-l{
  font-family:'Josefin Sans',sans-serif;font-size:0.78rem;
  font-weight:400;letter-spacing:0.1em;text-transform:uppercase;
  color:var(--text-sub);margin-top:0.3rem;
}
```

- [ ] **Step 2: Add count-up data attributes to stat items**

Find the stats bar HTML. Add `data-target` to each `.stat-n` element with the final number:
```html
<div class="stat-item">
  <div class="stat-n" data-target="10000" data-suffix="+">0+</div>
  <div class="stat-l">Registered Members</div>
</div>
<div class="stat-item">
  <div class="stat-n" data-target="4500" data-suffix="+">0+</div>
  <div class="stat-l">Successful Matches</div>
</div>
<div class="stat-item">
  <div class="stat-n" data-target="25" data-suffix="+">0+</div>
  <div class="stat-l">Years of Trust</div>
</div>
<div class="stat-item">
  <div class="stat-n" data-target="100" data-suffix="%">0%</div>
  <div class="stat-l">Verified Profiles</div>
</div>
<div class="stat-item">
  <div class="stat-n" data-target="50" data-suffix="+">0+</div>
  <div class="stat-l">Districts Covered</div>
</div>
```

- [ ] **Step 3: Add count-up JS**

Add this JS before `</script>` in the main script block:
```js
(function(){
  const statEls=document.querySelectorAll('.stat-n[data-target]');
  if(!statEls.length)return;
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      const target=parseInt(el.dataset.target,10);
      const suffix=el.dataset.suffix||'';
      const duration=1800;
      const start=performance.now();
      function tick(now){
        const elapsed=now-start;
        const progress=Math.min(elapsed/duration,1);
        const eased=1-Math.pow(1-progress,3); // ease-out cubic
        const current=Math.round(eased*target);
        el.textContent=(current>=1000?(current/1000).toFixed(1).replace('.0','')+'K':current)+suffix;
        if(progress<1)requestAnimationFrame(tick);
        else el.textContent=(target>=1000?(target/1000).toFixed(1).replace('.0','')+'K':target)+suffix;
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  statEls.forEach(el=>obs.observe(el));
})();
```

- [ ] **Step 4: Test**

Scroll stats into view — numbers should count up from 0. On 375px mobile, stats should wrap to 2-3 per row cleanly.

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: stats bar — count-up animation, gold separators, Cinzel numbers"
```

---

## Task 5: 3D Drag-to-Rotate Feature Carousel

**Files:**
- Modify: `Main/index.html` — replace `.features-grid` HTML and `.feat-card` CSS, add carousel JS

### Goal
Replace the flat 6-card grid with a GSAP 3D carousel. Cards are arranged in a circle on a tilted plane. User drags left/right to rotate. Active front card is full brightness; side/back cards are dimmer. Snaps to nearest card on release.

- [ ] **Step 1: Add carousel section wrapper CSS**

Add this CSS (replaces or supplements existing `.features-grid` styles):
```css
/* ── Carousel section ── */
.carousel-section{
  padding:5rem 0;
  position:relative;overflow:hidden;
  background:
    radial-gradient(ellipse 80% 60% at 20% 30%,rgba(253,243,224,0.92) 0%,transparent 60%),
    radial-gradient(ellipse 65% 55% at 80% 70%,rgba(255,240,242,0.75) 0%,transparent 58%),
    radial-gradient(ellipse 100% 80% at 50% 50%,#FAF0E6 0%,#FDF8EF 100%);
}
.carousel-section::before{
  content:'';position:absolute;inset:0;pointer-events:none;opacity:0.03;
  background-image:
    radial-gradient(circle,var(--gold) 1px,transparent 1px),
    radial-gradient(circle,var(--primary) 0.5px,transparent 0.5px);
  background-size:28px 28px,14px 14px;
  background-position:0 0,7px 7px;
}
/* Section heading */
.carousel-section .sec-hd{padding:0 1rem 2.5rem;}

/* Ornamental divider */
.orn-divider{
  display:flex;align-items:center;gap:1rem;
  justify-content:center;margin:0 auto 1rem;
}
.orn-divider::before,.orn-divider::after{
  content:'';flex:1;max-width:120px;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
}
.orn-divider span{
  color:var(--gold);font-size:0.75rem;letter-spacing:0.35em;
  font-family:'Josefin Sans',sans-serif;text-transform:uppercase;
}

/* Perspective container */
.carousel-viewport{
  perspective:1200px;
  height:320px;
  position:relative;
  display:flex;align-items:center;justify-content:center;
  cursor:grab;user-select:none;touch-action:pan-y;
}
.carousel-viewport:active{cursor:grabbing;}
.carousel-scene{
  width:0;height:0;
  transform-style:preserve-3d;
  will-change:transform;
}
/* Carousel cards */
.feat-card{
  position:absolute;
  width:200px;
  background:rgba(255,251,245,0.93);
  backdrop-filter:blur(18px) saturate(1.2);
  border:1.5px solid transparent;
  border-radius:18px;
  padding:1.6rem 1.4rem;
  text-align:center;
  box-shadow:var(--sh-card);
  transform-style:preserve-3d;
  transition:opacity 0.3s,filter 0.3s;
  pointer-events:none; /* JS handles interaction on viewport */
  /* Animated gold border chase */
  background-clip:padding-box;
  position:absolute;
  top:-130px; /* centre vertically */
  left:-100px; /* centre horizontally */
}
.feat-card::before{
  content:'';position:absolute;inset:-1.5px;border-radius:19px;z-index:-1;
  background:conic-gradient(from var(--_angle,0deg),transparent 70%,var(--gold-bright) 80%,transparent 90%);
  animation:borderSpin 3.5s linear infinite;
}
@property --_angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@keyframes borderSpin{to{--_angle:360deg;}}

.feat-card .feat-icon{
  display:flex;align-items:center;justify-content:center;
  width:48px;height:48px;margin:0 auto 0.9rem;
  background:rgba(123,31,46,0.07);border-radius:50%;
}
.feat-card .feat-icon svg{color:var(--primary);}
.feat-card .feat-title{
  font-family:'Cinzel',serif;font-size:0.95rem;font-weight:600;
  color:var(--primary);margin-bottom:0.5rem;line-height:1.3;
}
.feat-card .feat-text{
  font-family:'EB Garamond',serif;font-size:17px;
  color:var(--text-body);line-height:1.75;
}
/* Dot navigation */
.carousel-dots{
  display:flex;justify-content:center;gap:0.5rem;margin-top:2.2rem;
}
.cdot{
  width:8px;height:8px;border-radius:50%;
  background:rgba(184,137,42,0.3);cursor:pointer;
  transition:all 0.3s var(--ease-out);
}
.cdot.active{
  width:24px;border-radius:4px;
  background:var(--gold);
}
.carousel-hint{
  text-align:center;margin-top:1rem;
  font-family:'Josefin Sans',sans-serif;font-size:0.72rem;
  font-style:italic;color:var(--text-muted);letter-spacing:0.05em;
  transition:opacity 0.5s;
}
```

- [ ] **Step 2: Replace `.features-grid` HTML with carousel HTML**

Find this block in the HOME page HTML:
```html
<div class="sec-hd">
  <div class="sec-tag">Why Choose Us</div>
  ...
</div>
<div class="features-grid">
  <div class="feat-card">...
```

Replace from `<div class="sec-hd">` through the closing `</div>` of `.features-grid` with:

```html
<section class="carousel-section">
  <div class="sec-hd">
    <div class="orn-divider"><span>✦ &nbsp; &nbsp; ✦</span></div>
    <div class="sec-tag" style="font-family:'Josefin Sans',sans-serif;font-size:0.72rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);">Why Families Trust Us</div>
    <div class="sec-title" style="font-family:'Cinzel',serif;font-size:clamp(1.8rem,4vw,2.4rem);font-weight:600;color:var(--primary);margin:0.5rem 0;">A Legacy of Honour Since 2000</div>
    <div class="sec-sub">Serving the Reddy community with privacy, dignity and dedication</div>
  </div>

  <div class="carousel-viewport" id="carouselVP">
    <div class="carousel-scene" id="carouselScene">

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div class="feat-title">Complete Privacy</div>
        <div class="feat-text">Contact details never shared without mutual interest and bureau approval.</div>
      </div>

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <div class="feat-title">100% Verified</div>
        <div class="feat-text">Every profile is personally screened by our bureau team before going live.</div>
      </div>

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="feat-title">Community Exclusive</div>
        <div class="feat-text">Exclusively for the Reddy community, ensuring cultural and traditional compatibility.</div>
      </div>

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        </div>
        <div class="feat-title">Family Conversation</div>
        <div class="feat-text">Once contact is approved, families connect through our secure bureau channel.</div>
      </div>

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
        </div>
        <div class="feat-title">NRI Profiles</div>
        <div class="feat-text">Extensive database of NRI Reddy profiles from USA, UK, Canada, Australia and UAE.</div>
      </div>

      <div class="feat-card">
        <div class="feat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="feat-title">Personal Service</div>
        <div class="feat-text">Dedicated relationship managers guide you through every step of your journey.</div>
      </div>

    </div><!-- /scene -->
  </div><!-- /viewport -->

  <div class="carousel-dots" id="carouselDots"></div>
  <p class="carousel-hint" id="carouselHint">Drag left or right to explore →</p>
</section>
```

- [ ] **Step 3: Add carousel JS**

Add this script block immediately before the closing `</body>` tag (or in the main script block, after DOMContentLoaded):

```js
// ══════════════════════════════════════
// 3D DRAG CAROUSEL
// ══════════════════════════════════════
(function(){
  const vp=document.getElementById('carouselVP');
  const scene=document.getElementById('carouselScene');
  const cards=document.querySelectorAll('#carouselScene .feat-card');
  const dotsWrap=document.getElementById('carouselDots');
  const hint=document.getElementById('carouselHint');
  if(!vp||!scene||!cards.length)return;

  const N=cards.length;
  const RADIUS=window.innerWidth<500?190:290;
  const TILT=10; // degrees tilt on X axis
  let currentAngle=0;
  let targetAngle=0;
  let dragStartX=0;
  let isDragging=false;
  let hintDismissed=false;

  // Position cards around the circle
  function positionCards(){
    cards.forEach((card,i)=>{
      const angle=(360/N)*i;
      gsap.set(card,{
        rotationY:angle,
        translateZ:RADIUS,
        transformOrigin:'center center',
      });
    });
    gsap.set(scene,{rotationX:TILT,rotationY:0,transformStyle:'preserve-3d'});
  }
  positionCards();

  // Build dots
  const dots=[];
  for(let i=0;i<N;i++){
    const d=document.createElement('button');
    d.className='cdot'+(i===0?' active':'');
    d.setAttribute('aria-label','Go to card '+(i+1));
    d.onclick=()=>snapToCard(i);
    dotsWrap.appendChild(d);
    dots.push(d);
  }

  function getActiveIndex(){
    // Normalise angle to 0-360
    const norm=(((-currentAngle)%(360))+360)%360;
    const step=360/N;
    return Math.round(norm/step)%N;
  }

  function updateCards(){
    const norm=(((-currentAngle)%(360))+360)%360;
    const step=360/N;
    cards.forEach((card,i)=>{
      const cardAngle=(step*i);
      let diff=((norm-cardAngle)%360+360)%360;
      if(diff>180)diff=360-diff;
      const isFront=diff<(step/2);
      const brightness=isFront?1:Math.max(0.55,1-(diff/180)*0.45);
      card.style.filter=`brightness(${brightness})`;
      card.style.zIndex=isFront?'10':'1';
    });
    // Update dots
    const active=getActiveIndex();
    dots.forEach((d,i)=>d.classList.toggle('active',i===active));
  }

  function snapToCard(idx){
    const step=360/N;
    // Find nearest snap considering current rotation
    const norm=(((-currentAngle)%(360))+360)%360;
    const targetNorm=step*idx;
    let delta=targetNorm-norm;
    if(delta>180)delta-=360;
    if(delta<-180)delta+=360;
    targetAngle=currentAngle-delta;
    gsap.to(scene,{
      rotationY:targetAngle+TILT*0.1, // slight Y nudge for depth feel
      duration:0.65,ease:'power3.out',
      onUpdate:()=>{currentAngle=gsap.getProperty(scene,'rotationY');updateCards();}
    });
    // rotationX stays at TILT
    gsap.to(scene,{rotationX:TILT,duration:0.3,ease:'power2.out'});
    currentAngle=targetAngle;
  }

  // Drag handlers
  function onDragStart(clientX){
    isDragging=true;
    dragStartX=clientX;
    gsap.killTweensOf(scene);
    if(!hintDismissed&&hint){hint.style.opacity='0';hintDismissed=true;}
  }
  function onDragMove(clientX){
    if(!isDragging)return;
    const delta=(clientX-dragStartX)*0.4;
    gsap.set(scene,{rotationY:currentAngle+delta});
    updateCards();
  }
  function onDragEnd(clientX){
    if(!isDragging)return;
    isDragging=false;
    const delta=(clientX-dragStartX)*0.4;
    currentAngle+=delta;
    // Snap to nearest card
    const step=360/N;
    const norm=(((-currentAngle)%(360))+360)%360;
    const nearest=Math.round(norm/step)%N;
    snapToCard(nearest);
  }

  // Pointer events (desktop + mobile)
  vp.addEventListener('pointerdown',e=>{vp.setPointerCapture(e.pointerId);onDragStart(e.clientX);});
  vp.addEventListener('pointermove',e=>{onDragMove(e.clientX);});
  vp.addEventListener('pointerup',e=>{onDragEnd(e.clientX);});
  vp.addEventListener('pointercancel',e=>{onDragEnd(e.clientX);});

  // Touch events (belt-and-suspenders for older Android)
  vp.addEventListener('touchstart',e=>{onDragStart(e.touches[0].clientX);},{passive:true});
  vp.addEventListener('touchmove',e=>{onDragMove(e.touches[0].clientX);e.preventDefault();},{passive:false});
  vp.addEventListener('touchend',e=>{onDragEnd(e.changedTouches[0].clientX);});

  // Initial update
  updateCards();

  // GSAP scroll entrance
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('#carouselVP',{
    opacity:0,y:40,duration:0.8,ease:'power2.out',
    scrollTrigger:{trigger:'.carousel-section',start:'top 78%'}
  });
})();
```

- [ ] **Step 4: Test carousel**

1. Open main site → scroll to "Why Families Trust Us"
2. Desktop: click and drag left/right → cards rotate in 3D, snap on release
3. Mobile (DevTools 375px): touch and drag → same behaviour
4. Confirm 6 gold navigation dots appear and update as carousel rotates
5. Drag hint fades on first interaction
6. Confirm animated gold border chase on each card
7. Cards in background are dimmer than front card

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: 3D drag-to-rotate feature carousel replaces flat features-grid

GSAP 3D carousel with 6 cards on a tilted circular plane. Drag/touch
controlled with momentum snap. Animated gold border chase on cards.
Warm aurora gradient section background. SVG icons replace emojis."
```

---

## Task 6: "How We Work" — 4-Step Process Section

**Files:**
- Modify: `Main/index.html` — add new section after carousel section HTML, add CSS

- [ ] **Step 1: Add process section CSS**

```css
/* ── How We Work ── */
.process-section{padding:5rem 0;background:var(--bg-warm);}
.process-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1.5rem;
  max-width:1020px;margin:0 auto;padding:0 2rem;
}
@media(max-width:768px){.process-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.process-grid{grid-template-columns:1fr;}}
.process-card{
  background:var(--white);
  border-radius:18px;
  padding:1.8rem 1.4rem;
  border-top:4px solid var(--gold);
  box-shadow:var(--sh-soft);
  position:relative;overflow:hidden;
  transition:transform 0.28s var(--ease-out),box-shadow 0.28s;
}
.process-card:hover{transform:translateY(-6px);box-shadow:var(--sh-card);}
.process-num{
  font-family:'Cinzel',serif;font-size:3.8rem;font-weight:700;
  color:rgba(184,137,42,0.18);line-height:1;
  position:absolute;top:0.6rem;right:1rem;
}
.process-icon{
  width:44px;height:44px;
  background:rgba(123,31,46,0.07);border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  margin-bottom:1rem;
}
.process-icon svg{color:var(--primary);}
.process-title{
  font-family:'Cinzel',serif;font-size:1rem;font-weight:600;
  color:var(--primary);margin-bottom:0.5rem;
}
.process-text{
  font-family:'EB Garamond',serif;font-size:17px;
  color:var(--text-body);line-height:1.75;
}
```

- [ ] **Step 2: Add process section HTML after the carousel section**

```html
<section class="process-section">
  <div class="sec-hd">
    <div class="orn-divider"><span>✦ &nbsp; &nbsp; ✦</span></div>
    <div class="sec-tag" style="font-family:'Josefin Sans',sans-serif;font-size:0.72rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);">Simple &amp; Transparent</div>
    <div class="sec-title" style="font-family:'Cinzel',serif;font-size:clamp(1.8rem,4vw,2.4rem);font-weight:600;color:var(--primary);margin:0.5rem 0;">How We Work</div>
    <div class="sec-sub">Four simple steps from registration to your perfect match</div>
  </div>
  <div class="process-grid">
    <div class="process-card">
      <div class="process-num">01</div>
      <div class="process-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
      </div>
      <div class="process-title">Begin Your Story</div>
      <div class="process-text">Create your profile for free in just a few minutes — we guide you through every field.</div>
    </div>
    <div class="process-card">
      <div class="process-num">02</div>
      <div class="process-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
      </div>
      <div class="process-title">Bureau Verifies You</div>
      <div class="process-text">Our team personally reviews and approves your profile before it becomes visible to others.</div>
    </div>
    <div class="process-card">
      <div class="process-num">03</div>
      <div class="process-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div class="process-title">Meet Our Members</div>
      <div class="process-text">Browse verified profiles privately. Show interest to those who match your expectations.</div>
    </div>
    <div class="process-card">
      <div class="process-num">04</div>
      <div class="process-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      </div>
      <div class="process-title">Begin Your Journey</div>
      <div class="process-text">When both families show interest, our bureau facilitates the introduction and conversation.</div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add GSAP stagger entrance**

```js
gsap.from('.process-card',{
  opacity:0,y:36,stagger:0.15,duration:0.7,ease:'power2.out',
  scrollTrigger:{trigger:'.process-section',start:'top 78%'}
});
```

- [ ] **Step 4: Test**

Process cards stagger-enter on scroll. On mobile 375px: 1 column. On 768px: 2 columns. On desktop: 4 columns.

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: add How We Work 4-step process section with GSAP stagger"
```

---

## Task 7: Login Page — Glassmorphism Redesign

**Files:**
- Modify: `Main/index.html` — `.login-glass` CSS and `#pgLogin` HTML

- [ ] **Step 1: Update login page background**

Find `#pgLogin` CSS or the page div itself. Add:
```css
#pgLogin{
  min-height:100vh;
  display:flex;align-items:center;justify-content:center;
  position:relative;
  /* Blurred couple photo background — image set via JS same as heroSec */
  background-size:cover!important;
  background-position:center center!important;
  background-color:#5A1520; /* warm fallback */
}
#pgLogin::before{
  content:'';position:absolute;inset:0;z-index:0;
  backdrop-filter:blur(28px) saturate(0.8);
  background:rgba(253,243,224,0.38);
}
```

Update the JS that sets background images (search for `loginLogo` or where `bg1` is set on pages) to also apply the background image to `#pgLogin`:
```js
const loginPage=document.getElementById('pgLogin');
if(loginPage && IMGS.bg1){
  loginPage.style.backgroundImage=`url('data:image/jpeg;base64,${IMGS.bg1}')`;
}
```

- [ ] **Step 2: Update login card CSS**

Find `.login-glass` CSS. Replace with:
```css
.login-glass{
  background:rgba(255,251,245,0.91);
  backdrop-filter:blur(32px) saturate(1.4);
  border:1.5px solid rgba(184,137,42,0.45);
  border-radius:24px;
  padding:2.4rem 2rem;
  width:100%;max-width:420px;
  position:relative;z-index:1;
  box-shadow:
    0 0 0 1px rgba(255,251,245,0.5),
    var(--sh-hover),
    0 0 80px rgba(184,137,42,0.14);
}
```

- [ ] **Step 3: Add logo ring + welcome copy to login card**

Find the login card HTML (`<div class="login-glass">`). Replace the content at the top with:
```html
<div class="login-glass">
  <!-- Logo -->
  <div style="text-align:center;margin-bottom:1.2rem;">
    <div class="logo-ring-wrap lg" style="margin:0 auto;">
      <svg class="logo-ring-svg" viewBox="0 0 88 88" xmlns="http://www.w3.org/2000/svg">
        <circle cx="44" cy="44" r="41" fill="rgba(184,137,42,0.08)"/>
        <circle cx="44" cy="44" r="40" fill="none" stroke="url(#goldRingLg)" stroke-width="2"/>
        <circle cx="44" cy="44" r="32" fill="none" stroke="rgba(184,137,42,0.4)" stroke-width="1"/>
        <path d="M44,4 L45.8,7 L44,10 L42.2,7Z" fill="#D4AF37"/>
        <path d="M44,78 L45.8,81 L44,84 L42.2,81Z" fill="#D4AF37"/>
        <path d="M4,44 L7,45.8 L10,44 L7,42.2Z" fill="#D4AF37"/>
        <path d="M78,44 L81,45.8 L84,44 L81,42.2Z" fill="#D4AF37"/>
        <defs>
          <linearGradient id="goldRingLg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C9A84C"/>
            <stop offset="30%" stop-color="#E8C96A"/>
            <stop offset="55%" stop-color="#B8892A"/>
            <stop offset="80%" stop-color="#D4AF37"/>
            <stop offset="100%" stop-color="#9A6C1A"/>
          </linearGradient>
        </defs>
      </svg>
      <img id="loginLogo" src="" alt="NRMB">
    </div>
  </div>
  <!-- Welcome copy -->
  <div style="text-align:center;margin-bottom:1.4rem;">
    <div style="font-family:'Josefin Sans',sans-serif;font-size:0.68rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem;">Welcome Back</div>
    <div class="lg-title" style="font-family:'Cinzel',serif;font-size:1.25rem;font-weight:700;color:var(--primary);">Naveen Reddy Marriage Bureau</div>
    <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:1rem;color:var(--text-body);margin-top:0.25rem;">A sacred journey continues here</div>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0.9rem auto 0;"></div>
  </div>
  <!-- keep all existing login form fields below this point unchanged -->
```

Make sure all existing login inputs (`#lu`, `#lp`, buttons, Google sign-in, etc.) remain below — do not remove them.

- [ ] **Step 4: Test**

Open login page. Confirm: blurred warm bokeh background, luminous glass card with gold border glow, large logo ring at top, welcome copy in correct fonts. On mobile 375px: card fits within screen width.

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: login page — glassmorphism card on blurred photo, ornamental logo, warm copy"
```

---

## Task 8: Branches Page — Landmark SVG Cards

**Files:**
- Modify: `Main/index.html` — branch card HTML (4 cards in `#branchGrid`), `.branch-city-icon` CSS

- [ ] **Step 1: Add landmark header CSS**

Find `.branch-city-icon` CSS. Replace with:
```css
.branch-landmark-header{
  height:130px;display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:0.5rem;overflow:hidden;border-radius:20px 20px 0 0;
  position:relative;
}
.branch-landmark-header svg{
  width:100%;height:100%;
  transition:transform 0.35s var(--ease-out);
}
.branch-card:hover .branch-landmark-header svg{transform:scale(1.05);}
```

- [ ] **Step 2: Replace all 4 branch card bodies with landmark SVGs**

Find `<div id="branchGrid">` and replace the 4 `branch-card` divs:

```html
<div id="branchGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1.5rem;max-width:1020px;margin:0 auto;padding:0 2rem 2rem;position:relative;z-index:1;">

  <!-- SOMAJIGUDA — Hussain Sagar Buddha -->
  <div class="branch-card" onclick="openBranch('hyd')">
    <div class="branch-landmark-header">
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FDF3E0"/>
            <stop offset="100%" stop-color="#FAF0E6"/>
          </linearGradient>
        </defs>
        <rect width="220" height="130" fill="url(#sky1)"/>
        <!-- Water surface -->
        <ellipse cx="110" cy="122" rx="95" ry="10" fill="rgba(184,137,42,0.12)"/>
        <ellipse cx="110" cy="119" rx="80" ry="5" fill="rgba(184,137,42,0.08)"/>
        <!-- Rock pedestal -->
        <ellipse cx="110" cy="112" rx="22" ry="8" fill="#7B1F2E" opacity="0.85"/>
        <rect x="95" y="94" width="30" height="20" rx="3" fill="#7B1F2E" opacity="0.85"/>
        <!-- Lotus base -->
        <ellipse cx="110" cy="94" rx="20" ry="5" fill="#9B2F40" opacity="0.7"/>
        <!-- Buddha body — seated -->
        <!-- Legs (wide base) -->
        <ellipse cx="110" cy="90" rx="18" ry="6" fill="#7B1F2E"/>
        <!-- Robe torso -->
        <path d="M96,89 Q102,55 118,89 Z" fill="#7B1F2E"/>
        <!-- Right arm -->
        <path d="M117,75 Q126,78 122,86" stroke="#7B1F2E" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Left arm -->
        <path d="M103,75 Q94,78 98,86" stroke="#7B1F2E" stroke-width="5" fill="none" stroke-linecap="round"/>
        <!-- Hands in lap -->
        <ellipse cx="110" cy="84" rx="11" ry="4" fill="#7B1F2E"/>
        <!-- Head -->
        <circle cx="110" cy="56" r="13" fill="#7B1F2E"/>
        <!-- Ushnisha (topknot) -->
        <ellipse cx="110" cy="44" rx="6" ry="9" fill="#7B1F2E"/>
        <!-- Ears -->
        <ellipse cx="97" cy="57" rx="3" ry="5" fill="#7B1F2E"/>
        <ellipse cx="123" cy="57" rx="3" ry="5" fill="#7B1F2E"/>
        <!-- Halo -->
        <circle cx="110" cy="56" r="18" fill="none" stroke="rgba(184,137,42,0.35)" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Stars -->
        <circle cx="40" cy="22" r="1.2" fill="rgba(184,137,42,0.5)"/>
        <circle cx="178" cy="18" r="1" fill="rgba(184,137,42,0.4)"/>
        <circle cx="60" cy="40" r="0.8" fill="rgba(184,137,42,0.3)"/>
      </svg>
    </div>
    <div class="branch-city">Somajiguda</div>
    <div class="branch-state">Hyderabad — Head Office</div>
    <div class="branch-tap">Tap to view details →</div>
  </div>

  <!-- KOTHAPET — Charminar -->
  <div class="branch-card" onclick="openBranch('ktp')">
    <div class="branch-landmark-header">
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FDF8EC"/>
            <stop offset="100%" stop-color="#FAF0E6"/>
          </linearGradient>
        </defs>
        <rect width="220" height="130" fill="url(#sky2)"/>
        <!-- Ground -->
        <rect x="0" y="118" width="220" height="12" fill="rgba(184,137,42,0.1)"/>
        <!-- Central arch body -->
        <rect x="88" y="68" width="44" height="52" fill="#7B1F2E" opacity="0.85"/>
        <!-- Central arch opening -->
        <path d="M96,118 L96,85 Q110,72 124,85 L124,118 Z" fill="url(#sky2)"/>
        <!-- Arch decorative band -->
        <rect x="85" y="66" width="50" height="5" fill="#9B2F40" opacity="0.7"/>
        <!-- 4 Minarets -->
        <!-- Left outer -->
        <rect x="60" y="80" width="14" height="40" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="67" cy="80" rx="7" ry="4" fill="#9B2F40" opacity="0.9"/>
        <ellipse cx="67" cy="76" rx="5" ry="5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M64,72 L67,62 L70,72Z" fill="#B8892A"/>
        <!-- Left inner -->
        <rect x="78" y="84" width="12" height="36" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="84" cy="84" rx="6" ry="3.5" fill="#9B2F40" opacity="0.9"/>
        <ellipse cx="84" cy="80.5" rx="4.5" ry="4.5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M81.5,77 L84,68 L86.5,77Z" fill="#B8892A"/>
        <!-- Right inner -->
        <rect x="130" y="84" width="12" height="36" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="136" cy="84" rx="6" ry="3.5" fill="#9B2F40" opacity="0.9"/>
        <ellipse cx="136" cy="80.5" rx="4.5" ry="4.5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M133.5,77 L136,68 L138.5,77Z" fill="#B8892A"/>
        <!-- Right outer -->
        <rect x="146" y="80" width="14" height="40" fill="#7B1F2E" opacity="0.8" rx="2"/>
        <ellipse cx="153" cy="80" rx="7" ry="4" fill="#9B2F40" opacity="0.9"/>
        <ellipse cx="153" cy="76" rx="5" ry="5" fill="#7B1F2E" opacity="0.9"/>
        <path d="M150,72 L153,62 L156,72Z" fill="#B8892A"/>
        <!-- Clock face decoration -->
        <circle cx="110" cy="52" r="8" fill="none" stroke="rgba(184,137,42,0.5)" stroke-width="1.5"/>
        <circle cx="110" cy="52" r="2" fill="rgba(184,137,42,0.5)"/>
      </svg>
    </div>
    <div class="branch-city">Kothapet</div>
    <div class="branch-state">Dilsukhnagar, Hyderabad</div>
    <div class="branch-tap">Tap to view details →</div>
  </div>

  <!-- WARANGAL — Kakatiya Kala Thoranam -->
  <div class="branch-card" onclick="openBranch('wgl')">
    <div class="branch-landmark-header">
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFF5F5"/>
            <stop offset="100%" stop-color="#FAEAE6"/>
          </linearGradient>
        </defs>
        <rect width="220" height="130" fill="url(#sky3)"/>
        <!-- Ground -->
        <rect x="0" y="116" width="220" height="14" fill="rgba(184,137,42,0.1)"/>
        <!-- Left pillar -->
        <rect x="32" y="70" width="22" height="48" rx="2" fill="#7B1F2E" opacity="0.85"/>
        <!-- Left arch -->
        <path d="M32,85 Q43,58 54,85" fill="none" stroke="#7B1F2E" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
        <!-- Left pillar cap -->
        <ellipse cx="43" cy="70" rx="13" ry="5" fill="#9B2F40" opacity="0.8"/>
        <!-- Left finial -->
        <path d="M40,66 L43,54 L46,66Z" fill="#B8892A"/>
        <circle cx="43" cy="53" r="3" fill="#D4AF37"/>

        <!-- Centre pillar left -->
        <rect x="88" y="60" width="22" height="58" rx="2" fill="#7B1F2E" opacity="0.9"/>
        <!-- Centre arch -->
        <path d="M88,80 Q99,44 110,80" fill="none" stroke="#7B1F2E" stroke-width="10" stroke-linecap="round" opacity="0.9"/>
        <!-- Centre pillar cap -->
        <ellipse cx="99" cy="60" rx="14" ry="5.5" fill="#9B2F40" opacity="0.85"/>
        <!-- Centre finial -->
        <path d="M96,55 L99,40 L102,55Z" fill="#B8892A"/>
        <circle cx="99" cy="39" r="4" fill="#D4AF37"/>
        <!-- Lotus at crown -->
        <ellipse cx="99" cy="35" rx="6" ry="3" fill="rgba(184,137,42,0.5)"/>

        <!-- Centre pillar right -->
        <rect x="110" y="60" width="22" height="58" rx="2" fill="#7B1F2E" opacity="0.9"/>
        <path d="M110,80 Q121,44 132,80" fill="none" stroke="#7B1F2E" stroke-width="10" stroke-linecap="round" opacity="0.9"/>
        <ellipse cx="121" cy="60" rx="14" ry="5.5" fill="#9B2F40" opacity="0.85"/>
        <path d="M118,55 L121,40 L124,55Z" fill="#B8892A"/>
        <circle cx="121" cy="39" r="4" fill="#D4AF37"/>

        <!-- Right pillar -->
        <rect x="166" y="70" width="22" height="48" rx="2" fill="#7B1F2E" opacity="0.85"/>
        <path d="M166,85 Q177,58 188,85" fill="none" stroke="#7B1F2E" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
        <ellipse cx="177" cy="70" rx="13" ry="5" fill="#9B2F40" opacity="0.8"/>
        <path d="M174,66 L177,54 L180,66Z" fill="#B8892A"/>
        <circle cx="177" cy="53" r="3" fill="#D4AF37"/>

        <!-- Decorative horizontal band connecting pillars -->
        <rect x="32" y="96" width="156" height="4" rx="2" fill="rgba(123,31,46,0.3)"/>
        <rect x="32" y="104" width="156" height="2" rx="1" fill="rgba(184,137,42,0.3)"/>
      </svg>
    </div>
    <div class="branch-city">Warangal</div>
    <div class="branch-state">Hanamkonda, Telangana</div>
    <div class="branch-tap">Tap to view details →</div>
  </div>

  <!-- KARIMNAGAR — Elgandal Fort -->
  <div class="branch-card" onclick="openBranch('krm')">
    <div class="branch-landmark-header">
      <svg viewBox="0 0 220 130" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FEF9EC"/>
            <stop offset="100%" stop-color="#FAF0E0"/>
          </linearGradient>
        </defs>
        <rect width="220" height="130" fill="url(#sky4)"/>
        <!-- River at base -->
        <ellipse cx="110" cy="125" rx="105" ry="10" fill="rgba(184,137,42,0.1)"/>
        <path d="M0,118 Q55,112 110,116 Q165,120 220,118 L220,130 L0,130Z" fill="rgba(184,137,42,0.12)"/>
        <!-- Rocky hill silhouette -->
        <path d="M30,118 Q50,95 70,88 Q85,82 95,68 Q105,56 110,52 Q115,56 125,68 Q135,82 150,88 Q170,95 190,118Z" fill="rgba(184,137,42,0.15)"/>
        <path d="M50,118 Q70,98 90,88 Q100,83 107,72 Q109,65 110,60 Q111,65 113,72 Q120,83 130,88 Q150,98 170,118Z" fill="#7B1F2E" opacity="0.18"/>
        <!-- Fort walls on top of hill -->
        <path d="M85,72 L85,58 L90,58 L90,62 L96,62 L96,58 L102,58 L102,62 L108,62 L108,58 L112,58 L112,62 L118,62 L118,58 L124,58 L124,62 L130,62 L130,58 L135,58 L135,72Z" fill="#7B1F2E" opacity="0.88"/>
        <!-- Fort wall base -->
        <rect x="82" y="72" width="56" height="8" rx="1" fill="#7B1F2E" opacity="0.85"/>
        <!-- Tower left -->
        <rect x="78" y="54" width="14" height="26" rx="2" fill="#9B2F40" opacity="0.85"/>
        <rect x="76" y="52" width="18" height="5" rx="1" fill="#7B1F2E" opacity="0.9"/>
        <!-- Battlements on left tower -->
        <rect x="78" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <rect x="84" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <rect x="90" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <!-- Tower right -->
        <rect x="128" y="54" width="14" height="26" rx="2" fill="#9B2F40" opacity="0.85"/>
        <rect x="126" y="52" width="18" height="5" rx="1" fill="#7B1F2E" opacity="0.9"/>
        <rect x="128" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <rect x="134" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <rect x="140" y="47" width="4" height="6" fill="#7B1F2E" opacity="0.9"/>
        <!-- Fort gate arch -->
        <rect x="100" y="64" width="20" height="16" rx="1" fill="url(#sky4)"/>
        <path d="M100,72 Q110,62 120,72" fill="#7B1F2E" opacity="0.15"/>
        <!-- Flag -->
        <line x1="110" y1="47" x2="110" y2="28" stroke="#B8892A" stroke-width="1.5"/>
        <path d="M110,28 L122,33 L110,38Z" fill="#D4AF37"/>
        <!-- Winding path up hill -->
        <path d="M60,118 Q68,110 76,100 Q82,92 86,82" stroke="rgba(184,137,42,0.3)" stroke-width="2" fill="none" stroke-dasharray="3 3"/>
      </svg>
    </div>
    <div class="branch-city">Karimnagar</div>
    <div class="branch-state">Telangana</div>
    <div class="branch-tap">Tap to view details →</div>
  </div>

</div>
```

- [ ] **Step 3: Test**

Each branch card shows its landmark SVG illustration. On hover: landmark scales up slightly. Cards show correct city names and landmarks: Buddha (Somajiguda), Charminar (Kothapet), Kakatiya gateway (Warangal), Elgandal Fort (Karimnagar).

- [ ] **Step 4: Commit**

```bash
git add Main/index.html
git commit -m "feat: branches — inline SVG landmark illustrations for all 4 offices

Hussain Sagar Buddha (Somajiguda), Charminar (Kothapet),
Kakatiya Kala Thoranam (Warangal), Elgandal Fort (Karimnagar).
All SVGs use crimson/gold palette, no external images."
```

---

## Task 9: Signup Page — SVG Icons + Progress Bar

**Files:**
- Modify: `Main/index.html` — `#preStepA` HTML, `.psf-card` CSS, add progress bar HTML/CSS/JS

- [ ] **Step 1: Replace emoji icons in "Who is this for?" cards**

Find `#preStepA` HTML block. Replace the 6 `.psf-card` divs:
```html
<div class="psf-card" onclick="selectProfileFor('Myself','')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  </div>
  <div class="psf-card-lbl">Myself</div>
</div>
<div class="psf-card" onclick="selectProfileFor('My Son','Male')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="3"/><polyline points="21 3 23 3 23 5"/></svg>
  </div>
  <div class="psf-card-lbl">My Son</div>
</div>
<div class="psf-card" onclick="selectProfileFor('My Daughter','Female')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/><circle cx="19" cy="5" r="2"/><line x1="19" y1="7" x2="19" y2="11"/><line x1="17" y1="9" x2="21" y2="9"/></svg>
  </div>
  <div class="psf-card-lbl">My Daughter</div>
</div>
<div class="psf-card" onclick="selectProfileFor('My Brother','Male')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  </div>
  <div class="psf-card-lbl">My Brother</div>
</div>
<div class="psf-card" onclick="selectProfileFor('My Sister','Female')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  </div>
  <div class="psf-card-lbl">My Sister</div>
</div>
<div class="psf-card" onclick="selectProfileFor('A Friend','')">
  <div class="psf-card-icon">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
  </div>
  <div class="psf-card-lbl">A Friend</div>
</div>
```

- [ ] **Step 2: Update `.psf-card-icon` CSS**

Find `.psf-card-icon` or `.psf-card` CSS. Ensure:
```css
.psf-card-icon{
  width:52px;height:52px;
  background:rgba(123,31,46,0.07);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 0.6rem;
  transition:background 0.25s,box-shadow 0.25s;
}
.psf-card-icon svg{color:var(--primary);transition:color 0.25s;}
.psf-card.selected .psf-card-icon{
  background:var(--primary);
  box-shadow:0 4px 16px rgba(123,31,46,0.3);
}
.psf-card.selected .psf-card-icon svg{color:#fff;}
.psf-card-lbl{
  font-family:'Cinzel',serif;font-size:0.85rem;font-weight:600;color:var(--text);
}
```

- [ ] **Step 3: Add progress bar to multi-step form**

Find `#regStepsWrap` HTML. Add this immediately inside it, before any existing content:
```html
<div class="signup-progress-wrap" id="signupProgressWrap">
  <div class="sp-step-label" id="spStepLabel">Step 1 of 6</div>
  <div class="sp-bar-track">
    <div class="sp-bar-fill" id="spBarFill" style="width:16.6%;"></div>
  </div>
  <div class="sp-step-names">
    <span class="sp-sn active" data-step="1">Personal</span>
    <span class="sp-sn" data-step="2">Family</span>
    <span class="sp-sn" data-step="3">Career</span>
    <span class="sp-sn" data-step="4">Preferences</span>
    <span class="sp-sn" data-step="5">Photos</span>
    <span class="sp-sn" data-step="6">Review</span>
  </div>
</div>
```

Add CSS:
```css
.signup-progress-wrap{
  padding:1.2rem 2rem 0;max-width:680px;margin:0 auto;
}
.sp-step-label{
  font-family:'Josefin Sans',sans-serif;font-size:0.72rem;
  letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);
  margin-bottom:0.5rem;
}
.sp-bar-track{
  height:4px;background:rgba(184,137,42,0.2);border-radius:2px;overflow:hidden;
}
.sp-bar-fill{
  height:100%;background:linear-gradient(90deg,var(--primary),var(--gold));
  border-radius:2px;transition:width 0.5s var(--ease-out);
}
.sp-step-names{
  display:flex;justify-content:space-between;margin-top:0.4rem;
}
.sp-sn{
  font-family:'Josefin Sans',sans-serif;font-size:0.6rem;
  letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);
  transition:color 0.25s;
}
.sp-sn.active{color:var(--primary);font-weight:600;}
```

Add a JS function to update progress (call it whenever the step changes):
```js
function updateSignupProgress(stepNum, totalSteps){
  const label=document.getElementById('spStepLabel');
  const fill=document.getElementById('spBarFill');
  const names=document.querySelectorAll('.sp-sn');
  if(label) label.textContent='Step '+stepNum+' of '+totalSteps;
  if(fill) fill.style.width=((stepNum/totalSteps)*100)+'%';
  names.forEach(n=>n.classList.toggle('active',parseInt(n.dataset.step)===stepNum));
}
```

Find the existing step navigation function (search for `showStep` or `nextStep` or wherever the signup step changes) and call `updateSignupProgress(currentStep, 6)` there.

- [ ] **Step 4: Test**

Open signup page: "Who is this for?" shows clean SVG icon cards with warm circle backgrounds. Selecting one: icon circle fills crimson, icon turns white. Progress bar is visible at top of multi-step form and advances correctly.

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: signup — SVG icons replace emojis, progress bar with step names"
```

---

## Task 10: Site-wide UX — WhatsApp Button, Help Drawer, Breadcrumbs

**Files:**
- Modify: `Main/index.html` — add to end of `<body>`, add CSS

- [ ] **Step 1: Add WhatsApp floating button**

Add just before `</body>`:
```html
<!-- WhatsApp quick contact -->
<div class="wa-float" id="waFloat" onclick="window.open('https://wa.me/917207999985','_blank')">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.869.492 3.623 1.352 5.144L2 22l4.985-1.309A9.956 9.956 0 0012.004 22C17.53 22 22 17.522 22 12.004 22 6.478 17.53 2 12.004 2z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
</div>
```

Add CSS:
```css
.wa-float{
  position:fixed;bottom:24px;right:24px;z-index:800;
  width:56px;height:56px;border-radius:50%;
  background:#25D366;color:#fff;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  box-shadow:0 4px 20px rgba(37,211,102,0.4);
  transition:transform 0.25s var(--ease-out),box-shadow 0.25s;
}
.wa-float:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(37,211,102,0.5);}
/* Hide inside app pages (show only on public pages) */
.page.active[id="pgBrowse"] ~ .wa-float,
.page.active[id="pgDash"] ~ .wa-float{display:none;}
```

Note: the hide logic via CSS sibling selector may not work with the SPA pattern. Instead, add JS to show/hide the button based on current page. Find the `showPage` function and add:
```js
// inside showPage function, after setting active page:
const waBtn=document.getElementById('waFloat');
if(waBtn){
  const publicPages=['pgHome','pgLogin','pgSignup','pgAbout','pgBranches','pgContact','pgStories','pgMembership'];
  waBtn.style.display=publicPages.includes(id)?'flex':'none';
}
```

- [ ] **Step 2: Add first-visit welcome toast**

Add CSS:
```css
.welcome-toast{
  position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(120px);
  z-index:900;
  background:var(--bg-warm);
  border:1.5px solid var(--border);
  border-radius:20px;padding:1.1rem 1.4rem;
  box-shadow:var(--sh-card);
  max-width:340px;width:90%;
  transition:transform 0.45s var(--ease-out),opacity 0.45s;
  opacity:0;
}
.welcome-toast.show{transform:translateX(-50%) translateY(0);opacity:1;}
.wt-title{font-family:'Cinzel',serif;font-size:0.85rem;font-weight:600;color:var(--primary);margin-bottom:0.3rem;}
.wt-body{font-family:'EB Garamond',serif;font-size:16px;color:var(--text-body);line-height:1.6;margin-bottom:0.8rem;}
.wt-actions{display:flex;gap:0.6rem;}
.wt-cta{flex:1;padding:0.5rem;border-radius:50px;font-family:'Cinzel',serif;font-size:0.6rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;border:none;}
.wt-cta.primary{background:var(--primary);color:#fff;}
.wt-cta.secondary{background:transparent;border:1px solid var(--border);color:var(--text-muted);}
```

Add HTML before `</body>`:
```html
<div class="welcome-toast" id="welcomeToast" style="display:none;">
  <div class="wt-title">Welcome to Naveen Reddy Marriage Bureau</div>
  <div class="wt-body">Begin your journey — create your profile in just a few minutes, completely free.</div>
  <div class="wt-actions">
    <button class="wt-cta primary" onclick="showPage('pgSignup');dismissWelcomeToast()">Create Profile</button>
    <button class="wt-cta secondary" onclick="dismissWelcomeToast()">Maybe Later</button>
  </div>
</div>
```

Add JS:
```js
function dismissWelcomeToast(){
  const t=document.getElementById('welcomeToast');
  if(t){t.classList.remove('show');setTimeout(()=>t.style.display='none',500);}
  localStorage.setItem('nrmb_welcomed','1');
}
(function(){
  if(localStorage.getItem('nrmb_welcomed'))return;
  // Only show on home page for non-logged-in users
  if(localStorage.getItem('nrmb_lp'))return; // came from landing
  setTimeout(()=>{
    if(window.ST&&window.ST.user)return; // logged in, skip
    const t=document.getElementById('welcomeToast');
    if(t){t.style.display='block';requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('show')));}
    setTimeout(dismissWelcomeToast,14000);
  },4500);
})();
```

- [ ] **Step 3: Test**

1. Clear localStorage, open main site — welcome toast appears after 4.5s and auto-dismisses after 14s
2. WhatsApp button visible on home page, hidden after login on browse/dashboard pages
3. On mobile: both buttons don't overlap each other (WhatsApp right, toast bottom-centre)

- [ ] **Step 4: Commit**

```bash
git add Main/index.html
git commit -m "feat: WhatsApp floating button (public pages only) + first-visit welcome toast"
```

---

## Task 11: Bottom Navigation Bar (Post-Login Mobile)

**Files:**
- Modify: `Main/index.html` — add bottom nav HTML and CSS, update `showPage` JS

- [ ] **Step 1: Add bottom nav HTML**

Add just before `</body>`:
```html
<!-- Bottom nav — shows only after login on mobile -->
<nav class="bottom-nav" id="bottomNav" style="display:none;">
  <button class="bnav-item active" id="bn-home" onclick="showPage('pgHome');setBottomNav('bn-home')">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span>Home</span>
  </button>
  <button class="bnav-item" id="bn-browse" onclick="showPage('pgBrowse');setBottomNav('bn-browse')">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <span>Browse</span>
  </button>
  <button class="bnav-item" id="bn-liked" onclick="showPage('pgLiked');setBottomNav('bn-liked')">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
    <span>Liked</span>
    <span class="bnav-badge" id="bnavLikedBadge" style="display:none;">0</span>
  </button>
  <button class="bnav-item" id="bn-interests" onclick="showPage('pgIntInMe');setBottomNav('bn-interests')">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    <span>Interests</span>
  </button>
  <button class="bnav-item" id="bn-profile" onclick="showPage('pgMyProfile');setBottomNav('bn-profile')">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span>My Profile</span>
  </button>
</nav>
```

- [ ] **Step 2: Add bottom nav CSS**

```css
.bottom-nav{
  position:fixed;bottom:0;left:0;right:0;z-index:700;
  background:var(--white);
  border-top:1px solid var(--border-light);
  display:flex;
  padding-bottom:env(safe-area-inset-bottom,0px); /* iPhone home bar */
  box-shadow:0 -2px 16px rgba(123,31,46,0.07);
}
.bnav-item{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:0.6rem 0.3rem;
  background:none;border:none;cursor:pointer;
  color:var(--text-muted);
  font-family:'Josefin Sans',sans-serif;font-size:0.6rem;letter-spacing:0.06em;
  text-transform:uppercase;gap:0.2rem;
  position:relative;
  min-height:56px;
  transition:color 0.2s;
}
.bnav-item.active{color:var(--primary);}
.bnav-item.active::after{
  content:'';position:absolute;top:0;left:25%;right:25%;height:2px;
  background:var(--gold);border-radius:0 0 2px 2px;
}
.bnav-item svg{flex-shrink:0;}
.bnav-badge{
  position:absolute;top:6px;right:calc(50% - 16px);
  background:var(--primary);color:#fff;
  border-radius:50%;width:16px;height:16px;
  font-family:'Josefin Sans',sans-serif;font-size:0.55rem;
  display:flex;align-items:center;justify-content:center;
}
/* Only show on mobile and only when logged in */
@media(min-width:769px){.bottom-nav{display:none!important;}}
/* Pad main content above bottom nav when visible */
.page.active{padding-bottom:72px;}
@media(min-width:769px){.page.active{padding-bottom:0;}}
```

- [ ] **Step 3: Add `setBottomNav` JS and hook into `_applyLogin`**

```js
function setBottomNav(activeId){
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.toggle('active',b.id===activeId));
}
```

In `_applyLogin` (the function that runs after successful login), add:
```js
const bn=document.getElementById('bottomNav');
if(bn)bn.style.display='flex';
```

In logout handler, add:
```js
const bn=document.getElementById('bottomNav');
if(bn)bn.style.display='none';
```

Also update `updateLikedBadge` to update the bottom nav badge:
```js
function updateLikedBadge(){
  const count=ST.savedProfiles?ST.savedProfiles.length:0;
  // existing badge logic...
  const bnavBadge=document.getElementById('bnavLikedBadge');
  if(bnavBadge){bnavBadge.textContent=count;bnavBadge.style.display=count>0?'flex':'none';}
}
```

- [ ] **Step 4: Test**

Log in to main site on mobile viewport (375px). Bottom nav appears with 5 tabs. Active tab shows crimson icon + gold top indicator. Liked badge updates when profiles are saved. Bottom nav hidden on desktop (≥769px).

- [ ] **Step 5: Commit**

```bash
git add Main/index.html
git commit -m "feat: bottom navigation bar for post-login mobile experience

5-tab bottom nav: Home, Browse, Liked, Interests, My Profile.
Shows after login, hidden on desktop. Gold active indicator.
Badge on Liked tab. Safe-area aware for iPhone home bar."
```

---

## Self-review against spec

| Spec section | Implemented in |
|---|---|
| Color palette, no grey | Task 1 |
| Typography — larger, bolder | Task 1 (body 18px, headings Cinzel 600+) |
| Shimmer buttons | Task 1 |
| Logo ornamental ring | Task 2 |
| Hero black bar fix | Task 3 |
| Hero trust badge pills | Task 3 |
| Typewriter subheading | Task 3 |
| Stats count-up | Task 4 |
| 3D drag carousel | Task 5 |
| How We Work steps | Task 6 |
| Login redesign | Task 7 |
| Branches landmarks | Task 8 |
| Signup SVG icons | Task 9 |
| Signup progress bar | Task 9 |
| WhatsApp button | Task 10 |
| First-visit welcome toast | Task 10 |
| Bottom nav mobile | Task 11 |
| Warm aurora carousel background | Task 5 (CSS) |
| Animated gold border chase | Task 5 (CSS) |
| Post-login hero banners | Not yet — **add Task 12** |
| Traditional motifs / ornamental dividers | Partial — orn-divider added in Tasks 5, 6. Full motif system needs a dedicated pass |

**Gap found — adding Task 12:**

---

## Task 12: Post-login Page Hero Banners

**Files:**
- Modify: `Main/index.html` — `.signup-hero` CSS (used by all inner page banners)

- [ ] **Step 1: Update signup-hero to warm champagne overlay instead of dark**

Find `.signup-hero::before` CSS. Replace the dark overlay with warm:
```css
.signup-hero::before{
  content:'';position:absolute;inset:0;
  background:
    linear-gradient(to bottom,rgba(255,251,245,0.52) 0%,transparent 25%,transparent 65%,rgba(255,251,245,0.9) 100%),
    linear-gradient(to right,rgba(123,31,46,0.15) 0%,transparent 15%,transparent 85%,rgba(123,31,46,0.15) 100%);
}
```

Find `.signup-hero::after` (fades to page background). Update:
```css
.signup-hero::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(0deg,var(--bg) 0%,transparent 40%);
}
```

- [ ] **Step 2: Increase `.signup-hero` height for post-login pages**

```css
.signup-hero{
  height:clamp(180px,28vh,280px);
  position:relative;overflow:hidden;
  background-size:cover;
  background-position:center 30%;
  display:flex;align-items:center;justify-content:center;
  margin-top:var(--nav-h);
}
.sh-text{position:relative;z-index:2;text-align:center;}
.sh-title{
  font-family:'Cinzel',serif;
  font-size:clamp(1.8rem,5vw,2.8rem);
  font-weight:600;color:#fff;
  text-shadow:0 2px 20px rgba(123,31,46,0.4);
}
.sh-bc{
  font-family:'Josefin Sans',sans-serif;
  font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;
  color:rgba(255,248,220,0.75);margin-top:0.3rem;
}
```

- [ ] **Step 3: Test**

Open Branches, About, Stories, Membership pages. Each shows the couple photo banner at 28vh with warm vignette and white page title. Text is clearly readable.

- [ ] **Step 4: Commit**

```bash
git add Main/index.html
git commit -m "feat: post-login page hero banners — warm champagne vignette, Cinzel titles"
```
