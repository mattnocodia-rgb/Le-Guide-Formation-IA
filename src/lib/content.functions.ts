import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ArticleSummary = {
  title: string;
  slug: string;
  category: string;
  categorySlug: string | null;
  excerpt: string;
  publishedAt: string | null;
  updatedAt: string | null;
  readingMinutes: number;
};

function toSummary(a: ArticleSummary): ArticleSummary {
  return {
    title: a.title,
    slug: a.slug,
    category: a.category,
    categorySlug: a.categorySlug,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    readingMinutes: a.readingMinutes,
  };
}

export const listArticles = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublishedArticles } = await import("./airtable.server");
  const all = await getPublishedArticles();
  return all.map(toSummary);
});

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { getPublishedArticles, getCubeLinks, resolveCubeUrls } = await import("./airtable.server");
    const { renderMarkdown, parseFaq } = await import("./markdown.server");
    const all = await getPublishedArticles();
    const article = all.find((a) => a.slug === data.slug);
    if (!article) return null;
    const links = await getCubeLinks();
    const cube = resolveCubeUrls(article, links);
    const body = renderMarkdown(article.content, cube);
    const related = all
      .filter((a) => a.slug !== article.slug && a.category === article.category)
      .slice(0, 3)
      .map(toSummary);
    return {
      ...toSummary(article),
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      html: body.html,
      toc: body.toc,
      faq: parseFaq(article.faq, cube),
      sourcesHtml: article.sources ? renderMarkdown(article.sources, cube).html : "",
      related,
    };
  });
