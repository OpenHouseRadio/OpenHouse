import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Clock, User, Radio as RadioIcon } from "lucide-react";
import { getShow, getShows } from "@/lib/api";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import ShowCard from "@/components/ShowCard";
import EmbedPlaceholder from "@/components/EmbedPlaceholder";

export default function ShowDetail() {
  const { slug } = useParams();
  const [show, setShow] = useState(null);
  const [related, setRelated] = useState([]);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    setShow(null);
    getShow(slug).then(setShow).catch(() => {});
    getShows().then((d) => setRelated(d.filter((s) => s.slug !== slug).slice(0, 3))).catch(() => {});
  }, [slug]);

  if (!show) {
    return <div className="flex min-h-screen items-center justify-center text-sm uppercase tracking-[0.2em] text-inksoft">Tuning in…</div>;
  }

  return (
    <div data-testid="show-detail-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-28 sm:px-8 md:pt-40">
        <FadeIn>
          <Link to="/shows" data-testid="back-to-shows" className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> All Shows
          </Link>
        </FadeIn>

        <div className="mt-10">
          <FadeIn delay={0.1}>
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">{show.category} · {show.genre}</p>
          </FadeIn>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-[7vw]">
            <MaskedLine delay={0.15}>{show.title}</MaskedLine>
          </h1>
          <FadeIn delay={0.45}>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-inksoft">
              <span className="flex items-center gap-2"><User className="h-4 w-4 text-sagedeep" strokeWidth={1.5} /> Hosted by {show.host}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-sagedeep" strokeWidth={1.5} /> {show.airtime}</span>
              <span className="flex items-center gap-2"><RadioIcon className="h-4 w-4 text-sagedeep" strokeWidth={1.5} /> Open House Radio</span>
            </div>
          </FadeIn>
        </div>
      </div>

      <div ref={ref} className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8">
        <div className="overflow-hidden">
          <motion.img
            src={show.image}
            alt={show.title}
            style={{ y: imgY }}
            className="aspect-[21/9] w-full scale-110 object-cover"
            data-testid="show-hero-image"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1600px] gap-16 px-4 sm:px-8 md:mt-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">About the show</p>
          <div className="space-y-6 text-base leading-relaxed text-ink/85 md:text-lg" data-testid="show-description">
            {show.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-5">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">Listen back</p>
          <EmbedPlaceholder
            testId="show-archive-embed"
            label="Archive Audio"
            note="Past episodes will live here once the Radio.co archive embed is connected."
          />
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="related-shows-section">
          <Reveal className="mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">You might also like</h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {related.map((s, i) => (
              <ShowCard key={s.slug} show={s} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
