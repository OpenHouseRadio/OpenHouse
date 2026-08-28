import { useEffect, useState } from "react";
import { getSchedule, getResidents } from "@/lib/api";
import PageHead from "@/components/PageHead";
import LiveModule from "@/components/LiveModule";
import ScheduleList from "@/components/ScheduleList";
import EmbedPlaceholder from "@/components/EmbedPlaceholder";
import { Reveal } from "@/components/Reveal";

export default function Radio() {
  const [schedule, setSchedule] = useState([]);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    getSchedule().then(setSchedule).catch(() => {});
    getResidents().then(setResidents).catch(() => {});
  }, []);

  return (
    <div data-testid="radio-page" className="pb-20 md:pb-32">
      <PageHead
        kicker="The station"
        title="Radio"
        intro="Open House broadcasts every day from a small studio with a big window. Music, conversation and long silences, curated by residents and friends. Tune in, or browse the week below."
      />

      <section className="mx-auto mt-16 max-w-[1600px] px-4 sm:px-8 md:mt-24" data-testid="radio-live-section">
        <LiveModule />
      </section>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="radio-embed-section">
        <Reveal className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">Embeds</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">Player & Widgets</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          <EmbedPlaceholder
            testId="radioco-player-embed"
            label="Radio.co Player Embed"
            note="This space is reserved for the Radio.co web player. Drop the embed code in and the live stream lives here."
          />
          <EmbedPlaceholder
            testId="radioco-schedule-embed"
            label="Radio.co Schedule Widget"
            note="This space is reserved for the Radio.co schedule widget, synced automatically with the station clock."
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="radio-schedule-section">
        <Reveal className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">Weekly programme</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">The Week on Open House</h2>
        </Reveal>
        <ScheduleList entries={schedule} />
      </section>

      <section className="mx-auto mt-20 max-w-[1600px] px-4 sm:px-8 md:mt-32" data-testid="radio-residents-section">
        <Reveal className="mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-sagedeep">The voices</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">Residents</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {residents.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 0.08}>
              <div className="group text-center" data-testid={`resident-${r.name.toLowerCase().replace(/\s+/g, "-")}`}>
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
    </div>
  );
}
