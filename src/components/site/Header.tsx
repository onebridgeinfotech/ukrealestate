import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Heart, Bell, ChevronDown, LayoutDashboard, LogOut, User, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/listings", label: "Buy" },
  { to: "/post", label: "Sell" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
];

function dashboardPath(role?: string) {
  if (role === "seller") return "/dashboard/seller";
  if (role === "agent") return "/dashboard/agent";
  return "/dashboard/buyer";
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const role = user?.user_metadata?.role as string | undefined;
  const initials = user
    ? ((user.user_metadata?.first_name?.[0] ?? "") + (user.user_metadata?.last_name?.[0] ?? "")).toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    : "";

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-white/95 shadow-md backdrop-blur-xl"
          : "border-border/40 bg-white/90 backdrop-blur-xl shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => {
            const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200
                  after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:rounded-full after:bg-gold after:transition-transform after:duration-300 after:origin-left
                  ${isActive
                    ? "text-primary bg-primary/5 after:scale-x-100"
                    : "text-foreground/65 hover:text-foreground hover:bg-muted/60 after:scale-x-0 hover:after:scale-x-100"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold ring-2 ring-white" />
              </Button>

              {/* Saved */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500"
                aria-label="Saved listings"
                asChild
              >
                <Link to={dashboardPath(role)}>
                  <Heart className="h-[18px] w-[18px]" />
                </Link>
              </Button>

              <div className="mx-1 h-6 w-px bg-border" />

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm focus:outline-none">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="max-w-[100px] truncate text-foreground/80">
                      {user.user_metadata?.first_name ?? user.email?.split("@")[0]}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
                  <DropdownMenuLabel className="font-normal">
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    <div className="mt-0.5 text-xs font-semibold capitalize text-primary">{role ?? "buyer"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer rounded-lg">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer rounded-lg">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer rounded-lg">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 cursor-pointer rounded-lg text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Icon buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500"
                aria-label="Saved"
              >
                <Heart className="h-[18px] w-[18px]" />
              </Button>

              <div className="mx-1 h-6 w-px bg-border" />

              {/* Log in — ghost with border */}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-border/70 px-5 text-sm font-semibold text-foreground hover:border-primary hover:bg-primary hover:text-white"
              >
                <Link to="/login">Log in</Link>
              </Button>

              {/* Post Listing — gold CTA */}
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-gold-gradient px-5 text-sm font-semibold text-white shadow-sm hover:shadow-[0_4px_16px_oklch(0.72_0.13_75/0.40)] hover:-translate-y-px active:scale-[0.97] transition-all duration-200"
              >
                <Link to="/post">Post Listing</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl md:hidden" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">

              {/* Mobile header */}
              <div className="flex items-center justify-between border-b px-4 py-4">
                <Logo />
                {user && (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-sm font-bold text-white shadow-sm">
                    {initials}
                  </span>
                )}
              </div>

              {/* Logged-in user info */}
              {user && (
                <div className="border-b bg-muted/50 px-4 py-3">
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <p className="mt-0.5 text-sm font-semibold capitalize text-primary">{role ?? "buyer"} account</p>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex-1 space-y-1 p-4">
                {navLinks.map((l) => {
                  const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center rounded-xl px-4 py-3 text-base font-semibold transition-all duration-200
                        ${isActive
                          ? "bg-primary/8 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                {user && (
                  <Link
                    to={dashboardPath(role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-foreground/70 hover:bg-muted hover:text-foreground transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                )}
              </nav>

              {/* Mobile CTA buttons */}
              <div className="space-y-2.5 border-t p-4 pb-6">
                {user ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60"
                    onClick={() => { signOut(); setOpen(false); }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full rounded-xl border-border/70 font-semibold hover:border-primary hover:bg-primary hover:text-white"
                    >
                      <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="w-full rounded-xl bg-gold-gradient text-white font-semibold shadow-sm hover:shadow-[0_4px_16px_oklch(0.72_0.13_75/0.40)] transition-all duration-200"
                    >
                      <Link to="/post" onClick={() => setOpen(false)}>Post Listing</Link>
                    </Button>
                  </>
                )}
              </div>

            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
