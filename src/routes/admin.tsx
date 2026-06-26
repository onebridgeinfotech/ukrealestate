import { useState, useEffect } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, List, MessageSquare, Tag, MapPin, FileText,
  CreditCard, BarChart2, Search, Check, X, Star, Menu, ChevronRight,
  LogOut, Plus, Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/site/StatusBadge";
import { listings, formatPrice, type ListingStatus } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/admin-login" });
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") throw redirect({ to: "/admin-login" });
  },
  component: AdminPage,
});

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "listings", label: "Listings", icon: List },
  { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "cms", label: "CMS Pages", icon: FileText },
  { id: "packages", label: "Packages", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart2 },
];

const AREA_DATA = [
  { month: "Jan", revenue: 1200, users: 320 },
  { month: "Feb", revenue: 2100, users: 580 },
  { month: "Mar", revenue: 3400, users: 820 },
  { month: "Apr", revenue: 2800, users: 710 },
  { month: "May", revenue: 4200, users: 1050 },
  { month: "Jun", revenue: 5100, users: 1280 },
];

const BAR_DATA = [
  { month: "Jan", listings: 45 }, { month: "Feb", listings: 82 },
  { month: "Mar", listings: 120 }, { month: "Apr", listings: 98 },
  { month: "May", listings: 145 }, { month: "Jun", listings: 178 },
];

const MOCK_USERS = [
  { id:"U001", name:"Sarah Thompson", email:"sarah@example.com", role:"Buyer", status:"active", joined:"12 Jan 2026" },
  { id:"U002", name:"Alex Martinez", email:"alex@propertysales.co.uk", role:"Seller", status:"active", joined:"8 Feb 2026" },
  { id:"U003", name:"Marcus Johnson", email:"marcus@agent.co.uk", role:"Agent", status:"active", joined:"1 Mar 2026" },
  { id:"U004", name:"Emma Williams", email:"emma@example.com", role:"Buyer", status:"suspended", joined:"22 Mar 2026" },
  { id:"U005", name:"David Chen", email:"david@corp.com", role:"Seller", status:"active", joined:"5 Apr 2026" },
];

const MOCK_ENQUIRIES = [
  { from:"Sarah Thompson", to:"James Whitfield", property:"Kensington 4-Bed", date:"22 Jun", status:"open" },
  { from:"David Chen", to:"Marcus Johnson", property:"Canary Wharf Office", date:"20 Jun", status:"replied" },
  { from:"Emma Williams", to:"James Whitfield", property:"Land, Leeds", date:"18 Jun", status:"open" },
];

const CATEGORIES_DATA = [
  { name:"Residential", count:4820, active:true },
  { name:"Commercial", count:2340, active:true },
  { name:"New Build", count:1186, active:true },
  { name:"Industrial", count:892, active:true },
  { name:"Land", count:634, active:true },
  { name:"Office", count:1074, active:true },
];

const CMS_PAGES = [
  { title:"Homepage Hero", slug:"/", lastEdit:"2 days ago", status:"published" },
  { title:"About Us", slug:"/about", lastEdit:"1 week ago", status:"published" },
  { title:"How It Works", slug:"/how-it-works", lastEdit:"2 weeks ago", status:"published" },
  { title:"Pricing Page", slug:"/pricing", lastEdit:"1 month ago", status:"published" },
  { title:"Press Releases", slug:"/press", lastEdit:"3 days ago", status:"draft" },
];

const PACKAGES = [
  { name:"Free", price:0, active:3420, revenue:0 },
  { name:"Standard", price:29, active:312, revenue:9048 },
  { name:"Premium", price:59, active:118, revenue:6962 },
];

function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label:"Total Users", value:"38,142", change:"+12%" },
          { label:"Active Listings", value:"14,208", change:"+8%" },
          { label:"Monthly Revenue", value:"£16,010", change:"+23%" },
          { label:"Enquiries Today", value:"142", change:"+5%" },
        ].map(({ label, value, change }) => (
          <div key={label} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-4">
            <p className="text-xs text-white/50">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs text-emerald-400">{change} vs last month</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70">Revenue & Users (6 months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={AREA_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3d52" />
            <XAxis dataKey="month" tick={{ fontSize:12, fill:"#9ca3af" }} />
            <YAxis tick={{ fontSize:12, fill:"#9ca3af" }} />
            <Tooltip contentStyle={{ background:"#1C2B3A", border:"1px solid #2a3d52", color:"#fff" }} />
            <Area type="monotone" dataKey="revenue" stroke="#C8922A" fill="#C8922A20" strokeWidth={2} name="Revenue £" />
            <Area type="monotone" dataKey="users" stroke="#16A34A" fill="#16A34A10" strokeWidth={2} name="Users" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70">New Listings per Month</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={BAR_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3d52" />
            <XAxis dataKey="month" tick={{ fontSize:12, fill:"#9ca3af" }} />
            <YAxis tick={{ fontSize:12, fill:"#9ca3af" }} />
            <Tooltip contentStyle={{ background:"#1C2B3A", border:"1px solid #2a3d52", color:"#fff" }} />
            <Bar dataKey="listings" fill="#0D2B4E" radius={[4,4,0,0]} name="Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70">Recent Activity</h3>
        <div className="space-y-2">
          {[
            "New user registered: Sarah Thompson (Buyer)",
            "Listing approved: Kensington 4-Bed — RE-10241",
            "Enquiry flagged for review: ID EQ-00582",
            "Package upgrade: Alex Martinez → Standard",
            "New listing submitted: New Build 3-Bed, Didsbury",
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-white/70">
              <ChevronRight className="h-3 w-3 text-gold shrink-0" />{a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data) setUsers(data);
        setLoading(false);
      });
  }, []);

  async function suspendUser(id: string) {
    // Mark in local state — full suspend requires service role
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: true } : u));
  }

  async function activateUser(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: false } : u));
  }

  async function changeRole(id: string, role: string) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  }

  const filtered = users.filter((u) => {
    const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || (u.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
            placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {["All","buyer","seller","agent","admin"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${roleFilter === r ? "bg-primary text-white" : "border border-[#2a3d52] text-white/60 hover:text-white"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[#2a3d52] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#243547]">
            <tr>
              {["Name","Email","Role","Joined","Actions"].map((h) => (
                <th key={h} className="p-3 text-left text-xs font-medium text-white/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3d52]">
            {loading && (
              <tr><td colSpan={5} className="p-6 text-center text-white/40 text-sm">Loading users…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-white/40 text-sm">No users found.</td></tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#243547]">
                <td className="p-3 text-white font-medium">{[u.first_name, u.last_name].filter(Boolean).join(" ") || "—"}</td>
                <td className="p-3 text-white/60 text-xs">{u.email}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="rounded bg-[#0D1B25] border border-[#2a3d52] text-xs text-white px-2 py-0.5 outline-none"
                  >
                    {["buyer","seller","agent","admin"].map((r) => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="p-3 text-xs text-white/40">{u.created_at ? new Date(u.created_at).toLocaleDateString("en-GB") : "—"}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {u.suspended
                      ? <button onClick={() => activateUser(u.id)} className="rounded px-2 py-0.5 text-xs bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900">Activate</button>
                      : <button onClick={() => suspendUser(u.id)} className="rounded px-2 py-0.5 text-xs bg-red-900/30 text-red-400 hover:bg-red-900/60">Suspend</button>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/30">{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}

function ListingsTab() {
  const [items, setItems] = useState(listings);

  useEffect(() => {
    supabase
      .from("listings")
      .select("id, title, city, region, asking_price, status, is_featured, created_at, profiles(first_name, last_name)")
      .in("status", ["draft", "active", "under_offer"])
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setItems(data.map((l: any) => ({
            id: l.id,
            ref: "RE-" + l.id.substring(0, 5).toUpperCase(),
            title: l.title,
            location: [l.city, l.region].filter(Boolean).join(", "),
            price: l.asking_price ?? 0,
            status: l.status,
          })));
        }
      });
  }, []);

  async function approveListing(id: string) {
    await supabase.from("listings").update({ status: "active" }).eq("id", id);
    setItems((prev) => prev.map((l) => l.id === id ? { ...l, status: "active" } : l));
  }

  async function featureListing(id: string) {
    await supabase.from("listings").update({ is_featured: true }).eq("id", id);
    setItems((prev) => prev.map((l) => l.id === id ? { ...l, featured: true } : l));
  }

  async function rejectListing(id: string) {
    await supabase.from("listings").delete().eq("id", id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <input className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
          placeholder="Search listings..." />
      </div>
      <div className="rounded-xl border border-[#2a3d52] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#243547]">
            <tr>
              {["Ref","Title","Location","Price","Status","Actions"].map((h) => (
                <th key={h} className="p-3 text-left text-xs font-medium text-white/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3d52]">
            {items.map((l) => (
              <tr key={l.id} className="hover:bg-[#243547]">
                <td className="p-3 text-xs text-white/40">{l.ref}</td>
                <td className="p-3 text-white max-w-48 truncate">{l.title}</td>
                <td className="p-3 text-white/60 text-xs">{l.location}</td>
                <td className="p-3 text-gold font-medium">{formatPrice(l.price)}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs ${l.status === "active" ? "bg-emerald-900/50 text-emerald-400" : l.status === "under_offer" ? "bg-blue-900/50 text-blue-400" : "bg-amber-900/50 text-amber-400"}`}>{l.status === "draft" ? "pending review" : l.status}</span></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => approveListing(l.id)} className="rounded p-1 hover:bg-[#2a3d52] text-white/40 hover:text-emerald-400" title="Approve"><Check className="h-3.5 w-3.5" /></button>
                    <button onClick={() => featureListing(l.id)} className="rounded p-1 hover:bg-[#2a3d52] text-white/40 hover:text-gold" title="Feature"><Star className="h-3.5 w-3.5" /></button>
                    <button onClick={() => rejectListing(l.id)} className="rounded p-1 hover:bg-[#2a3d52] text-white/40 hover:text-red-400" title="Reject/Delete"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("enquiries")
      .select("id, message, status, created_at, listing_id, listings(title), sender_id, profiles(first_name, last_name, email)")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (data && !error) setEnquiries(data);
        else setEnquiries(MOCK_ENQUIRIES.map((e, i) => ({ id: i, mock: true, from: e.from, to: e.to, property: e.property, date: e.date, status: e.status })));
        setLoading(false);
      });
  }, []);

  async function deleteEnquiry(id: any) {
    await supabase.from("enquiries").delete().eq("id", id);
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) return <div className="text-white/40 text-sm p-6">Loading enquiries…</div>;

  if (enquiries.length === 0) return <div className="text-white/40 text-sm p-6">No enquiries yet.</div>;

  return (
    <div className="space-y-3">
      {enquiries.map((e) => (
        <div key={e.id} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {e.mock ? (
                <>
                  <p className="text-sm font-medium text-white">{e.from} → {e.to}</p>
                  <p className="text-xs text-white/50 mt-0.5">Re: {e.property} · {e.date}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-white">
                    {e.profiles ? `${e.profiles.first_name ?? ""} ${e.profiles.last_name ?? ""}`.trim() || e.profiles.email : "Unknown"}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    Re: {e.listings?.title ?? "Listing"} · {new Date(e.created_at).toLocaleDateString("en-GB")}
                  </p>
                  {e.message && <p className="text-xs text-white/40 mt-1 line-clamp-2">{e.message}</p>}
                </>
              )}
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${e.status === "open" || e.status === "pending" ? "bg-blue-900/50 text-blue-400" : "bg-emerald-900/50 text-emerald-400"}`}>
              {e.status ?? "open"}
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => !e.mock && deleteEnquiry(e.id)} className="rounded-md border border-red-900/50 px-3 py-1 text-xs text-red-400 hover:bg-red-900/20">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoriesTab() {
  return (
    <div className="rounded-xl border border-[#2a3d52] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#243547]">
          <tr>
            {["Category","Listings","Active","Actions"].map((h) => (
              <th key={h} className="p-3 text-left text-xs font-medium text-white/50">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a3d52]">
          {CATEGORIES_DATA.map((c) => (
            <tr key={c.name} className="hover:bg-[#243547]">
              <td className="p-3 text-white font-medium">{c.name}</td>
              <td className="p-3 text-white/60">{c.count.toLocaleString()}</td>
              <td className="p-3"><span className="rounded-full bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-400">Active</span></td>
              <td className="p-3"><button className="rounded border border-[#2a3d52] px-2 py-0.5 text-xs text-white/60 hover:text-white">Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CmsTab() {
  return (
    <div className="space-y-3">
      {CMS_PAGES.map((p) => (
        <div key={p.slug} className="flex items-center justify-between rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-4">
          <div>
            <p className="text-sm font-medium text-white">{p.title}</p>
            <p className="text-xs text-white/40">{p.slug} · Last edited {p.lastEdit}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === "published" ? "bg-emerald-900/50 text-emerald-400" : "bg-amber-900/50 text-amber-400"}`}>{p.status}</span>
            <button className="rounded-md border border-[#2a3d52] px-3 py-1 text-xs text-white/60 hover:text-white">Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PackagesTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {PACKAGES.map((p) => (
          <div key={p.name} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
            <h3 className="font-bold text-white">{p.name}</h3>
            <p className="text-gold text-xl font-bold mt-1">£{p.price}/mo</p>
            <div className="mt-4 space-y-1 text-sm text-white/60">
              <p>Active subscribers: <span className="text-white font-medium">{p.active.toLocaleString()}</span></p>
              <p>Monthly revenue: <span className="text-gold font-medium">£{p.revenue.toLocaleString()}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsTab() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={AREA_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3d52" />
            <XAxis dataKey="month" tick={{ fontSize:12, fill:"#9ca3af" }} />
            <YAxis tick={{ fontSize:12, fill:"#9ca3af" }} />
            <Tooltip contentStyle={{ background:"#1C2B3A", border:"1px solid #2a3d52", color:"#fff" }} />
            <Area type="monotone" dataKey="revenue" stroke="#C8922A" fill="#C8922A20" strokeWidth={2} name="Revenue £" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white/70">Monthly Listings Growth</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={BAR_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3d52" />
            <XAxis dataKey="month" tick={{ fontSize:12, fill:"#9ca3af" }} />
            <YAxis tick={{ fontSize:12, fill:"#9ca3af" }} />
            <Tooltip contentStyle={{ background:"#1C2B3A", border:"1px solid #2a3d52", color:"#fff" }} />
            <Bar dataKey="listings" fill="#0D2B4E" radius={[4,4,0,0]} name="New Listings" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LocationsTab() {
  const UK_REGIONS = [
    { name: "London", cities: ["Central London", "East London", "North London", "South London", "West London"] },
    { name: "South East", cities: ["Brighton", "Oxford", "Reading", "Southampton", "Canterbury"] },
    { name: "North West", cities: ["Manchester", "Liverpool", "Preston", "Chester", "Blackpool"] },
    { name: "Yorkshire", cities: ["Leeds", "Sheffield", "Bradford", "Hull", "York"] },
    { name: "West Midlands", cities: ["Birmingham", "Coventry", "Wolverhampton", "Stoke-on-Trent"] },
    { name: "East of England", cities: ["Cambridge", "Norwich", "Ipswich", "Peterborough"] },
    { name: "South West", cities: ["Bristol", "Bath", "Exeter", "Plymouth", "Gloucester"] },
    { name: "Scotland", cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"] },
    { name: "Wales", cities: ["Cardiff", "Swansea", "Newport", "Wrexham"] },
    { name: "Northern Ireland", cities: ["Belfast", "Derry", "Lisburn", "Newry"] },
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-xs text-white/40">UK regions and cities used for listing search filters. Toggle a region to view cities.</p>
      {UK_REGIONS.map((r) => (
        <div key={r.name} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] overflow-hidden">
          <button
            onClick={() => setOpen(open === r.name ? null : r.name)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white hover:bg-[#243547] transition-colors"
          >
            <span>{r.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">{r.cities.length} cities</span>
              <ChevronRight className={`h-4 w-4 text-white/40 transition-transform ${open === r.name ? "rotate-90" : ""}`} />
            </div>
          </button>
          {open === r.name && (
            <div className="border-t border-[#2a3d52] px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {r.cities.map((c) => (
                  <span key={c} className="rounded-full border border-[#2a3d52] px-3 py-1 text-xs text-white/70">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TAB_CONTENT_MAP({ activeTab }: { activeTab: string }) {
  const map: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab />,
    users: <UsersTab />,
    listings: <ListingsTab />,
    enquiries: <EnquiriesTab />,
    categories: <CategoriesTab />,
    locations: <LocationsTab />,
    cms: <CmsTab />,
    packages: <PackagesTab />,
    reports: <ReportsTab />,
  };
  return <>{map[activeTab] ?? <div className="text-white/50 text-sm">Select a section.</div>}</>;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("admin@marketuk.co.uk");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setAdminEmail(data.user.email);
    });
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin-login" });
  }

  const initials = adminEmail.slice(0, 1).toUpperCase();

  return (
    <div className="fixed inset-0 flex bg-[#0F1C28] text-white z-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} shrink-0 flex flex-col border-r border-[#1C2B3A] bg-[#0D1B25] transition-all duration-200`}>
        <div className="flex items-center gap-2 border-b border-[#1C2B3A] px-4 py-4">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-white font-bold text-xs">M</div>
          <span className="font-display font-bold text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${activeTab === id ? "bg-primary text-white" : "text-white/50 hover:bg-[#1C2B3A] hover:text-white"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-[#1C2B3A] p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/50 hover:bg-red-900/30 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#1C2B3A] px-5 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen((v) => !v)} className="rounded-md p-1.5 hover:bg-[#1C2B3A] text-white/60 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-semibold capitalize">{TABS.find((t) => t.id === activeTab)?.label ?? activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/50 hidden sm:block">{adminEmail}</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold">{initials}</div>
            <button onClick={handleSignOut} title="Sign out" className="rounded-md p-1.5 hover:bg-red-900/30 text-white/40 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <TAB_CONTENT_MAP activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}
