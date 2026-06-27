import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, List, MessageSquare, Tag, MapPin, FileText,
  CreditCard, BarChart2, Search, Check, X, Star, Menu, ChevronRight,
  LogOut, Plus, Trash2, Flame, UserCheck, Phone, Mail, Calendar,
  Building2, Home, Briefcase, TrendingUp, Download, StickyNote,
  ImagePlus, ImageOff,
} from "lucide-react";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  { id: "leads", label: "Leads CRM", icon: UserCheck },
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

const CMS_PAGES_DEFAULT = [
  { id:1, title:"Homepage Hero", slug:"/", lastEdit:"2 days ago", status:"published" },
  { id:2, title:"About Us", slug:"/about", lastEdit:"1 week ago", status:"published" },
  { id:3, title:"How It Works", slug:"/how-it-works", lastEdit:"2 weeks ago", status:"published" },
  { id:4, title:"Pricing Page", slug:"/pricing", lastEdit:"1 month ago", status:"published" },
  { id:5, title:"Press Releases", slug:"/press", lastEdit:"3 days ago", status:"draft" },
  { id:6, title:"Contact Us", slug:"/contact", lastEdit:"5 days ago", status:"published" },
  { id:7, title:"FAQ", slug:"/faq", lastEdit:"1 week ago", status:"published" },
  { id:8, title:"Terms & Conditions", slug:"/terms", lastEdit:"2 months ago", status:"published" },
  { id:9, title:"Privacy Policy", slug:"/privacy", lastEdit:"2 months ago", status:"published" },
  { id:10, title:"Careers", slug:"/careers", lastEdit:"Never", status:"draft" },
];

const PACKAGES_DEFAULT = [
  { id:1, name:"Free", price:0, active:3420, revenue:0, maxListings:1, features:"1 listing, Basic search visibility, Standard support" },
  { id:2, name:"Standard", price:29, active:312, revenue:9048, maxListings:10, features:"10 listings, Featured placement, Priority support, Analytics" },
  { id:3, name:"Premium", price:59, active:118, revenue:6962, maxListings:999, features:"Unlimited listings, Top placement, Dedicated manager, API access, White-label" },
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

function AddUserModal({ onClose, onAdded }: { onClose: () => void; onAdded: (u: any) => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "buyer" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fieldCls = "w-full rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.trim()) { setError("Email is required."); return; }
    setSaving(true); setError("");
    const { data, error: err } = await supabase.auth.admin.inviteUserByEmail(form.email.trim(), {
      data: { first_name: form.firstName, last_name: form.lastName, role: form.role },
    });
    if (err) {
      // Fallback: create profile record only (no auth invite in browser client)
      const tempId = crypto.randomUUID();
      await supabase.from("profiles").upsert({ id: tempId, email: form.email.trim(), first_name: form.firstName, last_name: form.lastName, role: form.role });
      toast.success("User profile created. They can sign up with this email.");
      onAdded({ id: tempId, email: form.email.trim(), first_name: form.firstName, last_name: form.lastName, role: form.role, created_at: new Date().toISOString() });
    } else {
      toast.success("Invitation email sent!");
      if (data?.user) onAdded({ ...data.user, first_name: form.firstName, last_name: form.lastName, role: form.role });
    }
    setSaving(false); onClose();
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl border border-[#2a3d52] bg-[#1C2B3A] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2a3d52] px-6 py-4">
          <h2 className="font-display font-bold text-white">Add New User</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#2a3d52] text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="rounded-lg bg-red-900/30 border border-red-900/50 text-red-400 text-sm px-4 py-3">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">First Name</label>
              <input className={fieldCls} placeholder="Sarah" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Last Name</label>
              <input className={fieldCls} placeholder="Thompson" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Email Address *</label>
            <input type="email" className={fieldCls} placeholder="user@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Role</label>
            <select className={fieldCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {["buyer","seller","agent","admin"].map((r) => <option key={r} className="capitalize">{r}</option>)}
            </select>
          </div>
          <p className="text-xs text-white/30">An invitation email will be sent. If admin invite is not enabled, the profile will be created for self-registration.</p>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#2a3d52]">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#2a3d52] px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#C8922A] hover:bg-[#a07020] disabled:opacity-60 px-5 py-2 text-sm font-semibold text-white transition-colors">
              {saving ? "Adding…" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersTab() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

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
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: true } : u));
  }

  async function activateUser(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, suspended: false } : u));
  }

  async function deleteUser(id: string) {
    if (!confirm("Remove this user from the CMS? This only removes their profile record.")) return;
    await supabase.from("profiles").delete().eq("id", id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
    <>
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onAdded={(u) => setUsers((prev) => [u, ...prev])} />}
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
            placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {["All","buyer","seller","agent","admin"].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${roleFilter === r ? "bg-primary text-white" : "border border-[#2a3d52] text-white/60 hover:text-white"}`}>
              {r}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddUser(true)} className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white transition-colors shrink-0 ml-auto">
          <Plus className="h-4 w-4" /> Add User
        </button>
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
                    <button onClick={() => deleteUser(u.id)} className="rounded px-2 py-0.5 text-xs border border-red-900/40 text-red-400 hover:bg-red-900/20 ml-1">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/30">{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</p>
    </div>
    </>
  );
}

const EMPTY_FORM = {
  title: "",
  category: "Residential",
  listing_type: "sale",
  asking_price: "",
  description: "",
  city: "",
  region: "",
  postcode: "",
  bedrooms: "",
  bathrooms: "",
  floor_area_sqft: "",
  status: "active",
  is_featured: false,
};

function AddListingModal({ onClose, onAdded }: { onClose: () => void; onAdded: (item: any) => void }) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.asking_price) { setError("Asking price is required."); return; }
    setSaving(true);
    setError("");

    // Upload images if any
    let imageUrls: string[] = [];
    if (imagePreviews.length > 0) {
      setUploadingImages(true);
      imageUrls = await uploadMultipleToCloudinary(imagePreviews.map((p) => p.file), "marketuk/listings");
      setUploadingImages(false);
    }

    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      title: form.title.trim(),
      category: form.category,
      listing_type: form.listing_type,
      asking_price: parseFloat(form.asking_price.replace(/,/g, "")),
      description: form.description.trim() || null,
      city: form.city.trim() || null,
      region: form.region.trim() || null,
      postcode: form.postcode.trim() || null,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
      floor_area_sqft: form.floor_area_sqft ? parseFloat(form.floor_area_sqft) : null,
      status: form.status,
      is_featured: form.is_featured,
      seller_id: user?.id ?? null,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const { data, error: err } = await supabase.from("listings").insert(payload).select().single();
    if (err) {
      setError(err.message);
      setSaving(false);
      return;
    }
    onAdded({
      id: data.id,
      ref: "RE-" + data.id.substring(0, 5).toUpperCase(),
      title: data.title,
      location: [data.city, data.region].filter(Boolean).join(", "),
      price: data.asking_price ?? 0,
      status: data.status,
    });
    onClose();
  }

  const fieldCls = "w-full rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]";
  const labelCls = "block text-xs font-medium text-white/50 mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2a3d52] bg-[#1C2B3A] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2a3d52] px-6 py-4">
          <h2 className="font-display font-bold text-white">Add New Listing</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#2a3d52] text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="rounded-lg bg-red-900/30 border border-red-900/50 text-red-400 text-sm px-4 py-3">{error}</div>}

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input className={fieldCls} placeholder="e.g. 4-Bed Detached House, Kensington" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Category *</label>
              <select className={fieldCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {["Residential","Commercial","Industrial","Land","New Build","Office"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Listing Type *</label>
              <select className={fieldCls} value={form.listing_type} onChange={(e) => set("listing_type", e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">To Let</option>
              </select>
            </div>
          </div>

          {/* Price + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Asking Price (£) *</label>
              <input className={fieldCls} placeholder="e.g. 450000" value={form.asking_price} onChange={(e) => set("asking_price", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={fieldCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="under_offer">Under Offer</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input className={fieldCls} placeholder="e.g. London" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <input className={fieldCls} placeholder="e.g. Greater London" value={form.region} onChange={(e) => set("region", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Postcode</label>
              <input className={fieldCls} placeholder="e.g. SW1A 1AA" value={form.postcode} onChange={(e) => set("postcode", e.target.value)} />
            </div>
          </div>

          {/* Property details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Bedrooms</label>
              <input type="number" min="0" className={fieldCls} placeholder="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input type="number" min="0" className={fieldCls} placeholder="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Floor Area (sq ft)</label>
              <input type="number" min="0" className={fieldCls} placeholder="0" value={form.floor_area_sqft} onChange={(e) => set("floor_area_sqft", e.target.value)} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${fieldCls} min-h-[100px] resize-y`} placeholder="Property description…" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelCls}>Property Photos <span className="text-white/30">(up to 20)</span></label>
            <label className={`flex flex-col items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-[#2a3d52] hover:border-[#C8922A]/60 py-6 cursor-pointer transition-colors ${imagePreviews.length > 0 ? "mt-0" : ""}`}>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                const files = Array.from(e.target.files ?? []).slice(0, 20 - imagePreviews.length);
                setImagePreviews((prev) => [...prev, ...files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))]);
                e.target.value = "";
              }} />
              <ImagePlus className="h-7 w-7 text-white/30" />
              <p className="text-xs text-white/40">Click to add photos, or drag & drop</p>
              <p className="text-[10px] text-white/20">JPG, PNG, WEBP — first image becomes the featured photo</p>
            </label>
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-[#0D1B25] border border-[#2a3d52]">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && <span className="absolute top-1 left-1 rounded text-[9px] font-bold bg-[#C8922A] text-white px-1.5 py-0.5">FEATURED</span>}
                    <button type="button" onClick={() => setImagePreviews((prev) => { URL.revokeObjectURL(img.url); return prev.filter((_, j) => j !== i); })}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {uploadingImages && <p className="text-xs text-[#C8922A] mt-2 flex items-center gap-1">Uploading images…</p>}
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("is_featured", !form.is_featured)}
              className={`relative h-5 w-9 rounded-full transition-colors ${form.is_featured ? "bg-[#C8922A]" : "bg-[#2a3d52]"}`}
            >
              <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_featured ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-white/70">Mark as Featured listing</span>
          </label>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#2a3d52]">
            <button type="button" onClick={onClose} className="rounded-lg border border-[#2a3d52] px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#C8922A] hover:bg-[#a07020] disabled:opacity-60 px-5 py-2 text-sm font-semibold text-white transition-colors">
              {saving ? "Adding…" : "Add Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListingsTab() {
  const [items, setItems] = useState(listings);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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
    if (!confirm("Delete this listing?")) return;
    await supabase.from("listings").delete().eq("id", id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  async function editListing(l: any) {
    const newTitle = prompt("Edit title:", l.title);
    if (!newTitle || newTitle === l.title) return;
    await supabase.from("listings").update({ title: newTitle }).eq("id", l.id);
    setItems((prev) => prev.map((x) => x.id === l.id ? { ...x, title: newTitle } : x));
  }

  const filtered = search.trim()
    ? items.filter((l) => l.title?.toLowerCase().includes(search.toLowerCase()) || l.location?.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <>
      {showAdd && (
        <AddListingModal
          onClose={() => setShowAdd(false)}
          onAdded={(item) => setItems((prev) => [item, ...prev])}
        />
      )}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Listing
          </button>
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
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-white/40 text-sm">No listings found.</td></tr>
              )}
              {filtered.map((l) => (
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
                      <button onClick={() => editListing(l)} className="rounded p-1 hover:bg-[#2a3d52] text-white/40 hover:text-blue-400" title="Edit"><FileText className="h-3.5 w-3.5" /></button>
                      <button onClick={() => rejectListing(l.id)} className="rounded p-1 hover:bg-[#2a3d52] text-white/40 hover:text-red-400" title="Delete"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-white/30">{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</p>
      </div>
    </>
  );
}

function EnquiryDetailModal({ enq, onClose, onDelete, onUpdateStatus }: { enq: any; onClose: () => void; onDelete: () => void; onUpdateStatus: (s: string) => void }) {
  const [status, setStatus] = useState(enq.status ?? "open");
  const senderName = enq.mock ? enq.from : (enq.profiles ? `${enq.profiles.first_name ?? ""} ${enq.profiles.last_name ?? ""}`.trim() || enq.profiles.email : "Unknown");
  const senderEmail = enq.mock ? "" : (enq.profiles?.email ?? "");
  const property = enq.mock ? enq.property : (enq.listings?.title ?? "Listing");
  const date = enq.mock ? enq.date : new Date(enq.created_at).toLocaleDateString("en-GB");

  function save() { onUpdateStatus(status); toast.success("Enquiry updated!"); onClose(); }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0F1C28] border-[#2a3d52] text-white p-0 overflow-hidden">
        <div className="bg-[#1C2B3A] px-6 py-4 border-b border-[#2a3d52]">
          <DialogHeader><DialogTitle className="text-white font-bold">{senderName}</DialogTitle></DialogHeader>
          <p className="text-white/40 text-xs mt-0.5">Re: {property} · {date}</p>
        </div>
        <div className="p-6 space-y-4">
          {senderEmail && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-3">
                <div className="flex items-center gap-1 text-white/40 text-xs mb-1"><Mail className="w-3 h-3" /> Email</div>
                <p className="text-sm text-white break-all">{senderEmail}</p>
              </div>
              <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-3">
                <div className="flex items-center gap-1 text-white/40 text-xs mb-1"><MessageSquare className="w-3 h-3" /> Property</div>
                <p className="text-sm text-white">{property}</p>
              </div>
            </div>
          )}
          {enq.message && (
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-4">
              <p className="text-xs text-white/40 mb-2">Message</p>
              <p className="text-sm text-white leading-relaxed">{enq.message}</p>
            </div>
          )}
          {!enq.message && (
            <div className="rounded-lg bg-[#1C2B3A] border border-dashed border-[#2a3d52] p-4 text-center text-white/30 text-sm">No message body recorded.</div>
          )}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wide block mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C8922A]">
              {["open","pending","replied","closed"].map((s) => <option key={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2 border-t border-[#2a3d52]">
            <button onClick={save} className="flex-1 bg-[#C8922A] hover:bg-[#a07020] text-white font-semibold py-2 rounded-lg text-sm transition-colors">Save</button>
            {senderEmail && (
              <a href={`mailto:${senderEmail}`} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2a3d52] text-sm text-white hover:bg-[#1C2B3A]">
                <Mail className="w-4 h-4" /> Reply
              </a>
            )}
            <button onClick={onDelete} className="px-4 py-2 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 text-sm">Delete</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EnquiriesTab() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

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
    setSelected(null);
  }

  function updateStatus(id: any, status: string) {
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
  }

  if (loading) return <div className="text-white/40 text-sm p-6">Loading enquiries…</div>;
  if (enquiries.length === 0) return <div className="text-white/40 text-sm p-6">No enquiries yet.</div>;

  return (
    <>
      {selected && (
        <EnquiryDetailModal
          enq={selected}
          onClose={() => setSelected(null)}
          onDelete={() => deleteEnquiry(selected.id)}
          onUpdateStatus={(s) => updateStatus(selected.id, s)}
        />
      )}
      <div className="space-y-3">
        {enquiries.map((e) => {
          const senderName = e.mock ? e.from : (e.profiles ? `${e.profiles.first_name ?? ""} ${e.profiles.last_name ?? ""}`.trim() || e.profiles.email : "Unknown");
          const property = e.mock ? e.property : (e.listings?.title ?? "Listing");
          const date = e.mock ? e.date : new Date(e.created_at).toLocaleDateString("en-GB");
          return (
            <div key={e.id} onClick={() => setSelected(e)} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-4 cursor-pointer hover:border-[#C8922A]/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{senderName}{e.mock && e.to ? ` → ${e.to}` : ""}</p>
                  <p className="text-xs text-white/50 mt-0.5">Re: {property} · {date}</p>
                  {e.message && <p className="text-xs text-white/40 mt-1 line-clamp-1">{e.message}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${e.status === "open" || e.status === "pending" ? "bg-blue-900/50 text-blue-400" : "bg-emerald-900/50 text-emerald-400"}`}>
                    {e.status ?? "open"}
                  </span>
                  <span className="text-[#C8922A] text-xs font-semibold">View →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CategoriesTab() {
  const [cats, setCats] = useState(CATEGORIES_DATA.map((c, i) => ({ ...c, id: i })));
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editName, setEditName] = useState("");

  function addCategory() {
    if (!newName.trim()) return;
    setCats((prev) => [...prev, { id: Date.now(), name: newName.trim(), count: 0, active: true }]);
    setNewName("");
    setAdding(false);
  }

  function saveEdit() {
    if (!editName.trim() || !editing) return;
    setCats((prev) => prev.map((c) => c.id === editing.id ? { ...c, name: editName.trim() } : c));
    setEditing(null);
  }

  function deleteCategory(id: number) {
    if (!confirm("Delete this category?")) return;
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleActive(id: number) {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setAdding(true); setNewName(""); }}
          className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {adding && (
        <div className="flex gap-2 rounded-xl border border-[#C8922A]/50 bg-[#1C2B3A] p-3">
          <input
            autoFocus
            className="flex-1 rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]"
            placeholder="Category name…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") setAdding(false); }}
          />
          <button onClick={addCategory} className="rounded-lg bg-[#C8922A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a07020]">Add</button>
          <button onClick={() => setAdding(false)} className="rounded-lg border border-[#2a3d52] px-3 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
        </div>
      )}

      <div className="rounded-xl border border-[#2a3d52] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#243547]">
            <tr>
              {["Category","Listings","Status","Actions"].map((h) => (
                <th key={h} className="p-3 text-left text-xs font-medium text-white/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a3d52]">
            {cats.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-white/40 text-sm">No categories yet.</td></tr>
            )}
            {cats.map((c) => (
              <tr key={c.id} className="hover:bg-[#243547]">
                <td className="p-3 text-white font-medium">
                  {editing?.id === c.id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        className="rounded border border-[#C8922A] bg-[#0D1B25] px-2 py-1 text-sm text-white outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                      />
                      <button onClick={saveEdit} className="rounded bg-[#C8922A] px-2 py-1 text-xs text-white">Save</button>
                      <button onClick={() => setEditing(null)} className="rounded border border-[#2a3d52] px-2 py-1 text-xs text-white/50">✕</button>
                    </div>
                  ) : c.name}
                </td>
                <td className="p-3 text-white/60">{c.count.toLocaleString()}</td>
                <td className="p-3">
                  <button onClick={() => toggleActive(c.id)}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${c.active ? "bg-emerald-900/50 text-emerald-400 hover:bg-red-900/30 hover:text-red-400" : "bg-red-900/30 text-red-400 hover:bg-emerald-900/50 hover:text-emerald-400"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing({ id: c.id, name: c.name }); setEditName(c.name); }}
                      className="rounded border border-[#2a3d52] px-2 py-0.5 text-xs text-white/60 hover:text-white hover:border-[#C8922A]"
                    >Edit</button>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="rounded border border-red-900/40 px-2 py-0.5 text-xs text-red-400 hover:bg-red-900/20"
                    >Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-white/30">{cats.length} categor{cats.length !== 1 ? "ies" : "y"}</p>
    </div>
  );
}

function CmsTab() {
  const [pages, setPages] = useState(CMS_PAGES_DEFAULT.map((p) => ({ ...p })));
  const [showAdd, setShowAdd] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", status: "draft" });
  const fieldCls = "w-full rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]";

  function openAdd() { setShowAdd(true); setEditingPage(null); setForm({ title: "", slug: "", status: "draft" }); }
  function openEdit(p: any) { setEditingPage(p); setShowAdd(false); setForm({ title: p.title, slug: p.slug, status: p.status }); }

  function savePage() {
    if (!form.title.trim() || !form.slug.trim()) { toast.error("Title and slug are required."); return; }
    const slug = form.slug.startsWith("/") ? form.slug : "/" + form.slug;
    if (editingPage) {
      setPages((prev) => prev.map((p) => p.id === editingPage.id ? { ...p, title: form.title.trim(), slug, status: form.status, lastEdit: "just now" } : p));
      toast.success("Page updated!");
    } else {
      setPages((prev) => [...prev, { id: Date.now(), title: form.title.trim(), slug, status: form.status, lastEdit: "just now" }]);
      toast.success("Page added!");
    }
    setShowAdd(false); setEditingPage(null);
  }

  function deletePage(id: number) {
    if (!confirm("Remove this CMS page record?")) return;
    setPages((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleStatus(id: number) {
    setPages((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "published" ? "draft" : "published" } : p));
  }

  const PageForm = () => (
    <div className="rounded-xl border border-[#C8922A]/50 bg-[#1C2B3A] p-5 space-y-4">
      <h3 className="font-bold text-white text-sm">{editingPage ? `Editing: ${editingPage.title}` : "Add New CMS Page"}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/50 mb-1">Page Title *</label>
          <input className={fieldCls} placeholder="e.g. Blog" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1">URL Slug *</label>
          <input className={fieldCls} placeholder="/blog" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Status</label>
        <select className={fieldCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button onClick={savePage} className="flex-1 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white">{editingPage ? "Save Changes" : "Add Page"}</button>
        <button onClick={() => { setShowAdd(false); setEditingPage(null); }} className="rounded-lg border border-[#2a3d52] px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{pages.length} CMS pages · click status badge to toggle published/draft</p>
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-3 py-1.5 text-xs font-semibold text-white transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add Page
        </button>
      </div>

      {(showAdd || editingPage) && <PageForm />}

      {pages.map((p) => (
        <div key={p.id} className="flex items-center justify-between rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-4 hover:border-[#2a3d52]/80 transition-colors">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">{p.title}</p>
            <p className="text-xs text-white/40 mt-0.5">{p.slug} · Last edited {p.lastEdit}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button onClick={() => toggleStatus(p.id)}
              className={`rounded-full px-2.5 py-0.5 text-xs cursor-pointer transition-colors ${p.status === "published" ? "bg-emerald-900/50 text-emerald-400 hover:bg-amber-900/50 hover:text-amber-400" : "bg-amber-900/50 text-amber-400 hover:bg-emerald-900/50 hover:text-emerald-400"}`}>
              {p.status}
            </button>
            <button onClick={() => openEdit(p)} className="rounded-md border border-[#2a3d52] px-3 py-1 text-xs text-white/60 hover:text-white hover:border-[#C8922A]">Edit</button>
            <button onClick={() => deletePage(p.id)} className="rounded-md border border-red-900/30 px-2 py-1 text-xs text-red-400 hover:bg-red-900/20">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PackagesTab() {
  const [packages, setPackages] = useState(PACKAGES_DEFAULT.map((p) => ({ ...p })));
  const [editing, setEditing] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const fieldCls = "w-full rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]";

  function openEdit(p: any) { setEditing(p); setEditForm({ ...p }); setShowAdd(false); }
  function openAdd() { setShowAdd(true); setEditing(null); setEditForm({ name:"", price:"", maxListings:"", features:"" }); }

  function saveEdit() {
    if (!editForm.name?.trim()) { toast.error("Name required"); return; }
    setPackages((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...editForm, price: Number(editForm.price), maxListings: Number(editForm.maxListings) } : p));
    setEditing(null); toast.success("Package updated!");
  }

  function addPackage() {
    if (!editForm.name?.trim()) { toast.error("Name required"); return; }
    const newPkg = { id: Date.now(), name: editForm.name.trim(), price: Number(editForm.price) || 0, maxListings: Number(editForm.maxListings) || 0, features: editForm.features || "", active: 0, revenue: 0 };
    setPackages((prev) => [...prev, newPkg]);
    setShowAdd(false); toast.success("Package added!");
  }

  function deletePackage(id: number) {
    if (!confirm("Delete this package?")) return;
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }

  const PackageForm = () => (
    <div className="rounded-xl border border-[#C8922A]/50 bg-[#1C2B3A] p-5 space-y-4">
      <h3 className="font-bold text-white text-sm">{showAdd ? "Add New Package" : `Editing: ${editing?.name}`}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/50 mb-1">Package Name *</label>
          <input className={fieldCls} placeholder="e.g. Enterprise" value={editForm.name ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1">Price (£/month)</label>
          <input type="number" className={fieldCls} placeholder="0" value={editForm.price ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, price: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Max Listings (999 = unlimited)</label>
        <input type="number" className={fieldCls} placeholder="999" value={editForm.maxListings ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, maxListings: e.target.value }))} />
      </div>
      <div>
        <label className="block text-xs text-white/50 mb-1">Features (comma-separated)</label>
        <textarea className={`${fieldCls} min-h-[70px] resize-none`} placeholder="e.g. 10 listings, Featured placement, Analytics" value={editForm.features ?? ""} onChange={(e) => setEditForm((f: any) => ({ ...f, features: e.target.value }))} />
      </div>
      <div className="flex gap-3">
        <button onClick={showAdd ? addPackage : saveEdit} className="flex-1 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white">{showAdd ? "Add Package" : "Save Changes"}</button>
        <button onClick={() => { setEditing(null); setShowAdd(false); }} className="rounded-lg border border-[#2a3d52] px-4 py-2 text-sm text-white/60 hover:text-white">Cancel</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-4 py-2 text-sm font-semibold text-white transition-colors">
          <Plus className="h-4 w-4" /> Add Package
        </button>
      </div>

      {showAdd && <PackageForm />}

      <div className="grid gap-4 sm:grid-cols-3">
        {packages.map((p) => (
          <div key={p.id} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white">{p.name}</h3>
                <p className="text-gold text-xl font-bold mt-0.5">£{p.price}/mo</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(p)} className="rounded p-1.5 border border-[#2a3d52] hover:border-[#C8922A] text-white/40 hover:text-[#C8922A] transition-colors" title="Edit">
                  <FileText className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => deletePackage(p.id)} className="rounded p-1.5 border border-red-900/30 hover:bg-red-900/20 text-white/30 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-sm text-white/60">
              <p>Active subscribers: <span className="text-white font-medium">{p.active.toLocaleString()}</span></p>
              <p>Monthly revenue: <span className="text-gold font-medium">£{p.revenue.toLocaleString()}</span></p>
              <p>Max listings: <span className="text-white font-medium">{p.maxListings >= 999 ? "Unlimited" : p.maxListings}</span></p>
            </div>
            {p.features && (
              <div className="border-t border-[#2a3d52] pt-3">
                <p className="text-xs text-white/30 mb-1.5">Features</p>
                <div className="flex flex-wrap gap-1">
                  {p.features.split(",").map((f: string) => (
                    <span key={f} className="rounded-full bg-[#0D1B25] border border-[#2a3d52] px-2 py-0.5 text-[10px] text-white/50">{f.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {editing?.id === p.id && <PackageForm />}
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

const UK_REGIONS_DEFAULT = [
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

function LocationsTab() {
  const [regions, setRegions] = useState(UK_REGIONS_DEFAULT.map((r) => ({ ...r, cities: [...r.cities] })));
  const [open, setOpen] = useState<string | null>(null);
  const [addingRegion, setAddingRegion] = useState(false);
  const [newRegion, setNewRegion] = useState("");
  const [addingCityFor, setAddingCityFor] = useState<string | null>(null);
  const [newCity, setNewCity] = useState("");

  function addRegion() {
    const name = newRegion.trim();
    if (!name || regions.find((r) => r.name === name)) return;
    setRegions((prev) => [...prev, { name, cities: [] }]);
    setNewRegion(""); setAddingRegion(false); setOpen(name);
  }

  function deleteRegion(name: string) {
    if (!confirm(`Delete region "${name}" and all its cities?`)) return;
    setRegions((prev) => prev.filter((r) => r.name !== name));
    if (open === name) setOpen(null);
  }

  function addCity(regionName: string) {
    const city = newCity.trim();
    if (!city) return;
    setRegions((prev) => prev.map((r) => r.name === regionName ? { ...r, cities: [...r.cities, city] } : r));
    setNewCity(""); setAddingCityFor(null);
  }

  function deleteCity(regionName: string, city: string) {
    setRegions((prev) => prev.map((r) => r.name === regionName ? { ...r, cities: r.cities.filter((c) => c !== city) } : r));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">UK regions and cities used for listing search filters.</p>
        <button onClick={() => { setAddingRegion(true); setNewRegion(""); }}
          className="flex items-center gap-2 rounded-lg bg-[#C8922A] hover:bg-[#a07020] px-3 py-1.5 text-xs font-semibold text-white transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add Region
        </button>
      </div>

      {addingRegion && (
        <div className="flex gap-2 rounded-xl border border-[#C8922A]/50 bg-[#1C2B3A] p-3">
          <input autoFocus
            className="flex-1 rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]"
            placeholder="Region name e.g. East Midlands"
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addRegion(); if (e.key === "Escape") setAddingRegion(false); }}
          />
          <button onClick={addRegion} className="rounded-lg bg-[#C8922A] px-3 py-2 text-sm font-semibold text-white hover:bg-[#a07020]">Add</button>
          <button onClick={() => setAddingRegion(false)} className="rounded-lg border border-[#2a3d52] px-3 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
        </div>
      )}

      {regions.map((r) => (
        <div key={r.name} className="rounded-xl border border-[#2a3d52] bg-[#1C2B3A] overflow-hidden">
          <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#243547] transition-colors">
            <button onClick={() => setOpen(open === r.name ? null : r.name)} className="flex-1 flex items-center gap-2 text-sm font-medium text-white text-left">
              <ChevronRight className={`h-4 w-4 text-white/40 transition-transform shrink-0 ${open === r.name ? "rotate-90" : ""}`} />
              {r.name}
              <span className="text-xs text-white/40 ml-1">{r.cities.length} cities</span>
            </button>
            <button onClick={() => deleteRegion(r.name)} className="rounded p-1 hover:bg-red-900/20 text-white/30 hover:text-red-400 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {open === r.name && (
            <div className="border-t border-[#2a3d52] px-4 py-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {r.cities.map((c) => (
                  <div key={c} className="group flex items-center gap-1 rounded-full border border-[#2a3d52] pl-3 pr-1.5 py-1">
                    <span className="text-xs text-white/70">{c}</span>
                    <button onClick={() => deleteCity(r.name, c)} className="rounded-full h-4 w-4 flex items-center justify-center hover:bg-red-900/40 text-white/30 hover:text-red-400 transition-colors">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {r.cities.length === 0 && <p className="text-xs text-white/30">No cities yet.</p>}
              </div>
              {addingCityFor === r.name ? (
                <div className="flex gap-2">
                  <input autoFocus
                    className="flex-1 rounded-lg border border-[#2a3d52] bg-[#0D1B25] px-3 py-1.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C8922A]"
                    placeholder="City name…"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addCity(r.name); if (e.key === "Escape") setAddingCityFor(null); }}
                  />
                  <button onClick={() => addCity(r.name)} className="rounded-lg bg-[#C8922A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#a07020]">Add</button>
                  <button onClick={() => setAddingCityFor(null)} className="rounded-lg border border-[#2a3d52] px-3 py-1.5 text-xs text-white/50 hover:text-white">✕</button>
                </div>
              ) : (
                <button onClick={() => { setAddingCityFor(r.name); setNewCity(""); }}
                  className="flex items-center gap-1.5 text-xs text-[#C8922A] hover:text-[#a07020] font-medium">
                  <Plus className="h-3 w-3" /> Add City
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── LEADS CRM ────────────────────────────────────────────────────────────────

type LeadType = "buyer" | "seller" | "agent";
type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
type LeadPriority = "hot" | "warm" | "cold";

type Lead = {
  id: number;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  date: string;
  followUp: string;
  notes: string;
  // buyer
  property?: string;
  budget?: string;
  viewingRequested?: boolean;
  firstTimeBuyer?: boolean;
  // seller
  propertyAddress?: string;
  estimatedValue?: string;
  timelineToSell?: string;
  // agent
  agency?: string;
  ricsNumber?: string;
  areasServed?: string;
  specialisations?: string;
};

const MOCK_LEADS: Lead[] = [
  // Buyer Leads
  { id: 1, type: "buyer", name: "Sarah Thompson", email: "sarah@example.com", phone: "07700 900142", source: "Enquiry Form", status: "new", priority: "hot", date: "27 Jun 2026", followUp: "28 Jun 2026", notes: "Very interested in Kensington property. Called once, left voicemail.", property: "Kensington 4-Bed Detached", budget: "£2.5M–£3.0M", viewingRequested: true, firstTimeBuyer: false },
  { id: 2, type: "buyer", name: "James Patel", email: "jpatel@email.com", phone: "07700 900209", source: "Viewing Request", status: "contacted", priority: "hot", date: "26 Jun 2026", followUp: "29 Jun 2026", notes: "Wants to view Canary Wharf flat. Cash buyer, no chain.", property: "2-Bed Flat, Canary Wharf", budget: "£600k–£800k", viewingRequested: true, firstTimeBuyer: false },
  { id: 3, type: "buyer", name: "Emily Clarke", email: "e.clarke@gmail.com", phone: "07700 900301", source: "Registration", status: "qualified", priority: "warm", date: "24 Jun 2026", followUp: "01 Jul 2026", notes: "First-time buyer, needs mortgage advice. Budget is firm.", property: "New Build 3-Bed, Milton Keynes", budget: "£350k–£425k", viewingRequested: false, firstTimeBuyer: true },
  { id: 4, type: "buyer", name: "David Chen", email: "d.chen@corp.com", phone: "07700 900201", source: "Saved Property", status: "new", priority: "warm", date: "25 Jun 2026", followUp: "30 Jun 2026", notes: "Saved 4 properties. High intent signal from behaviour.", property: "Multiple listings", budget: "£1.2M–£1.8M", viewingRequested: false, firstTimeBuyer: false },
  { id: 5, type: "buyer", name: "Anna Kowalski", email: "a.kowalski@email.com", phone: "07700 900206", source: "Enquiry Form", status: "converted", priority: "hot", date: "18 Jun 2026", followUp: "", notes: "Converted — offer accepted on Studio, Shoreditch. £385k.", property: "Studio Apartment, Shoreditch", budget: "£350k–£400k", viewingRequested: true, firstTimeBuyer: false },
  { id: 6, type: "buyer", name: "Marcus Bailey", email: "m.bailey@email.com", phone: "07700 900207", source: "Enquiry Form", status: "lost", priority: "cold", date: "10 Jun 2026", followUp: "", notes: "Went with another agent. Price range changed.", property: "Office Space, Liverpool St", budget: "£2M+", viewingRequested: false, firstTimeBuyer: false },

  // Seller Leads
  { id: 7, type: "seller", name: "John Matthews", email: "j.matthews@email.com", phone: "07700 900401", source: "Valuation Request", status: "contacted", priority: "hot", date: "25 Jun 2026", followUp: "28 Jun 2026", notes: "Inherited property. Wants quick sale. Motivated seller.", propertyAddress: "14 Park Road, Chelsea, SW3 4RY", estimatedValue: "£1.8M", timelineToSell: "1–3 months" },
  { id: 8, type: "seller", name: "Fiona MacLeod", email: "fiona.ml@email.com", phone: "07700 900204", source: "Registration", status: "new", priority: "warm", date: "26 Jun 2026", followUp: "29 Jun 2026", notes: "Upsizing. Current property valued at £950k.", propertyAddress: "8 Victoria Gardens, Notting Hill, W11", estimatedValue: "£950k", timelineToSell: "3–6 months" },
  { id: 9, type: "seller", name: "Rajan Kapoor", email: "rkapoor@email.com", phone: "07700 900205", source: "Post Listing Wizard", status: "qualified", priority: "warm", date: "22 Jun 2026", followUp: "30 Jun 2026", notes: "Listed HMO portfolio. Looking for portfolio buyer.", propertyAddress: "Multiple — Birmingham HMO portfolio", estimatedValue: "£2.1M total", timelineToSell: "6–12 months" },
  { id: 10, type: "seller", name: "Priya Sharma", email: "priya.s@email.com", phone: "07700 900202", source: "Enquiry Form", status: "converted", priority: "hot", date: "05 Jun 2026", followUp: "", notes: "Sold Canary Wharf flat. Listed and sold in 3 weeks.", propertyAddress: "2-Bed Flat, Canary Wharf, E14", estimatedValue: "£720k", timelineToSell: "ASAP" },

  // Agent Leads / Applications
  { id: 11, type: "agent", name: "Victoria Cross", email: "v.cross@crossestates.co.uk", phone: "07700 900501", source: "Agent Registration", status: "qualified", priority: "hot", date: "26 Jun 2026", followUp: "28 Jun 2026", notes: "RICS accredited. 8 years exp. Keen to upgrade to Premium plan.", agency: "Cross Estates Ltd", ricsNumber: "RICS789012", areasServed: "London, South East", specialisations: "Residential, Lettings" },
  { id: 12, type: "agent", name: "Tom Harrison", email: "t.harrison@harrisonprop.co.uk", phone: "07700 900502", source: "Agent Registration", status: "new", priority: "warm", date: "25 Jun 2026", followUp: "29 Jun 2026", notes: "Independent agent in Manchester. Interested in Standard plan.", agency: "Harrison Property", ricsNumber: "RICS445566", areasServed: "North West, Yorkshire", specialisations: "Residential, New Build" },
  { id: 13, type: "agent", name: "Sandra Wu", email: "s.wu@luxprime.co.uk", phone: "07700 900503", source: "Partner Referral", status: "contacted", priority: "hot", date: "24 Jun 2026", followUp: "27 Jun 2026", notes: "Luxury market specialist. Interested in co-branded agent profile.", agency: "LuxPrime Estates", ricsNumber: "RICS112233", areasServed: "London — Mayfair, Kensington, Chelsea", specialisations: "Residential, Commercial, Investment" },
];

const LEAD_STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  new:       { label: "New",       color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  contacted: { label: "Contacted", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  qualified: { label: "Qualified", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  converted: { label: "Converted", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  lost:      { label: "Lost",      color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const LEAD_PRIORITY: Record<LeadPriority, { label: string; color: string }> = {
  hot:  { label: "🔥 Hot",  color: "text-red-400" },
  warm: { label: "🟡 Warm", color: "text-amber-400" },
  cold: { label: "❄️ Cold", color: "text-blue-400" },
};

const LEAD_TYPE_ICON: Record<LeadType, React.ElementType> = {
  buyer:  Home,
  seller: Building2,
  agent:  Briefcase,
};

const LEAD_TYPE_COLOR: Record<LeadType, string> = {
  buyer:  "bg-sky-500/20 text-sky-300",
  seller: "bg-violet-500/20 text-violet-300",
  agent:  "bg-gold/20 text-yellow-300",
};

function exportLeadsCSV(leads: Lead[]) {
  const headers = ["ID","Type","Name","Email","Phone","Source","Status","Priority","Date","Follow-up","Property/Address","Budget/Value","Notes"];
  const rows = leads.map(l => [
    l.id, l.type, l.name, l.email, l.phone, l.source, l.status, l.priority, l.date, l.followUp,
    l.property || l.propertyAddress || l.agency || "",
    l.budget || l.estimatedValue || "",
    l.notes.replace(/,/g, ";"),
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "leads_export.csv"; a.click();
  URL.revokeObjectURL(url);
}

function LeadDetailModal({ lead, onClose, onUpdate }: { lead: Lead; onClose: () => void; onUpdate: (id: number, patch: Partial<Lead>) => void }) {
  const [notes, setNotes] = useState(lead.notes);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [followUp, setFollowUp] = useState(lead.followUp);
  const TypeIcon = LEAD_TYPE_ICON[lead.type];

  function save() {
    onUpdate(lead.id, { notes, status, followUp });
    toast.success("Lead updated successfully!");
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0F1C28] border-[#2a3d52] text-white p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1C2B3A] px-6 py-4 border-b border-[#2a3d52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C8922A]/20 flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-[#C8922A]" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">{lead.name}</h2>
              <p className="text-white/50 text-sm capitalize">{lead.type} Lead · {lead.source} · {lead.date}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className={`text-sm font-semibold ${LEAD_PRIORITY[lead.priority].color}`}>{LEAD_PRIORITY[lead.priority].label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${LEAD_STATUS_LABELS[status].color}`}>{LEAD_STATUS_LABELS[status].label}</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-3">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1"><Mail className="w-3 h-3" /> Email</div>
              <p className="text-sm text-white font-medium break-all">{lead.email}</p>
            </div>
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-3">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1"><Phone className="w-3 h-3" /> Phone</div>
              <p className="text-sm text-white font-medium">{lead.phone}</p>
            </div>
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-3">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1"><TrendingUp className="w-3 h-3" /> Source</div>
              <p className="text-sm text-white font-medium">{lead.source}</p>
            </div>
          </div>

          {/* Type-specific details */}
          {lead.type === "buyer" && (
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-4 space-y-2">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Buyer Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-white/40">Property Interest:</span><br /><span className="text-white">{lead.property}</span></div>
                <div><span className="text-white/40">Budget:</span><br /><span className="text-white font-semibold text-[#C8922A]">{lead.budget}</span></div>
                <div><span className="text-white/40">Viewing Requested:</span><br /><span className={lead.viewingRequested ? "text-green-400 font-semibold" : "text-white/50"}>{lead.viewingRequested ? "✓ Yes" : "No"}</span></div>
                <div><span className="text-white/40">First-Time Buyer:</span><br /><span className={lead.firstTimeBuyer ? "text-sky-400 font-semibold" : "text-white/50"}>{lead.firstTimeBuyer ? "✓ Yes" : "No"}</span></div>
              </div>
            </div>
          )}

          {lead.type === "seller" && (
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-4 space-y-2">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Seller Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2"><span className="text-white/40">Property Address:</span><br /><span className="text-white">{lead.propertyAddress}</span></div>
                <div><span className="text-white/40">Estimated Value:</span><br /><span className="text-white font-semibold text-[#C8922A]">{lead.estimatedValue}</span></div>
                <div><span className="text-white/40">Timeline to Sell:</span><br /><span className="text-white">{lead.timelineToSell}</span></div>
              </div>
            </div>
          )}

          {lead.type === "agent" && (
            <div className="rounded-lg bg-[#1C2B3A] border border-[#2a3d52] p-4 space-y-2">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Agent Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-white/40">Agency:</span><br /><span className="text-white">{lead.agency}</span></div>
                <div><span className="text-white/40">RICS Number:</span><br /><span className="text-white font-mono">{lead.ricsNumber}</span></div>
                <div><span className="text-white/40">Areas Served:</span><br /><span className="text-white">{lead.areasServed}</span></div>
                <div><span className="text-white/40">Specialisations:</span><br /><span className="text-white">{lead.specialisations}</span></div>
              </div>
            </div>
          )}

          {/* Status + Follow-up */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wide block mb-2">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C8922A]"
              >
                {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
                  <option key={s} value={s}>{LEAD_STATUS_LABELS[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wide block mb-2"><Calendar className="w-3 h-3 inline mr-1" />Follow-up Date</label>
              <input
                type="date"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#C8922A]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wide flex items-center gap-1 mb-2"><StickyNote className="w-3 h-3" /> Notes / Activity Log</label>
            <textarea
              className="w-full rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-2 text-sm text-white min-h-[100px] resize-none focus:outline-none focus:ring-1 focus:ring-[#C8922A] placeholder:text-white/20"
              placeholder="Add notes about this lead, calls made, emails sent, key info…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={save} className="flex-1 bg-[#C8922A] hover:bg-[#a07020] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Save Changes</button>
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2a3d52] text-sm text-white hover:bg-[#1C2B3A] transition-colors">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href={`tel:${lead.phone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2a3d52] text-sm text-white hover:bg-[#1C2B3A] transition-colors">
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [typeFilter, setTypeFilter] = useState<"all" | LeadType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | LeadPriority>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  function updateLead(id: number, patch: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  }

  const filtered = leads.filter((l) => {
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (priorityFilter !== "all" && l.priority !== priorityFilter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.priority === "hot").length,
    new: leads.filter((l) => l.status === "new").length,
    converted: leads.filter((l) => l.status === "converted").length,
    buyers: leads.filter((l) => l.type === "buyer").length,
    sellers: leads.filter((l) => l.type === "seller").length,
    agents: leads.filter((l) => l.type === "agent").length,
    convRate: Math.round((leads.filter((l) => l.status === "converted").length / leads.length) * 100),
  };

  const TYPE_FILTERS: { id: "all" | LeadType; label: string; count: number }[] = [
    { id: "all", label: "All Leads", count: leads.length },
    { id: "buyer", label: "🏠 Buyers", count: stats.buyers },
    { id: "seller", label: "🏢 Sellers", count: stats.sellers },
    { id: "agent", label: "💼 Agents", count: stats.agents },
  ];

  return (
    <div className="space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Leads", value: stats.total, icon: UserCheck, color: "text-white" },
          { label: "🔥 Hot Leads", value: stats.hot, icon: Flame, color: "text-red-400" },
          { label: "New (Uncontacted)", value: stats.new, icon: TrendingUp, color: "text-sky-400" },
          { label: "Conversion Rate", value: `${stats.convRate}%`, icon: Check, color: "text-green-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl bg-[#1C2B3A] border border-[#2a3d52] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 font-medium">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {TYPE_FILTERS.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setTypeFilter(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                typeFilter === id ? "bg-[#C8922A] border-[#C8922A] text-white" : "border-[#2a3d52] text-white/60 hover:border-[#C8922A]/60"
              }`}
            >
              {label} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>{LEAD_STATUS_LABELS[s].label}</option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
            className="rounded-lg border border-[#2a3d52] bg-[#1C2B3A] px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">🟡 Warm</option>
            <option value="cold">❄️ Cold</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              className="rounded-lg border border-[#2a3d52] bg-[#1C2B3A] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none w-44"
              placeholder="Search leads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={() => { exportLeadsCSV(filtered); toast.success("CSV exported!"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a3d52] text-xs text-white/70 hover:text-white hover:border-[#C8922A]/60 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-xl border border-[#2a3d52] overflow-hidden">
        <div className="bg-[#1a2a38] px-4 py-2.5 grid grid-cols-12 text-[11px] font-semibold text-white/40 uppercase tracking-wide">
          <span className="col-span-3">Lead</span>
          <span className="col-span-2 hidden sm:block">Type</span>
          <span className="col-span-2 hidden md:block">Source</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1 hidden lg:block">Priority</span>
          <span className="col-span-1 hidden lg:block">Follow-up</span>
          <span className="col-span-1 text-right">Action</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-sm">No leads match your filters.</div>
        )}

        {filtered.map((lead) => {
          const TypeIcon = LEAD_TYPE_ICON[lead.type];
          return (
            <div
              key={lead.id}
              className="grid grid-cols-12 items-center px-4 py-3 border-t border-[#2a3d52] hover:bg-[#1C2B3A]/50 transition-colors cursor-pointer"
              onClick={() => setSelected(lead)}
            >
              {/* Lead name + email */}
              <div className="col-span-3">
                <p className="font-semibold text-white text-sm">{lead.name}</p>
                <p className="text-xs text-white/40 truncate">{lead.email}</p>
              </div>

              {/* Type badge */}
              <div className="col-span-2 hidden sm:flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${LEAD_TYPE_COLOR[lead.type]}`}>
                  <TypeIcon className="w-3 h-3" />
                  {lead.type.charAt(0).toUpperCase() + lead.type.slice(1)}
                </span>
              </div>

              {/* Source */}
              <div className="col-span-2 hidden md:block">
                <span className="text-xs text-white/50">{lead.source}</span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${LEAD_STATUS_LABELS[lead.status].color}`}>
                  {LEAD_STATUS_LABELS[lead.status].label}
                </span>
              </div>

              {/* Priority */}
              <div className="col-span-1 hidden lg:block">
                <span className={`text-xs font-semibold ${LEAD_PRIORITY[lead.priority].color}`}>
                  {LEAD_PRIORITY[lead.priority].label}
                </span>
              </div>

              {/* Follow-up */}
              <div className="col-span-1 hidden lg:block">
                <span className="text-xs text-white/40">{lead.followUp || "—"}</span>
              </div>

              {/* Action */}
              <div className="col-span-1 text-right">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelected(lead); }}
                  className="text-[#C8922A] text-xs font-semibold hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/30 text-right">Showing {filtered.length} of {leads.length} leads</p>

      {/* Lead Detail Modal */}
      {selected && (
        <LeadDetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdate={(id, patch) => { updateLead(id, patch); setSelected((prev) => prev ? { ...prev, ...patch } : null); }}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function TAB_CONTENT_MAP({ activeTab }: { activeTab: string }) {
  const map: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab />,
    leads: <LeadsTab />,
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
