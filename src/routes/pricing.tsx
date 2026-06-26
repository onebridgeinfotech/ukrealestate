import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    desc: "Perfect for private sellers with a single property to list.",
    features: ["1 active listing", "3 photos per listing", "Standard placement", "Email support", "Basic analytics"],
    notIncluded: ["Multiple listings", "Search boost", "Featured badge", "Priority support", "Branded profile"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Standard",
    monthly: 29,
    desc: "Ideal for small agencies and active property sellers.",
    features: ["10 active listings", "10 photos per listing", "Highlighted border in search", "Search boost (+25%)", "Full analytics dashboard", "Email & phone support", "Saved search alerts for buyers"],
    notIncluded: ["Featured badge", "Top placement", "Branded profile"],
    cta: "Start Standard",
    highlight: true,
  },
  {
    name: "Premium",
    monthly: 59,
    desc: "Maximum visibility for agents and prolific sellers.",
    features: ["Unlimited active listings", "20 photos per listing", "Featured badge on all listings", "Top search placement", "Priority support (2hr response)", "Branded agent profile", "Full analytics + export", "CSV bulk upload", "Dedicated account manager"],
    notIncluded: [],
    cta: "Go Premium",
    highlight: false,
  },
];

const FEATURES_TABLE = [
  { feature: "Active listings", free: "1", standard: "10", premium: "Unlimited" },
  { feature: "Photos per listing", free: "3", standard: "10", premium: "20" },
  { feature: "Standard placement", free: true, standard: true, premium: true },
  { feature: "Highlighted border", free: false, standard: true, premium: true },
  { feature: "Search boost", free: false, standard: "+25%", premium: "+60%" },
  { feature: "Featured badge", free: false, standard: false, premium: true },
  { feature: "Top placement", free: false, standard: false, premium: true },
  { feature: "Full analytics", free: false, standard: true, premium: true },
  { feature: "Branded profile", free: false, standard: false, premium: true },
  { feature: "CSV bulk upload", free: false, standard: false, premium: true },
  { feature: "Phone support", free: false, standard: true, premium: true },
  { feature: "Dedicated account manager", free: false, standard: false, premium: true },
];

const FAQ = [
  { q: "Is there a free trial for paid plans?", a: "We offer a 14-day money-back guarantee on all paid plans. No questions asked." },
  { q: "Can I switch plans at any time?", a: "Yes. Upgrade or downgrade at any time from your dashboard. Changes take effect immediately or at the next billing cycle for downgrades." },
  { q: "Do you offer discounts for agencies with multiple users?", a: "Yes. Contact our sales team for custom agency pricing for teams of 3 or more agents." },
  { q: "Is VAT included in the prices?", a: "No — all prices are exclusive of VAT. VAT at 20% is added at checkout. Full VAT invoices are available in your account." },
  { q: "What happens to my listings if I cancel?", a: "On cancellation, your account reverts to the Free plan. You keep 1 listing; additional listings are temporarily hidden but not deleted." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary">
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function CellValue({ val }: { val: boolean | string }) {
  if (typeof val === "boolean") {
    return val ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  }
  return <span className="text-sm font-medium">{val}</span>;
}

function PricingPage() {
  const [annual, setAnnual] = useState(false);

  function price(mo: number) {
    if (mo === 0) return "£0";
    const p = annual ? Math.round(mo * 0.8) : mo;
    return `£${p}`;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16 text-center text-white">
        <h1 className="font-display text-4xl font-extrabold">Simple, transparent pricing</h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto">No hidden fees. No long-term contracts. Choose the plan that's right for you.</p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 p-1">
          <button onClick={() => setAnnual(false)} className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${!annual ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${annual ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}>
            Annual <Badge className="ml-1.5 bg-gold text-white text-[10px]">Save 20%</Badge>
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`relative flex flex-col rounded-2xl border-2 bg-card p-8 ${plan.highlight ? "border-primary shadow-xl" : "border-border"}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4">Most Popular</Badge>
                </div>
              )}
              <h2 className="font-display text-xl font-bold text-primary">{plan.name}</h2>
              <div className="mt-3 mb-1">
                <span className="font-display text-4xl font-extrabold text-primary">{price(plan.monthly)}</span>
                {plan.monthly > 0 && <span className="text-muted-foreground text-sm">/mo{annual ? " (billed annually)" : ""}</span>}
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{plan.desc}</p>
              <ul className="mb-6 space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60">
                    <X className="mt-0.5 h-4 w-4 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button asChild className={plan.highlight ? "bg-primary text-white" : plan.monthly === 0 ? "bg-gold text-white hover:bg-gold/90" : ""} variant={plan.highlight ? "default" : "outline"}>
                <Link to="/login">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-primary">Feature Comparison</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4 text-left font-medium">Feature</th>
                <th className="p-4 text-center font-medium">Free</th>
                <th className="p-4 text-center font-medium">Standard</th>
                <th className="p-4 text-center font-medium">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FEATURES_TABLE.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center"><CellValue val={row.free} /></td>
                  <td className="p-4 text-center"><CellValue val={row.standard} /></td>
                  <td className="p-4 text-center"><CellValue val={row.premium} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 font-display text-2xl font-bold text-primary">Pricing FAQs</h2>
          {FAQ.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-display text-2xl font-bold text-primary mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Join 850+ estate agents and private sellers already listing on MarketUK.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-gold text-white hover:bg-gold/90"><Link to="/login">Start with Free</Link></Button>
            <Button asChild variant="outline"><Link to="/contact">Contact Sales</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
