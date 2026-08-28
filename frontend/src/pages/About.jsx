import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { getResidents } from "@/lib/api";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import Marquee from "@/components/Marquee";

const CHAPTERS = [
  {
    num: "01",
    title: "Openness",
    text: "The name is the whole idea. An open house is a place you can walk into without an invitation — where the kettle is on and somebody is always glad you came. We try to run a radio station the same way.",
  },
  {
    num: "02",
    title: "Creativity",
    text: "We believe most people are making something, or want to be. Open House exists to give that work a room — whether it's a first demo, a tenth zine, or a dinner that happens once a month.",
  },
  {
    num: "03",
    title: "Community",
    text: "The station belongs to the people around it. Residents are neighbours, guests are friends of friends, and the schedule has a permanent slot for whoever walks in next.",
  },
  {
    num: "04",
    title: "Culture",
    text: "We care about the culture that happens at eye level — small gigs, kitchen-table labels, pub galleries, group chats. Not the algorithm's version of the city, but the actual one.",
  },
];

const ABOUT_IMG = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGNvbnZlcnNhdGlvbiUyMGNvZmZlZXxlbnwwfHx8fDE3ODc5MTcyOTh8MA&ixlib=rb-4.1.0&q=85";
const STUDIO_IMG = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop";

export default function About() {
  const [residents, setResidents] = useState([]);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    getResidents().then(setResidents).catch(() => {});
  }, []);

  return (
    <div data-testid="about-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 md:pt-44">
        <FadeIn delay={0.1}>
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">About Open House</p>
        </FadeIn>
        <h1 className="max-w-6xl font-display text-5xl font-black leading-[0.95] tracking-tighter md:text-[6.5vw]">
          <MaskedLine delay={0.15}>An open door for</MaskedLine>
          <MaskedLine delay={0.28}>sound & ideas.</MaskedLine>
        </h1>
        <FadeIn delay={0.55}>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-inksoft md:text-lg">
            Open House started the way most good things do — with a borrowed mixer,
            a spare room and too many talented friends. It is now an independent
            online radio station and cultural platform: part broadcaster, part
            magazine, part noticeboard for the neighbourhood.
          </p>
        </FadeIn>
      </div>

      <div ref={ref} className="mx-auto mt-16 max-w-[1600px] px-4 sm:px-8 md:mt-24">
        <div className="overflow-hidden">
          <motion.img
            src={STUDIO_IMG}
            alt="The Open House studio mixing desk"
            style={{ y: imgY }}
            className="aspect-[21/9] w-full scale-110 object-cover"
            data-testid="about-hero-image"
          />
        </div>
      </div>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="manifesto-section">
        <Reveal className="mb-16">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The manifesto</p>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">What we believe</h2>
        </Reveal>
        <div className="border-t border-line">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.num} delay={0.05 * i}>
              <div
                className="grid gap-6 border-b border-line py-12 md:grid-cols-12 md:py-16"
                data-testid={`manifesto-${c.num}`}
              >
                <p className="font-serifaccent text-5xl italic text-sagedeep md:col-span-2 md:text-6xl">{c.num}</p>
                <h3 className="font-display text-3xl font-bold tracking-tight md:col-span-4 md:text-5xl">{c.title}</h3>
                <p className="max-w-xl text-base leading-relaxed text-ink/80 md:col-span-6 md:text-lg">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="story-section">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="overflow-hidden">
              <img
                src={ABOUT_IMG}
                alt="Friends talking over coffee"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover grayscale-[30%] transition-[transform,filter] duration-700 hover:scale-105 hover:grayscale-0"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-7">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The short version</p>
            <blockquote className="font-serifaccent text-3xl italic leading-tight text-ink/85 md:text-4xl">
              "We play music we love, talk to people we admire, and put their work
              on a shelf where everyone can see it. That's the whole business plan."
            </blockquote>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-inksoft">
              There is no growth hack and no content strategy. There is a schedule
              of shows made by residents, a rolling showcase of community projects,
              and a standing invitation to come and make something with us.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee
        className="mt-20 md:mt-32"
        items={["Openness", "Creativity", "Collaboration", "Culture", "Community"]}
      />

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="about-residents-section">
        <Reveal className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The people</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">Residents & Contributors</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {residents.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08}>
              <div className="group text-center">
                <div className="mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full">
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <p className="mt-4 font-display text-base font-medium">{r.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-inksoft">{r.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1600px] px-4 sm:px-8 md:mt-36" data-testid="about-cta-section">
        <Reveal className="border border-line bg-surface p-10 md:p-20">
          <h2 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Want to be part of it?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-inksoft">
            Shows, projects, ideas, half-ideas — bring them all. The kettle is on.
          </p>
          <Link
            to="/submit"
            data-testid="about-submit-cta"
            className="mt-10 inline-block bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
          >
            Submit Something
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
