import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-primary";
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient shadow-gold">
        <Building2 className="h-5 w-5 text-white" strokeWidth={2.5} />
      </span>
      <span className={`font-display text-lg font-extrabold tracking-tight ${text}`}>
        Market<span className="text-gold-gradient">UK</span>
      </span>
    </Link>
  );
}
