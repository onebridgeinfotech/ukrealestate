import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Eye, BedDouble, Bath, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListingFlag, StatusBadge } from "./StatusBadge";
import { formatPrice, type Listing } from "@/lib/mock-data";

function use3DTilt(strength = 15) {
  const ref = useRef<HTMLElement>(null);

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(8px)`;
    el.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px oklch(0.27 0.07 255 / 0.15), 0 20px 40px oklch(0.27 0.07 255 / 0.1)`;
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.boxShadow = "";
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease";
    setTimeout(() => { if (el) el.style.transition = ""; }, 500);
  }

  return { ref, onMouseMove, onMouseLeave };
}

export function ListingCard({ listing, variant = "grid" }: { listing: Listing; variant?: "grid" | "list" }) {
  const { ref, onMouseMove, onMouseLeave } = use3DTilt(8);

  if (variant === "list") {
    return (
      <article
        ref={ref as React.RefObject<HTMLElement>}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:flex-row"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        <Link to="/listings/$id" params={{ id: listing.id }} className="relative block aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-64">
          <img src={listing.image} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute left-3 top-3"><ListingFlag badge={listing.badge} /></div>
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <StatusBadge status={listing.status} />
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{listing.category}</span>
              </div>
              <Link to="/listings/$id" params={{ id: listing.id }}>
                <h3 className="font-display text-lg font-bold leading-snug text-foreground hover:text-primary transition-colors">{listing.title}</h3>
              </Link>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-gold" />{listing.location}
              </p>
            </div>
            <button aria-label="Save" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-all hover:scale-110">
              <Heart className="h-5 w-5" />
            </button>
          </div>
          {(listing.bedrooms || listing.bathrooms || listing.size) && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {listing.bedrooms && <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{listing.bedrooms} bed</span>}
              {listing.bathrooms && <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{listing.bathrooms} bath</span>}
              {listing.size && <span className="flex items-center gap-1"><Maximize2 className="h-4 w-4" />{listing.size}</span>}
            </div>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-border">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Asking Price</div>
              <div className="font-display text-2xl font-extrabold text-primary">{formatPrice(listing.price)}</div>
              {listing.offersInvited && <span className="text-xs font-medium text-gold">Offers Invited</span>}
            </div>
            <Button asChild className="bg-gold-gradient text-white shadow-gold hover:opacity-95 hover:scale-105 transition-all">
              <Link to="/listings/$id" params={{ id: listing.id }}>View Details</Link>
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card"
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      <Link to="/listings/$id" params={{ id: listing.id }} className="relative block aspect-[4/3] overflow-hidden">
        <img src={listing.image} alt={listing.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute left-3 top-3 flex gap-2"><ListingFlag badge={listing.badge} /></div>
        <button aria-label="Save listing" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-foreground shadow-lg backdrop-blur transition-all hover:bg-white hover:text-red-500 hover:scale-110">
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          <Eye className="h-3 w-3" />{(listing.views ?? 0).toLocaleString()}
        </div>
        {/* Price overlay on hover */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="rounded-lg bg-white/95 backdrop-blur px-3 py-1.5 shadow-lg">
            <div className="font-display text-base font-extrabold text-primary">{formatPrice(listing.price)}</div>
          </div>
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center gap-2">
          <StatusBadge status={listing.status} />
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{listing.category}</span>
        </div>
        <Link to="/listings/$id" params={{ id: listing.id }} className="min-w-0">
          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{listing.title}</h3>
        </Link>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
          <span className="truncate">{listing.location}</span>
        </p>
        {(listing.bedrooms || listing.bathrooms) && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {listing.bedrooms && <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.bedrooms}</span>}
            {listing.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.bathrooms}</span>}
            {listing.size && <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{listing.size}</span>}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Asking</div>
            <div className="font-display text-lg font-extrabold text-primary">{formatPrice(listing.price)}</div>
          </div>
          <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all shadow-sm">
            <Link to="/listings/$id" params={{ id: listing.id }}>Enquire</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
