# Smart Bookmark App - Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Supabase Setup
- [x] Supabase project created
- [x] `bookmarks` table created with columns:
  - `id` (uuid, primary key)
  - `title` (text)
  - `url` (text)
  - `user_id` (uuid, references auth.users)
  - `created_at` (timestamp)
- [x] Row Level Security (RLS) enabled
- [x] RLS policies created:
  ```sql
  -- SELECT policy
  CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

  -- INSERT policy
  CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

  -- DELETE policy
  CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);
  ```
- [x] Realtime enabled:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
  ```
- [x] Google OAuth configured in Supabase Authentication settings

### 2. Environment Variables
Required variables (add to Vercel):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Code Quality
- [x] TypeScript errors fixed
- [x] Build successful (`npm run build`)
- [x] All dependencies installed
- [x] Middleware configured
- [x] Authentication flow working
- [x] Real-time sync working

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Option 3: GitHub Integration
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-deploy on every push

## 🔧 Post-Deployment

### Update Supabase OAuth Redirect URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

### Test Deployment
- [ ] Login with Google works
- [ ] Add bookmark works
- [ ] Delete bookmark works
- [ ] Real-time sync works across tabs
- [ ] Logout works

## 📦 Features
✅ Google OAuth Authentication
✅ Real-time bookmark sync
✅ CRUD operations (Create, Read, Delete)
✅ Responsive design
✅ Modern animated UI
✅ Row-level security
✅ Production-ready

## 🛠️ Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Supabase (Auth + Database + Realtime)
- Tailwind CSS
- Vercel (Hosting)

## 📝 Notes
- The app uses Next.js middleware for route protection
- Real-time updates require Supabase Realtime to be enabled
- Environment variables must be prefixed with `NEXT_PUBLIC_` for client-side access
