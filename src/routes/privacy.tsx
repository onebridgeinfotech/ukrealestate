import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `MarketUK Ltd ("MarketUK", "we", "us", "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose and safeguard information when you visit our website marketuk.co.uk and use our services.\n\nMarketUK Ltd is registered in England and Wales (Company No. 12345678). Our registered office is at 20 Fenchurch Street, London EC3M 3BY. We are registered with the Information Commissioner's Office (ICO) under registration number ZA987654.`,
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, submit a property listing, send an enquiry or contact us for support.\n\nPersonal information may include: full name, email address, phone number, postal address, payment information (processed securely via Stripe), property details you submit, communications you send through the platform, and usage data such as search terms, saved properties and pages visited.\n\nWe also collect technical information automatically, including: IP address, browser type and version, operating system, referring URLs, pages viewed, time spent on pages, and device identifiers.`,
  },
  {
    id: "use-of-information",
    title: "3. How We Use Your Information",
    content: `We use the information we collect to provide, maintain and improve our services; process transactions and send related information; send transactional and promotional communications; respond to enquiries and support requests; monitor and analyse trends and usage; detect and prevent fraudulent transactions; and comply with legal obligations.\n\nOur lawful bases for processing under UK GDPR are: performance of a contract (account services, listing management); legitimate interests (fraud prevention, security); legal obligation (tax records, regulatory compliance); and consent (marketing communications, cookies).`,
  },
  {
    id: "sharing",
    title: "4. Information Sharing",
    content: `We do not sell your personal information to third parties. We may share information with: estate agents and sellers when you submit a property enquiry; payment processors (Stripe) for billing; analytics providers (Google Analytics) under data processing agreements; legal and regulatory authorities when required by law; and successor entities in the event of a merger or acquisition.\n\nAll third-party processors are subject to contractual obligations to protect your data in accordance with UK GDPR.`,
  },
  {
    id: "cookies",
    title: "5. Cookies",
    content: `We use cookies and similar tracking technologies to provide our services and analyse usage. For full details of the cookies we use, please read our Cookie Policy at marketuk.co.uk/cookies.\n\nYou can control cookie preferences through your browser settings or our cookie consent manager. Note that disabling certain cookies may affect the functionality of our services.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain personal information for as long as necessary to provide our services and comply with legal obligations. Account data is retained for the duration of your account plus 7 years following closure. Transaction records are retained for 7 years in compliance with HMRC requirements. Marketing preferences are retained until you withdraw consent.`,
  },
  {
    id: "rights",
    title: "7. Your Rights",
    content: `Under UK GDPR you have the right to: access your personal data; rectify inaccurate data; request erasure of your data ("right to be forgotten"); restrict processing; data portability; object to processing; and withdraw consent at any time where processing is based on consent.\n\nTo exercise any of these rights, contact our Data Protection Officer at privacy@marketuk.co.uk or write to us at our registered office. We will respond within 30 days. You also have the right to lodge a complaint with the ICO at ico.org.uk.`,
  },
  {
    id: "security",
    title: "8. Security",
    content: `We implement appropriate technical and organisational security measures including: TLS encryption for all data in transit; AES-256 encryption for data at rest; regular penetration testing; access controls and authentication requirements; and staff training on data protection.\n\nDespite these measures, no internet transmission is completely secure. We encourage you to use strong passwords and notify us immediately if you suspect any unauthorised access to your account.`,
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a prominent notice on our website. The "Last updated" date at the top of this policy reflects the date of the most recent revision. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: `If you have questions about this Privacy Policy or our data practices, please contact:\n\nData Protection Officer\nMarketUK Ltd\n20 Fenchurch Street\nLondon EC3M 3BY\n\nEmail: privacy@marketuk.co.uk\nPhone: 0203 555 0142`,
  },
];

function PrivacyPage() {
  const [active, setActive] = useState("introduction");
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12 text-white text-center">
        <h1 className="font-display text-3xl font-extrabold">Privacy Policy</h1>
        <p className="mt-2 text-white/70 text-sm">Last updated: 1 January 2026</p>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* TOC */}
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
          {/* Content */}
          <div className="min-w-0 flex-1 space-y-8">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              This Privacy Policy constitutes a legally binding agreement between you and MarketUK Ltd. Please read it carefully before using our services.
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
