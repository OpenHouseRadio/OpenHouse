import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, ArrowUpRight } from "lucide-react";
import { usePlayer } from "@/lib/player";
import { getSchedule, getShows, getProjects } from "@/lib/api";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import LiveModule from "@/components/LiveModule";
import ShowCard from "@/components/ShowCard";
import ProjectCard from "@/components/ProjectCard";
import ScheduleList from "@/components/ScheduleList";

const HERO_IMG = "https://images.unsplash.com/photo-1642177437932-75d846ad48f3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHxjYW5kaWQlMjBESiUyMHN0dWRpb3xlbnwwfHx8fDE3ODc5MTcyODJ8MA&ixlib=rb-4.1.0&q=85";
const ABOUT_IMG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGNvbnZlcnNhdGlvbiUyMGNvZmZlZXxlbnwwfHx8fDE3ODc5MTcyOTh8MA&ixlib=rb-4.1.0&q=85";

function Hero() {
  const { open } = usePlayer();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} data-testid="hero" className="relative overflow-hidden">
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
              A space for music, art, conversation, and the people making things around us.
            </p>
          </FadeIn>

          <FadeIn delay={0.85}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                onClick={open}
                data-testid="hero-listen-live-btn"
                className="group flex items-center gap-3 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
              >
                <Play className="h-4 w-4 fill-current" />
                Listen Live
              </button>
              <Link
                to="/shows"
                data-testid="hero-explore-btn"
                className="flex items-center gap-3 border border-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-surface"
              >
                Explore Shows
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </FadeIn>
        </motion.div>

        <div className="relative lg:col-span-4">
          <FadeIn delay={0.5} className="h-full">
            <div className="relative h-72 overflow-hidden sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[130%]">
              <motion.img
                src={HERO_IMG}
                alt="Hands on a mixing desk in the Open House studio"
                style={{ y: imgY }}
                className="h-[115%] w-full object-cover"
                data-testid="hero-image"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-5 left-4 flex items-center gap-3 border border-line bg-paper px-5 py-4 shadow-none lg:-left-10"
              data-testid="on-air-badge"
            >
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse-dot" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-inksoft">On Air</p>
                <p className="font-display text-sm font-medium">Broadcasting daily</p>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ kicker, title, linkTo, linkLabel, testId }) {
  return (
    <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
      <div>
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">{kicker}</p>
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl" data-testid={testId}>{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          data-testid={`${testId}-link`}
          className="link-underline flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink"
        >
          {linkLabel} <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      )}
    </Reveal>
  );
}

export default function Home() {
  const [schedule, setSchedule] = useState([]);
  const [shows, setShows] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getSchedule().then((d) => setSchedule(d.slice(0, 5))).catch(() => {});
    getShows().then((d) => setShows(d.filter((s) => s.featured).slice(0, 3))).catch(() => {});
    getProjects().then((d) => setProjects(d.filter((p) => p.featured).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <Hero />

      <Marquee
        items={["Independent Radio", "Music", "Art", "Conversation", "Community", "Emerging Talent", "Open Door Policy"]}
      />

      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-32" data-testid="live-section">
        <SectionHeading kicker="On the air right now" title="Live Now" linkTo="/radio" linkLabel="Go to Radio" testId="live-heading" />
        <LiveModule />
      </section>

      <section className="bg-surface" data-testid="schedule-preview-section">
        <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-32">
          <SectionHeading kicker="This week" title="Coming Up" linkTo="/radio" linkLabel="Full Schedule" testId="schedule-heading" />
          <ScheduleList entries={schedule} />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-32" data-testid="featured-shows-section">
        <SectionHeading kicker="From the programme" title="Featured Shows" linkTo="/shows" linkLabel="All Shows" testId="shows-heading" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {shows.map((s, i) => (
            <ShowCard key={s.slug} show={s} index={i} />
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface" data-testid="featured-projects-section">
        <div className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-32">
          <SectionHeading kicker="What people are making" title="From the Community" linkTo="/projects" linkLabel="All Projects" testId="projects-heading" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-20 sm:px-8 md:py-32" data-testid="about-teaser-section">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">What is Open House?</p>
            <blockquote className="font-serifaccent text-3xl italic leading-tight text-ink/85 md:text-5xl">
              "Part radio station, part creative platform, part community network — a place to talk about music, art, ideas, and the projects people are building around us."
            </blockquote>
            <Link
              to="/about"
              data-testid="about-teaser-link"
              className="link-underline mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink"
            >
              Read our story <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="overflow-hidden">
              <img
                src={ABOUT_IMG}
                alt="Friends in conversation over coffee"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover grayscale-[30%] transition-[transform,filter] duration-700 hover:scale-105 hover:grayscale-0"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-coal text-paper" data-testid="community-cta-section">
        <Marquee dark items={["Pitch a Show", "Submit a Project", "Share Your Work", "Join the Conversation"]} />
        <div className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8 md:py-36">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sage">The door is open</p>
            <h2 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
              Make something with us.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
              Open House runs on the people around it. If you have a show idea,
              a project, a record collection, or just a hunch — we want to hear it.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/submit?tab=show"
                data-testid="pitch-show-cta"
                className="bg-paper px-8 py-4 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-sage"
              >
                Pitch a Show
              </Link>
              <Link
                to="/submit?tab=project"
                data-testid="submit-project-cta"
                className="border border-paper/40 px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:border-sage hover:text-sage"
              >
                Submit a Project
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
