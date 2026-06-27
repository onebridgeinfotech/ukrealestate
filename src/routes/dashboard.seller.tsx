import { useState } from "react";
import { toast } from "sonner";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  List,
  MessageSquare,
  BarChart2,
  CreditCard,
  User,
  Pencil,
  Star,
  Trash2,
  Eye,
  Plus,
  TrendingUp,
  Home,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/dashboard/seller")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Seller Dashboard â€” MarketUK" }] }),
  component: SellerDashboard,
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "My Listings", icon: List },
  { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "performance", label: "Performance", icon: BarChart2 },
  { id: "package", label: "Package", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
];

const MOCK_LISTINGS = [
  { id: 1, title: "4-Bed Detached, Kensington", category: "Residential", status: "Active", views: 1240, enquiries: 12, date: "12 May 2025", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=70" },
  { id: 2, title: "2-Bed Flat, Canary Wharf", category: "Residential", status: "Active", views: 892, enquiries: 8, date: "02 Apr 2025", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=70" },
  { id: 3, title: "Studio Apartment, Shoreditch", category: "Residential", status: "Under Offer", views: 645, enquiries: 6, date: "18 Mar 2025", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=70" },
  { id: 4, title: "Office Space, Liverpool St", category: "Commercial", status: "Active", views: 310, enquiries: 5, date: "01 Jun 2025", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=70" },
  { id: 5, title: "3-Bed Semi, Manchester", category: "Residential", status: "Draft", views: 0, enquiries: 0, date: "20 Jun 2025", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=70" },
  { id: 6, title: "Retail Unit, Brighton", category: "Commercial", status: "Active", views: 215, enquiries: 3, date: "10 Jun 2025", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&q=70" },
];

const VIEW_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: String(i + 1),
  views: Math.floor(60 + (i * 3) + (i > 20 ? 80 : 0) + (i % 5) * 20),
}));

const BAR_DATA = MOCK_LISTINGS.map((l) => ({
  name: l.title.split(",")[0],
  enquiries: l.enquiries,
}));

const ENQUIRIES = [
  { id: 1, buyer: "Sarah Thompson", property: "4-Bed Detached, Kensington", excerpt: "I'm very interested in viewing the property. Could we arrange a viewing this weekend?", date: "22 Jun 2025", status: "New" },
  { id: 2, buyer: "James Patel", property: "2-Bed Flat, Canary Wharf", excerpt: "Is the property chain-free? We're first-time buyers looking to move quickly.", date: "21 Jun 2025", status: "Read" },
  { id: 3, buyer: "Emily Clarke", property: "Studio Apartment, Shoreditch", excerpt: "What are the current service charges and lease length remaining?", date: "19 Jun 2025", status: "Read" },
  { id: 4, buyer: "Michael O'Brien", property: "Office Space, Liverpool St", excerpt: "We're looking for at least 2,000 sq ft. Is the layout flexible for an open-plan setup?", date: "18 Jun 2025", status: "New" },
];

const BILLING = [
  { date: "01 Jun 2025", plan: "Free Plan", amount: "Â£0.00", status: "Active" },
  { date: "01 May 2025", plan: "Free Plan", amount: "Â£0.00", status: "Paid" },
  { date: "01 Apr 2025", plan: "Free Plan", amount: "Â£0.00", status: "Paid" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    "Under Offer": "bg-amber-100 text-amber-700",
    Draft: "bg-gray-100 text-gray-500",
    New: "bg-blue-100 text-blue-700",
    Read: "bg-gray-100 text-gray-500",
    Paid: "bg-green-100 text-green-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-[#0D2B4E]/5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#0D2B4E]" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#0D2B4E]">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

type ListingItem = typeof MOCK_LISTINGS[0];

function EditListingModal({ listing, onSave, onClose }: { listing: ListingItem; onSave: (updated: ListingItem) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...listing });
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Title</Label>
            <Input className="mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {["Residential", "Commercial", "Industrial", "Land", "New Build"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {["Active", "Under Offer", "Draft", "Sold"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 rounded-md bg-[#C8922A] text-white text-sm font-medium hover:bg-[#a07020]">Save Changes</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type EnquiryItem = typeof ENQUIRIES[0];

function ReplyModal({ enq, onClose }: { enq: EnquiryItem; onClose: () => void }) {
  const [reply, setReply] = useState("");
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to {enq.buyer}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">{enq.property}</p>
            <p>{enq.excerpt}</p>
          </div>
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </div>
        <DialogFooter className="gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { if (!reply.trim()) { toast.error("Please write a reply first."); return; } toast.success("Reply sent to " + enq.buyer + "!"); onClose(); }} className="px-4 py-2 rounded-md bg-[#0D2B4E] text-white text-sm font-medium hover:bg-[#0a2040]">Send Reply</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [listingFilter, setListingFilter] = useState("All");
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [editingListing, setEditingListing] = useState<ListingItem | null>(null);
  const [replyingTo, setReplyingTo] = useState<EnquiryItem | null>(null);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);

  function handleSave(updated: ListingItem) {
    setListings((prev) => prev.map((l) => l.id === updated.id ? updated : l));
  }

  function handleDelete(id: number) {
    if (confirm("Delete this listing? This cannot be undone.")) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  }
  const [profile, setProfile] = useState({
    company: "Smith Properties Ltd",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@smithproperties.co.uk",
    phone: "07700 900123",
    website: "https://smithproperties.co.uk",
    bio: "Independent property seller based in London with over 10 years of experience in the residential and commercial markets.",
  });

  const filteredListings = listingFilter === "All"
    ? listings
    : listings.filter((l) => l.status === listingFilter);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed top-0 left-0 z-20 pt-16">
        <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#0D2B4E] flex items-center justify-center text-white text-xl font-bold mb-3">
            JS
          </div>
          <p className="font-semibold text-[#0D2B4E]">John Smith</p>
          <span className="mt-1 text-xs font-bold px-3 py-0.5 rounded-full bg-[#C8922A]/10 text-[#C8922A]">
            Seller
          </span>
        </div>
        <nav className="flex-1 py-4 px-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                ${activeTab === id ? "bg-[#0D2B4E] text-white" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-[#0D2B4E]">
            {TABS.find((t) => t.id === activeTab)?.label}
          </h1>
        </div>

        <div className="px-4 md:px-8 py-6">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Listings" value={6} icon={Home} sub="2 expiring soon" />
                <StatCard label="Total Views (30d)" value="2,847" icon={Eye} sub="+18% vs last month" />
                <StatCard label="Enquiries" value={34} icon={MessageSquare} sub="8 unread" />
                <StatCard label="Conversion Rate" value="1.2%" icon={TrendingUp} sub="Industry avg 0.9%" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/post">
                  <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Post New Listing
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setActiveTab("enquiries")} className="border-[#0D2B4E] text-[#0D2B4E]">
                  View All Enquiries
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[#0D2B4E]">Top Listings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Title</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Views</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Enquiries</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.slice(0, 5).map((l) => (
                        <tr key={l.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-medium text-[#0D2B4E]">{l.title}</td>
                          <td className="px-5 py-3 text-gray-600">{l.views.toLocaleString()}</td>
                          <td className="px-5 py-3 text-gray-600">{l.enquiries}</td>
                          <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                          <td className="px-5 py-3">
                            <button onClick={() => setEditingListing(l)} className="text-[#C8922A] hover:underline text-xs font-semibold">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MY LISTINGS */}
          {activeTab === "listings" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {["All", "Active", "Under Offer", "Draft"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setListingFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                        ${listingFilter === f ? "bg-[#0D2B4E] text-white border-[#0D2B4E]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}
                      `}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <Link to="/post">
                  <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Post New Listing
                  </Button>
                </Link>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Property</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Views</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Enquiries</th>
                        <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Listed</th>
                        <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map((l) => (
                        <tr key={l.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={l.img} alt={l.title} className="w-12 h-10 object-cover rounded-md hidden sm:block" />
                              <span className="font-medium text-[#0D2B4E] text-xs sm:text-sm">{l.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{l.category}</td>
                          <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{l.views.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{l.enquiries}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{l.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setEditingListing(l)} className="p-1.5 text-gray-400 hover:text-[#0D2B4E] transition-colors" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => { setFeaturedIds((ids) => ids.includes(l.id) ? ids.filter((x) => x !== l.id) : [...ids, l.id]); toast(featuredIds.includes(l.id) ? "Removed from featured" : "Listing featured! ⭐"); }} className="p-1.5 transition-colors" title="Feature" style={{ color: featuredIds.includes(l.id) ? "#C8922A" : "#9ca3af" }}>
                                <Star className={`w-4 h-4 ${featuredIds.includes(l.id) ? "fill-[#C8922A]" : ""}`} />
                              </button>
                              <button onClick={() => handleDelete(l.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredListings.length === 0 && (
                  <div className="text-center py-12 text-gray-400">No listings found for this filter.</div>
                )}
              </div>
            </div>
          )}

          {/* ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="space-y-4">
              {ENQUIRIES.map((enq) => (
                <div key={enq.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#0D2B4E]">{enq.buyer}</span>
                        <StatusBadge status={enq.status} />
                      </div>
                      <p className="text-xs text-[#C8922A] font-medium mb-2">{enq.property}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{enq.excerpt}</p>
                      <p className="text-xs text-gray-400 mt-2">{enq.date}</p>
                    </div>
                    <Button size="sm" className="bg-[#0D2B4E] hover:bg-[#0a2040] text-white whitespace-nowrap shrink-0" onClick={() => setReplyingTo(enq)}>
                      View &amp; Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PERFORMANCE */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-[#0D2B4E] mb-5">Property Views â€” Last 30 Days</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={VIEW_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0D2B4E" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0D2B4E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#0D2B4E" strokeWidth={2} fill="url(#viewGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-[#0D2B4E] mb-5">Enquiries by Property</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={BAR_DATA} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="enquiries" fill="#C8922A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PACKAGE */}
          {activeTab === "package" && (
            <div className="space-y-6">
              <div className="bg-[#0D2B4E] text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white/70 text-sm">Current Plan</p>
                  <h2 className="text-2xl font-bold mt-1">Free Plan</h2>
                  <p className="text-white/60 text-sm mt-1">1 listing Â· 3 images Â· Standard placement</p>
                </div>
                <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white shrink-0" onClick={() => setActiveTab("package")}>Upgrade Now</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
                  <p className="text-sm text-gray-500 font-medium">Free</p>
                  <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£0<span className="text-sm font-normal text-gray-400">/mo</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {["1 listing", "3 images", "Standard placement"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-gray-300" />{f}</li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-gray-200 text-gray-400">Current Plan</Button>
                </div>
                <div className="bg-white rounded-xl border-2 border-[#C8922A]/40 p-5 relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8922A] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">MOST POPULAR</span>
                  <p className="text-sm text-gray-500 font-medium">Standard</p>
                  <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£29<span className="text-sm font-normal text-gray-400">/mo</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {["10 listings", "10 images", "Highlighted border", "Email support"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />{f}</li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-[#C8922A] hover:bg-[#a07020] text-white" onClick={() => toast.success("Upgrading to Standard Plan… Redirecting to checkout.")}>Upgrade to Standard</Button>
                </div>
                <div className="bg-white rounded-xl border-2 border-gray-100 p-5">
                  <p className="text-sm text-gray-500 font-medium">Premium</p>
                  <p className="text-2xl font-bold text-[#0D2B4E] mt-1">Â£59<span className="text-sm font-normal text-gray-400">/mo</span></p>
                  <ul className="mt-3 space-y-1 text-sm text-gray-600">
                    {["Unlimited listings", "20 images", "Featured badge", "Analytics dashboard", "Priority support"].map((f) => (
                      <li key={f} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />{f}</li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-[#0D2B4E] hover:bg-[#0a2040] text-white" onClick={() => toast.success("Upgrading to Premium Plan… Redirecting to checkout.")}>Upgrade to Premium</Button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#0D2B4E]">Billing History</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Plan</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Amount</th>
                      <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BILLING.map((b, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-5 py-3 text-gray-600">{b.date}</td>
                        <td className="px-5 py-3 text-gray-600">{b.plan}</td>
                        <td className="px-5 py-3 font-medium text-[#0D2B4E]">{b.amount}</td>
                        <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-semibold text-[#0D2B4E]">Account Details</h3>
                <div>
                  <Label>Company Name</Label>
                  <Input className="mt-1" value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input className="mt-1" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input className="mt-1" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input className="mt-1" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input className="mt-1" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input className="mt-1" value={profile.website} onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label>About / Bio</Label>
                  <Textarea className="mt-1 min-h-[100px]" value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} />
                </div>
                <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white" onClick={() => toast.success("Profile saved successfully!")}>Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Reply Modal */}
      {replyingTo && <ReplyModal enq={replyingTo} onClose={() => setReplyingTo(null)} />}

      {/* Edit Modal */}
      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onSave={handleSave}
          onClose={() => setEditingListing(null)}
        />
      )}

      {/* Bottom Nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 flex">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 text-[10px] font-medium transition-colors
              ${activeTab === id ? "text-[#0D2B4E]" : "text-gray-400"}
            `}
          >
            <Icon className="w-5 h-5" />
            {label.split(" ")[0]}
          </button>
        ))}
      </nav>
    </div>
  );
}
