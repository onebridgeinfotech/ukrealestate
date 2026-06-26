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
          : "border-white/20 bg-white/90 backdrop-blur-xl shadow-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors
                  after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-gold after:transition-transform after:duration-300 after:origin-left
                  ${isActive
                    ? "text-primary after:scale-x-100"
                    : "text-foreground/70 hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
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
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
              </Button>

              {/* Saved */}
              <Button variant="ghost" size="icon" aria-label="Saved listings" asChild>
                <Link to={dashboardPath(role)}>
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5 focus:outline-none">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-white shadow-gold">
                      {initials}
                    </span>
                    <span className="max-w-[100px] truncate text-foreground/80">{user.user_metadata?.first_name ?? user.email?.split("@")[0]}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="font-normal">
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    <div className="mt-0.5 text-xs font-semibold capitalize text-primary">{role ?? "buyer"}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={dashboardPath(role)} className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                aria-label="Saved"
              >
                <Heart className="h-[18px] w-[18px]" />
              </Button>

              <div className="mx-1 h-6 w-px bg-border" />

              <Button
                variant="ghost"
                asChild
                className="h-9 rounded-full px-4 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="h-9 rounded-full bg-gold-gradient px-5 text-sm font-semibold text-white shadow-gold hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-150"
              >
                <Link to="/post">Post Listing</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <Logo />
                {user && (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-gradient text-sm font-bold text-white shadow-gold">
                    {initials}
                  </span>
                )}
              </div>

              {user && (
                <div className="border-b px-4 py-3 bg-muted/50">
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-sm font-semibold capitalize text-primary">{role ?? "buyer"} account</p>
                </div>
              )}

              <nav className="flex-1 space-y-1 p-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                    activeProps={{ className: "bg-primary/5 text-primary" }}
                  >
                    {l.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    to={dashboardPath(role)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />Dashboard
                  </Link>
                )}
              </nav>

              <div className="space-y-2 border-t p-4">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base text-destructive border-destructive/30 hover:bg-destructive/5"
                    onClick={() => { signOut(); setOpen(false); }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />Sign out
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="w-full h-12 text-base">
                      <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild className="w-full h-12 text-base bg-gold-gradient text-white shadow-gold">
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
