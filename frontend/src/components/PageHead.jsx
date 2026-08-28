import { MaskedLine, FadeIn } from "./Reveal";

export default function PageHead({ kicker, title, intro }) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 md:pt-44" data-testid="page-head">
      {kicker && (
        <FadeIn delay={0.1}>
          <p className="mb-6 text-xs uppercase tracking-[0.25em] text-sagedeep">{kicker}</p>
        </FadeIn>
      )}
      <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tighter md:text-[9vw]">
        <MaskedLine delay={0.15}>{title}</MaskedLine>
      </h1>
      {intro && (
        <FadeIn delay={0.5}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-inksoft md:text-lg">{intro}</p>
        </FadeIn>
      )}
    </div>
  );
}
