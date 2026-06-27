import { useState } from "react";
import { toast } from "sonner";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Home, Heart, Search, MessageSquare, Clock, User, Eye, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ListingCard } from "@/components/site/ListingCard";
import { StatusBadge } from "@/components/site/StatusBadge";
import { listings } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/buyer")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
  },
  component: BuyerDashboard,
});

const NAV = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "saved", label: "Saved Properties", icon: Heart },
  { id: "searches", label: "Saved Searches", icon: Search },
  { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "recent", label: "Recently Viewed", icon: Clock },
  { id: "profile", label: "Profile", icon: User },
];

const ACTIVITY = [
  { action: "Saved", title: "Kensington 4-Bed Detached", time: "2 hours ago", color: "text-red-500" },
  { action: "Enquired", title: "Canary Wharf Office Suite", time: "Yesterday", color: "text-blue-500" },
  { action: "Viewed", title: "New Build Semi, Didsbury", time: "Yesterday", color: "text-muted-foreground" },
  { action: "Saved", title: "Development Land, Leeds", time: "3 days ago", color: "text-red-500" },
  { action: "Enquired", title: "Georgian Office, Edinburgh", time: "4 days ago", color: "text-blue-500" },
];

const SAVED_SEARCHES = [
  { title: "3-Bed Manchester under Â£400k", filters: ["Residential","Manchester","3 beds","Max Â£400k"], matches: 4 },
  { title: "Office Space London Â£500kâ€“Â£2M", filters: ["Office","London","Â£500kâ€“Â£2M"], matches: 11 },
  { title: "New Build Help to Buy", filters: ["New Build","Any location","Help to Buy"], matches: 7 },
];

const ENQUIRIES = [
  { property: "Kensington 4-Bed House", agent: "James Whitfield", date: "22 Jun 2026", status: "active" as const },
  { property: "Canary Wharf Office Suite", agent: "Priya Sharma", date: "20 Jun 2026", status: "under-offer" as const },
  { property: "Edinburgh Period Office", agent: "Marcus Johnson", date: "15 Jun 2026", status: "active" as const },
];

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-primary">Welcome back, Sarah</h2>
        <p className="text-muted-foreground">{new Date().toLocaleDateString("en-GB", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Saved Properties", value: "12", icon: Heart, color: "text-red-500" },
          { label: "Saved Searches", value: "4", icon: Search, color: "text-blue-500" },
          { label: "Enquiries Sent", value: "7", icon: MessageSquare, color: "text-gold" },
          { label: "Properties Viewed", value: "38", icon: Eye, color: "text-primary" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4">
            <Icon className={`mb-2 h-5 w-5 ${color}`} />
            <div className="font-display text-2xl font-bold text-primary">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 font-semibold">Recent Activity</h3>
        <div className="space-y-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${a.color}`}>{a.action}:</span>
                <span>{a.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavedSection() {
  const [saved, setSaved] = useState(listings.slice(0, 4));
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">Saved Properties</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {saved.map((l) => (
          <div key={l.id} className="relative">
            <ListingCard listing={l} />
            <button onClick={() => setSaved((s) => s.filter((x) => x.id !== l.id))}
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-red-500 shadow hover:bg-white">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {saved.length === 0 && (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No saved properties yet.</p>
          <Button asChild className="mt-3" variant="outline"><Link to="/listings">Browse Listings</Link></Button>
        </div>
      )}
    </div>
  );
}

function SearchesSection() {
  const [searches, setSearches] = useState(SAVED_SEARCHES);
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">Saved Searches</h2>
      {searches.map((s, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{s.title}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.filters.map((f) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 shrink-0">{s.matches} new</Badge>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" className="bg-primary text-white"><Link to="/listings">Run Search</Link></Button>
            <Button size="sm" variant="outline" onClick={() => setSearches((ss) => ss.filter((_, j) => j !== i))}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnquiriesSection() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">My Enquiries</h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left font-medium text-muted-foreground">Property</th>
              <th className="p-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Agent</th>
              <th className="p-3 text-left font-medium text-muted-foreground hidden md:table-cell">Date</th>
              <th className="p-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ENQUIRIES.map((e, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="p-3 font-medium">{e.property}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{e.agent}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{e.date}</td>
                <td className="p-3"><StatusBadge status={e.status} /></td>
                <td className="p-3"><Button size="sm" variant="outline">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentSection() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-primary">Recently Viewed</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {listings.slice(0, 4).map((l, i) => (
          <div key={l.id} className="relative">
            <ListingCard listing={l} />
            <div className="absolute bottom-16 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur">
              Viewed {["2h ago","5h ago","Yesterday","3 days ago"][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifToggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function ProfileSection() {
  const [form, setForm] = useState({ firstName:"Sarah", lastName:"Thompson", email:"sarah@example.com", phone:"07700 900142", bio:"First-time buyer looking for a family home in North London." });
  const [pw, setPw] = useState({ current:"", next:"", confirm:"" });
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-primary">My Profile</h2>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Personal Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>First name</Label><Input className="mt-1" value={form.firstName} onChange={(e) => setForm({ ...form, firstName:e.target.value })} /></div>
          <div><Label>Last name</Label><Input className="mt-1" value={form.lastName} onChange={(e) => setForm({ ...form, lastName:e.target.value })} /></div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1"><Label>Email</Label><Badge variant="outline" className="text-[10px] text-emerald-600">Verified</Badge></div>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email:e.target.value })} />
        </div>
        <div><Label>Phone</Label><Input className="mt-1" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone:e.target.value })} /></div>
        <div><Label>About you</Label><Textarea className="mt-1" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio:e.target.value })} /></div>
        <Button className="bg-primary text-white" onClick={() => toast.success("Profile updated successfully!")}>Save Changes</Button>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold">Notification Preferences</h3>
        <NotifToggle label="New matches for saved searches" defaultOn={true} />
        <NotifToggle label="Price reductions on saved properties" defaultOn={true} />
        <NotifToggle label="Agent replies to enquiries" defaultOn={true} />
        <NotifToggle label="Marketing & promotional emails" defaultOn={false} />
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4" />Change Password</h3>
        <Input type="password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current:e.target.value })} />
        <Input type="password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next:e.target.value })} />
        <Input type="password" placeholder="Confirm new password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm:e.target.value })} />
        <Button variant="outline" onClick={() => {
          if (!pw.current || !pw.next) { toast.error("Please fill in all password fields."); return; }
          if (pw.next !== pw.confirm) { toast.error("New passwords do not match."); return; }
          if (pw.next.length < 8) { toast.error("Password must be at least 8 characters."); return; }
          toast.success("Password updated successfully!"); setPw({ current:"", next:"", confirm:"" });
        }}>Update Password</Button>
      </div>
    </div>
  );
}

function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const sections: Record<string, React.ReactNode> = {
    overview: <OverviewSection />,
    saved: <SavedSection />,
    searches: <SearchesSection />,
    enquiries: <EnquiriesSection />,
    recent: <RecentSection />,
    profile: <ProfileSection />,
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Dashboard</span>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="lg:w-56 shrink-0">
            <nav className="space-y-1 rounded-xl border border-border bg-card p-3">
              {NAV.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === id ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" />{label}
                </button>
              ))}
            </nav>
          </aside>
          <div className="min-w-0 flex-1">{sections[activeTab]}</div>
        </div>
      </div>
    </div>
  );
}
