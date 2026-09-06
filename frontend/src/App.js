import { useRef } from "react";
import "@/App.css";
import Lenis from "lenis";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, ArrowRight, ArrowUpRight, Instagram, Mail } from "lucide-react";
import { PlayerProvider, usePlayer, fmtDay, fmtDate, fmtTime, isLiveEvent, upcomingEvents, eventParts } from "@/lib/player";
import Nav, { INSTAGRAM_URL, CONTACT_EMAIL, DISCORD_URL, WHATSAPP_URL } from "@/components/Nav";
import Footer from "@/components/Footer";
import PlayerBar from "@/components/PlayerBar";
import Marquee from "@/components/Marquee";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import { RadioDoodle, DoorDoodle, CalendarDoodle } from "@/components/Doodle";
import Schedule from "@/pages/Schedule";

function Hero() {
  const { open, now } = usePlayer();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="top" ref={ref} data-testid="hero" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-16 pt-32 sm:px-8 md:pt-44 lg:grid-cols-12 lg:gap-8">
        <motion.div style={{ y: textY }} className="relative z-10 lg:col-span-8">
          <FadeIn delay={0.1}>
            <p className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-sagedeep">
              <span className="h-px w-10 bg-sagedeep" />
              Independent online radio
            </p>
          </FadeIn>

          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter">
            <MaskedLine delay={0.2} className="text-[21vw] sm:text-[18vw] lg:text-[11.5vw]">Open</MaskedLine>
            <MaskedLine delay={0.32} className="text-[21vw] sm:text-[18vw] lg:text-[11.5vw]">
              House<span className="text-sagedeep">.</span>
            </MaskedLine>
          </h1>

          <FadeIn delay={0.65}>
            <p className="mt-10 max-w-xl font-serifaccent text-2xl italic leading-snug text-sagedeep md:text-3xl">
              Open House is open.
            </p>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-inksoft md:text-base">
              Music, art, food, fashion, football, film, books, nightlife, politics, weird
              niche interests — whatever you care about enough to talk about. Shows about
              anything, made by anyone.
            </p>
          </FadeIn>

          <FadeIn delay={0.85}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={open}
                data-testid="hero-listen-live-btn"
                className="flex items-center gap-3 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
              >
                <Play className="h-4 w-4 fill-current" />
                Listen Live
              </button>
              <a
                href="#get-involved"
                data-testid="hero-get-involved-btn"
                className="flex items-center gap-3 border border-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-surface"
              >
                Have a Show
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <p className="text-[10px] uppercase tracking-[0.3em] text-inksoft" data-testid="hero-meta">
                Live from London — Est. 2026
              </p>
            </div>
          </FadeIn>
        </motion.div>

        <div className="relative flex items-center justify-center lg:col-span-4">
          <FadeIn delay={0.5} className="relative w-full">
            <motion.img
              src="/open-house-mark-tight.png"
              alt="Hand-drawn Open House mark — a little house with an open door"
              style={{ y: imgY }}
              className="mx-auto w-full max-w-md object-contain sm:max-w-lg lg:max-w-xl"
              data-testid="hero-image"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-4 flex items-center gap-3 border border-line bg-paper px-5 py-5 lg:left-0"
              data-testid="on-air-badge"
            >
              <span className={`h-2 w-2 rounded-full ${now?.onAir ? "bg-red-400 animate-pulse-dot" : "bg-inksoft/40"}`} />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-inksoft">
                  {now?.onAir ? "Live Now" : "Off Air"}
                </p>
                <p className="max-w-[190px] truncate font-display text-sm font-medium">
                  {now?.onAir ? now?.title || "Broadcasting now" : "Back soon"}
                </p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ListenSection() {
  const { playing, toggle, now, schedule } = usePlayer();
  const hasTrack = now?.onAir && (now.title || now.artist);
  const liveEv = schedule.find(isLiveEvent);
  const nextEv = upcomingEvents(schedule)[0];
  const evLabel = (ev) => {
    const p = eventParts(ev);
    return p.host ? `${p.title} w/ ${p.host}` : p.title;
  };

  return (
    <section id="listen" className="mx-auto max-w-[1600px] scroll-mt-24 px-4 py-20 sm:px-8 md:py-32" data-testid="listen-section">
      <Reveal className="mb-12 md:mb-16">
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">On the air</p>
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl" data-testid="listen-heading">
          Listen Live
        </h2>
      </Reveal>

      <Reveal>
        <div
          data-testid="live-player-module"
          className="grid overflow-hidden border border-line bg-coal text-paper md:grid-cols-12"
        >
          <div className="relative flex items-center justify-center overflow-hidden p-10 md:col-span-5 md:p-14">
            <motion.div
              initial={{ opacity: 0, y: 28, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm"
            >
              <RadioDoodle className="w-full" />
            </motion.div>
          </div>

          <div className="flex flex-col justify-between gap-10 p-8 md:col-span-7 md:p-14">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-paper/70" data-testid="live-indicator">
                <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse-dot bg-red-400" : "bg-sage"}`} />
                {playing ? "Playing Now" : "Live Stream"}
              </p>
              <p className="hidden text-[10px] uppercase tracking-[0.2em] text-paper/40 sm:block">
                Radio.co
              </p>
            </div>

            <div>
              <h3 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                The Open House Stream
              </h3>
              <p className="mt-2 font-serifaccent text-xl italic text-sage">music, conversation & whatever walks in</p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/70 md:text-base">
                One continuous stream — new shows finding their feet, test broadcasts
                and whatever happens next. Press play and keep us company.
              </p>

              {hasTrack ? (
                <div
                  className="mt-8 flex items-center gap-4 border-t border-paper/15 pt-6"
                  data-testid="now-playing"
                >
                  {now.artwork && (
                    <img
                      src={now.artwork}
                      alt={`${now.title} artwork`}
                      className="h-14 w-14 shrink-0 object-cover grayscale-[30%]"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-sage">Now Playing</p>
                    <p className="mt-1 truncate font-display text-lg font-medium" data-testid="now-playing-title">
                      {now.title}
                      {now.artist ? ` — ${now.artist}` : ""}
                    </p>
                    {now.dj && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.15em] text-paper/50">Live: {now.dj}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="mt-8 border-t border-paper/15 pt-6 text-[10px] uppercase tracking-[0.25em] text-paper/40" data-testid="now-playing-idle">
                  {now?.onAir ? "On air — track info on its way" : "Currently between broadcasts"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={toggle}
                data-testid="listen-play-btn"
                className="flex items-center gap-3 bg-paper px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-sage"
              >
                {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                {playing ? "Pause" : "Play Live"}
              </button>
              <div className="flex h-8 items-end gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`eq-bar w-[3px] bg-sage ${playing ? "animate-eq" : "scale-y-[0.25]"}`}
                    style={{ height: "100%", animationDelay: `${i * 0.13}s` }}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-paper/15 pt-5" data-testid="up-next-strip">
              {liveEv ? (
                <p className="text-[10px] uppercase tracking-[0.3em] text-paper/60">
                  <span className="text-sage">Live now</span> · {evLabel(liveEv)} · until {fmtTime(liveEv.end)}
                </p>
              ) : nextEv ? (
                <p className="text-[10px] uppercase tracking-[0.3em] text-paper/60">
                  <span className="text-sage">Up next</span> · {evLabel(nextEv)} ·{" "}
                  {`${fmtDay(nextEv.start)} ${fmtDate(nextEv.start)}`} · {fmtTime(nextEv.start)}—
                  {fmtTime(nextEv.end)}
                </p>
              ) : (
                <p className="text-[10px] uppercase tracking-[0.3em] text-paper/40">
                  New shows landing soon
                </p>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function NextOnSection() {
  const { schedule, now } = usePlayer();
  const liveEv = schedule.find(isLiveEvent);
  const next = upcomingEvents(schedule)
    .filter((e) => e !== liveEv)
    .slice(0, liveEv ? 2 : 3);
  const entries = [...(liveEv ? [liveEv] : []), ...next];

  return (
    <section id="next-on" className="border-y border-line bg-surface" data-testid="next-on-section">
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-28">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <p className="text-xs uppercase tracking-[0.25em] text-sagedeep" data-testid="next-on-heading">
            Next on Open House
          </p>
          <Link
            to="/schedule"
            data-testid="view-full-schedule-link"
            className="link-underline flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink"
          >
            View Full Schedule <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </Reveal>

        {entries.length > 0 ? (
          <Reveal>
            <div className="grid border-t border-line md:grid-cols-3" data-testid="next-on-list">
              {entries.map((ev, i) => {
                const live = isLiveEvent(ev);
                const parts = eventParts(ev);
                const hostShown = (live && now?.dj) || parts.host;
                return (
                  <div
                    key={ev.event_id || i}
                    data-testid={`next-on-entry-${i}`}
                    className="border-b border-line py-8 md:border-b-0 md:border-r md:py-10 md:pl-8 md:first:pl-0 md:last:border-r-0"
                  >
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-inksoft">
                      {live && (
                        <span className="flex items-center gap-1.5 text-sagedeep" data-testid="next-on-live-label">
                          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-sagedeep" />
                          Live Now ·
                        </span>
                      )}
                      {fmtDay(ev.start)} {fmtDate(ev.start)}
                    </p>
                    <p className="mt-3 font-display text-lg font-medium tracking-tight md:text-xl">
                      {fmtTime(ev.start)}—{fmtTime(ev.end)}
                    </p>
                    <p className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                      {parts.title}
                    </p>
                    {hostShown && (
                      <p className="mt-2 font-serifaccent text-xl italic text-inksoft">{hostShown}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div
              className="flex flex-col items-center gap-6 border-t border-line py-12 text-center"
              data-testid="next-on-empty"
            >
              <CalendarDoodle className="w-40 md:w-48" />
              <p className="max-w-md text-sm leading-relaxed text-inksoft">
                New shows are landing soon — follow{" "}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-sagedeep"
                >
                  @openhouse_radio
                </a>{" "}
                for the first broadcasts.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function CommunitySection() {
  const cards = [
    {
      name: "Discord",
      url: DISCORD_URL,
      testId: "discord-card",
      blurb: "The always-on chat — show ideas, half-ideas, hot takes and whatever's on your mind.",
    },
    {
      name: "WhatsApp",
      url: WHATSAPP_URL,
      testId: "whatsapp-card",
      blurb: "The group chat — quick hellos, what's on, and the day-to-day life of the station.",
    },
  ];

  return (
    <section id="community" className="border-b border-line bg-surface" data-testid="community-section">
      <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-28">
        <Reveal className="mb-12 md:mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The community</p>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl" data-testid="community-heading">
            Come as you are.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-inksoft md:text-lg">
            Open House is being built by the people in it — new shows, new people, live
            broadcasts, parties, conversations and whatever comes next. Pick a room and
            pull up a chair.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.1}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={c.testId}
                className="group flex h-full flex-col justify-between gap-10 border border-line bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:border-sagedeep md:p-12"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-3xl font-bold tracking-tight md:text-5xl">{c.name}</h3>
                  <ArrowUpRight
                    className="h-7 w-7 text-inksoft transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-sagedeep md:h-9 md:w-9"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="max-w-md text-sm leading-relaxed text-inksoft md:text-base">{c.blurb}</p>
                <p className="link-underline w-fit text-xs uppercase tracking-[0.25em] text-sagedeep">
                  Join the {c.name}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section id="get-involved" className="scroll-mt-24 bg-coal text-paper" data-testid="get-involved-section">
      <Marquee dark items={["Anyone Can Have a Show", "No Experience Needed", "A Laptop & a Mic", "The Door Is Open"]} />
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 sm:px-8 md:py-36 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-8">
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sage">Get involved</p>
          <h2 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Anyone can have a show.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
            You don't need to be a DJ, a presenter, or to have any radio experience at all.
            If you've got a genuine passion, something you know loads about, or just an idea
            you think could make a good show — we want to hear it.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
            No studio. No fancy setup. No experience required. A laptop, a mic and your
            bedroom will do nicely.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Hosting a show on Open House`}
              data-testid="get-involved-email-btn"
              className="flex items-center gap-3 bg-paper px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-sage"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              Pitch a Show
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="get-involved-instagram-btn"
              className="flex items-center gap-3 border border-paper/40 px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-sage hover:text-sage"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
              @openhouse_radio
            </a>
          </div>
          <p className="mt-8 text-sm text-paper/60">
            Already around? Join the conversation on{" "}
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="involved-discord-link"
              className="link-underline text-sage"
            >
              Discord
            </a>{" "}
            or{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="involved-whatsapp-link"
              className="link-underline text-sage"
            >
              WhatsApp
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={0.15} className="hidden lg:col-span-4 lg:block">
          <DoorDoodle className="mx-auto w-full max-w-[280px]" />
        </Reveal>
      </div>
    </section>
  );
}

function ContactStrip() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-28" data-testid="contact-section">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">Say hello</p>
          <blockquote className="max-w-2xl font-serifaccent text-3xl italic leading-tight text-ink/85 md:text-5xl">
            "If you care about something, there's probably a show in it."
          </blockquote>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-inksoft/60">
            ps — the kettle is boiling
          </p>
        </div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          data-testid="contact-email-btn"
          className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-sagedeep"
        >
          {CONTACT_EMAIL}
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
        </a>
      </Reveal>
    </section>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Landing() {
  return (
    <main>
      <Hero />
      <Marquee items={["Independent Radio", "Shows About Anything", "Anyone Can Have a Show", "Broadcast From Your Bedroom", "Currently Taking Shape", "Open Door Policy"]} />
      <ListenSection />
      <NextOnSection />
      <GetInvolved />
      <CommunitySection />
      <ContactStrip />
    </main>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <div className="noise-overlay" aria-hidden="true" />
      <PlayerProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Nav />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/schedule" element={<main><Schedule /></main>} />
          </Routes>
          <Footer />
          <PlayerBar />
        </BrowserRouter>
      </PlayerProvider>
    </div>
  );
}

export default App;
