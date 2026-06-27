# /review — Code Review Checklist

Run this before committing any significant feature or bug fix.

## Review Checklist

### React & Hooks
- [ ] All `useState` / `useEffect` / `useRef` calls appear BEFORE any conditional `return`
- [ ] No hooks inside loops, conditions, or nested functions
- [ ] `useEffect` dependencies array is correct and complete
- [ ] No memory leaks — object URLs created with `URL.createObjectURL()` are revoked with `URL.revokeObjectURL()`

### Auth & Security
- [ ] Protected routes have auth guard (`beforeLoad` redirect or `useEffect` + navigate)
- [ ] Admin routes check both `user` existence AND `profile.role === "admin"`
- [ ] No secrets or API keys in `VITE_` prefixed env vars
- [ ] User input is not interpolated directly into SQL (Supabase parameterises automatically — still verify)

### Supabase
- [ ] All queries handle both `data` and `error` — never silently ignore errors
- [ ] `setSaving(false)` is called in both success AND error paths
- [ ] `select()` only fetches columns that are actually used (no `select("*")` on large tables)
- [ ] Inserts/updates have correct column names matching `database.types.ts`

### UI / UX
- [ ] Loading states shown for all async operations (disabled button, spinner, or skeleton)
- [ ] Success and error feedback via `toast.success()` / `toast.error()` — not `alert()`
- [ ] Empty states handled (no blank content areas)
- [ ] Mobile layout checked at 390px — no content hidden behind bottom nav
- [ ] Bottom nav overlap: content wrapper has `pb-20` on mobile

### Listing-Specific
- [ ] Listing status values are one of: `active`, `draft`, `under_offer`, `sold`
- [ ] `listing_type` values are: `sale` or `rent`
- [ ] Price is stored as a number (not string) in Supabase
- [ ] Images stored as `string[]` array of Cloudinary URLs

### Performance
- [ ] No unnecessary re-renders from missing `useCallback` / `useMemo`
- [ ] Large lists use `.limit()` in Supabase queries (never unbounded)
- [ ] Images use Cloudinary transformation URLs where possible (e.g. `w_800,q_auto`)

### Build
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No `console.log` or debug statements left in production code
- [ ] No unused imports

## Files Most Likely to Need Review

- `src/routes/admin.tsx` — largest file, most logic
- `src/routes/post.tsx` — multi-step wizard with image upload
- `src/routes/dashboard.seller.tsx` / `dashboard.agent.tsx` — complex state, auth guards
- `src/routes/listings.index.tsx` — filter logic and Supabase query
- `src/lib/cloudinary.ts` — image upload with fallback
