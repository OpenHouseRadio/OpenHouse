import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "../lib/player";
import { getLive } from "../lib/api";
import { Reveal } from "./Reveal";

export default function LiveModule({ compact = false }) {
  const [live, setLive] = useState(null);
  const { playing, open, close } = usePlayer();

  useEffect(() => {
    getLive().then(setLive).catch(() => {});
  }, []);

  if (!live) return null;

  return (
    <Reveal>
      <div
        data-testid="live-now-module"
        className="grid overflow-hidden border border-line bg-coal text-paper md:grid-cols-12"
      >
        <div className="relative overflow-hidden md:col-span-4">
          <motion.img
            src={live.image}
            alt={live.title}
            className="h-64 w-full object-cover opacity-90 grayscale-[40%] md:h-full"
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-coal/20" />
        </div>

        <div className={`flex flex-col justify-between gap-8 p-8 md:col-span-8 ${compact ? "md:p-10" : "md:p-14"}`}>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-paper/70" data-testid="live-indicator">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse-dot" />
              Live Now
            </p>
            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-paper/40 sm:block">
              Radio.co embed ready
            </p>
          </div>

          <div>
            <h3 className={`font-display font-bold tracking-tight ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-6xl"}`} data-testid="live-show-title">
              {live.title}
            </h3>
            <p className="mt-2 font-serifaccent text-xl italic text-sage">with {live.host}</p>
            {!compact && (
              <p className="mt-5 max-w-xl text-sm md:text-base leading-relaxed text-paper/70">
                {live.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={playing ? close : open}
              data-testid="live-play-btn"
              className="group flex items-center gap-3 bg-paper px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-sage"
            >
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              {playing ? "Pause" : "Play Live"}
            </button>
            <Link
              to="/radio"
              data-testid="view-schedule-link"
              className="link-underline flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-paper/80 transition-colors duration-300 hover:text-sage"
            >
              View Schedule <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
