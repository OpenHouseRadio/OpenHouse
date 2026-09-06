import { usePlayer, fmtDay, fmtDate, fmtTime, isLiveEvent, upcomingEvents, eventParts } from "@/lib/player";
import { MaskedLine, FadeIn, Reveal } from "@/components/Reveal";
import { CalendarDoodle } from "@/components/Doodle";
import { INSTAGRAM_URL } from "@/components/Nav";

export default function Schedule() {
  const { schedule, now } = usePlayer();
  const upcoming = upcomingEvents(schedule);

  const groups = [];
  for (const ev of upcoming) {
    const key = `${fmtDay(ev.start)} ${fmtDate(ev.start)}`;
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, events: [] };
      groups.push(g);
    }
    g.events.push(ev);
  }

  return (
    <div data-testid="schedule-page" className="pb-20 md:pb-32">
      <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 md:pt-44">
        <FadeIn delay={0.1}>
          <p className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sagedeep">
            <span className="h-1.5 w-1.5 rounded-full bg-sagedeep" />
            The programme — synced live with the studio
          </p>
        </FadeIn>
        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter md:text-[9vw]">
          <MaskedLine delay={0.15}>Schedule</MaskedLine>
        </h1>
      </div>

      <div className="mx-auto mt-16 max-w-[1600px] px-4 sm:px-8 md:mt-20">
        {groups.length > 0 ? (
          <div className="border-b border-line">
            {groups.map((g) => (
              <Reveal key={g.key} className="border-t border-line">
                <div className="grid gap-4 py-8 md:grid-cols-12 md:py-12" data-testid={`schedule-day-${g.key.toLowerCase().replace(/\s+/g, "-")}`}>
                  <h2 className="font-display text-2xl font-bold tracking-tight md:col-span-3 md:text-4xl">
                    {g.key}
                  </h2>
                  <div className="md:col-span-9">
                    {g.events.map((ev, i) => {
                      const live = isLiveEvent(ev);
                      const parts = eventParts(ev);
                      const hostShown = (live && now?.dj) || parts.host;
                      return (
                        <div
                          key={ev.event_id || i}
                          data-testid={`listing-row-${i}`}
                          className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 gap-y-1 border-b border-line/60 py-5 last:border-b-0 md:grid-cols-[200px_1fr_auto]"
                        >
                          <span className="text-sm uppercase tracking-[0.2em] text-inksoft">
                            {fmtTime(ev.start)}—{fmtTime(ev.end)}
                          </span>
                          <span className="font-display text-xl font-medium tracking-tight md:text-2xl">
                            {parts.title}
                            {hostShown && (
                              <span className="font-serifaccent text-lg italic text-inksoft"> — {hostShown}</span>
                            )}
                          </span>
                          <span className="col-span-2 md:col-span-1 md:text-right">
                            {live && (
                              <span
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sagedeep"
                                data-testid="listing-live-badge"
                              >
                                <span className="h-2 w-2 animate-pulse-dot rounded-full bg-sagedeep" />
                                On Air
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 border-y border-line py-16 text-center" data-testid="schedule-empty">
            <CalendarDoodle className="w-44 md:w-56" />
            <p className="max-w-md text-sm leading-relaxed text-inksoft">
              The programme is being drawn up — follow{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sagedeep"
              >
                @openhouse_radio
              </a>{" "}
              for the first broadcasts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
