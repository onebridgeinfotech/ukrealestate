# MarketUK — QA Bug Report

**Tested:** 27 Jun 2026
**Environment:** https://cornflowerblue-capybara-977113.hostingersite.com
**Tested on:** Desktop (1280px), Tablet (768px), Mobile (390px) — Chrome

---

## 🔴 CRITICAL

---

### BUG-001 — Homepage search keyword not passed to results page

| Field | Detail |
|---|---|
| **Severity** | Critical |
| **Page** | Homepage `/` |
| **Device/Browser** | Desktop Chrome |

**Steps to Reproduce:**
1. Go to homepage
2. Type "restaurant" in the keyword search field
3. Click Search button

**Expected Result:** Navigates to `/listings?q=restaurant&type=&region=` and filters results by keyword

**Actual Result:** Navigates to `/listings?q=&type=&region=` — keyword value is empty, no filtering applied

**Suggested Fix:** Bind the keyword input to a controlled state variable and pass its value as the `q` URL param on form submit. The input is likely uncontrolled (value not read on submit).

---

### BUG-002 — Category and Location homepage links do not apply any filter

| Field | Detail |
|---|---|
| **Severity** | Critical |
| **Page** | Homepage `/` → Browse by Category / Browse by Location sections |
| **Device/Browser** | Desktop Chrome |

**Steps to Reproduce:**
1. On homepage scroll to "Browse by Category"
2. Click "Residential" (or any category/location tile)
3. Observe the listings page URL and results

**Expected Result:** Navigates to `/listings?type=Residential` and shows only matching listings

**Actual Result:** Navigates to `/listings` with no query params — all 6 demo listings appear unfiltered

**Suggested Fix:** Add query params to each category and location link, e.g. `<Link to="/listings" search={{ type: "Residential" }}>`. Same fix needed for location tiles.

---

## 🟠 HIGH

---

### BUG-003 — Only 6 mock listings shown; Supabase real data not connected

| Field | Detail |
|---|---|
| **Severity** | High |
| **Page** | `/listings` |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Navigate to `/listings`
2. Observe the result count

**Expected Result:** Real listings fetched from Supabase database

**Actual Result:** Shows "6 properties found (demo data)" — mock data is used, Supabase listings are not queried

**Suggested Fix:** Wire the listings page to `supabase.from('listings').select(...)`. Also remove the "(demo data)" suffix — it must not appear in production UI.

---

### BUG-004 — All footer social media links are broken placeholders

| Field | Detail |
|---|---|
| **Severity** | High |
| **Page** | Footer — all pages |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Scroll to footer on any page
2. Click Facebook, Twitter/X, LinkedIn, Instagram, or YouTube icon

**Expected Result:** Opens the brand's real social media profile in a new tab

**Actual Result:** All links point to `#` — page jumps to top. On sub-pages (e.g. `/login`) they incorrectly resolve to `/login#`

**Suggested Fix:** Replace `#` with real social media profile URLs. Add `target="_blank" rel="noopener noreferrer"` to each link.

---

### BUG-005 — Listing detail thumbnail images are all identical

| Field | Detail |
|---|---|
| **Severity** | High |
| **Page** | `/listings/1` (and all listing detail pages) |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Open any listing detail page e.g. `/listings/1`
2. Observe the 4 thumbnail images below the main gallery image

**Expected Result:** 4 distinct property photos shown as thumbnails

**Actual Result:** All 4 thumbnails display the exact same image

**Suggested Fix:** Ensure each listing in mock data contains an array of unique image URLs. The images array likely has only one item being repeated.

---

## 🟡 MEDIUM

---

### BUG-006 — Careers and Press pages show "Coming next" but are linked in footer

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Page** | `/careers`, `/press` |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Scroll to footer
2. Click "Careers" or "Press & Media" under Company section

**Expected Result:** A useful page, or these links are absent from the footer until pages are built

**Actual Result:** Both pages show "IN PROGRESS — Careers / Press — Coming next." with only a "Back to home" button

**Suggested Fix:** Remove Careers and Press links from the footer until the pages are ready. Never expose internal "IN PROGRESS" labels to end users.

---

### BUG-007 — Enquiry form on listing detail has no styled validation feedback

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Page** | `/listings/:id` — Send Enquiry form |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Navigate to `/listings/1`
2. Leave Name and Email fields empty
3. Click "Submit Enquiry"

**Expected Result:** Styled inline validation error messages appear under each required field (matching design system)

**Actual Result:** Browser-native tooltip appears on the name field only — no styled feedback, inconsistent UX

**Suggested Fix:** Add React-controlled validation with red error messages rendered below each field. Remove `required` HTML attribute and handle validation in JS instead.

---

### BUG-008 — Newsletter subscription form shows no success or error feedback

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Page** | Homepage `/` — "Get new listings in your inbox" section |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. On homepage, type a valid email in the newsletter input
2. Click Subscribe

**Expected Result:** Toast notification or inline success message confirms subscription (e.g. "You're subscribed!")

**Actual Result:** No visible feedback — user cannot tell if submission succeeded or failed

**Suggested Fix:** Add success state (toast + button text changes to "Subscribed ✓") and an error state for network failure.

---

### BUG-009 — Contact form submission has no visible confirmation

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Page** | `/contact` |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Go to `/contact`
2. Fill in Full Name, Email, Subject, and Message
3. Click "Send Message"

**Expected Result:** Toast success notification "Message sent! We'll be in touch shortly." or inline confirmation

**Actual Result:** No visible feedback confirming message was sent or failed

**Suggested Fix:** Fire `toast.success("Message sent!")` on successful submission. Show `toast.error("Failed to send. Please try again.")` on error.

---

### BUG-010 — "(demo data)" label visible to users on listings page

| Field | Detail |
|---|---|
| **Severity** | Medium |
| **Page** | `/listings` |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Navigate to `/listings`
2. Read the result count label

**Expected Result:** "6 properties found" (clean label)

**Actual Result:** "6 properties found (demo data)" — internal label exposed to all users, undermines trust

**Suggested Fix:** Remove the "(demo data)" suffix from the results count string before production launch.

---

## 🟢 LOW / UX

---

### BUG-011 — "How It Works" nav item wraps to two lines at tablet width

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Page** | All pages — header nav |
| **Device/Browser** | Tablet 768px |

**Steps to Reproduce:**
1. View site at 768px width
2. Observe the header navigation bar

**Expected Result:** All nav items remain on a single line

**Actual Result:** "How It Works" wraps to two lines inside the header nav

**Suggested Fix:** Add `whitespace-nowrap` to nav link elements, or reduce the nav font size slightly at the `md` breakpoint.

---

### BUG-012 — Breadcrumb on listing detail truncates title mid-word

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Page** | `/listings/:id` |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Navigate to `/listings/1`
2. Observe the breadcrumb trail

**Expected Result:** "Home / Residential / Luxury 4-Bed Detached House" (full or meaningful truncation)

**Actual Result:** "Home / Residential / Luxury 4-Bed Detached House — Prime Resi..." — cuts mid-word

**Suggested Fix:** Either remove the listing title from the breadcrumb (keep only type) or truncate at a word boundary with a sensible max length.

---

### BUG-013 — All contact details are placeholder/dummy values

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Page** | Footer (all pages) + `/contact` |
| **Device/Browser** | All |

**Details:**
- Phone: `+44 (0) 1234 567 890` — fake number
- Email: `hello@marketuk.co.uk` — placeholder domain
- Address: `20 Fenchurch Street, London EC3M 3BY` — placeholder
- Company No: `12345678` — placeholder

**Suggested Fix:** Replace all placeholder contact details with real business information before going live.

---

### BUG-014 — "Sell" nav link silently redirects to login with no explanation

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Page** | All pages — header nav |
| **Device/Browser** | All |

**Steps to Reproduce:**
1. Click "Sell" in the header nav while logged out

**Expected Result:** Login page shows a contextual message: "Please sign in to post a listing"

**Actual Result:** Silently redirects to `/login` with no explanation — confusing for new users

**Suggested Fix:** Pass a redirect reason: navigate to `/login?redirect=/post`. On the login page, detect this param and display a contextual hint banner above the form.

---

### BUG-015 — Notifications and Saved header buttons do nothing when logged out

| Field | Detail |
|---|---|
| **Severity** | Low |
| **Page** | All pages — header |
| **Device/Browser** | Desktop |

**Steps to Reproduce:**
1. View any page while not logged in
2. Click the 🔔 (Notifications) or ♡ (Saved) button in the header

**Expected Result:** Redirect to `/login` with a message, or a tooltip: "Sign in to save listings"

**Actual Result:** No visible action occurs — buttons appear to do nothing

**Suggested Fix:** On click when unauthenticated, either redirect to `/login` or show a tooltip/popover: "Sign in to access this feature".

---

## 📊 Summary

| Severity | Count |
|---|---|
| 🔴 Critical | 2 |
| 🟠 High | 3 |
| 🟡 Medium | 5 |
| 🟢 Low / UX | 5 |
| **Total** | **15** |

---

## 🚀 Recommended Fix Priority (Functional Bugs)

1. BUG-001 — Fix homepage search keyword (breaks primary user journey)
2. BUG-002 — Fix category/location filter links (breaks discovery)
3. BUG-003 — Connect Supabase listings + remove demo label
4. BUG-004 — Fix all social media links
5. BUG-005 — Fix duplicate listing thumbnails
6. BUG-006 — Remove Careers/Press from footer until pages are ready
7. BUG-007 — Add styled form validation to enquiry form
8. BUG-008 — Add newsletter subscription feedback
9. BUG-009 — Add contact form confirmation
10. BUG-013 — Replace all placeholder contact details
11. BUG-011 — Fix nav wrapping at tablet
12. BUG-012 — Fix breadcrumb truncation
13. BUG-014 — Add context message on Sell redirect
14. BUG-015 — Handle header buttons when logged out

---

---

# MarketUK — UI/UX Design Review

**Reviewed:** 27 Jun 2026
**Pages Covered:** Homepage, Listings, Listing Detail, Login, Pricing, Contact, FAQ
**Viewports:** Desktop 1280px, Mobile 390px

---

## 🔴 CRITICAL — Conversion-Blocking Issues

---

### UI-001 — Search bar Category and Location fields have no visible label text

| Field | Detail |
|---|---|
| **Priority** | Critical |
| **Page** | Homepage `/` — hero search bar |
| **Device** | All |

**Issue:** The Category and Location dropdowns show only a small icon with no label text at rest. The keyword field has placeholder text; the other two do not clearly say "Category" or "Location" at default state. Users cannot tell what the fields are for without clicking.

**Impact:** Users skip the fields entirely, reducing search quality and engagement.

**Fix:** Add visible placeholder labels: `"Category"` and `"Location"` matching the keyword field style. On desktop all three labels should be visible simultaneously.

---

### UI-002 — Hero section has excessive dead space below search bar

| Field | Detail |
|---|---|
| **Priority** | Critical |
| **Page** | Homepage `/` |
| **Device** | Desktop |

**Issue:** After the trust badges ("Verified listings · Direct broker contact · Free for buyers") there is ~100px of empty dark space before the stat counters section. This dead zone makes the page feel unfinished and pushes key content below the fold unnecessarily.

**Fix:** Reduce hero bottom padding to approximately `py-10`. The stats bar should sit closer to the search without a visible gap on the dark background.

---

### UI-003 — Listing cards on homepage use inconsistent image heights

| Field | Detail |
|---|---|
| **Priority** | Critical |
| **Page** | Homepage — Featured Properties and Recent Listings sections |
| **Device** | All |

**Issue:** The "Featured Properties" cards have taller images than the "Recent Listings" cards further down the page. Both sections use the same `ListingCard` component but render at different sizes due to parent container constraints. The inconsistency makes the grid look unpolished.

**Fix:** Standardise all listing card images to a fixed aspect ratio — `aspect-[16/10]` or a fixed `h-48` — applied inside the component itself so it is invariant regardless of context.

---

### UI-004 — Mobile listing detail: Enquiry form is completely hidden below the fold

| Field | Detail |
|---|---|
| **Priority** | Critical |
| **Page** | `/listings/:id` on mobile (390px) |
| **Device** | Mobile |

**Issue:** The enquiry form (the primary conversion action) is not visible anywhere above the fold on mobile. Users see only the image gallery and property title. The agent card and form are buried far down the page with no sticky CTA.

**Impact:** Critical conversion loss on mobile — the most important action is invisible.

**Fix:** Add a sticky bottom bar on mobile: `position: fixed; bottom: 0; width: 100%` containing "📞 Call Agent" and "✉ Send Enquiry" buttons. The bar should disappear when the enquiry form scrolls into view. This is standard pattern used by Rightmove and Zoopla.

---

## 🟠 HIGH — Trust and Usability Gaps

---

### UI-005 — Pricing cards: "Most Popular" badge clips on mobile

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/pricing` — mobile (390px) |
| **Device** | Mobile |

**Issue:** The Standard plan "Most Popular" badge uses `absolute -top-3` positioning. When cards stack vertically on mobile, the badge overlaps the card above it or is partially clipped.

**Fix:** Change badge positioning on mobile to a full-width coloured banner inside the top of the card: a stripe that reads "MOST POPULAR" spanning the full card width. More readable and no overflow dependency.

---

### UI-006 — Pricing feature comparison table is unreadable on mobile

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/pricing` — mobile (390px) |
| **Device** | Mobile |

**Issue:** The Feature / Free / Standard / Premium comparison table has no horizontal scrolling. On 390px each column is crushed to ~60px wide — column headers and tick/cross marks become completely illegible.

**Fix:** Wrap the table in `overflow-x-auto` so it scrolls horizontally on mobile. Alternatively, replace the table with card-per-feature accordions below the `md` breakpoint.

---

### UI-007 — Listings page "Clear All Filters" button is visually weak

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/listings` — filter sidebar |
| **Device** | All |

**Issue:** The "× Clear All Filters" link is styled as small plain text at the bottom of the sidebar. It is easy to miss, especially since it only appears after filters are applied.

**Fix:** Style as a ghost button: `border border-red-300 text-red-500 rounded-md px-3 py-1.5 text-sm`. Place it at the top of the filter panel (not the bottom) so users can always see it when filters are active.

---

### UI-008 — Login page: password field shows "••••••••" as placeholder

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/login` |
| **Device** | All |

**Issue:** The password field placeholder already shows bullet dots `••••••••` before the user types anything. This creates false affordance — it looks like a password is already entered, which confuses users and may cause them to submit without re-entering their credentials.

**Fix:** Change placeholder to text: `"Enter your password"` or `"Min. 8 characters"`. Remove the bullet placeholder entirely.

---

### UI-009 — Contact page: Full Name and Email inputs are too narrow side-by-side

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/contact` — desktop |
| **Device** | Desktop |

**Issue:** Full Name and Email are on the same row in a 2-column grid, each getting only ~250px width. Email addresses are truncated inside these narrow inputs. Phone and Subject fields below use full width — creating visual inconsistency.

**Fix:** Stack Name and Email vertically (each full width), or if keeping side-by-side ensure minimum input width of 320px.

---

### UI-010 — Agent Email CTA button on listing detail has low contrast

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | `/listings/:id` — agent card |
| **Device** | All |

**Issue:** The "Email" button in the agent card uses an outline/ghost style with a very light border and muted text. Against the white card background the contrast ratio is weak. It does not visually communicate a primary clickable action.

**Fix:** Make the Email button a solid secondary colour (navy `#0D2B4E` or gold `#C8922A`) with white text. Phone and Email buttons should have equal visual weight, or use Phone as primary (solid gold) and Email as secondary (solid navy).

---

### UI-011 — Hero badge says "5,000+ buyers" but stats row says "38,000+"

| Field | Detail |
|---|---|
| **Priority** | High |
| **Page** | Homepage `/` |
| **Device** | All |

**Issue:** The pill badge at the top of the hero reads "Trusted by 5,000+ verified buyers" but the stat block directly below reads "38,000+ REGISTERED BUYERS". This direct contradiction on the same page destroys credibility instantly.

**Fix:** Make both numbers consistent — use the higher figure (38,000+) in the hero badge, or remove the badge in favour of the stat block.

---

## 🟡 MEDIUM — Consistency and Polish

---

### UI-012 — Section eyebrow labels have no consistent style across homepage

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | Homepage `/` |
| **Device** | All |

**Issue:** Section labels like "HAND-PICKED OPPORTUNITIES", "EXPLORE THE MARKETPLACE", "JUST LISTED" use uppercase small text but vary in colour, weight, and letter-spacing across sections. Some appear in gold, some in muted grey.

**Fix:** Define a single eyebrow class: `text-xs font-bold uppercase tracking-widest text-[#C8922A]` and apply uniformly to all section intro labels.

---

### UI-013 — Category grid card icon and label alignment is inconsistent

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | Homepage — Browse by Category grid |
| **Device** | All |

**Issue:** Some category tiles appear taller or have different icon-to-label spacing due to icons varying in visual complexity. The 12-item grid has uneven row heights when labels differ in length ("Land" vs "Student Property").

**Fix:** Set a fixed icon container size (`h-10 w-10`) and minimum tile height `h-24`. Ensure all icons use the same stroke weight.

---

### UI-014 — "Enquire" button on listing cards is undersized and low-visibility

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | Homepage listing cards, `/listings` results |
| **Device** | All |

**Issue:** The "Enquire" CTA is a small outline button in the card's bottom-right corner. It competes with the price label and is not visually prominent. On a property marketplace the enquiry click is the most valuable action.

**Fix:** Make the Enquire button full-width within the card footer: `w-full bg-[#C8922A] text-white rounded-md py-2 font-semibold`. This makes it unmissable and standardises card footer height.

---

### UI-015 — FAQ page shows very few questions per tab, no question count shown

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | `/faq` |
| **Device** | All |

**Issue:** Only 5 accordion items visible in the "General" tab. No indicator of total question count. The page looks sparse — barely filling the viewport — which makes the site feel thin on content.

**Fix:** Show minimum 8–10 FAQ items per tab. Add a question count badge to each tab chip: "General (6)", "Buyers (5)", etc. This sets user expectations and demonstrates content depth.

---

### UI-016 — No skeleton loading states on listings page

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | `/listings` |
| **Device** | All |

**Issue:** When the listings page loads with a network delay, the user sees a blank content area with no loading feedback. No skeleton placeholder cards are shown.

**Fix:** Add 6 skeleton card components (grey animated pulse rectangles mimicking card layout) that render while the data fetch is in progress. Use `animate-pulse` Tailwind class on placeholder divs.

---

### UI-017 — "Similar Properties" cards at bottom of listing detail are too small

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | `/listings/:id` — Similar Properties section |
| **Device** | All |

**Issue:** Similar property cards render at approximately 50% the size of the main listing cards. Images are small, text is cramped, and the Enquire button is barely legible. This section should inspire continued browsing but looks like an afterthought.

**Fix:** Use the same full `ListingCard` component used on the `/listings` page. Set grid to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

---

### UI-018 — Mobile bottom nav bar overlaps page content

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | All pages — mobile (390px) |
| **Device** | Mobile |

**Issue:** The sticky bottom navigation bar (Home / Search / + / Saved / Profile) overlaps the last ~60px of page content. Footer text and content near the bottom is partially hidden behind the nav bar with no padding compensation.

**Fix:** Add `pb-20` (80px bottom padding) to the main page content wrapper on mobile so content never hides behind the fixed bottom nav.

---

### UI-019 — "Post Listing" header CTA button has insufficient visual weight

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | All pages — header |
| **Device** | Desktop |

**Issue:** "Post Listing" is a gold button but lacks enough padding and shadow to stand out prominently as a primary CTA against the white header.

**Fix:** Increase button padding to `px-6 py-2.5`, add `shadow-md` and `font-bold`. This makes the CTA pop without changing colour or layout.

---

### UI-020 — Contact page map embed is an empty grey placeholder rectangle

| Field | Detail |
|---|---|
| **Priority** | Medium |
| **Page** | `/contact` — desktop and mobile |
| **Device** | All |

**Issue:** The right side of the contact page shows a small grey box with "20 Fenchurch Street, London" and "View on Google Maps ↗" text, but no actual map. An empty grey rectangle reads as broken to users.

**Fix:** Either embed a real Google Maps iframe, or replace the empty box with a styled address card with a large map link button. Do not show an empty grey rectangle.

---

## 🟢 LOW — Polish and Micro-details

---

### UI-021 — Testimonial avatars are initials-only with no photos

| Field | Detail |
|---|---|
| **Priority** | Low |
| **Page** | Homepage — "Trusted by buyers and sellers" section |
| **Device** | All |

**Issue:** All 3 testimonials show 2-letter monogram avatars (JW, PS, MJ) with no real profile photos. On a trust-focused marketplace this weakens social proof significantly.

**Fix:** Use real or high-quality stock headshots. At minimum, use distinct background colours per avatar and add a ★★★★★ star rating above each quote.

---

### UI-022 — Newsletter row: email input and Subscribe button have height mismatch

| Field | Detail |
|---|---|
| **Priority** | Low |
| **Page** | Homepage — newsletter section |
| **Device** | Desktop |

**Issue:** The email input and Subscribe button are slightly different heights, causing 1–2px vertical misalignment in the row. Visible on close inspection.

**Fix:** Apply `h-11` to both elements and use `flex items-stretch` on the wrapper row.

---

### UI-023 — "How It Works" step numbering style is inconsistent between homepage and dedicated page

| Field | Detail |
|---|---|
| **Priority** | Low |
| **Page** | Homepage section vs `/how-it-works` page |
| **Device** | All |

**Issue:** Homepage shows numbered steps as inline text badges; the `/how-it-works` page shows them as circular icons. The same user journey is presented in two different visual styles.

**Fix:** Adopt the circular icon style from the full page for both locations — it is more polished and visually consistent.

---

### UI-024 — Pricing cards on mobile have no visual separator when stacked

| Field | Detail |
|---|---|
| **Priority** | Low |
| **Page** | `/pricing` — mobile (390px) |
| **Device** | Mobile |

**Issue:** Free, Standard, and Premium cards stack vertically with only a small margin gap. The Standard card's elevated border/shadow is hard to distinguish when viewed stacked vs side-by-side.

**Fix:** Increase `gap-y` to `gap-y-8` between stacked cards. Give the Standard card a coloured left border `border-l-4 border-[#C8922A]` on mobile for clear differentiation.

---

### UI-025 — Footer column headings have insufficient contrast from link text

| Field | Detail |
|---|---|
| **Priority** | Low |
| **Page** | Footer — all pages |
| **Device** | All |

**Issue:** Footer column headings (MARKETPLACE, COMPANY, SUPPORT) are only marginally bolder than the links beneath them. The visual grouping is subtle, making it hard to scan quickly.

**Fix:** Apply `text-white font-bold text-sm tracking-wide` to headings vs `text-gray-400 text-sm` to links. Creates a clear 2-level hierarchy that speeds scanning.

---

## 📊 UI/UX Summary

| Priority | Count | Key Theme |
|---|---|---|
| 🔴 Critical | 4 | Mobile conversion, dead space, false affordance |
| 🟠 High | 7 | Trust contradictions, contrast, form usability |
| 🟡 Medium | 9 | Loading states, card consistency, mobile nav |
| 🟢 Low | 5 | Polish, micro-spacing, brand consistency |
| **Total** | **25** | |

---

## 🎯 Top 5 UI/UX Fixes for Maximum Impact

1. **UI-004** — Sticky enquiry CTA on mobile listing detail (biggest conversion impact)
2. **UI-011** — Fix the 5,000 vs 38,000 buyer count contradiction (immediate trust damage)
3. **UI-008** — Fix password field showing dots before typing (UX confusion at login)
4. **UI-006** — Make feature comparison table scrollable on mobile (currently unreadable)
5. **UI-014** — Make Enquire button full-width on listing cards (biggest engagement impact)
