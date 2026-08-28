export default function EmbedPlaceholder({ label, note, testId }) {
  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center justify-center gap-3 border border-dashed border-ink/25 bg-surface/60 p-10 text-center md:p-16"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/25 text-inksoft">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </span>
      <p className="text-xs uppercase tracking-[0.25em] text-ink">{label}</p>
      <p className="max-w-xs text-sm leading-relaxed text-inksoft">{note}</p>
    </div>
  );
}
