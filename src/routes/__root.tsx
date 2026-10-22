import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getLayoutData } from "../lib/content.functions";
import { PageFrame } from "../components/site/SiteChrome";
import { SITE_DESCRIPTION, SITE_NAME, SITE_PROMISE } from "../lib/site";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap";

function NotFoundComponent() {
  return (
    <PageFrame>
      <div className="container-wide flex min-h-[60vh] flex-col items-start justify-center gap-6 py-20">
        <p className="note m-0 -rotate-2 text-[30px]">Oups, page introuvable</p>
        <h1 className="m-0 text-5xl leading-none">Cette page n'existe pas (ou plus).</h1>
        <p className="m-0 max-w-lg text-lg text-ink-soft">
          L'article a peut-être changé d'adresse. Le plus simple : repartir de l'accueil.
        </p>
        <Link to="/" className="btn-ink">
          Retour à l'accueil
        </Link>
      </div>
    </PageFrame>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="container-wide flex min-h-[70vh] flex-col items-start justify-center gap-6 py-20">
      <h1 className="m-0 text-4xl">La page n'a pas pu se charger.</h1>
      <p className="m-0 max-w-lg text-lg text-ink-soft">
        Un souci de notre côté. Vous pouvez réessayer, ou revenir à l'accueil.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-ink cursor-pointer border-0"
        >
          Réessayer
        </button>
        <a href="/" className="btn-outline">
          Accueil
        </a>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getLayoutData(),
  staleTime: 5 * 60 * 1000,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — ${SITE_PROMISE}` },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#f3eee3" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS_HREF },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "alternate", type: "text/plain", href: "/llms.txt", title: "llms.txt" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
