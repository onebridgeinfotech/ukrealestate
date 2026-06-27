# Testing & QA Guidelines — MarketUK

## Key User Journeys to Test After Every Change

### 1. Buyer Journey
- Homepage → search by keyword / category / location → listings page with correct filters applied
- Listings page → filter by price, bedrooms, property type → results update
- Click listing card → listing detail page loads with correct data
- Listing detail → Send Enquiry form → submit → toast confirmation
- Sign up as buyer → verify email → login → buyer dashboard

### 2. Seller Journey
- Login as seller → seller dashboard → My Listings tab shows own listings
- Create listing via Post wizard (5 steps: type → details → location → media → preview)
- Upload images in media step → images appear in preview
- Submit listing → status is "draft" (pending review)
- Listing appears in admin panel under Listings for approval

### 3. Agent Journey
- Login as agent → agent dashboard → Leads Kanban board visible
- Switch between Overview / Listings / Leads / Profile tabs
- Post listing → verify it appears in Listings tab

### 4. Admin Journey
- Login at `/admin-login` → redirects to `/admin` if role is "admin"
- Dashboard stats load, charts render
- Leads CRM → click any lead row → detail modal shows email, phone, notes
- Users tab → Add User modal works → user appears in table
- Listings tab → Add Listing with images → listing saved to Supabase
- Enquiries tab → click enquiry → detail modal shows message, email, reply button
- Locations tab → add a new region, add city, delete city, delete region
- Packages tab → edit a package price → change saved
- CMS Pages → toggle published/draft → status updates

### 5. Auth Guard (Logged Out)
- Visit `/dashboard/buyer`, `/dashboard/seller`, `/dashboard/agent` while logged out → redirects to `/login`
- Visit `/admin` while logged out → redirects to `/admin-login`
- Visit `/post` while logged out → redirects to `/login`

## Known Bugs (Do Not Mark as Fixed Without Verifying)

From `QA_BUG_REPORT.md`:

**Critical:**
- BUG-001: Homepage keyword search not passed in URL params
- BUG-002: Category/location tiles on homepage don't apply filter

**High:**
- BUG-003: Listings page shows mock data, not Supabase data
- BUG-004: Social media footer links all go to `#`
- BUG-005: Listing detail thumbnails all show same image

**Medium:**
- BUG-006: Careers/Press pages show "IN PROGRESS" — must not be visible in production
- BUG-007: Enquiry form uses native browser validation (no styled errors)
- BUG-008: Newsletter subscribe has no feedback
- BUG-009: Contact form submit has no confirmation
- BUG-010: "(demo data)" label visible on listings page

## Device & Viewport Testing Checklist

| Viewport | Width | Key checks |
|---|---|---|
| Mobile | 390px | Bottom nav visible, no content hidden behind it, listing detail sticky CTA |
| Tablet | 768px | Header nav doesn't wrap to two lines, filter sidebar collapses |
| Desktop | 1280px | Full layout, all columns visible, search bar 3 fields in row |

## UI/UX Issues to Watch (From UI/UX Review)

- UI-004: Mobile listing detail has no sticky enquiry CTA — highest conversion priority
- UI-011: Hero badge says "5,000+" but stat block says "38,000+" — fix the contradiction
- UI-008: Password field shows bullet dots as placeholder before typing
- UI-018: Mobile bottom nav overlaps page content (needs `pb-20` on content wrapper)
- UI-016: No loading skeleton on listings page during data fetch

## After Every Code Change

1. Run `npm run build` — must pass with zero TypeScript errors
2. Check the affected page in browser on both desktop and mobile
3. Verify auth guards still work (logged out → redirect)
4. Confirm no React hooks violations (no hooks after conditional returns)
