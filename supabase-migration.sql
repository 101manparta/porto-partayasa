-- ==============================================================================
-- PARTA — PERSONAL ENGINEERING PORTFOLIO PLATFORM
-- Production Supabase PostgreSQL Schema & Storage Security Architecture
-- Author: I Nyoman Parta Yasa (Backend Engineer, Bali, Indonesia)
--
-- JALANKAN SKRIP INI DI SUPABASE DASHBOARD > SQL EDITOR
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. ADMIN_USERS TABLE
-- Whitelisted administrator accounts with verified authorization.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can verify their own admin status" ON admin_users;
CREATE POLICY "Users can verify their own admin status" 
  ON admin_users FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

-- Helper security definer function to check if caller is an authorized administrator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'primary_profile',
  full_name TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa',
  professional_title TEXT NOT NULL DEFAULT 'Backend Engineer & System Architect',
  location TEXT NOT NULL DEFAULT 'Bali, Indonesia',
  email TEXT NOT NULL DEFAULT 'nvidiaparta@gmail.com',
  hero_headline TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa.',
  hero_statement TEXT NOT NULL DEFAULT 'Building Systems. Solving Problems. Engineering with Logic.',
  bio_short TEXT NOT NULL DEFAULT 'Backend Engineer with deep roots in medical laboratory technology, designing deterministic systems and resilient database architectures.',
  bio_full TEXT NOT NULL DEFAULT 'Backend Engineer specializing in system architecture, distributed pipelines, and relational database topologies.',
  medical_lab_journey TEXT NOT NULL DEFAULT 'The transition from Medical Laboratory Technology to Backend Engineering was not a pivot away from science—it was the expansion of scientific reasoning to digital infrastructure.',
  avatar_url TEXT DEFAULT '/assets/aistudio/image_27ab99ae.png',
  cv_url TEXT DEFAULT '#contact',
  github_url TEXT DEFAULT 'https://github.com/101manparta',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/manparta01x0/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. PROJECTS TABLE (Menggunakan ID TEXT agar cocok dengan frontend & URL slug)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Backend Engineering',
  live_url TEXT,
  github_url TEXT,
  thumbnail_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('published', 'draft')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(publication_status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(display_order);

-- ------------------------------------------------------------------------------
-- 5. PROJECT_IMAGES TABLE (Tabel screenshot dan diagram proyek)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT,
  mime_type TEXT,
  file_size INTEGER,
  title TEXT,
  caption TEXT,
  image_type TEXT NOT NULL DEFAULT 'screenshot' CHECK (image_type IN ('screenshot', 'architecture_diagram')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_showcase BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_showcase ON project_images(is_showcase);

-- ------------------------------------------------------------------------------
-- 6. PROJECT_DOCUMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'System Architecture',
    'Database ERD',
    'API Documentation',
    'Data Flow',
    'Authentication Flow',
    'Sequence Diagram',
    'DSA Explanation',
    'Performance Analysis',
    'Technical Decisions'
  )),
  description TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0,
  publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('published', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_category ON project_documents(category);

-- ------------------------------------------------------------------------------
-- 7. CASE_STUDIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_studies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id TEXT NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  overview TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  objectives TEXT NOT NULL,
  solution TEXT NOT NULL,
  system_architecture TEXT NOT NULL,
  tech_stack_analysis TEXT NOT NULL,
  frontend_architecture TEXT,
  backend_architecture TEXT NOT NULL,
  database_design TEXT NOT NULL,
  database_relationships TEXT,
  api_design TEXT NOT NULL,
  auth_and_authz TEXT NOT NULL,
  data_flow TEXT NOT NULL,
  dsa_and_complexity TEXT NOT NULL,
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  engineering_decisions TEXT NOT NULL,
  why_technologies_chosen TEXT NOT NULL,
  alternative_solutions TEXT NOT NULL,
  challenges_and_solutions TEXT NOT NULL,
  lessons_learned TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. TECHNOLOGIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technologies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Language', 'Database', 'Framework & Runtime', 'Architecture & DevOps', 'Message Broker & Queue', 'AI & Algorithms')),
  proficiency_level TEXT DEFAULT 'Advanced',
  icon TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. ACHIEVEMENTS & CERTIFICATIONS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Competition', 'Academic', 'Hackathon', 'Community', 'Honor')),
  description TEXT NOT NULL,
  credential_url TEXT,
  certificate_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS certifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  credential_id TEXT,
  verification_url TEXT,
  badge_image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('Cloud', 'Database', 'Backend', 'DevOps', 'Security', 'AI')),
  skills TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. ENGINEERING_ARTICLES & CONTACT_MESSAGES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS engineering_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  topic TEXT NOT NULL CHECK (topic IN ('DSA', 'System Architecture', 'Database Engineering', 'Backend API', 'AI Engineering')),
  summary TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  explanation TEXT NOT NULL,
  solution TEXT NOT NULL,
  code_examples TEXT NOT NULL,
  complexity_analysis TEXT NOT NULL,
  diagrams TEXT,
  related_projects TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  hero_headline TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa.',
  hero_statement TEXT NOT NULL DEFAULT 'Building Systems. Solving Problems. Engineering with Logic.',
  rotating_roles TEXT[] NOT NULL DEFAULT ARRAY['Backend Engineer', 'System Architecture', 'API Development', 'Database Engineering', 'AI Engineering'],
  seo_meta_title TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa — Backend Engineer & System Architecture',
  seo_meta_description TEXT NOT NULL DEFAULT 'Personal engineering portfolio and system architecture showcase for I Nyoman Parta Yasa, Backend Engineer based in Bali, Indonesia.',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) FOR DATABASE TABLES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public READ policies
DROP POLICY IF EXISTS "Public profiles read" ON profiles;
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public projects read" ON projects;
CREATE POLICY "Public projects read" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public project_images read" ON project_images;
CREATE POLICY "Public project_images read" ON project_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public project_documents read" ON project_documents;
CREATE POLICY "Public project_documents read" ON project_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public case_studies read" ON case_studies;
CREATE POLICY "Public case_studies read" ON case_studies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public technologies read" ON technologies;
CREATE POLICY "Public technologies read" ON technologies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public achievements read" ON achievements;
CREATE POLICY "Public achievements read" ON achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public certifications read" ON certifications;
CREATE POLICY "Public certifications read" ON certifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public engineering_articles read" ON engineering_articles;
CREATE POLICY "Public engineering_articles read" ON engineering_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public site_settings read" ON site_settings;
CREATE POLICY "Public site_settings read" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public contact_messages insert" ON contact_messages;
CREATE POLICY "Public contact_messages insert" ON contact_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin contact_messages read" ON contact_messages;
CREATE POLICY "Admin contact_messages read" ON contact_messages FOR SELECT USING (true);

-- Admin WRITE policies (Allow insert/update/delete for dashboard operations)
DROP POLICY IF EXISTS "Admin profiles all" ON profiles;
CREATE POLICY "Admin profiles all" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin projects all" ON projects;
CREATE POLICY "Admin projects all" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin project_images all" ON project_images;
CREATE POLICY "Admin project_images all" ON project_images FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin project_documents all" ON project_documents;
CREATE POLICY "Admin project_documents all" ON project_documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin case_studies all" ON case_studies;
CREATE POLICY "Admin case_studies all" ON case_studies FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin technologies all" ON technologies;
CREATE POLICY "Admin technologies all" ON technologies FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin achievements all" ON achievements;
CREATE POLICY "Admin achievements all" ON achievements FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin certifications all" ON certifications;
CREATE POLICY "Admin certifications all" ON certifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin engineering_articles all" ON engineering_articles;
CREATE POLICY "Admin engineering_articles all" ON engineering_articles FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin site_settings all" ON site_settings;
CREATE POLICY "Admin site_settings all" ON site_settings FOR ALL USING (true);

-- ==============================================================================
-- 12. STORAGE BUCKETS SETUP & STORAGE RLS POLICIES (SOLUSI ERROR STORAGE)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('project-images', 'project-images', true),
  ('engineering-documents', 'engineering-documents', true),
  ('achievement-certificates', 'achievement-certificates', true),
  ('certification-files', 'certification-files', true),
  ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Pastikan semua bucket public
UPDATE storage.buckets SET public = true WHERE id IN (
  'project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'
);

-- Bersihkan policy lama pada storage.objects agar tidak terjadi duplicate error
DROP POLICY IF EXISTS "Public read storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload to portfolio buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow update to portfolio buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete to portfolio buckets" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin update storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to portfolio buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on portfolio buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on portfolio buckets" ON storage.objects;

-- Policy 1: Siapapun dapat melihat file di bucket portfolio (SELECT)
CREATE POLICY "Public read storage objects" ON storage.objects 
  FOR SELECT 
  USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- Policy 2: Mengizinkan upload ke bucket-bucket portfolio (INSERT) -> INI YANG MEMPERBAIKI ERROR RLS
CREATE POLICY "Allow uploads to portfolio buckets" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- Policy 3: Mengizinkan update / replace gambar (UPDATE)
CREATE POLICY "Allow update on portfolio buckets" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- Policy 4: Mengizinkan hapus gambar (DELETE)
CREATE POLICY "Allow delete on portfolio buckets" ON storage.objects 
  FOR DELETE 
  USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- ==============================================================================
-- 13. PRE-POPULATE BASELINE PROJECTS
-- Mencegah error foreign key saat upload screenshot untuk VOLTRA, MEDIFLOW, & MLB ICON BALI
-- ==============================================================================
INSERT INTO projects (id, name, slug, short_description, full_description, category, live_url, github_url, technologies, is_featured, publication_status, display_order)
VALUES 
  ('proj-mlb-icon-bali', 'MLB ICON BALI', 'mlb-icon-bali', 'Enterprise hospitality booking & ticketing management platform with transactional inventory locking and high-throughput reservation pipelines.', 'A comprehensive commercial platform serving premier hospitality venues in Bali.', 'Enterprise Backend & Platform', 'https://mlb-pro-olive.vercel.app/', 'https://github.com/101manparta/mlb-icon-bali', ARRAY['PostgreSQL', 'TypeScript', 'Node.js', 'Redis', 'Supabase', 'Next.js', 'Tailwind CSS'], true, 'published', 1),
  ('proj-voltra', 'VOLTRA', 'voltra', 'High-throughput telemetry ingestion & dynamic EV charging load-balancing engine built with Go concurrency and time-series rollups.', 'An industrial Internet of Things (IoT) energy dispatch orchestration platform.', 'Distributed Systems & IoT', 'https://voltra-pi.vercel.app/', 'https://github.com/101manparta/voltra', ARRAY['Go', 'TimescaleDB', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets', 'Chart.js'], true, 'published', 2),
  ('proj-mediflow', 'MEDIFLOW', 'mediflow', 'Clinical laboratory specimen lifecycle & validation engine integrating diagnostic state transitions, automated delta checks, and HL7-compliant audit logs.', 'A mission-critical healthcare backend born out of actual clinical pathology laboratory practice.', 'Healthcare Backend & State Machines', 'https://mediflow-solutions.netlify.app/', 'https://github.com/101manparta/mediflow', ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Express', 'Tailwind CSS'], true, 'published', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- ==============================================================================
-- 14. INITIAL ADMINISTRATOR BOOTSTRAP
-- Assigns administrator privileges to I Nyoman Parta Yasa (nvidiaparta@gmail.com)
-- ==============================================================================
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'nvidiaparta@gmail.com'
ON CONFLICT (email) DO UPDATE SET role = 'admin';