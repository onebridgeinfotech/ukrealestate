import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/listings", label: "Search", icon: Search },
  { to: "/post", label: "Post", icon: PlusSquare, highlight: true },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/dashboard/buyer", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/30 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl shadow-[0_-10px_30px_oklch(0.27_0.07_255/0.1)] md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
          if (it.highlight) {
            return (
              <li key={it.to} className="flex items-end justify-center">
                <Link
                  to={it.to}
                  className="relative -mt-6 mb-1 grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-white shadow-gold before:absolute before:inset-0 before:rounded-full before:border-2 before:border-gold/60 before:animate-ping"
                  aria-label={it.label}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all duration-200 ${
                  active ? "text-primary [&>svg]:scale-110 [&>svg]:-translate-y-0.5" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
