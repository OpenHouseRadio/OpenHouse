import { useEffect, useState } from "react";
import { getProjects } from "@/lib/api";
import PageHead from "@/components/PageHead";
import ProjectCard from "@/components/ProjectCard";
import { FadeIn } from "@/components/Reveal";

const FILTERS = ["All", "Music", "Art", "Events", "Film", "Photography", "Fashion"];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getProjects(filter === "All" ? null : filter).then(setProjects).catch(() => {});
  }, [filter]);

  return (
    <div data-testid="projects-page" className="pb-20 md:pb-32">
      <PageHead
        kicker="From the community"
        title="Projects"
        intro="Open House is a shelf, a wall and a window for the things people around us are making — zines, films, dinners, EPs, clothing, paintings. Have a look around."
      />

      <FadeIn delay={0.4} className="mx-auto mt-12 max-w-[1600px] px-4 sm:px-8">
        <div className="flex flex-wrap gap-3" data-testid="project-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-testid={`filter-${f.toLowerCase()}`}
              className={`border px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                filter === f
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-transparent text-inksoft hover:border-ink hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </FadeIn>

      <section className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8">
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3" data-testid="projects-grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} masonry />
          ))}
        </div>
        {projects.length === 0 && (
          <p className="py-20 text-center text-sm uppercase tracking-[0.2em] text-inksoft" data-testid="projects-empty">
            Nothing in this room yet — maybe yours goes here.
          </p>
        )}
      </section>
    </div>
  );
}
