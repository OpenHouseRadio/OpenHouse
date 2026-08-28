# Open House — PRD

## Original Problem Statement
Build a sleek, laid-back, editorial-style website for "Open House" — an independent online radio station and cultural platform for music, art, creative projects, community and emerging talent. It should feel like a radio station + creative magazine + community noticeboard. Warm minimalism: off-white background, charcoal text, muted accent, oversized editorial typography, candid imagery. Core jobs: listen live, show schedule, showcase community projects, introduce the brand, invite submissions.

## User Choices (confirmed)
- Live radio: placeholder player UI only (Radio.co embed-ready)
- Submissions: saved to DB AND emailed to owner via Emergent-managed Resend
- Pages: 6 core pages only (Home, Radio, Shows, Projects, About, Submit); structure ready for Events/Archive/Residents
- Accent colour: no preference → muted sage (#A3B19B) chosen per design guidelines
- Quality bar: Awwwards-level — masked line-by-line hero reveal, marquee, parallax, framer-motion + lenis

## User Personas
- Listener: tunes into live radio, browses schedule and shows
- Creative/community member: browses projects, submits their own work or pitches a show
- Curious visitor: reads About/manifesto, gets the vibe

## Architecture
- Backend: FastAPI (`/app/backend/server.py`), MongoDB via MONGO_URL, all routes under `/api`
  - Seeded collections: shows (7), projects (7), schedule (9 slots), residents (6); submissions collection written at runtime
  - Endpoints: GET /api/live, /api/schedule, /api/shows(?category), /api/shows/{slug}, /api/projects(?category), /api/projects/{slug}, /api/residents, POST /api/submissions
  - Email: Emergent managed Resend proxy (`integrations.emergentagent.com`) with guardrail gate (_assert_safe_email), from_name "Open House", server-side templates, escaped fields
  - Env: EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME, SUBMISSION_NOTIFY_EMAIL (currently test address delivered@resend.dev — swap for real inbox)
- Frontend: React 19 + react-router-dom 7 + framer-motion 11 + lenis + Tailwind
  - Design system: Outfit (display) / Manrope (body) / Newsreader (serif accent); palette #F9F8F6 paper, #1C1C1A ink, #A3B19B sage, #252523 coal; noise overlay, 1px editorial borders
  - Shared: Nav (sticky, blur, mobile overlay menu), Footer, PlayerBar (global Listen Live state), LiveModule, Marquee, ScheduleList, ShowCard, ProjectCard, PageHead, EmbedPlaceholder, Reveal/MaskedLine motion helpers
  - Pages: Home, Radio, Shows (+detail), Projects (+detail), About, Submit (tabbed dual forms)

## Implemented (2026-08-28)
- Full 6-page site with kinetic masked hero reveal, editorial marquee, parallax hero/detail imagery, grayscale→colour card hovers, Lenis momentum scrolling
- Global Listen Live player bar (play/pause, live indicator, equalizer animation) — placeholder, Radio.co-ready
- Live Now module (dark), weekly schedule list, featured shows, community project grid, about teaser, community CTA
- Radio page: player/schedule Radio.co embed placeholders, full schedule, residents grid
- Shows directory with category filters + CMS-friendly show detail pages (archive audio placeholder, related shows)
- Projects masonry with 6 category filters + project detail pages (featured label, contributor, second image)
- About: numbered manifesto chapters (01–04), serif pull quote, residents, CTA
- Submit: Pitch a Show / Submit a Project tabbed forms → MongoDB + email notification, sonner toasts
- All content served from MongoDB seed data (CMS-friendly via API)

## Backlog / Next Tasks
- P0: Swap SUBMISSION_NOTIFY_EMAIL for the owner's real inbox (currently test address)
- P1: Radio.co live player + schedule widget embeds (slots ready on Radio page)
- P1: Admin/CMS view to edit shows, projects, schedule without code
- P2: Events, Archive, Residents pages (nav/footer already reference them)
- P2: Newsletter signup (footer placeholder present)
- P2: Show archive audio players on show detail pages
- P2: Media/file upload on project submissions
