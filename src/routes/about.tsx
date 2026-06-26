import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "@/lib/mock-data";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const TEAM = [
  { initials: "JW", name: "James Whitfield", role: "Chief Executive Officer", bio: "20 years in UK property, ex-Knight Frank and Savills. Founded MarketUK to democratise property search." },
  { initials: "PS", name: "Priya Sharma", role: "Chief Technology Officer", bio: "Former engineering lead at Rightmove. Passionate about applying AI to real estate data." },
  { initials: "MJ", name: "Marcus Johnson", role: "Head of Sales", bio: "RICS Chartered Surveyor with 15 years agency experience across London and South East." },
  { initials: "ED", name: "Emma Davies", role: "Head of Operations", bio: "Specialist in property compliance and PropTech operations. Previously at The Property Ombudsman." },
];

const VALUES = [
  { icon: Shield, title: "Trust", desc: "Every listing is verified. Every agent is vetted. We hold ourselves to the highest standards of transparency and integrity in the UK property market." },
  { icon: Eye, title: "Transparency", desc: "No hidden fees, no algorithmic black boxes. Clear pricing, honest data and plain-English communication at every step of your property journey." },
  { icon: Zap, title: "Technology", desc: "We harness cutting-edge search, AI matching and data analytics to connect the right buyer with the right property faster than any other platform." },
];

const PARTNERS = ["RICS", "The Property Ombudsman", "ICO Registered", "Safe Agent"];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Connecting UK Property<br />Buyers &amp; Sellers
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            MarketUK is the UK's most comprehensive property marketplace — trusted by buyers, sellers, investors and agents nationwide.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-extrabold text-primary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-primary">Our Story</h2>
            <p className="leading-relaxed text-muted-foreground">
              MarketUK was founded in 2019 by a group of property professionals frustrated by the fragmentation of the UK real estate market. Commercial, residential, land, and investment properties were scattered across dozens of portals — making it impossible for buyers to compare opportunities or for sellers to reach the right audience.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We built a single, trusted platform where every type of UK property can be discovered, analysed and transacted. From a first-time buyer's two-bed flat in Manchester to a £50M mixed-use development in the City of London — MarketUK handles it all.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Today we work with over 850 estate agents, 14,000 active listings and 38,000 registered buyers across England, Scotland and Wales. We're RICS affiliated, ICO registered and regulated by The Property Ombudsman.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80" alt="UK property" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-primary">Meet the Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="rounded-xl border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary text-white font-bold text-xl">
                  {m.initials}
                </div>
                <h3 className="font-display font-bold text-primary">{m.name}</h3>
                <p className="text-xs font-medium text-gold mb-3">{m.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-primary">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-primary">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="border-y border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">Proud Partners &amp; Accreditations</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PARTNERS.map((p) => (
              <div key={p} className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-primary">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-white text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to find your perfect property?</h2>
          <p className="text-white/80 mb-8">Join 38,000+ buyers and sellers already using MarketUK.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild className="bg-gold text-white hover:bg-gold/90"><Link to="/listings">Browse Listings</Link></Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10"><Link to="/post">Post a Listing</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
