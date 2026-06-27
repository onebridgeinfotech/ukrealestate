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
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

      {/* Trust bar */}
      <div className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-3.5 md:justify-between md:px-6">
          <p className="text-xs font-medium tracking-wide text-primary-foreground/60">
            Trusted by <span className="font-bold text-white">38,000+</span> buyers &amp; sellers across the UK
          </p>
          <div className="flex items-center gap-8">
            {trustBadges.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-medium text-primary-foreground/60">
                <Icon className="h-3.5 w-3.5 text-gold shrink-0" />
                <span className="tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">

          {/* Brand column */}
          <div className="lg:col-span-3">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/60">
              The UK's premium marketplace for buying and selling residential and commercial property.
              Verified listings, direct broker contact, free for buyers.
            </p>

            {/* Contact info */}
            <div className="mt-7 space-y-3">
              <a
                href="mailto:hello@marketuk.co.uk"
                className="flex items-center gap-3 text-sm text-primary-foreground/60 transition-colors duration-200 hover:text-white group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-200">
                  <Mail className="h-3.5 w-3.5 text-gold" />
                </span>
                hello@marketuk.co.uk
              </a>
              <a
                href="tel:+441234567890"
                className="flex items-center gap-3 text-sm text-primary-foreground/60 transition-colors duration-200 hover:text-white group"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-gold/40 group-hover:bg-gold/10 transition-all duration-200">
                  <Phone className="h-3.5 w-3.5 text-gold" />
                </span>
                +44 (0) 1234 567 890
              </a>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/60">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                </span>
                London, United Kingdom
              </div>
            </div>

            {/* Socials */}
            <div className="mt-7 flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary-foreground/50 transition-all duration-200 hover:border-gold/50 hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_4px_12px_oklch(0.72_0.13_75/0.2)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-3">
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white/80 border-b border-white/10 pb-2">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="group flex items-center gap-1.5 text-sm text-primary-foreground/55 transition-all duration-200 hover:text-white"
                      >
                        <span className="h-px w-0 bg-gold transition-all duration-200 group-hover:w-3 shrink-0" />
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
        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: copyright */}
            <p className="text-xs leading-relaxed text-primary-foreground/45">
              © {new Date().getFullYear()} <span className="text-primary-foreground/70 font-medium">MarketUK Ltd.</span> All rights reserved.
              <span className="mx-2 text-white/20">·</span>
              Company No. 12345678
              <span className="mx-2 text-white/20">·</span>
              Registered in England &amp; Wales
            </p>

            {/* Right: built by */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-primary-foreground/35 tracking-wide">Built by</span>
              <a
                href="https://www.onebridgeinfotech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-gold transition-colors duration-200 hover:text-white hover:underline underline-offset-4"
              >
                Onebridge Infotech
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
