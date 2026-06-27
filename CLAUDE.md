# MarketUK — Claude Code Project Guide

## Project Overview
**MarketUK** is a UK real estate marketplace for buying, selling, and letting residential and commercial property. It supports four user roles (buyer, seller, agent, admin), a full listing lifecycle, lead capture, enquiry management, and a CMS admin panel.

**Live URL:** `https://cornflowerblue-capybara-977113.hostingersite.com`
**GitHub:** `https://github.com/onebridgeinfotech/ukrealestate.git` (branch: `main`)
**Built by:** Onebridge Infotech

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vite + React 18 + TypeScript |
| Routing | TanStack Router (file-based, `src/routes/`) |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix UI primitives) |
| Auth | Supabase Auth — role-based (`buyer`, `seller`, `agent`, `admin`) |
| Database | Supabase (PostgreSQL) |
| Image Upload | Cloudinary — `src/lib/cloudinary.ts` |
| Toast / Notifications | Sonner — `import { toast } from "sonner"` |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | React useState / useEffect (no global store) |
| Deployment | Hostinger (LiteSpeed server) — output: `dist/` |

---

## Project Structure

```
src/
├── routes/                    # File-based routes (TanStack Router)
│   ├── index.tsx              # Homepage /
│   ├── listings.index.tsx     # /listings — search & filter
│   ├── listings.$id.tsx       # /listings/:id — detail page
│   ├── login.tsx              # /login — buyer/seller/agent auth
│   ├── post.tsx               # /post — multi-step listing wizard
│   ├── admin.tsx              # /admin — CMS admin panel (auth-gated)
│   ├── admin-login.tsx        # /admin-login
│   ├── dashboard.buyer.tsx    # /dashboard/buyer
│   ├── dashboard.seller.tsx   # /dashboard/seller
│   ├── dashboard.agent.tsx    # /dashboard/agent
│   ├── pricing.tsx            # /pricing
│   ├── contact.tsx            # /contact
│   ├── faq.tsx                # /faq
│   ├── about.tsx              # /about
│   ├── how-it-works.tsx       # /how-it-works
│   ├── terms.tsx              # /terms
│   ├── privacy.tsx            # /privacy
│   ├── cookies.tsx            # /cookies
│   ├── careers.tsx            # /careers
│   └── press.tsx              # /press
├── components/
│   ├── site/                  # App-specific components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx         # "Built by Onebridge Infotech" link
│   │   ├── ListingCard.tsx    # Reusable listing card
│   │   ├── SearchBar.tsx
│   │   ├── BottomNav.tsx      # Mobile sticky bottom nav
│   │   └── StatusBadge.tsx
│   └── ui/                    # shadcn/ui primitives (do not edit)
├── lib/
│   ├── auth.tsx               # useAuth() hook — { user, loading, profile }
│   ├── supabase.ts            # Supabase client
│   ├── cloudinary.ts          # uploadToCloudinary(), uploadMultipleToCloudinary()
│   ├── mock-data.ts           # Demo listings data
│   ├── listings-api.ts        # Supabase listing queries
│   └── database.types.ts      # Generated Supabase types
├── hooks/
│   └── use-mobile.tsx
└── main.tsx
```

---

## Auth System

```tsx
import { useAuth } from "@/lib/auth";

const { user, loading, profile } = useAuth();
// profile.role → "buyer" | "seller" | "agent" | "admin"
```

**Auth Guard Pattern — CRITICAL:**
All `useState` and `useEffect` hooks MUST come before any conditional early return. React will crash if hooks appear after `if (loading || !user) return null`.

```tsx
function MyComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // ✅ ALL useState FIRST
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading]);

  if (loading || !user) return null; // ✅ early return AFTER all hooks

  return <div>...</div>;
}
```

**Route-level auth guard (beforeLoad):**
```tsx
export const Route = createFileRoute("/dashboard/buyer")({
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/login" });
  },
  component: MyComponent,
});
```

**Admin routes** additionally check `profile.role === "admin"` and redirect to `/admin-login`.

---

## User Roles

| Role | Dashboard | Can Post Listings | Notes |
|---|---|---|---|
| `buyer` | `/dashboard/buyer` | No | Save properties, enquiries, saved searches |
| `seller` | `/dashboard/seller` | Yes | Manage own listings, view enquiries |
| `agent` | `/dashboard/agent` | Yes | Kanban pipeline, multiple listings, RICS badge |
| `admin` | `/admin` | Yes | Full CMS — users, listings, leads, packages, CMS pages |

---

## Supabase Tables

| Table | Key Columns |
|---|---|
| `profiles` | `id`, `first_name`, `last_name`, `email`, `role`, `created_at` |
| `listings` | `id`, `title`, `category`, `listing_type` (sale/rent), `asking_price`, `city`, `region`, `postcode`, `bedrooms`, `bathrooms`, `floor_area_sqft`, `status`, `is_featured`, `seller_id`, `images[]` |
| `enquiries` | `id`, `message`, `status`, `created_at`, `listing_id`, `sender_id` |

**Common query pattern:**
```tsx
const { data, error } = await supabase
  .from("listings")
  .select("id, title, asking_price, city, region, status")
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(20);
```

---

## Image Upload (Cloudinary)

```tsx
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";

// Single upload
const { result, error } = await uploadToCloudinary(file, "marketuk/listings");
// result.secureUrl → the CDN URL

// Multiple upload
const urls = await uploadMultipleToCloudinary(files, "marketuk/listings");
```

Env vars required: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`
If `VITE_CLOUDINARY_CLOUD_NAME` is not set, fall back to `URL.createObjectURL(file)` for local preview.

---

## Toast Notifications

Always use Sonner — never browser `alert()`:
```tsx
import { toast } from "sonner";

toast.success("Listing saved!");
toast.error("Something went wrong. Please try again.");
toast.info("Your session has expired.");
```

---

## Styling Conventions

- **Brand colours:** Navy `#0D2B4E` (primary), Gold `#C8922A` (accent), use `text-gold` / `bg-gold` Tailwind aliases
- **Admin panel colours:** Background `#0F1C28`, Card `#1C2B3A`, Border `#2a3d52`
- **Public site:** Uses Tailwind `bg-background`, `text-foreground`, `border-border` CSS variables (light mode)
- **Font:** `font-display` for headings (Playfair Display), `font-sans` for body
- **Dark admin inputs:** `bg-[#0D1B25] border-[#2a3d52] text-white focus:border-[#C8922A]`

---

## Deployment

**Build:** `npm run build` → outputs to `dist/`
**Deploy:** Push to GitHub → Hostinger auto-deploys from `main` branch
- Hostinger Build command: `npm run build`
- Hostinger Output directory: `dist`
- Server: LiteSpeed (not Apache) — `.htaccess` `AddType` / `ForceType` are ignored, use `RewriteRule [T=]` flags
- SPA routing: `dist/.htaccess` rewrites all paths to `index.html`

**Standard deploy steps:**
```bash
npm run build
git add .
git commit -m "feat: description"
git push origin main
```

---

## Known Issues & Constraints

- Listings page currently shows mock data from `src/lib/mock-data.ts` — Supabase connection pending
- "(demo data)" label must be removed before production launch
- Social media footer links are placeholder `#` — need real URLs
- Contact details (phone, email, address) are placeholder — need real business info
- Cloudinary env vars must be set in Hostinger environment variables for image upload to work in production
