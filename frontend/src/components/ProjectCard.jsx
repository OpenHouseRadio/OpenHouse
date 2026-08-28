import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]", "aspect-[5/6]", "aspect-square"];

export default function ProjectCard({ project, index = 0, masonry = false }) {
  const aspect = masonry ? ASPECTS[index % ASPECTS.length] : "aspect-[4/5]";
  return (
    <Reveal delay={(index % 3) * 0.08} className={masonry ? "mb-8 break-inside-avoid" : ""}>
      <Link
        to={`/projects/${project.slug}`}
        data-testid={`project-card-${project.slug}`}
        className="group block"
      >
        <div className={`relative overflow-hidden bg-surface ${aspect}`}>
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale-[30%] transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
          />
          {project.featured && (
            <span className="absolute left-4 top-4 bg-sage px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink">
              Featured
            </span>
          )}
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-sagedeep">{project.category}</p>
            <h3 className="mt-1.5 font-display text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-sagedeep">
              {project.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-inksoft">{project.excerpt}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-inksoft/70">by {project.contributor}</p>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-inksoft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sagedeep" strokeWidth={1.5} />
        </div>
      </Link>
    </Reveal>
  );
}
