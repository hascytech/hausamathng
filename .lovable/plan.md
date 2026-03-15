

# Fix: App crashes due to missing Supabase configuration

## Problem
The app shows a blank page because `createClient()` in `src/integrations/supabase/client.ts` throws `"supabaseUrl is required"` when `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables are not set.

## Solution
Two changes needed:

### 1. Make Supabase client handle missing env vars gracefully
In `src/integrations/supabase/client.ts`, only create the client if URL and key are present. Export a nullable client or a mock that won't crash.

### 2. Guard all Supabase usage
Update `useAuth.tsx` and any page that calls `supabase.from(...)` or `supabase.auth.*` to check if supabase is available first. When Supabase is not configured, the app should still render with auth features disabled (user always `null`, leaderboard shows mock data, scores don't save).

### Files to modify
- **`src/integrations/supabase/client.ts`** — Conditionally create client; export `null` if env vars missing
- **`src/hooks/useAuth.tsx`** — Guard auth calls; if no supabase, set user to null immediately
- **`src/pages/Lesson.tsx`** — Guard score saving
- **`src/pages/Leaderboard.tsx`** — Fall back to mock data from `leaderboardData` when supabase unavailable

This will let the app render and be fully usable with mock data until Supabase is connected.

