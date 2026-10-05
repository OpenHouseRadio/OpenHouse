import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fmtDay, fmtDate } from "@/lib/player";
import { RESIDENTS, fetchCloudcasts, showsForResident } from "@/lib/residents";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import PortraitDoodle from "@/components/PortraitDoodle";

const MAX_PAST_SHOWS = 4;

function PastShows({ resident, cloudcasts }) {
  const shows = showsForResident(resident, cloudcasts).slice(0, MAX_PAST_SHOWS);
  return (
    <div data-testid={`past-shows-${resident.id}`}>
      <p className="text-xs uppercase tracking-[0.25em] text-inksoft">Past shows</p>
      {shows.length > 0 ? (
        <ul className="mt-4">
          {shows.map((s, i) => (
            <li key={s.key} className="border-t border-line/60 first:border-t-0">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`past-show-${resident.id}-${i}`}
                className="group flex items-baseline justify-between gap-4 py-3"
              >
                <span className="min-w-0 truncate font-display text-base font-medium tracking-tight transition-colors duration-300 group-hover:text-sagedeep">
                  {s.name}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-inksoft">
                  {fmtDay(s.created_time)} {fmtDate(s.created_time)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-inksoft" data-testid={`past-shows-empty-${resident.id}`}>
          First broadcast landing soon.
        </p>
      )}
      <Link
        to="/archive"
        data-testid={`archive-link-${resident.id}`}
        className="link-underline mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink"
      >
        Full archive <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}

export default function Residents() {
  const [cloudcasts, setCloudcasts] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchCloudcasts().then((items) => {
      if (alive) setCloudcasts(items);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div data-testid="residents-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 md:pt-44">
        <FadeIn delay={0.1}>
          <p className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sagedeep">
            <span className="h-1.5 w-1.5 rounded-full bg-sagedeep" />
            The people on the microphones
          </p>
        </FadeIn>
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter md:text-[9vw]">
          <MaskedLine delay={0.15}>Residents.</MaskedLine>
        </h1>
        <FadeIn delay={0.45}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-inksoft md:text-lg">
            Regular voices, open doors. Every resident makes their show their own way –
            this is who they are and what they've played.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8 md:mt-20" data-testid="residents-list">
        {RESIDENTS.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i * 0.08, 0.25)} y={16}>
            <article
              className="grid gap-10 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:py-16"
              data-testid={`resident-${r.id}`}
            >
              <div className="md:col-span-3">
                <div className="w-40 border border-line bg-surface p-6 md:w-full md:max-w-[220px]">
                  <PortraitDoodle
                    variant={r.portrait}
                    className="w-full"
                    label={`Hand-drawn portrait of ${r.name}`}
                  />
                </div>
              </div>

              <div className="min-w-0 md:col-span-5">
                <p className="text-xs uppercase tracking-[0.25em] text-sagedeep">
                  {r.cadence}
                  {r.role ? ` · ${r.role}` : ""}
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
                  {r.name}
                </h2>
                <p className="mt-2 font-serifaccent text-2xl italic text-sagedeep">{r.show}</p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-inksoft md:text-base">{r.bio}</p>
              </div>

              <div className="min-w-0 md:col-span-4">
                <PastShows resident={r} cloudcasts={cloudcasts} />
              </div>
            </article>
          </Reveal>
        ))}
        <div className="border-t border-line" />

        <Reveal>
          <div className="flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between" data-testid="residents-join">
            <p className="max-w-xl font-serifaccent text-2xl italic leading-snug text-ink/85 md:text-3xl">
              "Anyone can have a show. The door is open."
            </p>
            <a
              href="mailto:david@openhouseradio.co.uk?subject=Hosting a show on Open House"
              data-testid="residents-pitch-btn"
              className="flex items-center gap-3 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
            >
              Become a resident
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
