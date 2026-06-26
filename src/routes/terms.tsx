import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

const SECTIONS = [
  {
    id: "agreement",
    title: "1. Agreement to Terms",
    content: `These Terms of Service ("Terms") constitute a legally binding agreement between you and MarketUK Ltd (Company No. 12345678), a company registered in England and Wales with its registered office at 20 Fenchurch Street, London EC3M 3BY ("MarketUK", "we", "us", "our").\n\nBy accessing or using the MarketUK platform at marketuk.co.uk, you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you do not agree, please do not use our services.`,
  },
  {
    id: "services",
    title: "2. Description of Services",
    content: `MarketUK provides an online property marketplace connecting buyers, sellers, landlords, tenants and agents across the United Kingdom. Our services include: property search and discovery; listing management tools for sellers and agents; buyer enquiry and messaging tools; saved searches and alerts; mortgage and conveyancing referrals; and analytics and reporting tools.\n\nWe are a technology platform and not an estate agent, mortgage broker or financial adviser. We are not party to any transaction between buyers and sellers on our platform.`,
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `To access certain features you must create an account. You agree to provide accurate and current information and to keep it updated. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.\n\nYou must notify us immediately at security@marketuk.co.uk if you suspect any unauthorised use of your account. We reserve the right to suspend or terminate accounts that breach these Terms.`,
  },
  {
    id: "listings",
    title: "4. Listings and Content",
    content: `Sellers and agents are solely responsible for the accuracy and legality of their listings. By submitting a listing, you represent and warrant that: you have the legal right to list the property; all information provided is accurate; the listing does not infringe third-party intellectual property rights; and the listing complies with all applicable laws and regulations.\n\nWe reserve the right to remove any listing at our discretion without prior notice if we believe it violates these Terms or applicable law. We do not verify ownership of listed properties and buyers should undertake their own due diligence.`,
  },
  {
    id: "fees",
    title: "5. Fees and Payment",
    content: `Certain features of the platform are available on paid subscription plans as set out on our Pricing page. All fees are stated exclusive of VAT. Payment is processed securely via Stripe.\n\nSubscriptions are billed monthly or annually in advance. You authorise us to charge your payment method on each billing date. If payment fails, we may suspend access to paid features. Fees are non-refundable except as required by law or our 14-day money-back guarantee for first-time subscribers.`,
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    content: `The MarketUK platform, including its software, design, trademarks, logos and content, is owned by MarketUK Ltd and protected by UK and international intellectual property laws. You may not reproduce, distribute or create derivative works without our prior written consent.\n\nBy submitting content to the platform, you grant MarketUK a non-exclusive, royalty-free, worldwide licence to use, reproduce and display that content in connection with our services.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: `To the maximum extent permitted by English law, MarketUK shall not be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data or goodwill, arising out of or in connection with your use of our services.\n\nOur total aggregate liability to you for any claim arising from these Terms or our services shall not exceed the greater of £100 or the fees you paid to us in the 12 months preceding the claim. Nothing in these Terms limits our liability for death, personal injury or fraud.`,
  },
  {
    id: "governing-law",
    title: "8. Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of England and Wales. You agree to submit to the exclusive jurisdiction of the courts of England and Wales to resolve any dispute arising under these Terms.\n\nIf any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "changes",
    title: "9. Changes to Terms",
    content: `We may update these Terms at any time. We will provide at least 30 days' notice of material changes via email or by posting a notice on our platform. Your continued use of the platform after changes constitutes acceptance of the revised Terms.\n\nFor questions about these Terms, contact legal@marketuk.co.uk or write to us at our registered office.`,
  },
];

function TermsPage() {
  const [active, setActive] = useState("agreement");
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12 text-white text-center">
        <h1 className="font-display text-3xl font-extrabold">Terms of Service</h1>
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
              </nav>
            </div>
          </aside>
          <div className="min-w-0 flex-1 space-y-8">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              Please read these Terms of Service carefully. By using MarketUK you agree to be legally bound by these Terms.
            </div>
            {SECTIONS.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-6">
                <h2 className="font-display text-xl font-bold text-primary mb-3">{s.title}</h2>
                {s.content.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-3 leading-relaxed text-muted-foreground text-sm">{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
