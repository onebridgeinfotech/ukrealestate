# /fix-issue — Fix a Bug from the QA Report

Use this command when working on a bug from `QA_BUG_REPORT.md`.

## Process

1. Read the bug entry in `QA_BUG_REPORT.md` to understand the exact steps to reproduce, expected vs actual result, and suggested fix
2. Locate the relevant source file (see mapping below)
3. Implement the fix — minimal change, no scope creep
4. Run `npm run build` to confirm no TypeScript errors
5. Verify the fix matches the "Expected Result" from the bug report
6. Update `QA_BUG_REPORT.md` — add a "**Fixed:**" line with the date and commit ref under the bug entry

## Bug → File Mapping

| Bug | File |
|---|---|
| BUG-001 — Search keyword not passed in URL | `src/routes/index.tsx` (homepage search bar) |
| BUG-002 — Category/location links don't filter | `src/routes/index.tsx` (Browse by Category / Location sections) |
| BUG-003 — Listings page shows mock data | `src/routes/listings.index.tsx` |
| BUG-004 — Social links go to `#` | `src/components/site/Footer.tsx` |
| BUG-005 — Duplicate listing thumbnails | `src/lib/mock-data.ts` + `src/routes/listings.$id.tsx` |
| BUG-006 — Careers/Press show "IN PROGRESS" | `src/routes/careers.tsx`, `src/routes/press.tsx`, `src/components/site/Footer.tsx` |
| BUG-007 — Enquiry form native validation | `src/routes/listings.$id.tsx` |
| BUG-008 — Newsletter no feedback | `src/routes/index.tsx` (newsletter section) |
| BUG-009 — Contact form no confirmation | `src/routes/contact.tsx` |
| BUG-010 — "(demo data)" label visible | `src/routes/listings.index.tsx` |
| BUG-011 — Nav wraps at tablet | `src/components/site/Header.tsx` |
| BUG-012 — Breadcrumb truncates mid-word | `src/routes/listings.$id.tsx` |
| BUG-013 — Placeholder contact details | `src/components/site/Footer.tsx`, `src/routes/contact.tsx` |
| BUG-014 — Sell redirect no context message | `src/components/site/Header.tsx`, `src/routes/login.tsx` |
| BUG-015 — Header icon buttons do nothing logged out | `src/components/site/Header.tsx` |

## UI/UX Fix → File Mapping

| Issue | File |
|---|---|
| UI-001 — Search bar missing labels | `src/routes/index.tsx` |
| UI-002 — Hero dead space | `src/routes/index.tsx` |
| UI-003 — Inconsistent card image heights | `src/components/site/ListingCard.tsx` |
| UI-004 — No sticky CTA on mobile listing detail | `src/routes/listings.$id.tsx` |
| UI-006 — Pricing table not scrollable mobile | `src/routes/pricing.tsx` |
| UI-007 — Clear filters button weak | `src/routes/listings.index.tsx` |
| UI-008 — Password placeholder shows dots | `src/routes/login.tsx` |
| UI-011 — Hero buyer count contradiction | `src/routes/index.tsx` |
| UI-014 — Enquire button not full width | `src/components/site/ListingCard.tsx` |
| UI-016 — No skeleton loading | `src/routes/listings.index.tsx` |
| UI-018 — Mobile nav overlaps content | `src/routes/__root.tsx` or page layout wrapper |
| UI-020 — Map embed empty grey box | `src/routes/contact.tsx` |

## Fix Template

```tsx
// Before
// [paste original code]

// After — fixes BUG-XXX: [description]
// [paste fixed code]
```
