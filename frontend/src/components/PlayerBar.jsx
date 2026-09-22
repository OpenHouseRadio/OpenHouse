import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, X } from "lucide-react";
import { usePlayer } from "../lib/player";

export default function PlayerBar() {
  const { on, playing, toggle, close, now } = usePlayer();
  const trackLine = now?.onAir && now?.title
    ? `${now.title}${now.artist ? ` — ${now.artist}` : ""}`
    : "Open House Radio — Live Stream";

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          data-testid="player-bar"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-paper/10 bg-coal text-paper"
        >
          <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-8">
            <button
              onClick={toggle}
              data-testid="player-toggle-btn"
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-300 hover:bg-sage"
            >
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
            </button>

            <div className="flex h-6 items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`eq-bar w-[3px] bg-sage ${playing ? "animate-eq" : "scale-y-[0.25]"}`}
                  style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-paper/60">
                <span className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse-dot bg-red-400" : "bg-paper/40"}`} />
                {playing ? "Live Now" : "Paused"}
              </p>
              <p className="truncate font-display text-sm font-medium md:text-base" data-testid="player-show-title">
                {trackLine}
              </p>
            </div>

            <p className="hidden text-[10px] uppercase tracking-[0.2em] text-paper/40 md:block">
              Streaming via Radio.co
            </p>

            <button
              onClick={close}
              data-testid="player-close-btn"
              aria-label="Close player"
              className="p-2 text-paper/60 transition-colors duration-300 hover:text-paper"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
