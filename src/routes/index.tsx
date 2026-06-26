import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star, Home as HomeIcon, Building2, HardHat, Factory, Map, Briefcase, ShoppingBag, GraduationCap, Users, Gavel, Palmtree, Layers, UserPlus, FileEdit, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/site/SearchBar";
import { ListingCard } from "@/components/site/ListingCard";
import { listings, categories, cities, testimonials, stats } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MarketUK — Find Your Perfect Business or Property" },
      { name: "description", content: "Browse 10,000+ businesses, franchises and commercial property for sale across the UK. Trusted by 5,000+ verified buyers." },
    ],
  }),
  component: Home,
});

const iconMap = { Home: HomeIcon, Building2, HardHat, Factory, Map, Briefcase, ShoppingBag, GraduationCap, Users, Gavel, Palmtree, Layers };

function Home() {
  const featured = listings.filter((l) => l.badge === "featured" || l.badge === "new").slice(0, 6);
  const recent = listings.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-hero-gradient text-white perspective-1000 transform-3d">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(232,184,75,0.18),transparent_50%)]" />
        {/* Floating orbs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-gold/20 blur-[100px] animate-pulse-slow" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-blue-400/20 blur-[80px] animate-pulse-slower" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-[60px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Trusted by 5,000+ verified buyers across the UK
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl">
              Find Your Perfect <span className="text-gold-gradient">Business</span> or Property
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 md:text-lg">
              The UK's premium marketplace connecting serious buyers with quality businesses, franchises and commercial property — all in one place.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl md:mt-10">
            <SearchBar variant="hero" />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald" /> Verified listings</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald" /> Direct broker contact</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald" /> Free for buyers</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4 md:px-6 perspective-1000">
          {stats.map((s) => (
            <div key={s.label} className="group rounded-2xl border border-border bg-card p-6 text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_oklch(0.72_0.13_75/0.15)] hover:border-gold/30">
              <div className="font-display text-2xl font-extrabold text-primary md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <SectionHeader eyebrow="Hand-picked opportunities" title="Featured Properties" titleClassName="text-animated-gradient" subtitle="Premium businesses and properties from trusted sellers, updated daily." action={{ label: "View all", to: "/listings" }} />
        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {featured.map((l) => (
            <div key={l.id} className="w-[80vw] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none">
              <ListingCard listing={l} />
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <SectionHeader eyebrow="Explore the marketplace" title="Browse by Category" subtitle="Find the right opportunity in your sector of expertise." />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {categories.map((c) => {
              const Icon = iconMap[c.icon as keyof typeof iconMap];
              return (
                <Link key={c.name} to="/listings" className="group relative overflow-hidden rounded-2xl border border-border bg-background p-4 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-10px_oklch(0.27_0.07_255/0.3)] hover:border-gold flex items-center gap-4">
                  {/* Sheen sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary transition-colors group-hover:bg-gold-gradient group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-sm font-bold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.count.toLocaleString()} listings</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <SectionHeader eyebrow="UK-wide coverage" title="Browse by Location" subtitle="Opportunities in every major UK city and region." />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cities.map((c) => (
            <Link key={c.name} to="/listings" className="group relative block aspect-[4/5] overflow-hidden rounded-xl shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated">
              <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="font-display text-xl font-extrabold">{c.name}</div>
                <div className="text-xs text-white/80">{c.count.toLocaleString()} listings</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <SectionHeader eyebrow="Simple, transparent process" title="How It Works" subtitle="Three steps from sign-up to a signed deal." />
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              { n: "01", Icon: UserPlus, title: "Register Free", desc: "Create your buyer or seller account in under 60 seconds. No fees, no obligation." },
              { n: "02", Icon: FileEdit, title: "Post or Search", desc: "Sellers list with our guided wizard. Buyers search 10,000+ verified opportunities." },
              { n: "03", Icon: Handshake, title: "Connect & Close", desc: "Message directly, exchange documents securely, and complete your deal with confidence." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-background p-6 shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated md:p-8">
                <span className="absolute -top-3 left-6 rounded-md bg-gold-gradient px-2.5 py-0.5 text-xs font-bold text-white shadow-gold">STEP {s.n}</span>
                <span className="mb-4 grid h-14 w-14 place-items-center rounded-xl bg-primary text-primary-foreground"><s.Icon className="h-7 w-7" /></span>
                <h3 className="font-display text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT LISTINGS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <SectionHeader eyebrow="Just listed" title="Recent Listings" subtitle="The newest opportunities added to MarketUK this week." action={{ label: "Browse all", to: "/listings" }} />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((l) => (<ListingCard key={l.id} listing={l} />))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20">
          <SectionHeader eyebrow="What our community says" title="Trusted by buyers and sellers" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-background p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elevated md:p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-gold text-gold" />))}
                </div>
                <blockquote className="text-base leading-relaxed text-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{t.name.split(" ").map(n => n[0]).join("")}</span>
                  <div>
                    <div className="font-display text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 text-white shadow-elevated md:px-12 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_50%,rgba(232,184,75,0.2),transparent_60%)]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <h3 className="font-display text-2xl font-extrabold md:text-3xl">Get new listings in your inbox</h3>
              <p className="mt-2 text-white/75">Weekly digest of the best new businesses and properties matching your interests. Unsubscribe anytime.</p>
            </div>
            <form className="flex flex-col gap-2 sm:flex-row">
              <input type="email" required placeholder="you@email.com" className="h-12 w-full rounded-lg border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/55 focus:border-gold focus:outline-none" />
              <div className="relative inline-flex shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gold/40 blur-xl animate-pulse-slow scale-110 pointer-events-none" />
                <Button type="submit" className="relative h-12 bg-gold-gradient px-6 font-semibold text-white shadow-gold hover:opacity-95 btn-3d">
                  Subscribe <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, titleClassName, subtitle, action }: { eyebrow?: string; title: string; titleClassName?: string; subtitle?: string; action?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow && <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">{eyebrow}</div>}
        <h2 className={`font-display text-2xl font-extrabold tracking-tight md:text-4xl ${titleClassName ?? "text-foreground"}`}>{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground md:text-base">{subtitle}</p>}
      </div>
      {action && (
        <Link to={action.to} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
