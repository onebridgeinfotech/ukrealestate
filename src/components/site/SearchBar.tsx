import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";

export function SearchBar({ variant = "hero" }: { variant?: "hero" | "compact" }) {
  const navigate = useNavigate();
  const onSearch = () => navigate({ to: "/listings" });
  const isHero = variant === "hero";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(); }}
      className={`w-full ${isHero ? "rounded-2xl bg-white p-2 shadow-elevated md:p-3" : "rounded-xl border border-border bg-card p-2 shadow-card"}`}
    >
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-stretch">
        <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 md:border-0 md:bg-transparent md:px-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input type="text" placeholder="Keyword (e.g. restaurant, dental)" className="h-12 w-full min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
        </label>
        <Select>
          <SelectTrigger className="h-12 border-border bg-background md:border-l md:border-t-0 md:border-r-0 md:border-b-0 md:rounded-none md:bg-transparent">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="franchise">Franchise</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="h-12 border-border bg-background md:border-l md:border-t-0 md:border-r-0 md:border-b-0 md:rounded-none md:bg-transparent">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All UK</SelectItem>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="manchester">Manchester</SelectItem>
            <SelectItem value="birmingham">Birmingham</SelectItem>
            <SelectItem value="edinburgh">Edinburgh</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="h-12 bg-gold-gradient px-6 text-base font-semibold text-white shadow-gold hover:opacity-95">
          <Search className="mr-2 h-5 w-5" /> Search
        </Button>
      </div>
    </form>
  );
}
