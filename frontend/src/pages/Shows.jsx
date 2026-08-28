import { useEffect, useState } from "react";
import { getShows } from "@/lib/api";
import PageHead from "@/components/PageHead";
import ShowCard from "@/components/ShowCard";
import { FadeIn } from "@/components/Reveal";

const FILTERS = ["All", "Music", "Talk", "Guest Mix"];

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    getShows(filter === "All" ? null : filter).then(setShows).catch(() => {});
  }, [filter]);

  return (
    <div data-testid="shows-page" className="pb-20 md:pb-32">
      <PageHead
        kicker="The programme"
        title="Shows"
        intro="Every show on Open House is made by someone who lives here — residents, friends, first-timers. Browse the current programme and find your frequency."
      />

      <FadeIn delay={0.4} className="mx-auto mt-12 max-w-[1600px] px-4 sm:px-8">
        <div className="flex flex-wrap gap-3" data-testid="show-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-testid={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" data-testid="shows-grid">
          {shows.map((s, i) => (
            <ShowCard key={s.slug} show={s} index={i} />
          ))}
        </div>
        {shows.length === 0 && (
          <p className="py-20 text-center text-sm uppercase tracking-[0.2em] text-inksoft" data-testid="shows-empty">
            Nothing here yet — check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
