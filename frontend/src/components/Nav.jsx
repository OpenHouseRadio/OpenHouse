import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Play, Pause, Asterisk } from "lucide-react";
import { usePlayer } from "../lib/player";

const LINKS = [
  { to: "/radio", label: "Radio" },
  { to: "/shows", label: "Shows" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { playing, toggle } = usePlayer();

  return (
    <>
      <header
        data-testid="main-nav"
        className="fixed top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1600px] items-center justify-between px-4 sm:px-8">
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-1.5 font-display text-lg md:text-xl font-bold tracking-tight"
          >
            Open House
            <Asterisk className="h-4 w-4 text-sagedeep" strokeWidth={2} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" data-testid="nav-links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `link-underline text-sm uppercase tracking-[0.15em] transition-colors duration-300 hover:text-ink ${
                    isActive ? "active text-ink" : "text-inksoft"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              data-testid="listen-live-btn"
              className="group flex items-center gap-2.5 bg-ink px-5 py-2.5 text-xs md:text-sm uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink"
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
              Listen Live
              <span
                className={`h-1.5 w-1.5 rounded-full ${playing ? "bg-red-400 animate-pulse-dot" : "bg-sage"}`}
              />
            </button>
            <button
              onClick={() => setOpen(true)}
              data-testid="mobile-menu-btn"
              className="p-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-coal text-paper"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
              <span className="font-display text-lg font-bold">Open House</span>
              <button
                onClick={() => setOpen(false)}
                data-testid="mobile-menu-close"
                className="p-2"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                    className="block py-2 font-display text-5xl font-bold tracking-tight transition-colors duration-300 hover:text-sage"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="px-8 pb-10 text-xs uppercase tracking-[0.2em] text-paper/50">
              Independent radio & cultural platform
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
