import { useState } from "react";
import { toast } from "sonner";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  LayoutDashboard,
  List,
  Users,
  User,
  Phone,
  Pencil,
  Star,
  Trash2,
  Eye,
  Plus,
  TrendingUp,
  Home,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/agent")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Agent Dashboard â€” MarketUK" }] }),
  component: AgentDashboard,
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "listings", label: "Managed Listings", icon: List },
  { id: "leads", label: "Leads", icon: Users },
  { id: "profile", label: "Profile", icon: User },
];

const MOCK_LISTINGS = [
  { id: 1, title: "4-Bed Detached, Kensington", category: "Residential", status: "Active", views: 2140, enquiries: 18, date: "12 May 2025", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=80&q=70" },
  { id: 2, title: "2-Bed Flat, Canary Wharf", category: "Residential", status: "Active", views: 1892, enquiries: 14, date: "02 Apr 2025", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=70" },
  { id: 3, title: "Studio, Shoreditch", category: "Residential", status: "Under Offer", views: 945, enquiries: 9, date: "18 Mar 2025", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=70" },
  { id: 4, title: "Office Space, Liverpool St", category: "Commercial", status: "Active", views: 710, enquiries: 5, date: "01 Jun 2025", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=70" },
  { id: 5, title: "3-Bed Semi, Manchester", category: "Residential", status: "Draft", views: 0, enquiries: 0, date: "20 Jun 2025", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=70" },
  { id: 6, title: "Retail Unit, Brighton", category: "Commercial", status: "Active", views: 415, enquiries: 6, date: "10 Jun 2025", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&q=70" },
  { id: 7, title: "5-Bed Victorian, Notting Hill", category: "Residential", status: "Active", views: 3100, enquiries: 22, date: "05 Mar 2025", img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=80&q=70" },
  { id: 8, title: "Land Plot, Surrey", category: "Land", status: "Active", views: 520, enquiries: 4, date: "22 Apr 2025", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&q=70" },
  { id: 9, title: "New Build 3-Bed, Milton Keynes", category: "New Build", status: "Active", views: 890, enquiries: 11, date: "30 Apr 2025", img: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=80&q=70" },
  { id: 10, title: "2-Bed Flat, Leeds City Centre", category: "Residential", status: "Under Offer", views: 1100, enquiries: 8, date: "15 Feb 2025", img: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=80&q=70" },
  { id: 11, title: "HMO 6-Bed, Birmingham", category: "HMO & BTL", status: "Active", views: 670, enquiries: 7, date: "18 May 2025", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70" },
  { id: 12, title: "Commercial Unit, Glasgow", category: "Commercial", status: "Draft", views: 0, enquiries: 0, date: "24 Jun 2025", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&q=70" },
];

type KanbanLead = {
  id: number;
  buyer: string;
  property: string;
  phone: string;
  email: string;
};

const KANBAN: Record<string, KanbanLead[]> = {
  "New": [
    { id: 1, buyer: "David Chen", property: "4-Bed Detached, Kensington", phone: "07700 900201", email: "d.chen@email.com" },
    { id: 2, buyer: "Priya Sharma", property: "2-Bed Flat, Canary Wharf", phone: "07700 900202", email: "priya.s@email.com" },
    { id: 3, buyer: "Tom Williams", property: "New Build 3-Bed, Milton Keynes", phone: "07700 900203", email: "tom.w@email.com" },
  ],
  "Contacted": [
    { id: 4, buyer: "Fiona MacLeod", property: "5-Bed Victorian, Notting Hill", phone: "07700 900204", email: "fiona.ml@email.com" },
    { id: 5, buyer: "Rajan Kapoor", property: "HMO 6-Bed, Birmingham", phone: "07700 900205", email: "rkapoor@email.com" },
  ],
  "Viewing": [
    { id: 6, buyer: "Anna Kowalski", property: "Studio, Shoreditch", phone: "07700 900206", email: "a.kowalski@email.com" },
    { id: 7, buyer: "Marcus Bailey", property: "Office Space, Liverpool St", phone: "07700 900207", email: "m.bailey@email.com" },
  ],
  "Offer Made": [
    { id: 8, buyer: "Sarah Thompson", property: "4-Bed Detached, Kensington", phone: "07700 900208", email: "s.thompson@email.com" },
    { id: 9, buyer: "James Patel", property: "2-Bed Flat, Canary Wharf", phone: "07700 900209", email: "jpatel@email.com" },
  ],
};

const STAGE_ORDER = ["New", "Contacted", "Viewing", "Offer Made"];

const STAGE_COLOURS: Record<string, string> = {
  "New": "border-blue-200 bg-blue-50",
  "Contacted": "border-amber-200 bg-amber-50",
  "Viewing": "border-purple-200 bg-purple-50",
  "Offer Made": "border-green-200 bg-green-50",
};

const STAGE_BADGE: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Contacted": "bg-amber-100 text-amber-700",
  "Viewing": "bg-purple-100 text-purple-700",
  "Offer Made": "bg-green-100 text-green-700",
};

const SPECIALISATIONS = ["Residential", "Commercial", "New Build", "Lettings", "Land", "Investment", "Student"];
const SERVICE_AREAS = ["London", "South East", "South West", "North West", "North East", "Yorkshire", "Scotland", "Wales", "East Midlands", "West Midlands"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    "Under Offer": "bg-amber-100 text-amber-700",
    Draft: "bg-gray-100 text-gray-500",
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

function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [kanban, setKanban] = useState(KANBAN);
  const [listingFilter, setListingFilter] = useState("All");
  const [managedListings, setManagedListings] = useState(MOCK_LISTINGS);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(["Residential", "Lettings"]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["London", "South East"]);
  const [profile, setProfile] = useState({
    company: "Hartley & Associates",
    firstName: "William",
    lastName: "Hartley",
    email: "w.hartley@hartleyassociates.co.uk",
    phone: "07700 900100",
    website: "https://hartleyassociates.co.uk",
    ricsNumber: "RICS123456",
    bio: "RICS-accredited estate agent with 15 years of experience across London and the South East. Specialising in high-value residential sales, new build developments, and commercial property acquisition. I pride myself on delivering exceptional client service and achieving the best possible outcomes for both buyers and sellers.",
  });

  function moveToNextStage(leadId: number, currentStage: string) {
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    if (currentIndex >= STAGE_ORDER.length - 1) return;
    const nextStage = STAGE_ORDER[currentIndex + 1];
    const lead = kanban[currentStage].find((l) => l.id === leadId);
    if (!lead) return;
    setKanban((prev) => ({
      ...prev,
      [currentStage]: prev[currentStage].filter((l) => l.id !== leadId),
      [nextStage]: [...prev[nextStage], lead],
    }));
  }

  function toggleChip(value: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filteredListings = listingFilter === "All"
    ? managedListings
    : managedListings.filter((l) => l.status === listingFilter);

  const totalLeads = Object.values(kanban).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen fixed top-0 left-0 z-20 pt-16">
        <div className="flex flex-col items-center py-8 px-4 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#0D2B4E] flex items-center justify-center text-white text-xl font-bold mb-3">
            WH
          </div>
          <p className="font-semibold text-[#0D2B4E]">William Hartley</p>
          <span className="mt-1 text-xs font-bold px-3 py-0.5 rounded-full bg-[#C8922A]/10 text-[#C8922A]">
            Agent
          </span>
          <span className="mt-1 text-[10px] text-gray-400">RICS Accredited</span>
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
                <StatCard label="Managed Listings" value={12} icon={Home} sub="4 added this month" />
                <StatCard label="Active Buyers" value={28} icon={Users} sub="6 new this week" />
                <StatCard label="Leads This Month" value={47} icon={MessageSquare} sub="+23% vs last month" />
                <StatCard label="Avg Days to Sale" value={42} icon={TrendingUp} sub="Industry avg 58 days" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/post">
                  <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Listing
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => setActiveTab("leads")} className="border-[#0D2B4E] text-[#0D2B4E]">
                  View All Leads
                </Button>
              </div>

              {/* Lead Pipeline Summary */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-[#0D2B4E] mb-4">Lead Pipeline</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STAGE_ORDER.map((stage) => (
                    <div key={stage} className={`rounded-lg border p-3 ${STAGE_COLOURS[stage]}`}>
                      <p className="text-xs font-semibold text-gray-500 mb-1">{stage}</p>
                      <p className="text-2xl font-bold text-[#0D2B4E]">{kanban[stage].length}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Listings Table */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-[#0D2B4E]">Top Performing Listings</h2>
                  <button onClick={() => setActiveTab("listings")} className="text-xs text-[#C8922A] font-semibold hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Title</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium hidden sm:table-cell">Views</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium hidden sm:table-cell">Enquiries</th>
                        <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_LISTINGS.filter((l) => l.status === "Active").slice(0, 5).map((l) => (
                        <tr key={l.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-5 py-3 font-medium text-[#0D2B4E]">{l.title}</td>
                          <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{l.views.toLocaleString()}</td>
                          <td className="px-5 py-3 text-gray-600 hidden sm:table-cell">{l.enquiries}</td>
                          <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MANAGED LISTINGS */}
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
                    <Plus className="w-4 h-4" /> Add New Listing
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
                              <button onClick={() => toast("Edit listing coming soon — full editor launching shortly.")} className="p-1.5 text-gray-400 hover:text-[#0D2B4E] transition-colors" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => { setFeaturedIds((ids) => ids.includes(l.id) ? ids.filter((x) => x !== l.id) : [...ids, l.id]); toast(featuredIds.includes(l.id) ? "Removed from featured" : "Listing featured! ⭐"); }} className="p-1.5 transition-colors" title="Feature" style={{ color: featuredIds.includes(l.id) ? "#C8922A" : "#9ca3af" }}>
                                <Star className={`w-4 h-4 ${featuredIds.includes(l.id) ? "fill-[#C8922A]" : ""}`} />
                              </button>
                              <button onClick={() => { if (confirm("Remove this listing from your managed listings?")) { setManagedListings((ml) => ml.filter((x) => x.id !== l.id)); toast("Listing removed."); } }} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
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

          {/* LEADS KANBAN */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{totalLeads} total leads across all stages</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STAGE_ORDER.map((stage) => (
                  <div key={stage} className="flex flex-col gap-3">
                    <div className={`rounded-lg px-3 py-2 flex items-center justify-between border ${STAGE_COLOURS[stage]}`}>
                      <span className="font-semibold text-sm text-[#0D2B4E]">{stage}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STAGE_BADGE[stage]}`}>
                        {kanban[stage].length}
                      </span>
                    </div>
                    {kanban[stage].map((lead) => {
                      const stageIdx = STAGE_ORDER.indexOf(stage);
                      const isLast = stageIdx === STAGE_ORDER.length - 1;
                      return (
                        <div key={lead.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
                          <div>
                            <p className="font-semibold text-[#0D2B4E] text-sm">{lead.buyer}</p>
                            <p className="text-xs text-[#C8922A] font-medium mt-0.5 line-clamp-1">{lead.property}</p>
                          </div>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Eye className="w-3 h-3" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!isLast && (
                              <Button
                                size="sm"
                                className="flex-1 bg-[#0D2B4E] hover:bg-[#0a2040] text-white text-xs h-7 px-2"
                                onClick={() => moveToNextStage(lead.id, stage)}
                              >
                                Move to {STAGE_ORDER[stageIdx + 1]}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                            {isLast && (
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-7 px-2"
                                onClick={() => { setKanban((prev) => ({ ...prev, [stage]: prev[stage].filter((l) => l.id !== lead.id) })); toast.success(`🎉 Offer accepted for ${lead.buyer}!`); }}
                              >
                                Offer Made
                              </Button>
                            )}
                            <button className="p-1.5 text-gray-400 hover:text-[#0D2B4E] border border-gray-200 rounded-md transition-colors" title="Call">
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {kanban[stage].length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-300 border border-dashed border-gray-200 rounded-lg">
                        No leads in this stage
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-semibold text-[#0D2B4E]">Agency Details</h3>
                <div>
                  <Label>Company / Agency Name</Label>
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
                  <Label>RICS Number</Label>
                  <Input className="mt-1" placeholder="e.g. RICS123456" value={profile.ricsNumber} onChange={(e) => setProfile((p) => ({ ...p, ricsNumber: e.target.value }))} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h3 className="font-semibold text-[#0D2B4E]">Specialisations</h3>
                <div className="flex flex-wrap gap-2">
                  {SPECIALISATIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleChip(s, selectedSpecs, setSelectedSpecs)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer
                        ${selectedSpecs.includes(s)
                          ? "bg-[#0D2B4E] text-white border-[#0D2B4E]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#0D2B4E]"}
                      `}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <h3 className="font-semibold text-[#0D2B4E] pt-2">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleChip(a, selectedAreas, setSelectedAreas)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all cursor-pointer
                        ${selectedAreas.includes(a)
                          ? "bg-[#C8922A] text-white border-[#C8922A]"
                          : "bg-white text-gray-600 border-gray-300 hover:border-[#C8922A]"}
                      `}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-[#0D2B4E]">Professional Bio</h3>
                <Textarea
                  className="min-h-[160px]"
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Write a detailed professional bio for your public profile..."
                />
                <p className="text-xs text-gray-400">{profile.bio.length} characters â€” shown on your public agent profile</p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button className="bg-[#C8922A] hover:bg-[#a07020] text-white" onClick={() => toast.success("Profile saved successfully!")}>Save Changes</Button>
                  <button
                    type="button"
                    onClick={() => toast("Public agent profiles are coming soon. Save your changes first.")}
                    className="flex items-center gap-1 text-sm text-[#0D2B4E] font-medium hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" /> View Public Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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
