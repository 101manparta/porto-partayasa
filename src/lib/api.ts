/**
 * PARTA Engineering Portfolio Platform
 * Unified Data Access Layer (Supabase PostgreSQL with Local Synchronized State)
 */

import { getSupabaseClient } from './supabase';
import {
  Profile,
  Project,
  ProjectImage,
  ProjectDocument,
  CaseStudy,
  Achievement,
  Certification,
  EngineeringArticle,
  Technology,
  ContactMessage,
  SiteSettings,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_DOCUMENTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_ARTICLES,
  INITIAL_TECHNOLOGIES,
  INITIAL_SITE_SETTINGS,
} from './initialData';

// Local storage backup keys for deterministic offline/immediate operational capability
const STORAGE_KEYS = {
  profile: 'parta_data_profile',
  projects: 'parta_data_projects',
  images: 'parta_data_images',
  documents: 'parta_data_documents',
  achievements: 'parta_data_achievements',
  certifications: 'parta_data_certifications',
  articles: 'parta_data_articles',
  technologies: 'parta_data_technologies',
  messages: 'parta_data_messages',
  settings: 'parta_data_settings',
};

// Initialize local cache if not present
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch {
    // ignore
  }
  return defaultValue;
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// -----------------------------------------------------------------------------
// PROFILE API
// -----------------------------------------------------------------------------
export async function getProfile(): Promise<Profile> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle();
      if (!error && data) {
        return data as Profile;
      }
    } catch (err) {
      console.warn('Supabase profile fetch error, fallback to cache:', err);
    }
  }

  const cached = getLocalItem<Profile>(STORAGE_KEYS.profile, INITIAL_PROFILE);
  if (!cached.github_url || cached.github_url.includes('nvidiaparta')) {
    cached.github_url = INITIAL_PROFILE.github_url;
    setLocalItem(STORAGE_KEYS.profile, cached);
  }
  if (!cached.linkedin_url || cached.linkedin_url.includes('nvidiaparta')) {
    cached.linkedin_url = INITIAL_PROFILE.linkedin_url;
    setLocalItem(STORAGE_KEYS.profile, cached);
  }
  return cached;
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const current = await getProfile();
  const merged: Profile = { ...current, ...updates, updated_at: new Date().toISOString() };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('profiles').upsert(merged);
      if (error) console.error('Supabase profile upsert error:', error);
    } catch (err) {
      console.error('Supabase profile update failed:', err);
    }
  }

  setLocalItem(STORAGE_KEYS.profile, merged);
  return merged;
}

// -----------------------------------------------------------------------------
// PROJECTS API
// -----------------------------------------------------------------------------
export async function getProjects(includeDrafts = false): Promise<Project[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('publication_status', 'published');
      }
      const { data: dbProjects, error: pErr } = await query;

      if (!pErr && dbProjects && dbProjects.length > 0) {
        // Fetch all project images directly from Supabase
        const { data: dbImages } = await supabase
          .from('project_images')
          .select('*')
          .order('display_order', { ascending: true });

        // Fetch all project documents directly from Supabase
        const { data: dbDocs } = await supabase
          .from('project_documents')
          .select('*')
          .order('display_order', { ascending: true });

        // Fetch case studies
        const { data: dbCaseStudies } = await supabase
          .from('case_studies')
          .select('*');

        const enriched = dbProjects.map((p) => {
          const projImgs = (dbImages || []).filter(
            (img) => img.project_id === p.id || img.project_id === `proj-${p.slug}`
          );
          const projDocs = (dbDocs || []).filter(
            (doc) => doc.project_id === p.id || doc.project_id === `proj-${p.slug}`
          );
          const cs = (dbCaseStudies || []).find(
            (c) => c.project_id === p.id || c.project_id === `proj-${p.slug}`
          );
          return {
            ...p,
            images: projImgs,
            documents: projDocs,
            case_study: cs,
          };
        });

        return enriched as Project[];
      }
    } catch (err) {
      console.warn('Supabase projects query failed, falling back to cached projects:', err);
    }
  }

  const localProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const allImages = await getProjectImages();
  const allDocs = await getProjectDocuments(undefined, includeDrafts);

  const enriched = localProjects.map((p) => {
    const projImages = allImages.filter((img) => img.project_id === p.id);
    const projDocs = allDocs.filter((doc) => doc.project_id === p.id);
    return {
      ...p,
      images: projImages.length > 0 ? projImages : p.images || [],
      documents: projDocs.length > 0 ? projDocs : p.documents || [],
    };
  });

  if (includeDrafts) {
    return enriched;
  }
  return enriched.filter((p) => p.publication_status === 'published');
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, images:project_images(*), documents:project_documents(*), case_study:case_studies(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as Project;
      }
    } catch (err) {
      console.warn('Supabase getProjectBySlug failed:', err);
    }
  }

  const localProjects = await getProjects(true);
  return localProjects.find((p) => p.slug === slug) || null;
}

export async function createProject(projectData: Partial<Project>): Promise<Project> {
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    name: projectData.name || 'Untitled Project',
    slug: projectData.slug || `project-${Date.now()}`,
    short_description: projectData.short_description || '',
    full_description: projectData.full_description || '',
    category: projectData.category || 'Backend Engineering',
    live_url: projectData.live_url || '',
    github_url: projectData.github_url || '',
    thumbnail_url: projectData.thumbnail_url || '',
    technologies: projectData.technologies || [],
    is_featured: projectData.is_featured ?? false,
    publication_status: projectData.publication_status || 'published',
    display_order: projectData.display_order ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: projectData.images || [],
    documents: projectData.documents || [],
    case_study: projectData.case_study,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').insert([{
        name: newProject.name,
        slug: newProject.slug,
        short_description: newProject.short_description,
        full_description: newProject.full_description,
        category: newProject.category,
        live_url: newProject.live_url,
        github_url: newProject.github_url,
        thumbnail_url: newProject.thumbnail_url,
        technologies: newProject.technologies,
        is_featured: newProject.is_featured,
        publication_status: newProject.publication_status,
        display_order: newProject.display_order,
      }]).select().single();

      if (!error && data) {
        newProject.id = data.id;
      }
    } catch (err) {
      console.error('Supabase project creation failed:', err);
    }
  }

  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  allProjects.push(newProject);
  setLocalItem(STORAGE_KEYS.projects, allProjects);

  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const index = allProjects.findIndex((p) => p.id === id);

  const updated: Project = {
    ...(index !== -1 ? allProjects[index] : ({} as Project)),
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (index !== -1) {
    allProjects[index] = updated;
    setLocalItem(STORAGE_KEYS.projects, allProjects);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { images: _images, documents: _documents, case_study: _caseStudy, ...dbFields } = updates;
      await supabase.from('projects').update(dbFields).eq('id', id);
    } catch (err) {
      console.error('Supabase project update failed:', err);
    }
  }

  return updated;
}

export async function deleteProject(id: string): Promise<boolean> {
  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const filtered = allProjects.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEYS.projects, filtered);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete project error:', err);
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// SUPABASE STORAGE UPLOAD & ASSET API
// -----------------------------------------------------------------------------
export type StorageBucket =
  | 'project-images'
  | 'engineering-documents'
  | 'achievement-certificates'
  | 'certification-files'
  | 'profile-assets';

export interface StorageUploadResult {
  publicUrl: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export async function uploadFileToStorage(
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<StorageUploadResult> {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(`File size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds 10MB limit.`);
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueKey = `${Date.now()}_${cleanName}`;
  const storagePath = folder ? `${folder}/${uniqueKey}` : uniqueKey;

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Supabase Storage upload error (${bucket}):`, error);
      throw new Error(
        `Upload ke Supabase Storage bucket "${bucket}" gagal: ${error.message}. Pastikan bucket "${bucket}" berstatus Public dan policy RLS mengizinkan upload.`
      );
    }

    if (data) {
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return {
        publicUrl: publicData.publicUrl,
        filePath: data.path,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      };
    }
  }

  // Offline / mock fallback only when Supabase is completely unconfigured
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        publicUrl: reader.result as string,
        filePath: storagePath,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file locally.'));
    reader.readAsDataURL(file);
  });
}

export async function deleteFileFromStorage(bucket: StorageBucket, filePath: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase && filePath) {
    try {
      await supabase.storage.from(bucket).remove([filePath]);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// PROJECT MEDIA & SCREENSHOTS API
// -----------------------------------------------------------------------------
export async function getProjectImages(projectId?: string, showcaseOnly = false): Promise<ProjectImage[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('project_images').select('*').order('display_order', { ascending: true });
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (showcaseOnly) {
        query = query.eq('is_showcase', true);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as ProjectImage[];
      }
    } catch (err) {
      console.warn('Supabase getProjectImages error:', err);
    }
  }

  const initialImages: ProjectImage[] = INITIAL_PROJECTS.flatMap((p) => p.images || []);
  const allImages = getLocalItem<ProjectImage[]>(STORAGE_KEYS.images, initialImages);
  let filtered = allImages;
  if (projectId) {
    filtered = filtered.filter((img) => img.project_id === projectId);
  }
  if (showcaseOnly) {
    filtered = filtered.filter((img) => img.is_showcase);
  }
  return filtered.sort((a, b) => a.display_order - b.display_order);
}

export async function createProjectImage(data: Partial<ProjectImage>): Promise<ProjectImage> {
  const newImg: ProjectImage = {
    id: `img-${Date.now()}`,
    project_id: data.project_id || '',
    image_url: data.image_url || '',
    file_path: data.file_path || '',
    file_name: data.file_name || 'untitled-image',
    mime_type: data.mime_type || 'image/png',
    file_size: data.file_size,
    title: data.title || '',
    caption: data.caption || '',
    image_type: data.image_type || 'screenshot',
    display_order: data.display_order ?? 0,
    is_showcase: data.is_showcase ?? true,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    // Check if the project exists in Supabase. If not, match by slug or ensure it exists
    let targetProjectId = newImg.project_id;
    const { data: matchedProj } = await supabase
      .from('projects')
      .select('id')
      .or(`id.eq.${newImg.project_id},slug.eq.${newImg.project_id.replace('proj-', '')}`)
      .limit(1)
      .maybeSingle();

    if (matchedProj) {
      targetProjectId = matchedProj.id;
    } else {
      // If projects table is empty, auto-seed the baseline project so foreign key never fails
      const baseline = INITIAL_PROJECTS.find(
        (p) => p.id === newImg.project_id || p.slug === newImg.project_id.replace('proj-', '')
      ) || INITIAL_PROJECTS[0];

      if (baseline) {
        const { data: createdProj, error: pCreateErr } = await supabase
          .from('projects')
          .upsert({
            id: baseline.id,
            name: baseline.name,
            slug: baseline.slug,
            short_description: baseline.short_description,
            full_description: baseline.full_description,
            category: baseline.category,
            live_url: baseline.live_url,
            github_url: baseline.github_url,
            technologies: baseline.technologies,
            is_featured: baseline.is_featured,
            publication_status: baseline.publication_status,
            display_order: baseline.display_order,
          })
          .select('id')
          .single();

        if (!pCreateErr && createdProj) {
          targetProjectId = createdProj.id;
        }
      }
    }

    newImg.project_id = targetProjectId;

    const { data: inserted, error } = await supabase
      .from('project_images')
      .insert([
        {
          project_id: targetProjectId,
          image_url: newImg.image_url,
          file_path: newImg.file_path,
          file_name: newImg.file_name,
          mime_type: newImg.mime_type,
          file_size: newImg.file_size,
          title: newImg.title,
          caption: newImg.caption,
          image_type: newImg.image_type,
          display_order: newImg.display_order,
          is_showcase: newImg.is_showcase,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase createProjectImage error:', error);
      throw new Error(`Gagal menyimpan gambar ke database Supabase: ${error.message}`);
    }

    if (inserted) {
      newImg.id = inserted.id;
      newImg.project_id = inserted.project_id;
    }
  }

  // Also update local cache
  const initialImages: ProjectImage[] = INITIAL_PROJECTS.flatMap((p) => p.images || []);
  const allImages = getLocalItem<ProjectImage[]>(STORAGE_KEYS.images, initialImages);
  allImages.push(newImg);
  setLocalItem(STORAGE_KEYS.images, allImages);

  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const pIdx = allProjects.findIndex((p) => p.id === newImg.project_id);
  if (pIdx !== -1) {
    if (!allProjects[pIdx].images) allProjects[pIdx].images = [];
    allProjects[pIdx].images!.push(newImg);
    setLocalItem(STORAGE_KEYS.projects, allProjects);
  }

  return newImg;
}

export async function updateProjectImage(id: string, updates: Partial<ProjectImage>): Promise<ProjectImage> {
  const initialImages: ProjectImage[] = INITIAL_PROJECTS.flatMap((p) => p.images || []);
  const allImages = getLocalItem<ProjectImage[]>(STORAGE_KEYS.images, initialImages);
  const idx = allImages.findIndex((img) => img.id === id);
  const updated = { ...(idx !== -1 ? allImages[idx] : ({} as ProjectImage)), ...updates };

  if (idx !== -1) {
    allImages[idx] = updated;
    setLocalItem(STORAGE_KEYS.images, allImages);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('project_images').update(updates).eq('id', id);
    } catch (err) {
      console.error('Supabase updateProjectImage error:', err);
    }
  }

  // Update in project
  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  for (const proj of allProjects) {
    if (proj.images) {
      const imIdx = proj.images.findIndex((im) => im.id === id);
      if (imIdx !== -1) {
        proj.images[imIdx] = updated;
        setLocalItem(STORAGE_KEYS.projects, allProjects);
        break;
      }
    }
  }

  return updated;
}

export async function deleteProjectImage(id: string): Promise<boolean> {
  const initialImages: ProjectImage[] = INITIAL_PROJECTS.flatMap((p) => p.images || []);
  const allImages = getLocalItem<ProjectImage[]>(STORAGE_KEYS.images, initialImages);
  const target = allImages.find((img) => img.id === id);
  setLocalItem(STORAGE_KEYS.images, allImages.filter((img) => img.id !== id));

  if (target?.file_path) {
    await deleteFileFromStorage('project-images', target.file_path);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('project_images').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteProjectImage error:', err);
    }
  }

  // Update in project
  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  for (const proj of allProjects) {
    if (proj.images) {
      proj.images = proj.images.filter((im) => im.id !== id);
    }
  }
  setLocalItem(STORAGE_KEYS.projects, allProjects);

  return true;
}

export async function reorderProjectImages(reordered: { id: string; display_order: number }[]): Promise<boolean> {
  const initialImages: ProjectImage[] = INITIAL_PROJECTS.flatMap((p) => p.images || []);
  const allImages = getLocalItem<ProjectImage[]>(STORAGE_KEYS.images, initialImages);

  for (const item of reordered) {
    const found = allImages.find((img) => img.id === item.id);
    if (found) {
      found.display_order = item.display_order;
    }
  }
  setLocalItem(STORAGE_KEYS.images, allImages);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      for (const item of reordered) {
        await supabase.from('project_images').update({ display_order: item.display_order }).eq('id', item.id);
      }
    } catch (err) {
      console.error('Supabase reorderProjectImages error:', err);
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// ENGINEERING DOCUMENTATION & DIAGRAMS API
// -----------------------------------------------------------------------------
export async function getProjectDocuments(projectId?: string, includeDrafts = false): Promise<ProjectDocument[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('project_documents').select('*').order('display_order', { ascending: true });
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      if (!includeDrafts) {
        query = query.eq('publication_status', 'published');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as ProjectDocument[];
      }
    } catch (err) {
      console.warn('Supabase getProjectDocuments error:', err);
    }
  }

  const allDocs = getLocalItem<ProjectDocument[]>(STORAGE_KEYS.documents, INITIAL_DOCUMENTS);
  let filtered = allDocs;
  if (projectId) {
    filtered = filtered.filter((d) => d.project_id === projectId);
  }
  if (!includeDrafts) {
    filtered = filtered.filter((d) => d.publication_status === 'published');
  }
  return filtered.sort((a, b) => a.display_order - b.display_order);
}

export async function createProjectDocument(data: Partial<ProjectDocument>): Promise<ProjectDocument> {
  const newDoc: ProjectDocument = {
    id: `doc-${Date.now()}`,
    project_id: data.project_id || '',
    title: data.title || 'Untitled Document',
    category: data.category || 'System Architecture',
    description: data.description || '',
    file_url: data.file_url || '',
    file_path: data.file_path || '',
    file_name: data.file_name || 'document.pdf',
    mime_type: data.mime_type || 'application/pdf',
    file_size: data.file_size,
    display_order: data.display_order ?? 0,
    publication_status: data.publication_status || 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase.from('project_documents').insert([{
        project_id: newDoc.project_id,
        title: newDoc.title,
        category: newDoc.category,
        description: newDoc.description,
        file_url: newDoc.file_url,
        file_path: newDoc.file_path,
        file_name: newDoc.file_name,
        mime_type: newDoc.mime_type,
        file_size: newDoc.file_size,
        display_order: newDoc.display_order,
        publication_status: newDoc.publication_status,
      }]).select().single();

      if (!error && inserted) {
        newDoc.id = inserted.id;
      }
    } catch (err) {
      console.error('Supabase createProjectDocument error:', err);
    }
  }

  const allDocs = getLocalItem<ProjectDocument[]>(STORAGE_KEYS.documents, INITIAL_DOCUMENTS);
  allDocs.push(newDoc);
  setLocalItem(STORAGE_KEYS.documents, allDocs);

  return newDoc;
}

export async function updateProjectDocument(id: string, updates: Partial<ProjectDocument>): Promise<ProjectDocument> {
  const allDocs = getLocalItem<ProjectDocument[]>(STORAGE_KEYS.documents, INITIAL_DOCUMENTS);
  const idx = allDocs.findIndex((d) => d.id === id);
  const updated = { ...(idx !== -1 ? allDocs[idx] : ({} as ProjectDocument)), ...updates, updated_at: new Date().toISOString() };

  if (idx !== -1) {
    allDocs[idx] = updated;
    setLocalItem(STORAGE_KEYS.documents, allDocs);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('project_documents').update(updates).eq('id', id);
    } catch (err) {
      console.error('Supabase updateProjectDocument error:', err);
    }
  }

  return updated;
}

export async function deleteProjectDocument(id: string): Promise<boolean> {
  const allDocs = getLocalItem<ProjectDocument[]>(STORAGE_KEYS.documents, INITIAL_DOCUMENTS);
  const target = allDocs.find((d) => d.id === id);
  setLocalItem(STORAGE_KEYS.documents, allDocs.filter((d) => d.id !== id));

  if (target?.file_path) {
    await deleteFileFromStorage('engineering-documents', target.file_path);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('project_documents').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteProjectDocument error:', err);
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// CASE STUDY API
// -----------------------------------------------------------------------------
export async function updateCaseStudy(caseStudyData: Partial<CaseStudy> & { project_id: string }): Promise<CaseStudy> {
  const allProjects = getLocalItem<Project[]>(STORAGE_KEYS.projects, INITIAL_PROJECTS);
  const projIndex = allProjects.findIndex((p) => p.id === caseStudyData.project_id);

  const newOrUpdatedCaseStudy: CaseStudy = {
    id: caseStudyData.id || `cs-${Date.now()}`,
    project_id: caseStudyData.project_id,
    overview: caseStudyData.overview || '',
    problem_statement: caseStudyData.problem_statement || '',
    objectives: caseStudyData.objectives || '',
    solution: caseStudyData.solution || '',
    system_architecture: caseStudyData.system_architecture || '',
    tech_stack_analysis: caseStudyData.tech_stack_analysis || '',
    frontend_architecture: caseStudyData.frontend_architecture || '',
    backend_architecture: caseStudyData.backend_architecture || '',
    database_design: caseStudyData.database_design || '',
    database_relationships: caseStudyData.database_relationships || '',
    api_design: caseStudyData.api_design || '',
    auth_and_authz: caseStudyData.auth_and_authz || '',
    data_flow: caseStudyData.data_flow || '',
    dsa_and_complexity: caseStudyData.dsa_and_complexity || '',
    time_complexity: caseStudyData.time_complexity || '',
    space_complexity: caseStudyData.space_complexity || '',
    engineering_decisions: caseStudyData.engineering_decisions || '',
    why_technologies_chosen: caseStudyData.why_technologies_chosen || '',
    alternative_solutions: caseStudyData.alternative_solutions || '',
    challenges_and_solutions: caseStudyData.challenges_and_solutions || '',
    lessons_learned: caseStudyData.lessons_learned || '',
    architecture_diagram_url: caseStudyData.architecture_diagram_url || '',
    updated_at: new Date().toISOString(),
  };

  if (projIndex !== -1) {
    allProjects[projIndex].case_study = newOrUpdatedCaseStudy;
    setLocalItem(STORAGE_KEYS.projects, allProjects);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('case_studies').upsert(newOrUpdatedCaseStudy);
    } catch (err) {
      console.error('Supabase case study upsert error:', err);
    }
  }

  return newOrUpdatedCaseStudy;
}

// -----------------------------------------------------------------------------
// ACHIEVEMENTS API
// -----------------------------------------------------------------------------
export async function getAchievements(includeDrafts = false): Promise<Achievement[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('achievements').select('*').order('display_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Achievement[];
      }
    } catch (err) {
      console.warn('Supabase achievements error, fallback to cache:', err);
    }
  }

  const local = getLocalItem<Achievement[]>(STORAGE_KEYS.achievements, INITIAL_ACHIEVEMENTS);
  if (includeDrafts) return local;
  return local.filter((a) => a.is_published);
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const newAch: Achievement = {
    id: `ach-${Date.now()}`,
    title: data.title || '',
    competition_name: data.competition_name || '',
    organization: data.organization || '',
    year: data.year || new Date().getFullYear().toString(),
    category: data.category || 'Engineering',
    award_ranking: data.award_ranking || '',
    certificate_url: data.certificate_url || '',
    description: data.description || '',
    personal_contribution: data.personal_contribution || '',
    technologies_used: data.technologies_used || [],
    is_published: data.is_published ?? true,
    display_order: data.display_order ?? 0,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('achievements').insert([newAch]);
    } catch (err) {
      console.error('Supabase create achievement error:', err);
    }
  }

  const all = getLocalItem<Achievement[]>(STORAGE_KEYS.achievements, INITIAL_ACHIEVEMENTS);
  all.push(newAch);
  setLocalItem(STORAGE_KEYS.achievements, all);
  return newAch;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
  const all = getLocalItem<Achievement[]>(STORAGE_KEYS.achievements, INITIAL_ACHIEVEMENTS);
  const idx = all.findIndex((a) => a.id === id);
  const updated = { ...(idx !== -1 ? all[idx] : ({} as Achievement)), ...updates };

  if (idx !== -1) {
    all[idx] = updated;
    setLocalItem(STORAGE_KEYS.achievements, all);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('achievements').update(updates).eq('id', id);
    } catch (err) {
      console.error('Supabase update achievement error:', err);
    }
  }

  return updated;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const all = getLocalItem<Achievement[]>(STORAGE_KEYS.achievements, INITIAL_ACHIEVEMENTS);
  setLocalItem(STORAGE_KEYS.achievements, all.filter((a) => a.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('achievements').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete achievement error:', err);
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// CERTIFICATIONS API
// -----------------------------------------------------------------------------
export async function getCertifications(includeDrafts = false): Promise<Certification[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('certifications').select('*').order('display_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Certification[];
      }
    } catch (err) {
      console.warn('Supabase certifications error:', err);
    }
  }

  const local = getLocalItem<Certification[]>(STORAGE_KEYS.certifications, INITIAL_CERTIFICATIONS);
  if (includeDrafts) return local;
  return local.filter((c) => c.is_published);
}

export async function createCertification(data: Partial<Certification>): Promise<Certification> {
  const newCert: Certification = {
    id: `cert-${Date.now()}`,
    title: data.title || '',
    issuing_organization: data.issuing_organization || '',
    issue_date: data.issue_date || new Date().getFullYear().toString(),
    expiration_date: data.expiration_date || 'Lifetime',
    credential_url: data.credential_url || '',
    certificate_image_url: data.certificate_image_url || '',
    skills_gained: data.skills_gained || [],
    description: data.description || '',
    is_published: data.is_published ?? true,
    display_order: data.display_order ?? 0,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('certifications').insert([newCert]);
    } catch (err) {
      console.error('Supabase create cert error:', err);
    }
  }

  const all = getLocalItem<Certification[]>(STORAGE_KEYS.certifications, INITIAL_CERTIFICATIONS);
  all.push(newCert);
  setLocalItem(STORAGE_KEYS.certifications, all);
  return newCert;
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
  const all = getLocalItem<Certification[]>(STORAGE_KEYS.certifications, INITIAL_CERTIFICATIONS);
  const idx = all.findIndex((c) => c.id === id);
  const updated = { ...(idx !== -1 ? all[idx] : ({} as Certification)), ...updates };

  if (idx !== -1) {
    all[idx] = updated;
    setLocalItem(STORAGE_KEYS.certifications, all);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('certifications').update(updates).eq('id', id);
    } catch (err) {
      console.error('Supabase update cert error:', err);
    }
  }

  return updated;
}

export async function deleteCertification(id: string): Promise<boolean> {
  const all = getLocalItem<Certification[]>(STORAGE_KEYS.certifications, INITIAL_CERTIFICATIONS);
  setLocalItem(STORAGE_KEYS.certifications, all.filter((c) => c.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('certifications').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete cert error:', err);
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// ENGINEERING ARTICLES API
// -----------------------------------------------------------------------------
export async function getEngineeringArticles(includeDrafts = false): Promise<EngineeringArticle[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let query = supabase.from('engineering_articles').select('*').order('display_order', { ascending: true });
      if (!includeDrafts) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as EngineeringArticle[];
      }
    } catch (err) {
      console.warn('Supabase articles query error:', err);
    }
  }

  const local = getLocalItem<EngineeringArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
  if (includeDrafts) return local;
  return local.filter((a) => a.is_published);
}

export async function getEngineeringArticleBySlug(slug: string): Promise<EngineeringArticle | null> {
  const articles = await getEngineeringArticles(true);
  return articles.find((a) => a.slug === slug) || null;
}

export async function createEngineeringArticle(data: Partial<EngineeringArticle>): Promise<EngineeringArticle> {
  const newArt: EngineeringArticle = {
    id: `art-${Date.now()}`,
    title: data.title || '',
    slug: data.slug || `article-${Date.now()}`,
    topic: data.topic || 'System Architecture',
    summary: data.summary || '',
    problem_statement: data.problem_statement || '',
    explanation: data.explanation || '',
    solution: data.solution || '',
    code_examples: data.code_examples || '',
    complexity_analysis: data.complexity_analysis || '',
    diagrams: data.diagrams || '',
    related_projects: data.related_projects || [],
    is_published: data.is_published ?? true,
    display_order: data.display_order ?? 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('engineering_articles').insert([newArt]);
    } catch (err) {
      console.error('Supabase create article error:', err);
    }
  }

  const all = getLocalItem<EngineeringArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
  all.push(newArt);
  setLocalItem(STORAGE_KEYS.articles, all);
  return newArt;
}

export async function updateEngineeringArticle(id: string, updates: Partial<EngineeringArticle>): Promise<EngineeringArticle> {
  const all = getLocalItem<EngineeringArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
  const idx = all.findIndex((a) => a.id === id);
  const updated = { ...(idx !== -1 ? all[idx] : ({} as EngineeringArticle)), ...updates, updated_at: new Date().toISOString() };

  if (idx !== -1) {
    all[idx] = updated;
    setLocalItem(STORAGE_KEYS.articles, all);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('engineering_articles').update(updates).eq('id', id);
    } catch (err) {
      console.error('Supabase update article error:', err);
    }
  }

  return updated;
}

export async function deleteEngineeringArticle(id: string): Promise<boolean> {
  const all = getLocalItem<EngineeringArticle[]>(STORAGE_KEYS.articles, INITIAL_ARTICLES);
  setLocalItem(STORAGE_KEYS.articles, all.filter((a) => a.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('engineering_articles').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete article error:', err);
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// TECHNOLOGIES & SKILLS API
// -----------------------------------------------------------------------------
export async function getTechnologies(): Promise<Technology[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('technologies').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Technology[];
      }
    } catch (err) {
      console.warn('Supabase technologies error:', err);
    }
  }
  return getLocalItem<Technology[]>(STORAGE_KEYS.technologies, INITIAL_TECHNOLOGIES);
}

export async function createTechnology(data: Partial<Technology>): Promise<Technology> {
  const newTech: Technology = {
    id: `tech-${Date.now()}`,
    name: data.name || '',
    category: data.category || 'Language',
    description: data.description || '',
    display_order: data.display_order ?? 0,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('technologies').insert([newTech]);
    } catch (err) {
      console.error('Supabase create tech error:', err);
    }
  }

  const all = getLocalItem<Technology[]>(STORAGE_KEYS.technologies, INITIAL_TECHNOLOGIES);
  all.push(newTech);
  setLocalItem(STORAGE_KEYS.technologies, all);
  return newTech;
}

export async function deleteTechnology(id: string): Promise<boolean> {
  const all = getLocalItem<Technology[]>(STORAGE_KEYS.technologies, INITIAL_TECHNOLOGIES);
  setLocalItem(STORAGE_KEYS.technologies, all.filter((t) => t.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('technologies').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete tech error:', err);
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// CONTACT MESSAGES API
// -----------------------------------------------------------------------------
export async function submitContactMessage(
  payload: Omit<ContactMessage, 'id' | 'created_at' | 'is_read' | 'is_archived'>
): Promise<{ success: boolean; message: string }> {
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    sender_name: payload.sender_name.trim(),
    sender_email: payload.sender_email.trim(),
    subject: payload.subject.trim(),
    message: payload.message.trim(),
    is_read: false,
    is_archived: false,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        sender_name: newMsg.sender_name,
        sender_email: newMsg.sender_email,
        subject: newMsg.subject,
        message: newMsg.message,
      }]);
      if (error) {
        console.warn('Supabase contact message insert notice:', error);
      }
    } catch (err) {
      console.error('Failed to send contact message via Supabase:', err);
    }
  }

  const all = getLocalItem<ContactMessage[]>(STORAGE_KEYS.messages, []);
  all.unshift(newMsg);
  setLocalItem(STORAGE_KEYS.messages, all);

  return { success: true, message: 'Message successfully delivered to I Nyoman Parta Yasa.' };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as ContactMessage[];
      }
    } catch (err) {
      console.warn('Supabase contact messages fetch error:', err);
    }
  }
  return getLocalItem<ContactMessage[]>(STORAGE_KEYS.messages, [
    {
      id: 'msg-sample-1',
      sender_name: 'Wayang Sastra',
      sender_email: 'engineering-lead@techbali.id',
      subject: 'Inquiry: Distributed Backend Architecture Consultation',
      message: 'Greetings Parta, impressed by your work on Voltra EV load balancing and MLB Icon. We are scaling our regional microservice fleet in Bali and would love to discuss a system architecture engagement.',
      is_read: false,
      is_archived: false,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    }
  ]);
}

export async function markContactMessageRead(id: string, isRead: boolean): Promise<boolean> {
  const all = getLocalItem<ContactMessage[]>(STORAGE_KEYS.messages, []);
  const msg = all.find((m) => m.id === id);
  if (msg) msg.is_read = isRead;
  setLocalItem(STORAGE_KEYS.messages, all);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
    } catch {
      // ignore
    }
  }
  return true;
}

export async function archiveContactMessage(id: string, isArchived: boolean): Promise<boolean> {
  const all = getLocalItem<ContactMessage[]>(STORAGE_KEYS.messages, []);
  const msg = all.find((m) => m.id === id);
  if (msg) msg.is_archived = isArchived;
  setLocalItem(STORAGE_KEYS.messages, all);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contact_messages').update({ is_archived: isArchived }).eq('id', id);
    } catch {
      // ignore
    }
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const all = getLocalItem<ContactMessage[]>(STORAGE_KEYS.messages, []);
  setLocalItem(STORAGE_KEYS.messages, all.filter((m) => m.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch {
      // ignore
    }
  }
  return true;
}

// -----------------------------------------------------------------------------
// DATABASE SEEDING UTILITY (1-Click Supabase Direct Population)
// -----------------------------------------------------------------------------
export async function seedSupabaseDatabase(): Promise<{ success: boolean; message: string; counts: Record<string, number> }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase client is not connected. Configure your Supabase URL & Anon Key first.',
      counts: {},
    };
  }

  const counts: Record<string, number> = {
    profiles: 0,
    projects: 0,
    case_studies: 0,
    technologies: 0,
    achievements: 0,
    certifications: 0,
    articles: 0,
  };

  try {
    // 1. Seed Profile
    const { error: pErr } = await supabase.from('profiles').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      full_name: INITIAL_PROFILE.full_name,
      professional_title: INITIAL_PROFILE.professional_title,
      location: INITIAL_PROFILE.location,
      email: INITIAL_PROFILE.email,
      hero_headline: INITIAL_PROFILE.hero_headline,
      hero_statement: INITIAL_PROFILE.hero_statement,
      bio_short: INITIAL_PROFILE.bio_short,
      bio_full: INITIAL_PROFILE.bio_full,
      medical_lab_journey: INITIAL_PROFILE.medical_lab_journey,
      github_url: INITIAL_PROFILE.github_url,
      linkedin_url: INITIAL_PROFILE.linkedin_url,
    });
    if (!pErr) counts.profiles = 1;

    // 2. Seed Projects & Case Studies
    for (const proj of INITIAL_PROJECTS) {
      const { data: insertedProj, error: prErr } = await supabase.from('projects').upsert({
        name: proj.name,
        slug: proj.slug,
        short_description: proj.short_description,
        full_description: proj.full_description,
        category: proj.category,
        live_url: proj.live_url,
        github_url: proj.github_url,
        technologies: proj.technologies,
        is_featured: proj.is_featured,
        publication_status: proj.publication_status,
        display_order: proj.display_order,
      }).select().single();

      if (!prErr && insertedProj) {
        counts.projects++;
        if (proj.case_study) {
          const { error: csErr } = await supabase.from('case_studies').upsert({
            project_id: insertedProj.id,
            overview: proj.case_study.overview,
            problem_statement: proj.case_study.problem_statement,
            objectives: proj.case_study.objectives,
            solution: proj.case_study.solution,
            system_architecture: proj.case_study.system_architecture,
            tech_stack_analysis: proj.case_study.tech_stack_analysis,
            backend_architecture: proj.case_study.backend_architecture,
            database_design: proj.case_study.database_design,
            api_design: proj.case_study.api_design,
            auth_and_authz: proj.case_study.auth_and_authz,
            data_flow: proj.case_study.data_flow,
            dsa_and_complexity: proj.case_study.dsa_and_complexity,
            time_complexity: proj.case_study.time_complexity,
            space_complexity: proj.case_study.space_complexity,
            engineering_decisions: proj.case_study.engineering_decisions,
            why_technologies_chosen: proj.case_study.why_technologies_chosen,
            alternative_solutions: proj.case_study.alternative_solutions,
            challenges_and_solutions: proj.case_study.challenges_and_solutions,
            lessons_learned: proj.case_study.lessons_learned,
          });
          if (!csErr) counts.case_studies++;
        }

        // Seed project images if any
        if (proj.images && proj.images.length > 0) {
          for (const img of proj.images) {
            await supabase.from('project_images').insert([{
              project_id: insertedProj.id,
              title: img.title || img.caption,
              caption: img.caption,
              image_url: img.image_url || '',
              image_type: img.image_type || 'screenshot',
              display_order: img.display_order,
              is_showcase: img.is_showcase ?? true,
            }]);
          }
        }
      }
    }

    // 2b. Seed Documents
    for (const doc of INITIAL_DOCUMENTS) {
      // Find matching project id
      const targetProj = INITIAL_PROJECTS.find((p) => p.id === doc.project_id);
      let targetDbId = doc.project_id;
      if (targetProj) {
        const { data: found } = await supabase.from('projects').select('id').eq('slug', targetProj.slug).maybeSingle();
        if (found) targetDbId = found.id;
      }

      await supabase.from('project_documents').insert([{
        project_id: targetDbId,
        title: doc.title,
        category: doc.category,
        description: doc.description,
        file_url: doc.file_url,
        file_name: doc.file_name,
        mime_type: doc.mime_type,
        file_size: doc.file_size,
        display_order: doc.display_order,
        publication_status: doc.publication_status,
      }]);
    }

    // 3. Seed Achievements
    for (const ach of INITIAL_ACHIEVEMENTS) {
      const { error } = await supabase.from('achievements').insert([{
        title: ach.title,
        competition_name: ach.competition_name,
        organization: ach.organization,
        year: ach.year,
        category: ach.category,
        award_ranking: ach.award_ranking,
        description: ach.description,
        personal_contribution: ach.personal_contribution,
        technologies_used: ach.technologies_used,
        is_published: ach.is_published,
        display_order: ach.display_order,
      }]);
      if (!error) counts.achievements++;
    }

    // 4. Seed Certifications
    for (const cert of INITIAL_CERTIFICATIONS) {
      const { error } = await supabase.from('certifications').insert([{
        title: cert.title,
        issuing_organization: cert.issuing_organization,
        issue_date: cert.issue_date,
        expiration_date: cert.expiration_date,
        credential_url: cert.credential_url,
        skills_gained: cert.skills_gained,
        description: cert.description,
        is_published: cert.is_published,
        display_order: cert.display_order,
      }]);
      if (!error) counts.certifications++;
    }

    // 5. Seed Engineering Articles
    for (const art of INITIAL_ARTICLES) {
      const { error } = await supabase.from('engineering_articles').upsert({
        title: art.title,
        slug: art.slug,
        topic: art.topic,
        summary: art.summary,
        problem_statement: art.problem_statement,
        explanation: art.explanation,
        solution: art.solution,
        code_examples: art.code_examples,
        complexity_analysis: art.complexity_analysis,
        diagrams: art.diagrams,
        related_projects: art.related_projects,
        is_published: art.is_published,
        display_order: art.display_order,
      });
      if (!error) counts.articles++;
    }

    return {
      success: true,
      message: `Database seeding completed successfully! Populated: ${counts.projects} projects, ${counts.case_studies} case studies, ${counts.achievements} achievements, ${counts.certifications} certs, ${counts.articles} articles, documents, and screenshots.`,
      counts,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Seeding error: ${errorMsg}`,
      counts,
    };
  }
}
