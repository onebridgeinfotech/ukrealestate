import { supabase } from "./supabase";
import type { Database, ListingStatus } from "./database.types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];
type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];

export interface ListingFilters {
  search?: string;
  propertyType?: string[];
  region?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: ListingStatus;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
}

export async function fetchListings(filters: ListingFilters = {}) {
  const {
    search, propertyType, region, city,
    minPrice, maxPrice, bedrooms,
    status = "active",
    isFeatured,
    page = 1,
    pageSize = 12,
  } = filters;

  let query = supabase
    .from("listings")
    .select("*, profiles(first_name, last_name, company_name, avatar_url)", { count: "exact" })
    .eq("status", status)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%,postcode.ilike.%${search}%`);
  }
  if (propertyType && propertyType.length > 0) {
    query = query.in("property_type", propertyType);
  }
  if (region) query = query.eq("region", region);
  if (city) query = query.ilike("city", `%${city}%`);
  if (minPrice) query = query.gte("asking_price", minPrice);
  if (maxPrice) query = query.lte("asking_price", maxPrice);
  if (bedrooms) query = query.gte("bedrooms", bedrooms);
  if (isFeatured !== undefined) query = query.eq("is_featured", isFeatured);

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  return { listings: data as Listing[] | null, error, total: count ?? 0 };
}

export async function fetchListingBySlug(slug: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*, profiles(first_name, last_name, company_name, avatar_url, phone, email)")
    .eq("slug", slug)
    .single();

  if (data) {
    // Increment views asynchronously
    supabase.rpc("increment_listing_views", { listing_id: data.id }).then(() => {});
  }

  return { listing: data as Listing | null, error };
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*, profiles(first_name, last_name, company_name, avatar_url, phone, email)")
    .eq("id", id)
    .single();
  return { listing: data as Listing | null, error };
}

export async function createListing(data: ListingInsert) {
  const { data: listing, error } = await supabase
    .from("listings")
    .insert(data)
    .select()
    .single();
  return { listing, error };
}

export async function updateListing(id: string, updates: Partial<ListingInsert>) {
  const { data, error } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { listing: data, error };
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  return { error };
}

export async function fetchMyListings(userId: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { listings: data as Listing[] | null, error };
}

// ─── SAVED LISTINGS ───────────────────────────────────────────

export async function fetchSavedListings(userId: string) {
  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id, listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { saved: data, error };
}

export async function toggleSavedListing(userId: string, listingId: string) {
  const { data: existing } = await supabase
    .from("saved_listings")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .single();

  if (existing) {
    const { error } = await supabase.from("saved_listings").delete().eq("id", existing.id);
    return { saved: false, error };
  } else {
    const { error } = await supabase.from("saved_listings").insert({ user_id: userId, listing_id: listingId });
    return { saved: true, error };
  }
}

export async function isSavedListing(userId: string, listingId: string) {
  const { data } = await supabase
    .from("saved_listings")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .single();
  return !!data;
}

// ─── ENQUIRIES ────────────────────────────────────────────────

export async function submitEnquiry(data: {
  listingId: string;
  senderId?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}) {
  const { error } = await supabase.from("enquiries").insert({
    listing_id: data.listingId,
    sender_id: data.senderId ?? null,
    sender_name: data.senderName,
    sender_email: data.senderEmail,
    sender_phone: data.senderPhone ?? null,
    message: data.message,
  });
  return { error };
}

export async function fetchEnquiriesForListing(listingId: string) {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, profiles(first_name, last_name, email, phone)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });
  return { enquiries: data, error };
}

export async function fetchMyEnquiries(userId: string) {
  const { data, error } = await supabase
    .from("enquiries")
    .select("*, listings(title, slug, featured_image)")
    .eq("sender_id", userId)
    .order("created_at", { ascending: false });
  return { enquiries: data, error };
}
