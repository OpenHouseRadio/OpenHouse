import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export default function ScheduleList({ entries, showDay = true }) {
  return (
    <div data-testid="schedule-list" className="border-t border-line">
      {entries.map((s, i) => (
        <Reveal key={`${s.day}-${s.time}-${s.slug}`} delay={Math.min(i * 0.05, 0.3)} y={16}>
          <Link
            to={`/shows/${s.slug}`}
            data-testid={`schedule-row-${s.slug}-${s.day}`}
            className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-1 border-b border-line py-5 transition-colors duration-300 hover:bg-surface md:grid-cols-[140px_90px_1fr_auto] md:px-4"
          >
            {showDay ? (
              <span className="text-xs uppercase tracking-[0.2em] text-inksoft">{s.day}</span>
            ) : (
              <span className="text-xs uppercase tracking-[0.2em] text-inksoft">{s.time}</span>
            )}
            <span className="text-xs uppercase tracking-[0.2em] text-inksoft md:text-ink">
              {showDay ? s.time : ""}
            </span>
            <span className="col-span-2 font-display text-xl font-medium tracking-tight transition-colors duration-300 group-hover:text-sagedeep md:col-span-1 md:text-2xl">
              {s.title}
            </span>
            <span className="col-span-2 text-sm text-inksoft md:col-span-1 md:text-right">
              with {s.host}
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
