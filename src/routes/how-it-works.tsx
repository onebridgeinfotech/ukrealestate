import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Heart, MessageSquare, Calendar, CheckCircle, UserPlus, FileEdit, Bell, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});

const BUYER_STEPS = [
  { icon: Search, num: "01", title: "Search", desc: "Browse 14,000+ UK properties using our powerful search with filters for type, location, price, bedrooms and tenure. Save your searches for instant alerts." },
  { icon: Heart, num: "02", title: "Save & Compare", desc: "Save your favourite properties to your dashboard. Compare up to 4 listings side by side with full details, pricing history and area statistics." },
  { icon: MessageSquare, num: "03", title: "Enquire", desc: "Contact agents directly through our platform. Send enquiries, ask questions and get detailed responses — all tracked in your buyer dashboard." },
  { icon: Calendar, num: "04", title: "Book Viewing", desc: "Arrange in-person or virtual viewings at a time that suits you. Our agents confirm within 2 hours and send you full property packs in advance." },
  { icon: CheckCircle, num: "05", title: "Complete", desc: "Make your offer through the platform. We support you through solicitor referrals, mortgage advice and survey bookings right through to exchange and completion." },
];

const SELLER_STEPS = [
  { icon: UserPlus, num: "01", title: "Register", desc: "Create your free MarketUK account in under 2 minutes. Verify your email and you're ready to post your first listing immediately." },
  { icon: FileEdit, num: "02", title: "Post Listing", desc: "Use our guided listing wizard. Upload photos, add a description, set your price and choose your listing package. Go live within 24 hours of verification." },
  { icon: Bell, num: "03", title: "Receive Enquiries", desc: "Get instant notifications when buyers enquire. Respond directly through the platform, share additional documents and arrange viewings at your convenience." },
  { icon: MessageSquare, num: "04", title: "Accept Offers", desc: "Manage and compare offers through your seller dashboard. Mark properties as Under Offer, negotiate terms and instruct your solicitor — all in one place." },
  { icon: Star, num: "05", title: "Sold!", desc: "Complete the sale with confidence. We provide post-sale support, help you collect your buyer review and make the whole process transparent from day one." },
];

const FAQS = [
  { q: "Is MarketUK free to use for buyers?", a: "Yes, completely free. Creating an account, searching, saving properties, sending enquiries and booking viewings are all free for buyers." },
  { q: "How do I verify a listing is genuine?", a: "Every listing on MarketUK is verified by our team before going live. We check agent credentials, confirm property ownership and validate all key details." },
  { q: "Can I list a property without an estate agent?", a: "Yes. Private sellers can list on our platform using the Standard or Premium plan. We recommend Premium for maximum visibility." },
  { q: "What areas does MarketUK cover?", a: "We cover all of England, Scotland and Wales. Northern Ireland coverage is coming in Q4 2026." },
  { q: "How quickly will my listing go live?", a: "Standard listings are reviewed and published within 24 hours. Premium listings are typically live within 2 hours during business hours." },
  { q: "Can I upgrade my listing after publishing?", a: "Yes, you can upgrade your plan at any time from your seller dashboard. Changes take effect immediately." },
  { q: "What is the difference between Freehold and Leasehold?", a: "Freehold means you own the property and land outright. Leasehold means you own the property for the duration of a lease (often 99–999 years) but not the land." },
  { q: "Does MarketUK offer mortgage advice?", a: "We partner with several FCA-regulated mortgage brokers who can provide fee-free advice. You can request a callback from your buyer dashboard." },
];

function Step({ icon: Icon, num, title, desc }: { icon: React.ElementType; num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="mt-2 flex-1 border-l-2 border-dashed border-primary/20" style={{ minHeight: 40 }} />
      </div>
      <div className="pb-8">
        <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">Step {num}</div>
        <h3 className="font-display text-xl font-bold text-primary">{title}</h3>
        <p className="mt-2 text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

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

function HowItWorksPage() {
  const [tab, setTab] = useState<"buyers" | "sellers">("buyers");
  const steps = tab === "buyers" ? BUYER_STEPS : SELLER_STEPS;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16 text-center text-white">
        <h1 className="font-display text-4xl font-extrabold">How MarketUK Works</h1>
        <p className="mt-3 text-white/80">Everything you need to buy or sell UK property — in five simple steps.</p>
      </section>

      {/* Tab switcher */}
      <div className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl">
          {(["buyers","sellers"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors border-b-2 ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              For {t}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        {steps.map((s) => <Step key={s.num} {...s} />)}
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 font-display text-2xl font-bold text-primary">Frequently Asked Questions</h2>
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-display text-2xl font-bold text-primary mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of buyers and sellers on the UK's most trusted property platform.</p>
          <Button asChild className="bg-gold text-white hover:bg-gold/90 px-8">
            <Link to="/login">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
