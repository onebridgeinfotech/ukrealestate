import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/careers")({
  head: () => ({ meta: [{ title: "Careers — MarketUK" }] }),
  component: () => <ComingSoon title="Careers" description="Coming next." />,
});
