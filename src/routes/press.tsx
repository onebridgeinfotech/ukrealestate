import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/press")({
  head: () => ({ meta: [{ title: "Press — MarketUK" }] }),
  component: () => <ComingSoon title="Press" description="Coming next." />,
});
