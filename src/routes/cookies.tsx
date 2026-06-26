import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
});

const SECTIONS = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: `Cookies are small text files placed on your device when you visit a website. They help the website remember information about your visit, which can make your next visit easier and the site more useful to you.\n\nCookies can be "session" cookies, which are deleted when you close your browser, or "persistent" cookies, which remain on your device for a set period of time or until you delete them.`,
  },
  {
    id: "cookies-we-use",
    title: "2. Cookies We Use",
    content: `We use four categories of cookies on MarketUK:\n\n**Essential Cookies:** Required for the website to function properly. These include session management, security tokens and user authentication cookies. You cannot opt out of essential cookies.\n\n**Analytics Cookies:** Help us understand how visitors interact with our website. We use Google Analytics 4 (with IP anonymisation) to collect anonymous usage data.\n\n**Functional Cookies:** Enable enhanced functionality such as remembering your search preferences, saved filters and display settings.\n\n**Marketing Cookies:** Used to deliver relevant advertising and track campaign effectiveness. We work with Google Ads and Facebook Pixel.`,
  },
  {
    id: "specific-cookies",
    title: "3. Specific Cookies",
    content: `Essential: _session (session, authentication); csrf_token (session, security); cookieconsent (1 year, consent record).\n\nAnalytics: _ga (2 years, Google Analytics); _ga_XXXXXX (2 years, GA session); _gid (24 hours, GA daily user tracking).\n\nFunctional: muk_prefs (1 year, search preferences); muk_filters (30 days, last applied filters); muk_view (7 days, grid/list preference).\n\nMarketing: _fbp (90 days, Facebook Pixel); _gcl_au (90 days, Google Ads conversion); _gads (13 months, Google Ads).`,
  },
  {
    id: "third-party",
    title: "4. Third-Party Cookies",
    content: `Some cookies on our site are set by third-party services. These third parties have their own privacy policies and we have no control over the cookies they set:\n\n• Google Analytics — analytics.google.com/analytics/\n• Google Ads — policies.google.com/privacy\n• Facebook/Meta — www.facebook.com/privacy/policy/\n• Stripe — stripe.com/gb/privacy\n• Intercom — www.intercom.com/legal/privacy`,
  },
  {
    id: "managing",
    title: "5. Managing Cookies",
    content: `You can manage cookies in several ways:\n\n**Cookie Consent Manager:** Use the preference panel on this page to accept or reject non-essential cookies.\n\n**Browser Settings:** Most browsers allow you to refuse or accept cookies, delete cookies and set notifications for cookies. See your browser's help documentation for instructions.\n\n**Opt-Out Tools:** Google Analytics opt-out: tools.google.com/dlpage/gaoptout. Google Ads: adssettings.google.com. Facebook: facebook.com/settings/?tab=ads.\n\nPlease note that disabling cookies may affect the functionality of the MarketUK platform.`,
  },
  {
    id: "uk-law",
    title: "6. UK Law and PECR",
    content: `Our use of cookies is governed by the UK Privacy and Electronic Communications Regulations (PECR) and the UK General Data Protection Regulation (UK GDPR). We obtain your consent before placing non-essential cookies and provide a clear mechanism to withdraw consent at any time.\n\nFor enquiries about our cookie practices, contact privacy@marketuk.co.uk or write to our Data Protection Officer at 20 Fenchurch Street, London EC3M 3BY.`,
  },
];

function CookiePreferences() {
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-6 mt-8">
      <h2 className="font-display text-xl font-bold text-primary mb-4">Manage Cookie Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-medium text-sm">Essential Cookies</p>
            <p className="text-xs text-muted-foreground">Required for site functionality — cannot be disabled</p>
          </div>
          <Switch checked={true} disabled />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-medium text-sm">Analytics Cookies</p>
            <p className="text-xs text-muted-foreground">Help us understand how visitors use the site (Google Analytics)</p>
          </div>
          <Switch checked={analytics} onCheckedChange={setAnalytics} />
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="font-medium text-sm">Functional Cookies</p>
            <p className="text-xs text-muted-foreground">Remember your preferences and settings</p>
          </div>
          <Switch checked={functional} onCheckedChange={setFunctional} />
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-sm">Marketing Cookies</p>
            <p className="text-xs text-muted-foreground">Personalised advertising from Google and Facebook</p>
          </div>
          <Switch checked={marketing} onCheckedChange={setMarketing} />
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Button className="bg-primary text-white" onClick={() => setSaved(true)}>Save Preferences</Button>
        <Button variant="outline" onClick={() => { setAnalytics(false); setFunctional(false); setMarketing(false); setSaved(true); }}>Reject All</Button>
        <Button variant="outline" onClick={() => { setAnalytics(true); setFunctional(true); setMarketing(true); setSaved(true); }}>Accept All</Button>
      </div>
      {saved && <p className="mt-3 text-sm text-emerald-600">✓ Your preferences have been saved.</p>}
    </div>
  );
}

function CookiesPage() {
  const [active, setActive] = useState("what-are-cookies");
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12 text-white text-center">
        <h1 className="font-display text-3xl font-extrabold">Cookie Policy</h1>
        <p className="mt-2 text-white/70 text-sm">Last updated: 1 January 2026</p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-56 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contents</h2>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)}
                    className={`block rounded-md px-3 py-1.5 text-xs transition-colors ${active === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                    {s.title}
                  </a>
                ))}
                <a href="#preferences" onClick={() => setActive("preferences")}
                  className={`block rounded-md px-3 py-1.5 text-xs transition-colors ${active === "preferences" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}>
                  7. Manage Preferences
                </a>
              </nav>
            </div>
          </aside>
          <div className="min-w-0 flex-1 space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-6">
                <h2 className="font-display text-xl font-bold text-primary mb-3">{s.title}</h2>
                {s.content.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-3 leading-relaxed text-muted-foreground text-sm">{p}</p>
                ))}
              </div>
            ))}
            <div id="preferences" className="scroll-mt-6">
              <CookiePreferences />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
