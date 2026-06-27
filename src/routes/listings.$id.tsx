import { useState, useRef } from "react";
import { toast } from "sonner";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Calendar, Eye, Heart, Share2, Phone, Mail, Download,
  Train, School, ChevronLeft, ChevronRight, CheckCircle, FileText, Copy, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusBadge } from "@/components/site/StatusBadge";
import { ListingCard } from "@/components/site/ListingCard";
import { listings, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/listings/$id")({
  component: ListingDetailPage,
});

const KEY_FACTS = [
  { label: "Property Type", key: "category" },
  { label: "Tenure", key: "tenure" },
  { label: "Bedrooms", value: "4" },
  { label: "Bathrooms", value: "3" },
  { label: "Floor Area", value: "2,340 sq ft" },
  { label: "EPC Rating", value: "C" },
  { label: "Council Tax Band", value: "G" },
  { label: "Year Built", value: "1895" },
];

const FEATURES_INTERIOR = [
  "Open-plan kitchen/dining room with bi-fold doors",
  "Master bedroom with en-suite and dressing room",
  "Two further double bedrooms with fitted wardrobes",
  "Family bathroom with freestanding bath",
  "Study/home office on ground floor",
  "Underfloor heating throughout ground floor",
];
const FEATURES_EXTERIOR = [
  "South-facing landscaped rear garden (60ft)",
  "Off-street parking for two vehicles",
  "Detached double garage with EV charging point",
  "Covered outdoor entertaining terrace",
  "Mature planting and raised vegetable beds",
];
const FEATURES_UTILITIES = [
  "Mains gas central heating (Worcestershire boiler, 2023)",
  "Double glazing throughout",
  "Superfast broadband (FTTP, 900Mbps)",
  "Mains water and drainage",
  "Integrated smart home system (Lutron)",
];

const STATIONS = [
  { name: "Kensington (Olympia)", distance: "0.4 miles", lines: "Overground, District" },
  { name: "High Street Kensington", distance: "0.7 miles", lines: "District, Circle" },
  { name: "Earl's Court", distance: "0.9 miles", lines: "District, Piccadilly" },
];

const SCHOOLS = [
  { name: "Kensington Primary Academy", type: "Primary", ofsted: "Outstanding", distance: "0.2 miles" },
  { name: "Holland Park School", type: "Secondary", ofsted: "Outstanding", distance: "0.5 miles" },
];

function MortgageCalc({ price }: { price: number }) {
  const [deposit, setDeposit] = useState(Math.round(price * 0.1));
  const loanAmt = Math.max(0, price - deposit);
  const monthly = Math.round((loanAmt * 0.045) / 12);
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <h3 className="mb-3 font-display font-bold text-primary">Mortgage Calculator</h3>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Property Price</label>
          <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium">{formatPrice(price)}</div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Deposit</label>
          <Input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Est. Monthly Payment</span>
          <span className="font-display text-xl font-extrabold text-primary">Â£{monthly.toLocaleString()}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">Based on 4.5% APR, 25-year term. Indicative only.</p>
      </div>
    </div>
  );
}

function ListingDetailPage() {
  const { id } = Route.useParams();
  const listing = listings.find((l) => l.id === id) ?? listings[0];
  const related = listings.filter((l) => l.id !== listing.id && l.category === listing.category).slice(0, 3);
  const fallbackRelated = listings.filter((l) => l.id !== listing.id).slice(0, 3);
  const relatedItems = related.length >= 2 ? related : fallbackRelated;

  const [thumbIdx, setThumbIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [enquiry, setEnquiry] = useState({ name: "", email: "", phone: "", message: `I am interested in ${listing.title}. Please contact me to discuss further.`, viewing: false });
  const enquiryRef = useRef<HTMLDivElement>(null);

  function scrollToEnquiry(withViewing = false) {
    if (withViewing) setEnquiry((e) => ({ ...e, viewing: true }));
    enquiryRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }

  function shareVia(platform: string) {
    const url = window.location.href;
    const text = encodeURIComponent(listing.title);
    const encodedUrl = encodeURIComponent(url);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      email: `mailto:?subject=${text}&body=Check%20out%20this%20property%3A%20${encodedUrl}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => toast("Link copied to clipboard!", { icon: "🔗" }));
    } else {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
  }

  const images = [listing.image, listing.image, listing.image, listing.image];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-primary">{listing.category}</Link>
            <span>/</span>
            <span className="truncate text-foreground font-medium max-w-xs">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left column */}
          <div className="min-w-0 flex-1">
            {/* Gallery */}
            <div className="mb-6">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                <img src={images[thumbIdx]} alt={listing.title} className="h-full w-full object-cover" />
                <button onClick={() => setThumbIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => setThumbIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setThumbIdx(i)}
                      className={`h-2 w-2 rounded-full transition-colors ${i === thumbIdx ? "bg-white" : "bg-white/50"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setThumbIdx(i)}
                    className={`aspect-[4/3] overflow-hidden rounded-lg border-2 transition-colors ${i === thumbIdx ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className={`h-full w-full object-cover transition-opacity ${i === thumbIdx ? "opacity-100" : "opacity-60 hover:opacity-80"}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title block */}
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={listing.status} />
                <Badge variant="secondary">{listing.category}</Badge>
                {listing.badge === "featured" && <Badge className="bg-gold text-white">Featured</Badge>}
                {listing.badge === "reduced" && <Badge className="bg-red-500 text-white">Reduced</Badge>}
              </div>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-primary sm:text-3xl">{listing.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Ref: {listing.ref}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Listed {listing.listedDate}</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{listing.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Price block */}
            <div className="mb-6 rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Asking Price</div>
                  <div className="font-display text-4xl font-extrabold text-primary">{formatPrice(listing.price)}</div>
                  {listing.offersInvited && <span className="text-sm font-medium text-gold">Offers Invited</span>}
                  {listing.tenure && <Badge variant="outline" className="mt-2">{listing.tenure}</Badge>}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gold text-white hover:bg-gold/90" onClick={() => scrollToEnquiry()}>
                    <Mail className="mr-2 h-4 w-4" /> Send Enquiry
                  </Button>
                  <Button variant="outline" onClick={() => { setSaved((v) => !v); toast(saved ? "Removed from saved properties" : "Saved to your properties", { icon: saved ? "🤍" : "❤️" }); }}>
                    <Heart className={`mr-2 h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : ""}`} /> {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" onClick={() => scrollToEnquiry(true)}>
                    <Calendar className="mr-2 h-4 w-4" /> Book Viewing
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" title="Share this property">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-1.5" align="end">
                      <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Share via</p>
                      <button onClick={() => shareVia("copy")} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted text-left">
                        <Copy className="h-4 w-4 text-muted-foreground shrink-0" /> Copy link
                      </button>
                      <button onClick={() => shareVia("whatsapp")} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted text-left">
                        <span className="h-4 w-4 shrink-0 text-center text-base leading-4">💬</span> WhatsApp
                      </button>
                      <button onClick={() => shareVia("facebook")} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted text-left">
                        <span className="h-4 w-4 shrink-0 inline-flex items-center justify-center rounded text-[10px] font-bold bg-blue-600 text-white">f</span> Facebook
                      </button>
                      <button onClick={() => shareVia("twitter")} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted text-left">
                        <span className="h-4 w-4 shrink-0 inline-flex items-center justify-center rounded text-[10px] font-bold bg-black text-white">𝕏</span> X / Twitter
                      </button>
                      <button onClick={() => shareVia("email")} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted text-left">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" /> Email
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Key Facts */}
            <div className="mb-6 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 font-display text-lg font-bold text-primary">Key Facts</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {KEY_FACTS.map((f) => (
                  <div key={f.label} className="rounded-lg bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="mt-0.5 text-sm font-semibold">
                      {f.value ?? (f.key ? String((listing as unknown as Record<string, unknown>)[f.key] ?? "â€”") : "â€”")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="w-full justify-start border-b bg-transparent p-0 rounded-none h-auto">
                {["overview","features","location","documents"].map((t) => (
                  <TabsTrigger key={t} value={t} className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 pb-3">
                    {t}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="pt-5">
                <p className="mb-4 leading-relaxed text-muted-foreground">{listing.description}</p>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  This exceptional property has been meticulously maintained and offers a superb blend of original period features with high-quality modern finishes throughout. The accommodation is arranged over three floors with beautifully proportioned rooms and excellent ceiling heights.
                </p>
                <ul className="space-y-2">
                  {["Stunning refurbished four-bedroom family home","South-facing private garden, 60ft in length","Grade II listed with original Victorian features","Walking distance to top-rated schools","Easy access to Kensington High Street shops"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="features" className="pt-5">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <h3 className="mb-3 font-semibold text-primary">Interior</h3>
                    <ul className="space-y-2">{FEATURES_INTERIOR.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />{f}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold text-primary">Exterior</h3>
                    <ul className="space-y-2">{FEATURES_EXTERIOR.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />{f}</li>)}</ul>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold text-primary">Utilities</h3>
                    <ul className="space-y-2">{FEATURES_UTILITIES.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />{f}</li>)}</ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="pt-5 space-y-5">
                <div className="flex h-64 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <div className="text-center">
                    <MapPin className="mx-auto h-10 w-10 text-primary/40" />
                    <p className="mt-2 text-sm text-muted-foreground">{listing.location}</p>
                    <p className="text-xs text-muted-foreground">Interactive map available on enquiry</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 font-semibold text-primary flex items-center gap-2"><Train className="h-4 w-4" />Nearest Stations</h3>
                  <div className="space-y-2">
                    {STATIONS.map((s) => (
                      <div key={s.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.lines}</p></div>
                        <Badge variant="outline">{s.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 font-semibold text-primary flex items-center gap-2"><School className="h-4 w-4" />Nearby Schools</h3>
                  <div className="space-y-2">
                    {SCHOOLS.map((s) => (
                      <div key={s.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.type} Â· Ofsted: {s.ofsted}</p></div>
                        <Badge variant="outline">{s.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="pt-5">
                <div className="space-y-3">
                  {[
                    { label: "EPC Certificate", desc: "Energy Performance Certificate â€” Rating C" },
                    { label: "Floor Plan", desc: "Full floor plan across all levels (PDF)" },
                    { label: "Title Register", desc: "HM Land Registry title document" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary/50" />
                        <div><p className="text-sm font-semibold">{d.label}</p><p className="text-xs text-muted-foreground">{d.desc}</p></div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="mr-2 h-3.5 w-3.5" /> Request
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right sticky sidebar */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Agent card */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white font-bold text-lg">JW</div>
                  <div>
                    <p className="font-semibold">James Whitfield</p>
                    <p className="text-xs text-muted-foreground">MarketUK Agent</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">RICS Qualified</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 text-sm" size="sm">
                    <Phone className="mr-1.5 h-3.5 w-3.5" /> 0203 555 0142
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm" size="sm">
                    <Mail className="mr-1.5 h-3.5 w-3.5" /> Email
                  </Button>
                </div>
              </div>

              {/* Enquiry form */}
              <div ref={enquiryRef} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-display font-bold text-primary">Send Enquiry</h3>
                <div className="space-y-3">
                  <Input placeholder="Your name" value={enquiry.name} onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })} />
                  <Input placeholder="Email address" type="email" value={enquiry.email} onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })} />
                  <Input placeholder="Phone number" type="tel" value={enquiry.phone} onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })} />
                  <Textarea placeholder="Message" rows={3} value={enquiry.message} onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })} />
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox checked={enquiry.viewing} onCheckedChange={(v) => setEnquiry({ ...enquiry, viewing: !!v })} />
                    I would like to arrange a viewing
                  </label>
                  <Button className="w-full bg-gold text-white hover:bg-gold/90" onClick={() => { if (!enquiry.name || !enquiry.email) { toast.error("Please fill in your name and email."); return; } toast.success("Enquiry sent! The agent will be in touch shortly."); setEnquiry((e) => ({ ...e, name: "", email: "", phone: "" })); }}>Submit Enquiry</Button>
                </div>
              </div>

              {/* Mortgage calculator */}
              <MortgageCalc price={listing.price} />
            </div>
          </div>
        </div>

        {/* Related listings */}
        <div className="mt-12">
          <h2 className="mb-5 font-display text-xl font-bold text-primary">Similar Properties</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto">
            {relatedItems.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

