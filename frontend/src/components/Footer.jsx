import { Link } from "react-router-dom";
import { Asterisk, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="flex items-center gap-1.5 font-display text-3xl font-bold tracking-tight">
              Open House
              <Asterisk className="h-5 w-5 text-sagedeep" strokeWidth={2} />
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-inksoft">
              Independent radio and cultural platform. A space for music, art,
              conversation, and the people making things around us.
            </p>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-inksoft">Newsletter — coming soon</p>
              <div className="mt-3 flex max-w-sm items-center border-b border-ink/30">
                <input
                  data-testid="newsletter-input"
                  type="email"
                  placeholder="your@email.com"
                  disabled
                  className="w-full bg-transparent py-3 text-sm placeholder:text-inksoft/60 focus:outline-none disabled:cursor-not-allowed"
                />
                <span className="text-xs uppercase tracking-[0.15em] text-inksoft/60">Soon</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs uppercase tracking-[0.2em] text-inksoft">Explore</p>
            <ul className="mt-4 space-y-3 text-sm">
              {[["Radio", "/radio"], ["Shows", "/shows"], ["Projects", "/projects"], ["About", "/about"], ["Submit", "/submit"]].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} data-testid={`footer-link-${label.toLowerCase()}`} className="link-underline text-ink transition-colors duration-300 hover:text-sagedeep">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-inksoft/60">Soon: Events · Archive · Residents</p>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-inksoft">Say hello</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="mailto:hello@openhouse.radio" data-testid="footer-email" className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep">
                  hello@openhouse.radio
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" data-testid="footer-instagram" className="group flex items-center gap-1 text-ink transition-colors duration-300 hover:text-sagedeep">
                  @openhouse
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            </ul>
            <p className="mt-8 font-serifaccent text-lg italic text-inksoft">
              "The door is always open."
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 text-xs uppercase tracking-[0.15em] text-inksoft md:flex-row md:items-center md:justify-between">
          <p>© 2026 Open House. All frequencies reserved.</p>
          <p>Made with friends, for friends.</p>
        </div>
      </div>
    </footer>
  );
}
