import { Play, Pause, Asterisk, Instagram, Mail } from "lucide-react";
import { usePlayer } from "../lib/player";

export const INSTAGRAM_URL = "https://www.instagram.com/openhouse_radio";
export const CONTACT_EMAIL = "david@openhouseradio.co.uk";

export default function Nav() {
  const { playing, toggle } = usePlayer();

  return (
    <header
      data-testid="main-nav"
      className="fixed top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8 md:h-20">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-1.5 font-display text-lg font-bold tracking-tight md:text-xl"
        >
          Open House
          <Asterisk className="h-4 w-4 text-sagedeep" strokeWidth={2} />
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-instagram"
            aria-label="Open House on Instagram"
            className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink sm:block"
          >
            <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-testid="nav-email"
            aria-label="Email Open House"
            className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink sm:block"
          >
            <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </a>
          <button
            onClick={toggle}
            data-testid="listen-live-btn"
            className="flex items-center gap-2.5 bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink md:text-sm"
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            Listen Live
            <span
              className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse-dot bg-red-400" : "bg-sage"}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
