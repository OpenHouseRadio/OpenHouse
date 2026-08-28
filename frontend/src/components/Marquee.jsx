import { Asterisk } from "lucide-react";

export default function Marquee({ items, className = "", dark = false }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div
      data-testid="marquee"
      className={`overflow-hidden border-y ${dark ? "border-paper/15" : "border-line"} py-4 ${className}`}
    >
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {doubled.map((t, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 text-xs md:text-sm uppercase tracking-[0.25em] ${dark ? "text-paper/60" : "text-inksoft"}`}
          >
            {t}
            <Asterisk className="h-4 w-4 text-sage" strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </div>
  );
}
