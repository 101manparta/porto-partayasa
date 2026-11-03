/**
 * PARTA Engineering Portfolio Platform
 * Core Data Models & TypeScript Types matching Supabase PostgreSQL Schema
 */

export type PublicationStatus = 'published' | 'draft';
export type ImageType = 'screenshot' | 'architecture_diagram';
export type TechCategory = 'Language' | 'Database' | 'Architecture & DevOps' | 'Framework & Runtime' | 'AI & Algorithms';
export type ArticleTopic = 'DSA' | 'System Architecture' | 'Database Engineering' | 'Backend API' | 'AI Engineering';

export type DocumentCategory =
  | 'System Architecture'
  | 'Database ERD'
  | 'API Documentation'
  | 'Data Flow'
  | 'Authentication Flow'
  | 'Sequence Diagram'
  | 'DSA Explanation'
  | 'Performance Analysis'
  | 'Technical Decisions';

export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  location: string;
  email: string;
  hero_headline: string;
  hero_statement: string;
  bio_short: string;
  bio_full: string;
  medical_lab_journey: string;
  avatar_url: string;
  cv_url: string;
  github_url: string;
  linkedin_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  file_path?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  title?: string;
  caption: string;
  image_type: ImageType;
  display_order: number;
  is_showcase: boolean;
  created_at?: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string; // Associated project id or 'general'
  title: string;
  category: DocumentCategory;
  description: string;
  file_url: string;
  file_path?: string;
  file_name: string;
  mime_type: string; // 'application/pdf', 'image/png', 'image/jpeg', 'image/webp'
  file_size?: number;
  display_order: number;
  publication_status: PublicationStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  icon?: string;
  description?: string;
  display_order: number;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  live_url: string;
  github_url: string;
  thumbnail_url: string;
  image_url?: string;
  technologies: string[]; // List of technology names or tags
  is_featured: boolean;
  publication_status: PublicationStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Related relational items
  images?: ProjectImage[];
  documents?: ProjectDocument[];
  case_study?: CaseStudy;
}

export interface CaseStudy {
  id: string;
  project_id: string;
  overview: string;
  problem_statement: string;
  objectives: string;
  solution: string;
  system_architecture: string;
  tech_stack_analysis: string;
  frontend_architecture?: string;
  backend_architecture: string;
  database_design: string;
  database_relationships?: string;
  api_design: string;
  auth_and_authz: string;
  data_flow: string;
  dsa_and_complexity: string;
  time_complexity: string;
  space_complexity: string;
  engineering_decisions: string;
  why_technologies_chosen: string;
  alternative_solutions: string;
  challenges_and_solutions: string;
  lessons_learned: string;
  architecture_diagram_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  competition_name: string;
  organization: string;
  year: string;
  category: string;
  award_ranking: string;
  credential_url?: string;
  certificate_url?: string;
  certificate_path?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  description: string;
  personal_contribution: string;
  technologies_used: string[];
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_url?: string;
  certificate_url?: string;
  certificate_image_url?: string;
  certificate_path?: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
  skills_gained: string[];
  description: string;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface EngineeringArticle {
  id: string;
  title: string;
  slug: string;
  topic: ArticleTopic;
  summary: string;
  problem_statement: string;
  explanation: string;
  solution: string;
  code_examples: string;
  complexity_analysis: string;
  diagrams?: string;
  related_projects: string[];
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  hero_headline: string;
  hero_statement: string;
  rotating_roles: string[];
  seo_meta_title: string;
  seo_meta_description: string;
  updated_at: string;
}

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
  lastChecked?: string;
}
