# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Reddy Elite Matrimony — a luxury matrimony platform built with vanilla HTML/CSS/JS and Firebase. No build step, no package manager, no framework. Files are served directly via Vercel.

## Deployment

- **No build commands** — static files served as-is
- **Vercel** handles routing via `vercel.json` rewrites
- Root site deploys from the repo root; admin site deploys from `Admin/`
- Two separate Vercel projects (see memory for details)

To preview locally: open any `.html` file directly in a browser, or use a simple static server:
```bash
npx serve .
```

## Repository Structure

```
Website/              ← root
├── index.html        ← main user-facing matrimony app (~4500 lines)
├── landing.html      ← welcome/intro page
├── Admin/
│   ├── index.html    ← admin portal (member management, stats)
│   └── vercel.json
├── Website/          ← experimental alternate version
│   └── index.html
└── vercel.json
```

## Architecture

**Single-file SPA pattern**: All pages, routing, and logic live in one or two large HTML files. JavaScript handles in-page "navigation" by showing/hiding sections — there is no router library.

**Firebase backend**:
- Project ID: `reddy-elite-matrimony`
- Auth: Email/Password + Google Sign-In
- Firestore collections: `users`, `stories`, `appointments`
- Realtime Database (asia-southeast1) for live features
- All Firebase SDK loaded from CDN inside the HTML

**CDN dependencies** (no npm):
- Firebase v9+ (modular SDK via CDN)
- GSAP (scroll animations)
- Razorpay (payment checkout)
- Google Fonts: EB Garamond (body), Cormorant Garamond (headings), Cinzel (labels)

## Design System

- **Colors**: Crimson `#8b0000`, Gold `#b8960c`/`#d4af37`, Offwhite `#fefcf8`, Cream `#fdf8f0` — all in CSS `:root` vars
- **Aesthetic**: Luxury/ornate with glassmorphism, serif-heavy typography, gold accents
- **Membership tiers**: VVIP > Elite > Premium (Elite is the featured/recommended card)
- All UI is mobile-first; extensive touch-target and scroll fixes

## Key Features to Know

- Multi-step signup flow with Firebase draft saves
- Browse page with profile cards (verified badge, heart/like button)
- Referral system with unique links and WhatsApp sharing
- Appointment booking (Tuesdays blocked)
- Success stories with pending/approved moderation
- Admin portal: member list, edit/approve profiles, statistics dashboard
- Razorpay integration for membership upgrades
