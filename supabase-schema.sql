-- ============================================================
-- MarketUK — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'agent', 'admin');
CREATE TYPE listing_status AS ENUM ('active', 'under_offer', 'sold', 'draft');
CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'replied', 'closed');
CREATE TYPE package_name AS ENUM ('free', 'standard', 'premium');

-- ─── PROFILES ─────────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  role            user_role NOT NULL DEFAULT 'buyer',
  company_name    TEXT,
  bio             TEXT,
  website         TEXT,
  rics_number     TEXT,
  avatar_url      TEXT,
  package         package_name NOT NULL DEFAULT 'free',
  package_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── LISTINGS ─────────────────────────────────────────────────
CREATE TABLE public.listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  property_type   TEXT NOT NULL,
  status          listing_status NOT NULL DEFAULT 'draft',
  asking_price    NUMERIC(12,2),
  price_qualifier TEXT,
  offers_invited  BOOLEAN NOT NULL DEFAULT FALSE,
  tenure          TEXT,
  service_charge  NUMERIC(10,2),
  ground_rent     NUMERIC(10,2),
  address_line1   TEXT NOT NULL,
  address_line2   TEXT,
  city            TEXT NOT NULL,
  county          TEXT,
  postcode        TEXT NOT NULL,
  region          TEXT NOT NULL,
  bedrooms        INTEGER,
  bathrooms       INTEGER,
  floor_area      NUMERIC(10,2),
  floor_area_unit TEXT DEFAULT 'sqft',
  year_built      INTEGER,
  condition       TEXT,
  epc_rating      TEXT,
  council_tax_band TEXT,
  parking         TEXT,
  garden          TEXT,
  central_heating BOOLEAN NOT NULL DEFAULT FALSE,
  broadband       BOOLEAN NOT NULL DEFAULT FALSE,
  key_features    TEXT[] NOT NULL DEFAULT '{}',
  images          TEXT[] NOT NULL DEFAULT '{}',
  featured_image  TEXT,
  documents       JSONB NOT NULL DEFAULT '{}',
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  views           INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION public.generate_listing_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(TRIM(NEW.title), '[^a-z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_generate_slug
  BEFORE INSERT ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.generate_listing_slug();

-- Increment view count function
CREATE OR REPLACE FUNCTION public.increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings SET views = views + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── ENQUIRIES ────────────────────────────────────────────────
CREATE TABLE public.enquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  agent_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name   TEXT NOT NULL,
  sender_email  TEXT NOT NULL,
  sender_phone  TEXT,
  message       TEXT NOT NULL,
  status        enquiry_status NOT NULL DEFAULT 'new',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SAVED LISTINGS ───────────────────────────────────────────
CREATE TABLE public.saved_listings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ─── SAVED SEARCHES ───────────────────────────────────────────
CREATE TABLE public.saved_searches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  filters     JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, only edit their own
CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: public can read active listings; owners manage their own
CREATE POLICY "Active listings are publicly readable"
  ON public.listings FOR SELECT
  USING (status != 'draft' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create listings"
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update their listings"
  ON public.listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owners can delete their listings"
  ON public.listings FOR DELETE USING (auth.uid() = user_id);

-- Enquiries: senders and listing owners can see enquiries
CREATE POLICY "Enquiry sender can view their enquiries"
  ON public.enquiries FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = agent_id OR
         auth.uid() IN (SELECT user_id FROM public.listings WHERE id = listing_id));

CREATE POLICY "Anyone can create enquiry"
  ON public.enquiries FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Listing owner can update enquiry status"
  ON public.enquiries FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.listings WHERE id = listing_id));

-- Saved listings: users manage their own
CREATE POLICY "Users can manage saved listings"
  ON public.saved_listings FOR ALL USING (auth.uid() = user_id);

-- Saved searches: users manage their own
CREATE POLICY "Users can manage saved searches"
  ON public.saved_searches FOR ALL USING (auth.uid() = user_id);

-- ─── INDEXES ──────────────────────────────────────────────────
CREATE INDEX listings_user_id_idx       ON public.listings(user_id);
CREATE INDEX listings_status_idx        ON public.listings(status);
CREATE INDEX listings_property_type_idx ON public.listings(property_type);
CREATE INDEX listings_region_idx        ON public.listings(region);
CREATE INDEX listings_city_idx          ON public.listings(city);
CREATE INDEX listings_asking_price_idx  ON public.listings(asking_price);
CREATE INDEX listings_is_featured_idx   ON public.listings(is_featured);
CREATE INDEX enquiries_listing_id_idx   ON public.enquiries(listing_id);
CREATE INDEX enquiries_sender_id_idx    ON public.enquiries(sender_id);

-- ─── STORAGE BUCKETS ──────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-documents', 'listing-documents', FALSE)
ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Owners can delete their listing images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
