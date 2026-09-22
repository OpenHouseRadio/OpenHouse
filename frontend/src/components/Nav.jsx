import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Instagram, Mail, MessagesSquare, MessageCircle } from "lucide-react";
import { usePlayer } from "../lib/player";

export const INSTAGRAM_URL = "https://www.instagram.com/openhouse_world";
export const CONTACT_EMAIL = "david@openhouseradio.co.uk";
export const DISCORD_URL = "https://discord.gg/AGsudUcFn";
export const WHATSAPP_URL = "https://chat.whatsapp.com/Ex5aXILwwxj6mBkxcczlxe?mode=gi_t";

export default function Nav() {
  const { playing, toggle, now } = usePlayer();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!menuOpen) return;
    const y = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const pageLinks = [
    { to: "/schedule", label: "Schedule", testId: "menu-schedule" },
    { to: "/archive", label: "Archive", testId: "menu-archive" },
  ];

  return (
    <>
      <header
        data-testid="main-nav"
        className="fixed top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8 md:h-20">
          <Link to="/" data-testid="nav-logo" className="flex items-center" aria-label="Open House — home">
            <img
              src="/open-house-wordmark.png"
              alt="Open House"
              className="h-10 w-auto transition-transform duration-300 hover:-rotate-2 md:h-12"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/schedule"
              data-testid="nav-schedule"
              className="link-underline mr-1 hidden text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              Schedule
            </Link>
            <Link
              to="/archive"
              data-testid="nav-archive"
              className="link-underline mr-1 hidden text-xs uppercase tracking-[0.2em] text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              Archive
            </Link>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-instagram"
              aria-label="Open House on Instagram"
              className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              <Instagram className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              data-testid="nav-email"
              aria-label="Email Open House"
              className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-discord"
              aria-label="Open House on Discord"
              className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              <MessagesSquare className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-whatsapp"
              aria-label="Open House on WhatsApp"
              className="hidden p-2 text-inksoft transition-colors duration-300 hover:text-ink min-[900px]:block"
            >
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </a>
            <button
              onClick={toggle}
              data-testid="listen-live-btn"
              className="flex items-center gap-2.5 bg-ink px-5 py-3 text-xs uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink md:text-sm"
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
              <span className="hidden min-[400px]:inline">Listen Live</span>
              <span className="min-[400px]:hidden">Live</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ${now?.onAir ? "animate-pulse-dot bg-red-400" : "bg-sage"}`}
              />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              data-testid="menu-open"
              aria-label="Open menu"
              className="py-3.5 pl-3 text-xs uppercase tracking-[0.2em] text-ink min-[900px]:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            data-testid="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] bg-paper min-[900px]:hidden"
          >
            <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8 md:h-20">
              <img src="/open-house-wordmark.png" alt="Open House" className="h-10 w-auto md:h-12" />
              <button
                onClick={() => setMenuOpen(false)}
                data-testid="menu-close"
                aria-label="Close menu"
                className="py-3.5 pl-3 text-xs uppercase tracking-[0.2em] text-ink"
              >
                Close
              </button>
            </div>

            <nav className="px-4 pt-14 sm:px-8">
              <ul className="space-y-7">
                {pageLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      data-testid={l.testId}
                      className={`font-display text-[40px] font-bold leading-none tracking-tight text-ink ${
                        pathname.startsWith(l.to) ? "underline decoration-1 underline-offset-[6px]" : ""
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Hosting a show on Open House`}
                    onClick={() => setMenuOpen(false)}
                    data-testid="menu-pitch"
                    className="font-display text-[40px] font-bold leading-none tracking-tight text-ink"
                  >
                    Pitch a show
                  </a>
                </li>
              </ul>

              <div className="mt-12 border-t border-ink/15 pt-8">
                <ul className="space-y-4 text-base text-ink">
                  <li>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      data-testid="menu-instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      data-testid="menu-discord"
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      data-testid="menu-whatsapp"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => setMenuOpen(false)} data-testid="menu-email">
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
