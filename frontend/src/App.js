import { useRef } from "react";
import "@/App.css";
import Lenis from "lenis";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Pause, ArrowRight, ArrowUpRight, Instagram, Mail } from "lucide-react";
import { PlayerProvider, usePlayer } from "@/lib/player";
import Nav, { INSTAGRAM_URL, CONTACT_EMAIL } from "@/components/Nav";
import Footer from "@/components/Footer";
import PlayerBar from "@/components/PlayerBar";
import Marquee from "@/components/Marquee";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import { RadioDoodle, DoorDoodle } from "@/components/Doodle";

const MARK_IMG = "/open-house-mark.png";

function Hero() {
  const { open } = usePlayer();
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
              Independent radio & cultural platform
            </p>
          </FadeIn>

          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter">
            <MaskedLine delay={0.2} className="text-[21vw] sm:text-[18vw] lg:text-[11.5vw]">Open</MaskedLine>
            <MaskedLine delay={0.32} className="text-[21vw] sm:text-[18vw] lg:text-[11.5vw]">
              House<span className="text-sagedeep">.</span>
            </MaskedLine>
          </h1>

          <FadeIn delay={0.65}>
            <p className="mt-10 max-w-xl font-serifaccent text-2xl italic leading-snug text-ink/80 md:text-3xl">
              An independent online radio and culture platform — currently taking shape.
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
                Get Involved
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </FadeIn>
        </motion.div>

        <div className="relative lg:col-span-4">
          <FadeIn delay={0.5} className="h-full">
            <div className="relative h-80 overflow-hidden sm:h-[26rem] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[130%]">
              <motion.img
                src={MARK_IMG}
                alt="Hand-drawn Open House mark — a little house with an open door"
                style={{ y: imgY }}
                className="h-[115%] w-full object-contain"
                data-testid="hero-image"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-4 flex items-center gap-3 border border-line bg-paper px-5 py-5 lg:-left-10"
              data-testid="on-air-badge"
            >
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse-dot" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-inksoft">On Air</p>
                <p className="font-display text-sm font-medium">Streaming via Radio.co</p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function ListenSection() {
  const { playing, toggle, now } = usePlayer();
  const hasTrack = now?.onAir && (now.title || now.artist);

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
                One continuous stream from the studio — early selections, test broadcasts
                and the sounds of a station finding its feet. Press play and keep us company.
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
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function GetInvolved() {
  return (
    <section id="get-involved" className="scroll-mt-24 bg-coal text-paper" data-testid="get-involved-section">
      <Marquee dark items={["Host a Show", "Share a Mix", "Join the Conversation", "The Door Is Open"]} />
      <div className="mx-auto grid max-w-[1600px] gap-12 px-4 py-24 sm:px-8 md:py-36 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-8">
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sage">Get involved</p>
          <h2 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Host a show with us.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
            Open House is being built with the people around it. DJs, artists, musicians,
            selectors, collectors and creatives — if you have an idea for a show, a mix,
            or something in between, we'd love to hear it.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Hosting a show on Open House`}
              data-testid="get-involved-email-btn"
              className="flex items-center gap-3 bg-paper px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-sage"
            >
              <Mail className="h-4 w-4" strokeWidth={1.5} />
              Email Us
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
            "The kettle is on. Come and make something with us."
          </blockquote>
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
        <Nav />
        <main>
          <Hero />
          <Marquee items={["Independent Radio", "Music", "Art", "Conversation", "Community", "Currently Taking Shape", "Open Door Policy"]} />
          <ListenSection />
          <GetInvolved />
          <ContactStrip />
        </main>
        <Footer />
        <PlayerBar />
      </PlayerProvider>
    </div>
  );
}

export default App;
