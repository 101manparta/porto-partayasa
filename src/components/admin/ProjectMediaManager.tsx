import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Eye,
  Star,
  Check,
  AlertCircle,
  MoveUp,
  MoveDown,
  X,
  FileCheck,
  Filter,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Project, ProjectImage } from '../../types';
import {
  uploadFileToStorage,
  createProjectImage,
  updateProjectImage,
  deleteProjectImage,
  updateProject,
} from '../../lib/api';
import { getSupabaseClient } from '../../lib/supabase';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';

interface ProjectMediaManagerProps {
  projects: Project[];
  images: ProjectImage[];
  onRefresh: () => void;
  showNotice: (msg: string) => void;
}

export const ProjectMediaManager: React.FC<ProjectMediaManagerProps> = ({
  projects,
  images,
  onRefresh,
  showNotice,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Editing state for an individual image
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  // Upload modal state
  const [uploadTargetProject, setUploadTargetProject] = useState<string>(
    projects.length > 0 ? projects[0].id : ''
  );
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadImageType, setUploadImageType] = useState<'screenshot' | 'architecture_diagram'>('screenshot');
  const [uploadIsShowcase, setUploadIsShowcase] = useState(true);
  const [copiedFixSql, setCopiedFixSql] = useState(false);
  const [copiedDbFixSql, setCopiedDbFixSql] = useState(false);
  const [copiedTableRlsFixSql, setCopiedTableRlsFixSql] = useState(false);

  const TABLE_RLS_FIX_SQL = `-- 1. Izinkan simpan & baca pada tabel project_images
ALTER TABLE IF EXISTS project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on project_images" ON project_images;
DROP POLICY IF EXISTS "Public project_images read" ON project_images;
DROP POLICY IF EXISTS "Admin project_images all" ON project_images;
CREATE POLICY "Allow all on project_images" ON project_images 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 2. Izinkan simpan & baca pada tabel projects
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on projects" ON projects;
DROP POLICY IF EXISTS "Public projects read" ON projects;
DROP POLICY IF EXISTS "Admin projects all" ON projects;
CREATE POLICY "Allow all on projects" ON projects 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 3. Izinkan simpan & baca pada tabel project_documents
ALTER TABLE IF EXISTS project_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all on project_documents" ON project_documents;
DROP POLICY IF EXISTS "Public project_documents read" ON project_documents;
DROP POLICY IF EXISTS "Admin project_documents all" ON project_documents;
CREATE POLICY "Allow all on project_documents" ON project_documents 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);`;

  const STORAGE_RLS_FIX_SQL = `-- 1. Pastikan bucket project-images berstatus Public
UPDATE storage.buckets SET public = true WHERE id = 'project-images';

-- 2. Berikan izin upload (INSERT) ke bucket project-images & dokumen
DROP POLICY IF EXISTS "Allow uploads to portfolio buckets" ON storage.objects;
CREATE POLICY "Allow uploads to portfolio buckets" ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

-- 3. Berikan izin update dan delete
DROP POLICY IF EXISTS "Allow update on portfolio buckets" ON storage.objects;
CREATE POLICY "Allow update on portfolio buckets" ON storage.objects 
  FOR UPDATE 
  USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));

DROP POLICY IF EXISTS "Allow delete on portfolio buckets" ON storage.objects;
CREATE POLICY "Allow delete on portfolio buckets" ON storage.objects 
  FOR DELETE 
  USING (bucket_id IN ('project-images', 'engineering-documents', 'achievement-certificates', 'certification-files', 'profile-assets'));`;

  const DATABASE_UUID_FIX_SQL = `-- 1. Lepas foreign key sementara agar kolom bisa diubah tipenya
ALTER TABLE IF EXISTS project_images DROP CONSTRAINT IF EXISTS project_images_project_id_fkey;
ALTER TABLE IF EXISTS project_documents DROP CONSTRAINT IF EXISTS project_documents_project_id_fkey;
ALTER TABLE IF EXISTS case_studies DROP CONSTRAINT IF EXISTS case_studies_project_id_fkey;

-- 2. Ubah tipe kolom id dan project_id menjadi TEXT
ALTER TABLE IF EXISTS projects ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS project_images ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS project_images ALTER COLUMN project_id TYPE TEXT;
ALTER TABLE IF EXISTS project_documents ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS project_documents ALTER COLUMN project_id TYPE TEXT;
ALTER TABLE IF EXISTS case_studies ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS case_studies ALTER COLUMN project_id TYPE TEXT;

-- 3. Pasang kembali foreign key dengan cascade delete
ALTER TABLE IF EXISTS project_images ADD CONSTRAINT project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS project_documents ADD CONSTRAINT project_documents_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS case_studies ADD CONSTRAINT case_studies_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- 4. Masukkan baseline 3 proyek utama Parta Yasa
INSERT INTO projects (id, name, slug, short_description, full_description, category, live_url, github_url, technologies, is_featured, publication_status, display_order)
VALUES 
  ('proj-mlb-icon-bali', 'MLB ICON BALI', 'mlb-icon-bali', 'Enterprise hospitality booking & ticketing management platform with transactional inventory locking and high-throughput reservation pipelines.', 'A comprehensive commercial platform serving premier hospitality venues in Bali.', 'Enterprise Backend & Platform', 'https://mlb-pro-olive.vercel.app/', 'https://github.com/101manparta/mlb-icon-bali', ARRAY['PostgreSQL', 'TypeScript', 'Node.js', 'Redis', 'Supabase', 'Next.js', 'Tailwind CSS'], true, 'published', 1),
  ('proj-voltra', 'VOLTRA', 'voltra', 'High-throughput telemetry ingestion & dynamic EV charging load-balancing engine built with Go concurrency and time-series rollups.', 'An industrial Internet of Things (IoT) energy dispatch orchestration platform.', 'Distributed Systems & IoT', 'https://voltra-pi.vercel.app/', 'https://github.com/101manparta/voltra', ARRAY['Go', 'TimescaleDB', 'PostgreSQL', 'Docker', 'Redis', 'WebSockets', 'Chart.js'], true, 'published', 2),
  ('proj-mediflow', 'MEDIFLOW', 'mediflow', 'Clinical laboratory specimen lifecycle & validation engine integrating diagnostic state transitions, automated delta checks, and HL7-compliant audit logs.', 'A mission-critical healthcare backend born out of actual clinical pathology laboratory practice.', 'Healthcare Backend & State Machines', 'https://mediflow-solutions.netlify.app/', 'https://github.com/101manparta/mediflow', ARRAY['TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Express', 'Tailwind CSS'], true, 'published', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug;`;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter images based on selected project
  const filteredImages = selectedProjectId === 'all'
    ? images
    : images.filter((img) => img.project_id === selectedProjectId);

  const sortedImages = [...filteredImages].sort((a, b) => a.display_order - b.display_order);

  // Supported MIME types
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Invalid format (${file.type || 'unknown'}). Supported: JPG, JPEG, PNG, WEBP.`;
    }
    if (file.size > 10 * 1024 * 1024) {
      return `File exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(10);

    const fileArray = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setUploadError(errorMsg);
        setIsUploading(false);
        setUploadProgress(null);
        return;
      }

      try {
        setUploadProgress(Math.round(((i + 1) / fileArray.length) * 80));

        // Upload file binary to Supabase Storage
        const uploadResult = await uploadFileToStorage('project-images', file, 'screenshots');

        // Create metadata record in PostgreSQL
        const targetProjId = uploadTargetProject || (projects[0]?.id ?? '');
        await createProjectImage({
          project_id: targetProjId,
          image_url: uploadResult.publicUrl,
          file_path: uploadResult.filePath,
          file_name: uploadResult.fileName,
          mime_type: uploadResult.mimeType,
          file_size: uploadResult.fileSize,
          title: uploadTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
          caption: uploadCaption.trim() || `${file.name.replace(/\.[^/.]+$/, '')} preview`,
          image_type: uploadImageType,
          display_order: images.length + successCount + 1,
          is_showcase: uploadIsShowcase,
        });

        successCount++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed.';
        setUploadError(`Failed to upload ${file.name}: ${msg}`);
        break;
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(null);
      if (successCount > 0) {
        showNotice(`Successfully uploaded ${successCount} media asset${successCount > 1 ? 's' : ''}.`);
        setUploadTitle('');
        setUploadCaption('');
        onRefresh();
      }
    }, 400);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    if (confirm(`Delete media asset "${title || 'this image'}"?`)) {
      await deleteProjectImage(id);
      showNotice('Media asset deleted.');
      onRefresh();
    }
  };

  const handleSetThumbnail = async (image: ProjectImage) => {
    const proj = projects.find((p) => p.id === image.project_id);
    if (!proj) return;

    await updateProject(proj.id, { thumbnail_url: image.image_url });
    showNotice(`Set as thumbnail for project "${proj.name}".`);
    onRefresh();
  };

  const handleToggleShowcase = async (image: ProjectImage) => {
    await updateProjectImage(image.id, { is_showcase: !image.is_showcase });
    showNotice(`Showcase visibility updated for "${image.title || 'image'}".`);
    onRefresh();
  };

  const handleMoveOrder = async (image: ProjectImage, direction: 'up' | 'down') => {
    const currentIndex = sortedImages.findIndex((img) => img.id === image.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sortedImages.length) return;

    const targetImage = sortedImages[targetIndex];
    const originalOrder = image.display_order;
    const targetOrder = targetImage.display_order;

    await updateProjectImage(image.id, { display_order: targetOrder });
    await updateProjectImage(targetImage.id, { display_order: originalOrder });

    onRefresh();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    await updateProjectImage(editingImage.id, {
      title: editingImage.title,
      caption: editingImage.caption,
      image_type: editingImage.image_type,
      project_id: editingImage.project_id,
      is_showcase: editingImage.is_showcase,
    });

    showNotice('Media details updated.');
    setEditingImage(null);
    onRefresh();
  };

  const isSupabaseConnected = Boolean(getSupabaseClient());

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">MEDIA ASSETS & SUPABASE STORAGE</div>
          <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Project Media Management</h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Upload, preview, replace, and organize high-resolution screenshots and architectural diagrams.
          </p>
        </div>

        {/* Status Badge & Project Filter Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full border text-[11px] font-mono flex items-center gap-1.5 ${
              isSupabaseConnected
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>{isSupabaseConnected ? 'Supabase Storage: Active' : 'Mode Offline (Local Only)'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#09090C] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
            >
              <option value="all">All Projects ({images.length} images)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Offline Warning Banner if Supabase is disconnected on Vercel */}
      {!isSupabaseConnected && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-amber-300">
              Peringatan: Vercel Belum Terhubung ke Supabase Cloud Storage
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
              Variabel <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> belum ter-compile di Vercel Anda.
              Jika Anda mengupload gambar sekarang, gambar hanya tersimpan sementara di browser ini (localStorage) dan <strong>TIDAK AKAN MUNCUL di browser/laptop/akun lain</strong>.
            </p>
            <p className="text-[11px] text-amber-300 font-mono pt-1">
              Solusi: Tambahkan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di dashboard Vercel &gt; Settings &gt; Environment Variables, lalu klik <strong>Redeploy</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <LiquidGlassCard
        variant="elevated"
        className={`p-6 sm:p-8 border-2 border-dashed transition-all duration-200 ${
          isDragging ? 'border-white bg-white/[0.08]' : 'border-white/15'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 liquid-glass rounded-2xl text-neutral-300">
            <Upload className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-serif text-white">
              Drag & Drop Screenshots or Diagrams Here
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Supports JPG, JPEG, PNG, WEBP up to 10MB per file. Directly stored in Supabase Storage bucket <code className="text-neutral-300 font-mono">project-images</code>.
            </p>
          </div>

          {/* Target Project & Properties Selector for Upload */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left text-xs font-mono">
            <div>
              <label className="block text-neutral-400 mb-1">ASSOCIATE WITH PROJECT</label>
              <select
                value={uploadTargetProject}
                onChange={(e) => setUploadTargetProject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#08080B] border border-white/10 text-white text-xs focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">ASSET TYPE</label>
              <select
                value={uploadImageType}
                onChange={(e) => setUploadImageType(e.target.value as 'screenshot' | 'architecture_diagram')}
                className="w-full px-3 py-2 rounded-xl bg-[#08080B] border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="screenshot">Project Screenshot</option>
                <option value="architecture_diagram">Architecture Diagram</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1">CUSTOM TITLE (OPTIONAL)</label>
              <input
                type="text"
                placeholder="e.g. Telemetry Dashboard Console"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="showcaseCheckbox"
                checked={uploadIsShowcase}
                onChange={(e) => setUploadIsShowcase(e.target.checked)}
                className="rounded accent-white cursor-pointer"
              />
              <label htmlFor="showcaseCheckbox" className="text-neutral-300 cursor-pointer">
                Include in Homepage Infinite Marquee
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <div className="pt-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFilesUpload(e.target.files);
              }}
            />
            <LiquidGlassButton
              type="button"
              variant="primary"
              size="md"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading to Supabase...' : 'Browse Image Files'}</span>
            </LiquidGlassButton>
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress !== null && (
            <div className="w-full max-w-md mt-4">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Error Banner with 1-Click RLS & UUID Fix */}
          {uploadError && (() => {
            const isTableRlsError = uploadError.toLowerCase().includes('table "project_images"') || uploadError.toLowerCase().includes('table "projects"');
            const isStorageRlsError = !isTableRlsError && uploadError.toLowerCase().includes('row-level security');
            const isUuidError = uploadError.toLowerCase().includes('type uuid') || uploadError.toLowerCase().includes('invalid input syntax for type uuid');

            return (
              <div className="w-full max-w-xl p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs font-mono text-red-300 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-red-200">{uploadError}</p>
                    {isTableRlsError && (
                      <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                        Penyebab: File berhasil diunggah ke Storage, namun tabel database PostgreSQL <code>project_images</code> belum memiliki policy INSERT.
                      </p>
                    )}
                    {isStorageRlsError && (
                      <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                        Penyebab: Supabase Storage secara default mengunci upload file (RLS) sampai policy INSERT diberikan di database Anda.
                      </p>
                    )}
                    {isUuidError && (
                      <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
                        Penyebab: Kolom <code>project_id</code> di tabel database Supabase Anda bertipe <code>UUID</code>, sementara tabel belum memiliki data proyek 'proj-mlb-icon-bali'.
                      </p>
                    )}
                  </div>
                </div>

                {/* Table RLS Solution Section */}
                {isTableRlsError && (
                  <div className="pt-3 border-t border-red-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-white font-semibold flex items-center gap-1.5">
                        <span>Solusi: Jalankan SQL ini di Supabase SQL Editor</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(TABLE_RLS_FIX_SQL);
                          setCopiedTableRlsFixSql(true);
                          setTimeout(() => setCopiedTableRlsFixSql(false), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedTableRlsFixSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTableRlsFixSql ? 'SQL Disalin!' : 'Salin SQL Fix Tabel project_images'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 rounded-xl text-[10px] text-neutral-300 overflow-x-auto border border-white/5 font-mono leading-relaxed whitespace-pre">
                      {TABLE_RLS_FIX_SQL}
                    </pre>
                    <p className="text-[10.5px] text-neutral-400 font-sans">
                      Langkah: Buka Supabase Dashboard &gt; SQL Editor &gt; Paste SQL di atas &gt; Klik Run. Setelah itu, upload ulang file Anda.
                    </p>
                  </div>
                )}

                {/* Storage RLS Solution Section */}
                {isStorageRlsError && (
                  <div className="pt-3 border-t border-red-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-white font-semibold flex items-center gap-1.5">
                        <span>Solusi: Jalankan SQL ini di Supabase SQL Editor</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(STORAGE_RLS_FIX_SQL);
                          setCopiedFixSql(true);
                          setTimeout(() => setCopiedFixSql(false), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedFixSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedFixSql ? 'SQL Disalin!' : 'Salin SQL Fix Storage'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 rounded-xl text-[10.5px] text-neutral-300 overflow-x-auto border border-white/5 font-mono leading-relaxed whitespace-pre">
                      {STORAGE_RLS_FIX_SQL}
                    </pre>
                    <p className="text-[10.5px] text-neutral-400 font-sans">
                      Langkah: Buka Supabase Dashboard &gt; SQL Editor &gt; Paste SQL di atas &gt; Klik Run. Setelah itu, upload ulang file Anda.
                    </p>
                  </div>
                )}

                {/* UUID Type Solution Section */}
                {isUuidError && (
                  <div className="pt-3 border-t border-red-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans text-white font-semibold flex items-center gap-1.5">
                        <span>Solusi: Jalankan SQL ini di Supabase SQL Editor</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(DATABASE_UUID_FIX_SQL);
                          setCopiedDbFixSql(true);
                          setTimeout(() => setCopiedDbFixSql(false), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedDbFixSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedDbFixSql ? 'SQL Disalin!' : 'Salin SQL Fix Database'}</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-black/60 rounded-xl text-[10px] text-neutral-300 overflow-x-auto border border-white/5 font-mono leading-relaxed whitespace-pre">
                      {DATABASE_UUID_FIX_SQL}
                    </pre>
                    <p className="text-[10.5px] text-neutral-400 font-sans">
                      Langkah: Buka Supabase Dashboard &gt; SQL Editor &gt; Paste SQL di atas &gt; Klik Run.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </LiquidGlassCard>

      {/* Media Grid / Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>UPLOADED MEDIA ASSETS ({sortedImages.length})</span>
          <span>Order is adjustable via controls</span>
        </div>

        {sortedImages.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-12 text-center text-xs font-mono text-neutral-500">
            No media uploaded for this selection yet. Drag & drop image files above to add screenshots.
          </LiquidGlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedImages.map((image, idx) => {
              const associatedProject = projects.find((p) => p.id === image.project_id);
              const isThumbnail = associatedProject?.thumbnail_url === image.image_url;

              return (
                <LiquidGlassCard key={image.id} variant="default" className="overflow-hidden flex flex-col justify-between group">
                  {/* Image Preview Container */}
                  <div className="relative aspect-video bg-black/60 overflow-hidden border-b border-white/[0.06]">
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt={image.caption || image.title || 'Project screenshot'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 text-xs font-mono p-4">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                        <span>Mock Telemetry Visual</span>
                      </div>
                    )}

                    {/* Quick Badges Overlay */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 text-[10px] font-mono">
                      {isThumbnail && (
                        <span className="px-2 py-0.5 bg-white text-black font-semibold rounded-md shadow">
                          THUMBNAIL
                        </span>
                      )}
                      {image.is_showcase && (
                        <span className="px-2 py-0.5 bg-black/80 text-white rounded-md border border-white/20 backdrop-blur-sm">
                          HOMEPAGE SHOWCASE
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-black/80 text-neutral-300 rounded-md border border-white/10 backdrop-blur-sm">
                        #{image.display_order}
                      </span>
                    </div>

                    {/* Preview Button */}
                    {image.image_url && (
                      <button
                        onClick={() => setPreviewModalUrl(image.image_url)}
                        className="absolute bottom-2 right-2 p-1.5 liquid-glass rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="View Full Resolution"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-neutral-400">
                        {associatedProject?.name || 'Unassigned Project'} · {image.image_type}
                      </div>
                      <h3 className="text-sm font-semibold text-white tracking-tight mt-0.5 truncate">
                        {image.title || image.caption || 'Screenshot'}
                      </h3>
                      {image.caption && (
                        <p className="text-xs text-neutral-400 font-sans line-clamp-2 mt-1">
                          {image.caption}
                        </p>
                      )}
                    </div>

                    {/* Card Actions & Reordering */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                      {/* Order Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(image, 'up')}
                          className="p-1 liquid-glass rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === sortedImages.length - 1}
                          onClick={() => handleMoveOrder(image, 'down')}
                          className="p-1 liquid-glass rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Functional Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleShowcase(image)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            image.is_showcase
                              ? 'text-white liquid-glass'
                              : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title={image.is_showcase ? 'Remove from Homepage Marquee' : 'Add to Homepage Marquee'}
                        >
                          <Star className={`w-3.5 h-3.5 ${image.is_showcase ? 'fill-white' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleSetThumbnail(image)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isThumbnail
                              ? 'text-white liquid-glass font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                          title="Set as Project Primary Thumbnail"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingImage(image)}
                          className="p-1.5 liquid-glass rounded text-neutral-300 hover:text-white cursor-pointer"
                          title="Edit Details"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(image.id, image.title)}
                          className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 cursor-pointer"
                          title="Delete Media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-lg p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">Edit Media Asset</h2>
              <button
                onClick={() => setEditingImage(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">ASSOCIATED PROJECT</label>
                <select
                  value={editingImage.project_id}
                  onChange={(e) => setEditingImage({ ...editingImage, project_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">IMAGE TITLE</label>
                <input
                  type="text"
                  required
                  value={editingImage.title || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">CAPTION / DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingImage.caption || ''}
                  onChange={(e) => setEditingImage({ ...editingImage, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">IMAGE TYPE</label>
                  <select
                    value={editingImage.image_type}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        image_type: e.target.value as 'screenshot' | 'architecture_diagram',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs"
                  >
                    <option value="screenshot">Screenshot</option>
                    <option value="architecture_diagram">Architecture Diagram</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="editShowcaseCheck"
                    checked={editingImage.is_showcase}
                    onChange={(e) =>
                      setEditingImage({ ...editingImage, is_showcase: e.target.checked })
                    }
                    className="rounded accent-white cursor-pointer"
                  />
                  <label htmlFor="editShowcaseCheck" className="text-neutral-300 cursor-pointer">
                    Showcase in Marquee
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Changes
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* Lightbox Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl liquid-glass border border-white/20 p-2">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 liquid-glass rounded-xl text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalUrl}
              alt="Full preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
