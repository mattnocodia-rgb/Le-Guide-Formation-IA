import type { ReactNode } from "react";

export function ForWho({
  id,
  kicker,
  title,
  yes,
  no,
}: {
  id: string;
  kicker: string;
  title: string;
  yes: ReactNode[];
  no: ReactNode[];
}) {
  return (
    <section aria-labelledby={id} className="container-wide max-w-[880px] pt-16">
      <p className="note m-0 -rotate-1 text-[24px]">{kicker}</p>
      <h2 id={id} className="m-0 mt-1 text-[clamp(28px,3.2vw,38px)] leading-[1.1]">
        {title}
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[3fr_2fr]">
        <div className="sheet p-6" style={{ transform: "rotate(-0.4deg)" }}>
          <h3 className="m-0 text-[21px]">C'est pour vous si…</h3>
          <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
            {yes.map((y, i) => (
              <li key={i} className="flex gap-3 text-[16px] leading-relaxed">
                <span aria-hidden="true" className="font-extrabold text-accent-ink">✓</span>
                <span>{y}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-sm border border-rule bg-paper-light p-6">
          <h3 className="m-0 text-[19px] text-ink-soft">Ce n'est pas pour vous si…</h3>
          <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
            {no.map((n, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-soft">
                <span aria-hidden="true">✕</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
