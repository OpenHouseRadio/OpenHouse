# Open House — PRD

## Original Problem Statement
Build a sleek, laid-back, editorial-style website for "Open House" — an independent online radio station and cultural platform. Warm minimalism: off-white background, charcoal text, muted sage accent, oversized editorial typography, candid imagery.

## Current Scope (pivoted 2026-08-28)
Simplified to a SINGLE-PAGE launch/landing page. No backend, no database, no REACT_APP_BACKEND_URL — standalone static frontend deployable to Vercel as-is. All fake/example shows, schedules, projects and multi-page structure removed to avoid looking more established than the brand currently is.

## Live Brand Details (confirmed by user)
- Instagram: https://www.instagram.com/openhouse_radio
- Contact email: david@openhouseradio.co.uk (mailto CTAs)
- Radio.co stream: https://streams.radio.co/seb9792770/listen (verified HTTP 200, wired to a real HTML5 audio player)

## Architecture
- Frontend only: React 19 + framer-motion + lenis + Tailwind (no router, no axios, no API calls)
- Design system unchanged: Outfit / Manrope / Newsreader; #F9F8F6 paper, #1C1C1A ink, #A3B19B sage, #252523 coal; noise overlay, editorial borders
- Player: global context (`src/lib/player.jsx`) drives a real `Audio` element on the Radio.co stream; shared by nav button, hero CTA, listen section and bottom player bar (play/pause, live dot, equalizer animation)
- Page sections: Hero (masked OPEN HOUSE reveal + parallax image + On Air badge) → editorial marquee → Listen Live (dark player module) → Get Involved (host-a-show invite, mailto + Instagram CTAs) → contact strip → footer (Instagram + email + copyright)
- .gitignore (root + frontend) now ignores all .env files

## Implemented
- 2026-08-28: Full 6-page editorial site with FastAPI/MongoDB backend, submissions + Resend email notifications
- 2026-08-28: Submission notifications routed to owner's inbox
- 2026-08-28: Simplified to standalone single-page landing; real Radio.co stream wired into player; real Instagram and contact email; .env gitignored; backend/multi-page code removed from frontend bundle
- 2026-08-28: Now Playing — Radio.co public API (public.radio.co/api/v2/seb9792770: track/current + status + source, no key, CORS *) polled every 30s in player context; Listen section shows artwork + track/artist + live DJ name when on air, graceful "Currently between broadcasts" when off air; player bar shows live track line
- 2026-08-28: Imagery restyled per user feedback — replaced club/electronic visuals with warm, natural, artistic photos (hero: vinyl spines + headphones in daylight; listen section: piano keys in soft light). Now Playing confirmed live on air (Michael Franks track with artwork)

## Backlog / Next Tasks
- P1: Deploy to Vercel + custom domain openhouseradio.co.uk (guide delivered to user 2026-08-28; user-side: GitHub push, Vercel import with root=frontend, DNS A/CNAME records)
- P2: Grow back into multi-page site (Shows, Projects, About, Submit) when the brand is ready — the previous components are in git history
- P2: Newsletter signup
