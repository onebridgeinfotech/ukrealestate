import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingCard } from "@/components/site/ListingCard";
import { listings } from "@/lib/mock-data";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
});

function SavedPage() {
  const [saved, setSaved] = useState(listings.slice(0, 4));
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");

  const displayed = saved.filter((l) => {
    if (filter === "residential") return l.category === "Residential" || l.category === "New Build";
    if (filter === "commercial") return l.category === "Commercial" || l.category === "Office" || l.category === "Industrial";
    if (filter === "land") return l.category === "Land" || l.category === "Development";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Saved Properties</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Saved Properties</h1>
            <p className="text-sm text-muted-foreground mt-1">{saved.length} properties saved</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land & Development</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Date Saved: Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                <SelectItem value="price-desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-24 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <h2 className="font-display text-xl font-semibold text-primary">No saved properties yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse listings and click the heart icon to save properties here.</p>
            <Button asChild className="mt-5 bg-primary text-white"><Link to="/listings">Browse Listings</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayed.map((l) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} />
                <button
                  onClick={() => setSaved((s) => s.filter((x) => x.id !== l.id))}
                  className="absolute right-3 top-14 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-500 shadow hover:bg-white transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {saved.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" className="text-red-500 hover:text-red-600 hover:border-red-200" onClick={() => setSaved([])}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear All Saved
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
