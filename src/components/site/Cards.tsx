import { Link } from "@tanstack/react-router";
import type React from "react";

import type { ArticleSummary } from "@/lib/content.functions";
import { formatDateFr, tiltFor } from "@/lib/site";

export function ArticleCard({
  article,
  index,
  showCategory = true,
  headingLevel = 3,
}: {
  article: ArticleSummary;
  index: number;
  showCategory?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className="sheet tilt relative flex flex-col gap-3 px-6 pt-7 pb-6"
      style={{ "--r": tiltFor(index) } as React.CSSProperties}
    >
      <div aria-hidden="true" className="tape top-[-10px] left-6 -rotate-3" />
      {showCategory && article.category ? (
        <span className="note text-[22px]">{article.category}</span>
      ) : null}
      <Heading className="m-0 text-[23px] leading-[1.2]">
        <Link
          to="/$slug"
          params={{ slug: article.slug }}
          className="text-ink no-underline after:absolute after:inset-0 after:content-['']"
        >
          {article.title}
        </Link>
      </Heading>
      {article.excerpt ? (
        <p className="m-0 text-base leading-relaxed text-ink-soft">{article.excerpt}</p>
      ) : null}
      <p className="mt-auto mb-0 text-[13px] text-muted-foreground">
        {article.updatedAt ? `Mis à jour le ${formatDateFr(article.updatedAt)} · ` : ""}
        {article.readingMinutes} min
      </p>
    </article>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="postit tilt max-w-xl p-6" style={{ "--r": "-1deg" } as React.CSSProperties}>
      <p className="note m-0 text-[26px] text-ink">{children}</p>
    </div>
  );
}

export function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
