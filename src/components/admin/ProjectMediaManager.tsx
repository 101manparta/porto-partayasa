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
} from 'lucide-react';
import { Project, ProjectImage } from '../../types';
import {
  uploadFileToStorage,
  createProjectImage,
  updateProjectImage,
  deleteProjectImage,
  updateProject,
} from '../../lib/api';
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

        {/* Project Filter Selector */}
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

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="w-full max-w-md p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-mono text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
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
