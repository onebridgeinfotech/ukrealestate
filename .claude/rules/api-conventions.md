# API & Backend Conventions — MarketUK

## Supabase Client

Always import the single shared client — never create a new one:
```tsx
import { supabase } from "@/lib/supabase";
```

## Query Patterns

### Fetching listings
```tsx
// Active listings with related profile
const { data, error } = await supabase
  .from("listings")
  .select(`
    id, title, category, listing_type, asking_price,
    city, region, postcode, bedrooms, bathrooms,
    floor_area_sqft, status, is_featured, images,
    profiles(first_name, last_name, email)
  `)
  .eq("status", "active")
  .order("created_at", { ascending: false })
  .limit(20);
```

### Inserting a listing
```tsx
const { data, error } = await supabase
  .from("listings")
  .insert({
    title: "4-Bed House, Kensington",
    category: "Residential",
    listing_type: "sale",         // "sale" | "rent"
    asking_price: 2500000,
    city: "London",
    region: "Greater London",
    postcode: "W8 4PT",
    bedrooms: 4,
    bathrooms: 3,
    floor_area_sqft: 2400,
    status: "active",             // "active" | "draft" | "under_offer" | "sold"
    is_featured: false,
    seller_id: user.id,
    images: ["https://res.cloudinary.com/..."],
  })
  .select()
  .single();
```

### Fetching enquiries
```tsx
const { data } = await supabase
  .from("enquiries")
  .select("id, message, status, created_at, listing_id, listings(title), sender_id, profiles(first_name, last_name, email)")
  .order("created_at", { ascending: false })
  .limit(50);
```

### Updating a record
```tsx
const { error } = await supabase
  .from("listings")
  .update({ status: "active", is_featured: true })
  .eq("id", listingId);
```

### Deleting a record
```tsx
await supabase.from("listings").delete().eq("id", id);
```

## Auth Patterns

### Get current user (client-side)
```tsx
import { useAuth } from "@/lib/auth";
const { user, loading, profile } = useAuth();
// profile.role → "buyer" | "seller" | "agent" | "admin"
```

### Get current user (in beforeLoad / server context)
```tsx
const { data: { user } } = await supabase.auth.getUser();
```

### Sign out
```tsx
await supabase.auth.signOut();
navigate({ to: "/login" });
```

## Cloudinary Image Upload

```tsx
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";

// Single file
const { result, error } = await uploadToCloudinary(file, "marketuk/listings");
if (result) imageUrl = result.secureUrl;

// Multiple files
const urls = await uploadMultipleToCloudinary(files, "marketuk/listings");
```

**Fallback when Cloudinary is not configured:**
```tsx
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const url = cloudName
  ? (await uploadToCloudinary(file, "marketuk/listings")).result?.secureUrl
  : URL.createObjectURL(file);
```

## Listing Status Values

| Value | Meaning |
|---|---|
| `active` | Live on site, visible to buyers |
| `draft` | Submitted but pending admin review |
| `under_offer` | Offer accepted, still visible |
| `sold` | Completed sale |

## User Roles & Access

| Role | Access |
|---|---|
| `buyer` | Read listings, save, enquire, view own dashboard |
| `seller` | Post listings, manage own listings, view enquiries |
| `agent` | Post listings, manage client listings, leads pipeline |
| `admin` | Full CMS — all users, all listings, leads, packages, CMS pages |

## Error Handling

Always handle Supabase errors explicitly:
```tsx
const { data, error } = await supabase.from("listings").select("*");
if (error) {
  toast.error("Failed to load listings.");
  console.error(error.message);
  return;
}
```

Never silently swallow errors in production-facing code.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

All `VITE_` prefixed vars are exposed to the browser bundle. Never put service role keys or secrets in `VITE_` vars.
