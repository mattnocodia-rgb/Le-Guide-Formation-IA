import { createFileRoute, redirect } from "@tanstack/react-router";

// Keep shared and bookmarked URLs working, including client-side navigation.
export const Route = createFileRoute("/boutique")({
  beforeLoad: () => {
    throw redirect({ to: "/realisations", statusCode: 301, replace: true });
  },
});
