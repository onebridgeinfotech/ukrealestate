import { useState, useEffect } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { SlidersHorizontal, Grid3X3, List, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ListingCard } from "@/components/site/ListingCard";
import { fetchListings } from "@/lib/listings-api";
import { listings as mockListings } from "@/lib/mock-data";

export const Route = createFileRoute("/listings/")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: (s.q as string) ?? "",
    type: (s.type as string) ?? "",
    region: (s.region as string) ?? "",
  }),
  component: ListingsPage,
});

const PROPERTY_TYPES = [
  "Residential","Commercial","New Build","Industrial","Land",
  "Office","Retail Units","Student Property","HMO & BTL","Auction","Holiday Let","Development",
];

interface Filters {
  types: string[];
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  tenures: string[];
  featured: boolean;
  reduced: boolean;
}

const DEFAULT_FILTERS: Filters = {
  types: [], minPrice: "", maxPrice: "", bedrooms: "Any",
  tenures: [], featured: false, reduced: false,
};

function countActiveFilters(f: Filters) {
  let n = f.types.length + f.tenures.length;
  if (f.minPrice) n++;
  if (f.maxPrice) n++;
  if (f.bedrooms !== "Any") n++;
  if (f.featured) n++;
  if (f.reduced) n++;
  return n;
}

function FilterPanel({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  function toggleArr(key: "types" | "tenures", val: string) {
    const arr = filters[key];
    setFilters({ ...filters, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  }
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Property Type</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox checked={filters.types.includes(t)} onCheckedChange={() => toggleArr("types", t)} />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Price Range</h3>
        <div className="flex gap-2">
          <Input placeholder="Min £" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} type="number" />
          <Input placeholder="Max £" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} type="number" />
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Bedrooms</h3>
        <div className="flex flex-wrap gap-2">
          {["Any","1","2","3","4","5+"].map((b) => (
            <button key={b} onClick={() => setFilters({ ...filters, bedrooms: b })}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${filters.bedrooms === b ? "border-primary bg-primary text-white" : "border-border hover:border-primary"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Tenure</h3>
        <div className="space-y-2">
          {["Freehold","Leasehold","Share of Freehold"].map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox checked={filters.tenures.includes(t)} onCheckedChange={() => toggleArr("tenures", t)} />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Special</h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox checked={filters.featured} onCheckedChange={(v) => setFilters({ ...filters, featured: !!v })} />
            <span className="text-sm">Featured Only</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox checked={filters.reduced} onCheckedChange={(v) => setFilters({ ...filters, reduced: !!v })} />
            <span className="text-sm">Reduced Price</span>
          </label>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => setFilters(DEFAULT_FILTERS)}>
        <X className="mr-2 h-4 w-4" /> Clear All Filters
      </Button>
    </div>
  );
}

// Adapt Supabase listing shape to the ListingCard expected shape
function adaptListing(l: Record<string, unknown>) {
  return {
    id: l.id as string,
    title: l.title as string,
    price: (l.asking_price as number) ?? 0,
    location: `${l.city as string}${l.county ? `, ${l.county}` : ""}`,
    category: l.property_type as string,
    bedrooms: (l.bedrooms as number) ?? undefined,
    bathrooms: (l.bathrooms as number) ?? undefined,
    size: l.floor_area ? `${l.floor_area} ${l.floor_area_unit ?? "sq ft"}` : undefined,
    image: (l.featured_image as string) ?? ((l.images as string[])?.[0] ?? "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80"),
    status: (l.status as string) === "under_offer" ? "under-offer" : l.status as string,
    badge: (l.is_featured as boolean) ? "featured" : undefined,
    tenure: l.tenure as string | undefined,
    slug: l.slug as string,
  };
}

function ListingsPage() {
  const search = useSearch({ from: "/listings/" });
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    types: search.type ? [search.type] : [],
  });
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(search.q ?? "");
  const [dbListings, setDbListings] = useState<ReturnType<typeof adaptListing>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const PER_PAGE = 12;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchListings({
      search: keyword || undefined,
      propertyType: filters.types.length ? filters.types : undefined,
      region: search.region || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      bedrooms: filters.bedrooms !== "Any" ? Number(filters.bedrooms.replace("+", "")) : undefined,
      isFeatured: filters.featured ? true : undefined,
      page,
      pageSize: PER_PAGE,
    }).then(({ listings: rows, total: t, error }) => {
      if (cancelled) return;
      if (error || !rows || rows.length === 0) {
        // Fall back to mock data
        setUsingMock(true);
        let items = [...mockListings] as unknown as Record<string, unknown>[];
        if (filters.types.length) items = items.filter((l) => filters.types.includes(l.category as string));
        if (filters.minPrice) items = items.filter((l) => (l.price as number) >= Number(filters.minPrice));
        if (filters.maxPrice) items = items.filter((l) => (l.price as number) <= Number(filters.maxPrice));
        if (sort === "price-asc") items.sort((a, b) => (a.price as number) - (b.price as number));
        if (sort === "price-desc") items.sort((a, b) => (b.price as number) - (a.price as number));
        const paged = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);
        setDbListings(paged.map((l) => ({
          id: l.id as string,
          title: l.title as string,
          price: l.price as number,
          location: l.location as string,
          category: l.category as string,
          bedrooms: l.bedrooms as number | undefined,
          bathrooms: l.bathrooms as number | undefined,
          size: l.size as string | undefined,
          image: l.image as string,
          status: l.status as string,
          badge: l.badge as string | undefined,
          tenure: l.tenure as string | undefined,
          slug: undefined,
        })));
        setTotal(items.length);
      } else {
        setUsingMock(false);
        setDbListings(rows.map(adaptListing));
        setTotal(t);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [filters, sort, page, keyword, search.region]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const activeCount = countActiveFilters(filters);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Search Results</span>
          </nav>
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-border bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2">
            <Input
              placeholder="Search by keyword, city, or postcode…"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="max-w-xl"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-primary">Filters</h2>
                {activeCount > 0 && <Badge className="bg-gold text-white">{activeCount}</Badge>}
              </div>
              <FilterPanel filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              {/* Mobile filter sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters{activeCount > 0 && ` (${activeCount})`}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="mt-6"><FilterPanel filters={filters} setFilters={(f) => { setFilters(f); setPage(1); }} /></div>
                </SheetContent>
              </Sheet>

              <p className="flex-1 text-sm text-muted-foreground">
                {loading ? (
                  <span className="flex items-center gap-1"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…</span>
                ) : (
                  <><span className="font-semibold text-foreground">{total}</span> properties found{usingMock && " (demo data)"}</>
                )}
              </p>

              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">Price: Low → High</SelectItem>
                    <SelectItem value="price-desc">Price: High → Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex overflow-hidden rounded-md border border-border">
                  <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-white" : "hover:bg-muted"}`}><Grid3X3 className="h-4 w-4" /></button>
                  <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-primary text-white" : "hover:bg-muted"}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-border bg-card">
                    <div className="h-48 rounded-t-xl bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-5 bg-muted rounded w-1/3 mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : dbListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-20 text-center">
                <p className="text-muted-foreground">No properties match your filters.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setFilters(DEFAULT_FILTERS); setKeyword(""); }}>Clear Filters</Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {dbListings.map((l) => <ListingCard key={l.id} listing={l as never} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {dbListings.map((l) => <ListingCard key={l.id} listing={l as never} variant="list" />)}
              </div>
            )}

            {totalPages > 1 && !loading && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <Button key={p} size="sm" onClick={() => setPage(p)}
                    className={p === page ? "bg-primary text-white" : ""}
                    variant={p === page ? "default" : "outline"}>{p}</Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
