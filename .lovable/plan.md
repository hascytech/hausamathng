

# Transfer Hausa Math Masters Code to This Project

## Project Overview

Your existing GitHub repository is a **Hausa Math** educational platform -- a math learning app for Hausa-speaking students with video lessons, quizzes, leaderboard, authentication, and PWA support. It was originally built in another Lovable project with Supabase integration.

## Files to Transfer

### New dependencies to add to `package.json`
- `@supabase/supabase-js` -- Supabase client
- `framer-motion` -- animations
- `vite-plugin-pwa` -- PWA offline support

### Configuration files to update
- **`vite.config.ts`** -- Add PWA plugin with manifest config
- **`tailwind.config.ts`** -- Add custom fonts (Manrope, Noto Sans), success/gold colors, fade-in-up animation
- **`src/index.css`** -- Replace with Hausa Math theme (green/gold color scheme, custom font imports)
- **`index.html`** -- Update title/meta for "Hausa Math"

### New source files to create (17 files)
**Pages (9):**
- `src/pages/Index.tsx` -- Landing page with hero, stats, testimonials, class links
- `src/pages/Classes.tsx` -- Class selection (SS1/SS2/SS3) and topic listing
- `src/pages/Lesson.tsx` -- Video player + quiz with score saving to Supabase
- `src/pages/Leaderboard.tsx` -- Student rankings from Supabase view
- `src/pages/Dashboard.tsx` -- User progress stats
- `src/pages/Login.tsx` -- Auth (login/signup) with Supabase
- `src/pages/Admin.tsx` -- Admin panel for topic management
- `src/pages/Install.tsx` -- PWA installation instructions
- `src/pages/About.tsx` -- About page with mission/values

**Components (4):**
- `src/components/Navbar.tsx` -- Navigation with auth-aware links
- `src/components/VideoPlayer.tsx` -- YouTube/TikTok embed player
- `src/components/QuizCard.tsx` -- Quiz question card with step-by-step solutions
- `src/components/LeaderboardTable.tsx` -- Leaderboard display table

**Data & Hooks (2):**
- `src/lib/data.ts` -- Topics, quiz questions, class levels, helper functions
- `src/hooks/useAuth.tsx` -- Auth context provider using Supabase

**Supabase integration (2):**
- `src/integrations/supabase/client.ts` -- Supabase client setup
- `src/integrations/supabase/types.ts` -- Database type definitions

### Files to update
- **`src/App.tsx`** -- Add AuthProvider, all routes (/, /classes, /lesson, /leaderboard, etc.)

### Supabase migrations (3 files)
- Profile, user_roles, scores tables, leaderboard view, auto-profile trigger

### Assets (binary files -- cannot be transferred)
- `src/assets/student-1.png` through `student-4.png`, `hero-illustration.png`
- `public/icons/icon-192.png`, `icon-512.png`

These image files cannot be read from GitHub as raw content. After the code transfer, you will need to upload these images manually or we can use placeholder images.

## Important Notes

1. **Supabase Connection**: The original project uses an external Supabase project. You will need to either connect this Lovable project to the same Supabase instance (by setting `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` environment variables) or set up Lovable Cloud with equivalent tables.

2. **Image Assets**: The 5 PNG image assets (student photos, hero illustration, PWA icons) are binary files that cannot be fetched as code. The Index page imports them directly. I will use placeholder references that you can replace later by uploading the actual images.

3. **PWA Support**: The `vite-plugin-pwa` dependency adds offline support with a service worker. This works in the original project but may need testing in this environment.

## Implementation Order

1. Update `package.json` with new dependencies
2. Update config files (vite, tailwind, index.css, index.html)
3. Create Supabase integration files (client, types)
4. Create data and auth files
5. Create components (Navbar, VideoPlayer, QuizCard, LeaderboardTable)
6. Create all page files
7. Update App.tsx with routes and AuthProvider
8. Add Supabase migration files

This will be done across multiple implementation steps due to the volume of files.

