import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, User } from "lucide-react";
import { getProject, getProjects } from "@/lib/api";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    setProject(null);
    getProject(slug).then(setProject).catch(() => {});
    getProjects().then((d) => setRelated(d.filter((p) => p.slug !== slug).slice(0, 3))).catch(() => {});
  }, [slug]);

  if (!project) {
    return <div className="flex min-h-screen items-center justify-center text-sm uppercase tracking-[0.2em] text-inksoft">Opening the door…</div>;
  }

  return (
    <div data-testid="project-detail-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-28 sm:px-8 md:pt-40">
        <FadeIn>
          <Link to="/projects" data-testid="back-to-projects" className="link-underline inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> All Projects
          </Link>
        </FadeIn>

        <div className="mt-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <FadeIn delay={0.1}>
              <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">{project.category}</p>
            </FadeIn>
            <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter md:text-[7vw]">
              <MaskedLine delay={0.15}>{project.title}</MaskedLine>
            </h1>
            <FadeIn delay={0.45}>
              <p className="mt-6 flex items-center gap-2 text-sm text-inksoft">
                <User className="h-4 w-4 text-sagedeep" strokeWidth={1.5} /> by {project.contributor}
              </p>
            </FadeIn>
          </div>
          {project.featured && (
            <FadeIn delay={0.5}>
              <span className="mt-2 inline-block bg-sage px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-ink" data-testid="featured-label">
                Featured on Open House
              </span>
            </FadeIn>
          )}
        </div>
      </div>

      <div ref={ref} className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8">
        <div className="overflow-hidden">
          <motion.img
            src={project.images?.[0] || project.image}
            alt={project.title}
            style={{ y: imgY }}
            className="aspect-[21/9] w-full scale-110 object-cover"
            data-testid="project-hero-image"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1600px] gap-16 px-4 sm:px-8 md:mt-24 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The work</p>
          <div className="space-y-6 text-base leading-relaxed text-ink/85 md:text-lg" data-testid="project-description">
            {project.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="project-external-link"
              className="link-underline mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ink"
            >
              Visit project <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </a>
          )}
        </Reveal>

        {project.images?.[1] && (
          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="overflow-hidden">
              <img
                src={project.images[1]}
                alt={`${project.title} — detail`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover grayscale-[30%] transition-[transform,filter] duration-700 hover:scale-105 hover:grayscale-0"
              />
            </div>
          </Reveal>
        )}
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="related-projects-section">
          <Reveal className="mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">More from the community</h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
