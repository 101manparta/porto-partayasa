# PARTA — Personal Engineering Portfolio Platform

Production-ready, database-connected personal engineering portfolio and architecture platform for **I Nyoman Parta Yasa**, Backend Engineer based in Bali, Indonesia.

Specializing in **Backend Development**, **System Architecture**, **API Engineering**, **Database Design**, and **AI Engineering**.

---

## 1. System Overview & Architecture

The platform is designed around two independent, cleanly separated user experiences:

1. **Public Portfolio** (`/`, `/projects`, `/engineering`, `/achievements`, `/certifications`, `/about`, `/contact`):
   - Crafted with an **Apple-inspired Liquid Glass** monochromatic visual language.
   - Fast, interactive showcase highlighting production backend systems, database topologies, telemetry pipelines, and engineering case studies.
   - **Zero admin links or telemetry**: completely clean navigation with no public hints of the administrative console.

2. **Protected Admin Console** (`/admin` and `/admin/dashboard`):
   - Secure login screen at `/admin` using **Supabase Auth** (`supabase.auth.signInWithPassword()`).
   - Strict database-backed administrator authorization (`admin_users` table + `is_admin()` security definer function).
   - Protected dashboard with 9 management modules:
     - **Overview**: Real-time stats (published projects, media count, engineering diagrams, certifications) and a live activity feed.
     - **Profile**: Full bio, headline, statements, medical lab to software engineering journey, and social links (GitHub & LinkedIn).
     - **Projects**: Comprehensive CRUD, case studies, live demo/repo links, and dedicated screenshot manager with 6 presets.
     - **Project Media**: Multi-file drag-and-drop uploader, image previews, ordering, thumbnail assignment, and homepage marquee toggle.
     - **Engineering Documentation**: Architecture diagrams (PNG, JPG, WEBP) and technical whitepapers (PDF) across 9 engineering domains.
     - **Skills & Experience**: Categorized technology taxonomy (Languages, Frameworks, Databases, Cloud & DevOps, Message Queues).
     - **Certificates**: Unified management of verified professional certifications and academic/engineering honors.
     - **Supabase Storage**: Real-time diagnostics for all 5 storage buckets with integrated live test uploader.
     - **Account Settings**: Authenticated session card, live Supabase credentials verification, SQL migration runner, and inbound inquiries inbox.
     - **Logout**: Revokes session tokens and returns to `/admin`.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion (Framer Motion), Lucide Icons.
- **Backend-as-a-Service**: Supabase.
  - **Database**: PostgreSQL with Row Level Security (RLS) and custom PL/pgSQL security definer functions.
  - **Authentication**: Supabase Auth (Email + Password with JWT and secure session storage).
  - **Storage**: 5 dedicated buckets with role-checked upload/delete policies.
- **Deployment**: Vercel (Frontend SPA with `vercel.json` rewrites) & GitHub (Source Control).

---

## 3. Storage Buckets Topology

The application relies on 5 dedicated public Supabase Storage buckets:

1. `project-images` — Project screenshots, architecture schematics, and homepage marquee assets.
2. `engineering-documents` — System architecture diagrams and technical PDF whitepapers.
3. `achievement-certificates` — Competition, hackathon, and honors credential proofs.
4. `certification-files` — Verified professional certifications (e.g., AWS, GCP, Oracle, CNCF).
5. `profile-assets` — Profile photography, medical laboratory background assets, and author avatars.

---

## 4. Environment Variables

Create a `.env` or `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key

# (Optional backward-compatibility alias for Next.js tools)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

> **Security Note:** Never commit your `.env` or `.env.local` file. Only the public anon key is exposed on the frontend; Row Level Security (RLS) protects all database operations.

---

## 5. Supabase Database & Auth Setup

### Step 1: Run the Database Migration
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project and navigate to the **SQL Editor**.
3. Copy the complete SQL script from `/src/lib/sqlMigration.ts` (or from the **Account Settings > Supabase Engine** tab in the admin console).
4. Run the query. This creates:
   - Tables: `profile`, `projects`, `project_media`, `engineering_docs`, `achievements`, `certifications`, `technologies`, `contact_messages`, `articles`, `admin_users`.
   - Security Definer Function: `is_admin()` checking the `admin_users` table.
   - Row Level Security (RLS) policies: `SELECT` for public, `INSERT`/`UPDATE`/`DELETE` strictly restricted to `is_admin()`.
   - Automatic bucket creation for all 5 storage buckets.

### Step 2: Create the Admin User
1. In the Supabase Dashboard, go to **Authentication > Users**.
2. Click **Add User** -> **Create User**.
3. Enter the administrator email: `nvidiaparta@gmail.com` (or your preferred admin email) and a strong password.
4. Copy the generated `User UID`.
5. Return to the **SQL Editor** and execute:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('YOUR_USER_UID', 'nvidiaparta@gmail.com', 'admin')
   ON CONFLICT (email) DO UPDATE SET role = 'admin', user_id = EXCLUDED.user_id;
   ```
6. Now you can sign in via `/admin` with this email and password.

---

## 6. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server on port 3000
npm run dev

# 3. Open in browser
# Public portfolio: http://localhost:3000
# Admin login:     http://localhost:3000/admin
```

---

## 7. Production Build & Verification

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Deployment Guide

### A. GitHub Setup
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "feat: production-ready Parta Engineering Portfolio with Supabase Auth"
   ```
2. Link your remote repository and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/101manparta/portfolio-platform.git
   git push -u origin main
   ```

### B. Vercel Deployment
1. Go to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import the GitHub repository.
3. In **Build and Output Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-public-key`
5. Click **Deploy**.
6. **SPA Routing**: The included `vercel.json` automatically rewrites all incoming routes (`/admin`, `/admin/dashboard`, `/projects/*`, etc.) to `/index.html` with security headers, preventing any 404 errors on direct navigation or page refresh.
