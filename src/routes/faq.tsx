import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

const FAQS: Record<string, { q: string; a: string }[]> = {
  General: [
    { q: "What is MarketUK?", a: "MarketUK is the UK's most comprehensive property marketplace, covering residential, commercial, industrial, land and investment properties across England, Scotland and Wales." },
    { q: "Is MarketUK regulated?", a: "Yes. MarketUK is registered with the ICO (Information Commissioner's Office), affiliated with RICS, and all agents are members of The Property Ombudsman." },
    { q: "How do I create an account?", a: "Visit our login page and click 'Create Account'. You can sign up as a Buyer, Seller or Agent. You can also register using your Google account for instant access." },
    { q: "Is my data safe with MarketUK?", a: "Your data is encrypted in transit and at rest. We are GDPR compliant and will never sell your personal information to third parties. Read our Privacy Policy for full details." },
    { q: "What regions does MarketUK cover?", a: "We currently cover all of England, Scotland and Wales. Northern Ireland is launching in Q4 2026. We have listings in every major city and region." },
    { q: "How do I report a suspicious listing?", a: "Click the 'Report' button on any listing page, or email our team at trust@marketuk.co.uk. We investigate all reports within 24 hours." },
  ],
  Buyers: [
    { q: "Is it free to search for properties on MarketUK?", a: "Yes, searching, saving and enquiring about properties is completely free for buyers. There are no hidden fees or subscription requirements." },
    { q: "How do I save a property?", a: "Click the heart icon on any listing to save it to your dashboard. You'll need to be logged in. Saved properties are stored indefinitely until you remove them." },
    { q: "Can I set up property alerts?", a: "Yes. Save a search in your dashboard to receive email alerts when new matching properties are listed or when prices change on your saved properties." },
    { q: "How do I book a viewing?", a: "On any listing page, click 'Book Viewing'. The agent will confirm within 2 hours during business hours. You can also request virtual viewings." },
    { q: "Does MarketUK offer mortgage referrals?", a: "We partner with several FCA-regulated mortgage brokers. Request a free callback from your buyer dashboard and a broker will be in touch within one business day." },
    { q: "What information is included in a listing?", a: "All listings include: photos, full description, price, location, property type, tenure, key facts (bedrooms, bathrooms, EPC), agent contact details and enquiry form." },
  ],
  Sellers: [
    { q: "How much does it cost to list a property?", a: "We offer three plans: Free (1 listing), Standard (£29/month, up to 10 listings) and Premium (£59/month, unlimited listings with featured placement). See our Pricing page for full details." },
    { q: "How quickly will my listing go live?", a: "Standard listings are reviewed and published within 24 hours. Premium listings are typically live within 2 hours during business hours (Mon–Fri 9am–6pm)." },
    { q: "Can I edit my listing after publishing?", a: "Yes. Log in to your seller dashboard, navigate to My Listings and click Edit on any listing. Changes go live after a brief review (usually under 1 hour)." },
    { q: "How many photos can I upload?", a: "Free plan: 3 photos. Standard plan: 10 photos. Premium plan: 20 photos. We recommend high-quality landscape photos for maximum buyer engagement." },
    { q: "What is a Featured listing?", a: "Featured listings appear at the top of search results and on our homepage. They receive on average 4x more views than standard listings. Available on the Premium plan." },
    { q: "Can I pause my listing without deleting it?", a: "Yes. In your seller dashboard under My Listings, use the 'Pause' option to temporarily hide a listing. It can be re-activated at any time at no extra cost." },
  ],
  Agents: [
    { q: "How do I register as an agent on MarketUK?", a: "Select 'Agent' when creating your account. You'll need to provide your agency name, RICS or Propertymark number, and a valid business email address for verification." },
    { q: "Can I manage multiple listings as an agent?", a: "Yes. Agent accounts have full dashboard access to manage all your listings, leads, enquiries and viewing requests in one place. Bulk upload via CSV is available on request." },
    { q: "Does MarketUK integrate with property management software?", a: "We support data feeds from Reapit, Jupix, CFP, Vebra and Alto. Contact our agent support team for integration assistance." },
    { q: "How are leads delivered to agents?", a: "Buyer enquiries are delivered instantly to your MarketUK dashboard and forwarded to your registered email. SMS alerts are available on Premium plans." },
    { q: "What is a Branded Agent Profile?", a: "A branded profile includes your agency logo, contact details, team bios, service area map and a portfolio of all your active listings. Available on the Premium plan." },
    { q: "Is there a contract or minimum term?", a: "No long-term contracts. All plans are month-to-month and can be cancelled anytime. Annual billing is available at a 20% discount." },
  ],
  Payments: [
    { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) and BACS bank transfer for annual plans. All payments are processed securely via Stripe." },
    { q: "Can I switch plans at any time?", a: "Yes. You can upgrade or downgrade your plan at any time from your seller dashboard. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
    { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on all paid plans if you're not satisfied. Contact billing@marketuk.co.uk within 14 days of your first payment." },
    { q: "Is VAT included in the listed prices?", a: "All prices shown are exclusive of VAT. VAT at the current rate (20%) will be added at checkout. VAT receipts are available in your account settings." },
    { q: "What happens to my listings if I downgrade to Free?", a: "You can keep one listing on the Free plan. Additional listings will be temporarily hidden until you upgrade. No listings are permanently deleted when downgrading." },
    { q: "How do I get a VAT invoice?", a: "Invoices are automatically generated on each billing cycle and available in your account under Settings > Billing. You can download PDF invoices at any time." },
  ],
};

const CATEGORIES = Object.keys(FAQS);

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-4 text-left font-medium hover:text-primary transition-colors">
        <span className="pr-4">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>}
    </div>
  );
}

function FaqPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("General");

  const displayed = useMemo(() => {
    if (query.trim()) {
      const q = query.toLowerCase();
      return Object.values(FAQS).flat().filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    }
    return FAQS[cat] ?? [];
  }, [query, cat]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-14 text-center text-white">
        <h1 className="font-display text-4xl font-extrabold">Frequently Asked Questions</h1>
        <p className="mt-3 text-white/80">Find answers to common questions about buying, selling and listing on MarketUK.</p>
        <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-xl bg-white/10 px-4 py-2">
          <Search className="h-5 w-5 text-white/60" />
          <input
            className="flex-1 bg-transparent text-white placeholder:text-white/60 outline-none"
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        {!query && (
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${cat === c ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}>
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-6">
          {query && <p className="mb-4 text-sm text-muted-foreground">{displayed.length} result{displayed.length !== 1 ? "s" : ""} for "<strong>{query}</strong>"</p>}
          {displayed.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">No results found. <button className="text-primary hover:underline" onClick={() => setQuery("")}>Clear search</button></div>
          ) : (
            displayed.map((f) => <FaqItem key={f.q} {...f} />)
          )}
        </div>

        <div className="mt-10 rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
          <p className="font-semibold text-primary">Still have questions?</p>
          <p className="mt-1 text-sm text-muted-foreground mb-4">Our support team typically responds within one business day.</p>
          <Button asChild className="bg-gold text-white hover:bg-gold/90">
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
