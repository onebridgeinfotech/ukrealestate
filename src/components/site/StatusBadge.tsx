import type { ListingBadge, ListingStatus } from "@/lib/mock-data";
import { Sparkles, Tag, Clock } from "lucide-react";

export function StatusBadge({ status }: { status: ListingStatus }) {
  const map = {
    active: { label: "Active", cls: "bg-emerald/10 text-emerald border-emerald/20" },
    "under-offer": { label: "Under Offer", cls: "bg-warning/15 text-warning border-warning/30" },
    sold: { label: "Sold", cls: "bg-danger/15 text-danger border-danger/30" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function ListingFlag({ badge }: { badge: ListingBadge }) {
  if (!badge) return null;
  const map = {
    featured: { label: "Featured", icon: Sparkles, cls: "bg-gold-gradient text-white shadow-gold" },
    new: { label: "New", icon: Clock, cls: "bg-emerald text-white" },
    reduced: { label: "Reduced", icon: Tag, cls: "bg-danger text-white" },
  } as const;
  const b = map[badge];
  const Icon = b.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${b.cls}`}>
      <Icon className="h-3 w-3" />
      {b.label}
    </span>
  );
}
