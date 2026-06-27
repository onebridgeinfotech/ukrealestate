import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Shield, Award, CheckCircle } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Marketplace",
    links: [
      { to: "/listings", label: "Browse Listings" },
      { to: "/post", label: "Post a Listing" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/pricing", label: "Pricing & Packages" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
      { to: "/careers", label: "Careers" },
      { to: "/press", label: "Press & Media" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/faq", label: "FAQ" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/cookies", label: "Cookie Policy" },
    ],
  },
];

const socials = [
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Twitter, label: "Twitter / X", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

const trustBadges = [
  { Icon: Shield, label: "SSL Secured" },
  { Icon: Award, label: "RICS Affiliated" },
  { Icon: CheckCircle, label: "ICO Registered" },
];

export function Footer() {
  return (
    <footer className="relative bg-primary text-primary-foreground/80">
      {/* Gold top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Trust bar */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-4 md:justify-between md:px-6">
          <p className="text-xs font-medium text-primary-foreground/60">
            Trusted by <span className="text-white font-semibold">38,000+</span> buyers &amp; sellers across the UK
          </p>
          <div className="flex items-center gap-6">
            {trustBadges.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
                <Icon className="h-3.5 w-3.5 text-gold" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">

          {/* Brand column */}
          <div className="lg:col-span-3">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/60">
              The UK's premium marketplace for buying and selling businesses, franchises and commercial property. Verified listings, direct broker contact, free for buyers.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a href="mailto:hello@marketuk.co.uk" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-gold shrink-0" />hello@marketuk.co.uk
              </a>
              <a href="tel:+441234567890" className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-gold shrink-0" />+44 (0) 1234 567 890
              </a>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
                <MapPin className="h-4 w-4 text-gold shrink-0" />London, United Kingdom
              </div>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-primary-foreground/60 transition-all duration-200 hover:border-gold/40 hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-white/50">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-sm text-primary-foreground/60 transition-colors hover:text-white hover:translate-x-0.5 inline-block"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} MarketUK Ltd. All rights reserved. Company No. 12345678. Registered in England &amp; Wales.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary-foreground/40">Built by</span>
            <a
              href="https://www.onebridgeinfotech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C8922A] hover:text-white transition-colors"
            >
              Onebridge Infotech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
