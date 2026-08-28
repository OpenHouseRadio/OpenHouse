import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export default function ShowCard({ show, index = 0, aspect = "aspect-[4/5]" }) {
  return (
    <Reveal delay={(index % 3) * 0.1}>
      <Link
        to={`/shows/${show.slug}`}
        data-testid={`show-card-${show.slug}`}
        className="group block"
      >
        <div className={`relative overflow-hidden bg-surface ${aspect}`}>
          <img
            src={show.image}
            alt={show.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
          />
          <span className="absolute left-4 top-4 bg-paper/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
            {show.category}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-inksoft">{show.genre}</p>
            <h3 className="mt-1.5 font-display text-xl md:text-2xl font-medium tracking-tight transition-colors duration-300 group-hover:text-sagedeep">
              {show.title}
            </h3>
            <p className="mt-1 text-sm text-inksoft">with {show.host}</p>
          </div>
          <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-inksoft transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sagedeep" strokeWidth={1.5} />
        </div>
      </Link>
    </Reveal>
  );
}
