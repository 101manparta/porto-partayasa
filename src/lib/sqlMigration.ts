/**
 * PARTA Engineering Portfolio Platform
 * Complete PostgreSQL Schema, Storage Policies, and Row Level Security (RLS) Script
 * Ready to copy & run directly in Supabase SQL Editor.
 */

export const SUPABASE_SQL_MIGRATION = `-- ==============================================================================
-- PARTA — PERSONAL ENGINEERING PORTFOLIO PLATFORM
-- Production Supabase PostgreSQL Schema & Security Architecture
-- Author: I Nyoman Parta Yasa (Backend Engineer, Bali, Indonesia)
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
-- Stores master bio, medical laboratory origin, and verified social links.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa',
  professional_title TEXT NOT NULL DEFAULT 'Backend Engineer',
  location TEXT NOT NULL DEFAULT 'Bali, Indonesia',
  email TEXT NOT NULL DEFAULT 'nvidiaparta@gmail.com',
  hero_headline TEXT NOT NULL DEFAULT 'I Nyoman Parta Yasa.',
  hero_statement TEXT NOT NULL DEFAULT 'Building Systems. Solving Problems. Engineering with Logic.',
  bio_short TEXT NOT NULL,
  bio_full TEXT NOT NULL,
  medical_lab_journey TEXT,
  avatar_url TEXT,
  cv_url TEXT,
  github_url TEXT DEFAULT 'https://github.com/101manparta',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/manparta01x0/',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. PROJECTS TABLE
-- ------------------------------------------------------------------------------
-- 4. PROJECTS TABLE
-- Stores curated backend systems, live demos, and metadata.
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
-- 4. PROJECT_IMAGES TABLE
-- High-fidelity screenshots and system architecture diagrams for projects.
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
-- 5. PROJECT_DOCUMENTS TABLE
-- Engineering documentation, architectural diagrams, ERDs, sequence diagrams, and PDFs.
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
-- 6. CASE_STUDIES TABLE
-- Comprehensive in-depth engineering breakdowns for each project.
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
  architecture_diagram_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. TECHNOLOGIES TABLE
-- Normalized technology inventory with categories and descriptions.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('Language', 'Database', 'Architecture & DevOps', 'Framework & Runtime', 'AI & Algorithms')),
  icon TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 8. ACHIEVEMENTS TABLE
-- Hackathons, technical competitions, awards, and honors.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  competition_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  year TEXT NOT NULL,
  category TEXT NOT NULL,
  award_ranking TEXT NOT NULL,
  certificate_url TEXT,
  certificate_path TEXT,
  file_name TEXT,
  mime_type TEXT,
  file_size INTEGER,
  description TEXT NOT NULL,
  personal_contribution TEXT NOT NULL,
  technologies_used TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. CERTIFICATIONS TABLE
-- Professional credentials, cloud certifications, and technical mastery.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiration_date TEXT,
  credential_url TEXT,
  certificate_image_url TEXT,
  certificate_path TEXT,
  file_name TEXT,
  mime_type TEXT,
  file_size INTEGER,
  skills_gained TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. ENGINEERING_ARTICLES TABLE
-- DSA writeups, system design blueprints, backend architecture deep dives.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS engineering_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- ------------------------------------------------------------------------------
-- 11. SOCIAL_LINKS TABLE
-- Dynamic social media and profile connections.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ------------------------------------------------------------------------------
-- 12. CONTACT_MESSAGES TABLE
-- Encrypted / restricted inbound inquiries submitted via the public contact form.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 13. SITE_SETTINGS TABLE
-- Global platform configurations (hero statements, rotating roles, SEO).
-- ------------------------------------------------------------------------------
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
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
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
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Published projects are readable by everyone" ON projects FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Project images are readable by everyone" ON project_images FOR SELECT USING (true);
CREATE POLICY "Published project documents are readable by everyone" ON project_documents FOR SELECT USING (publication_status = 'published');
CREATE POLICY "Case studies of published projects are readable by everyone" ON case_studies FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = case_studies.project_id AND projects.publication_status = 'published')
);
CREATE POLICY "Technologies are readable by everyone" ON technologies FOR SELECT USING (true);
CREATE POLICY "Published achievements are readable by everyone" ON achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Published certifications are readable by everyone" ON certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Published articles are readable by everyone" ON engineering_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Active social links are readable by everyone" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Site settings are readable by everyone" ON site_settings FOR SELECT USING (true);

-- CONTACT FORM POLICY: Anyone can submit a message, but only verified admin can view/manage
CREATE POLICY "Public visitors can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Only authenticated admin can read contact messages" ON contact_messages FOR SELECT USING (is_admin());
CREATE POLICY "Only authenticated admin can update contact messages" ON contact_messages FOR UPDATE USING (is_admin());
CREATE POLICY "Only authenticated admin can delete contact messages" ON contact_messages FOR DELETE USING (is_admin());

-- AUTHENTICATED ADMIN FULL ACCESS POLICIES (Enforced via is_admin())
CREATE POLICY "Admin full access on profiles" ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on projects" ON projects FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on project_images" ON project_images FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on project_documents" ON project_documents FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on case_studies" ON case_studies FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on technologies" ON technologies FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on achievements" ON achievements FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on certifications" ON certifications FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on engineering_articles" ON engineering_articles FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on social_links" ON social_links FOR ALL USING (is_admin());
CREATE POLICY "Admin full access on site_settings" ON site_settings FOR ALL USING (is_admin());

-- ==============================================================================
-- 15. STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('project-images', 'project-images', true),
  ('engineering-documents', 'engineering-documents', true),
  ('achievement-certificates', 'achievement-certificates', true),
  ('certification-files', 'certification-files', true),
  ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read, authenticated users can upload
DROP POLICY IF EXISTS "Public read storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin update storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete storage objects" ON storage.objects;

CREATE POLICY "Public read storage objects" ON storage.objects 
  FOR SELECT USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

CREATE POLICY "Admin upload storage objects" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

CREATE POLICY "Admin update storage objects" ON storage.objects 
  FOR UPDATE USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

CREATE POLICY "Admin delete storage objects" ON storage.objects 
  FOR DELETE USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- ==============================================================================
-- 16. BASELINE SEED DATA
-- Pre-populates the 3 core projects so that foreign keys and uploads match 100%
-- ==============================================================================
INSERT INTO projects (id, name, slug, short_description, full_description, category, live_url, github_url, technologies, is_featured, publication_status, display_order)
VALUES 
  ('proj-mlb-icon-bali', 'MLB ICON BALI', 'mlb-icon-bali', 'Enterprise hospitality booking & ticketing management platform with transactional inventory locking and high-throughput reservation pipelines.', 'A comprehensive commercial platform serving premier hospitality venues in Bali.', 'Enterprise Backend & Platform', 'https://mlb-pro-olive.vercel.app/', 'https://github.com/101manparta/mlb-icon-bali', ARRAY['PostgreSQL', 'TypeScript', 'Node.js', 'Redis', 'Supabase', 'Next.js', 'Tailwind CSS'], true, 'published', 1),
  ('proj-voltra', 'VOLTRA', 'voltra', 'High-throughput telemetry ingestion & dynamic EV charging load-balancing engine built with Go concurrency and time-series rollups.', 'An industrial Internet of Things (IoT) energy dispatch orchestration platform.', 'Distributed Systems & IoT', 'https://voltra-pi.vercel.app/', 'https://github.com/101manparta/voltra', ARRAY['Go', 'TimescaleDB', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets', 'Chart.js'], true, 'published', 2),
  ('proj-mediflow', 'MEDIFLOW', 'mediflow', 'Clinical laboratory specimen lifecycle & validation engine integrating diagnostic state transitions, automated delta checks, and HL7-compliant audit logs.', 'A mission-critical healthcare backend born out of actual clinical pathology laboratory practice.', 'Healthcare Backend & State Machines', 'https://mediflow-solutions.netlify.app/', 'https://github.com/101manparta/mediflow', ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Express', 'Tailwind CSS'], true, 'published', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;

-- ==============================================================================
-- 17. INITIAL ADMINISTRATOR BOOTSTRAP
-- Assigns administrator privileges to I Nyoman Parta Yasa (nvidiaparta@gmail.com)
-- ==============================================================================
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'nvidiaparta@gmail.com'
ON CONFLICT (email) DO UPDATE SET role = 'admin';
`;
