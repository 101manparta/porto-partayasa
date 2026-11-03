import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Edit,
  Eye,
  Plus,
  X,
  AlertCircle,
  FileDown,
  ExternalLink,
  Filter,
  CheckCircle2,
  FileCode,
  Network,
  Database,
  Workflow,
  Cpu,
} from 'lucide-react';
import { Project, ProjectDocument, DocumentCategory } from '../../types';
import {
  uploadFileToStorage,
  createProjectDocument,
  updateProjectDocument,
  deleteProjectDocument,
} from '../../lib/api';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';

interface EngineeringDocsManagerProps {
  projects: Project[];
  documents: ProjectDocument[];
  onRefresh: () => void;
  showNotice: (msg: string) => void;
}

export const EngineeringDocsManager: React.FC<EngineeringDocsManagerProps> = ({
  projects,
  documents,
  onRefresh,
  showNotice,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingDoc, setEditingDoc] = useState<Partial<ProjectDocument> | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: DocumentCategory[] = [
    'System Architecture',
    'Database ERD',
    'API Documentation',
    'Data Flow',
    'Authentication Flow',
    'Sequence Diagram',
    'DSA Explanation',
    'Performance Analysis',
    'Technical Decisions',
  ];

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchProj = selectedProjectId === 'all' || doc.project_id === selectedProjectId;
    const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchProj && matchCat;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => a.display_order - b.display_order);

  // Validate format (PNG, JPG, WEBP, PDF)
  const ACCEPTED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'application/pdf',
  ];

  const handleFileUpload = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Invalid format. Supported: PNG, JPG, WEBP diagrams and PDF documents.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      setUploadProgress(60);
      const res = await uploadFileToStorage('engineering-documents', file, 'diagrams');
      setUploadProgress(100);

      if (editingDoc) {
        setEditingDoc({
          ...editingDoc,
          file_url: res.publicUrl,
          file_path: res.filePath,
          file_name: res.fileName,
          mime_type: res.mimeType,
          file_size: res.fileSize,
        });
      }
      showNotice(`File "${file.name}" uploaded successfully to Supabase Storage.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc?.title || !editingDoc.category) {
      setUploadError('Please specify title and category.');
      return;
    }

    if (editingDoc.id) {
      await updateProjectDocument(editingDoc.id, editingDoc);
      showNotice('Documentation updated.');
    } else {
      await createProjectDocument({
        ...editingDoc,
        display_order: documents.length + 1,
      });
      showNotice('Documentation artifact created.');
    }

    setEditingDoc(null);
    onRefresh();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete engineering document "${title}"?`)) {
      await deleteProjectDocument(id);
      showNotice('Document deleted.');
      onRefresh();
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'System Architecture':
        return Cpu;
      case 'Database ERD':
        return Database;
      case 'API Documentation':
        return FileCode;
      case 'Data Flow':
      case 'Sequence Diagram':
        return Workflow;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400">TECHNICAL ARTIFACTS & BLUEPRINTS</div>
          <h1 className="text-3xl font-serif text-white tracking-tight mt-1">
            Engineering Documentation
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Manage system architecture diagrams, database ERDs, sequence schematics, API specs, and PDF research whitepapers.
          </p>
        </div>

        <LiquidGlassButton
          variant="primary"
          size="sm"
          onClick={() =>
            setEditingDoc({
              title: '',
              category: 'System Architecture',
              description: '',
              project_id: projects[0]?.id || '',
              file_url: '',
              file_name: '',
              mime_type: 'image/png',
              publication_status: 'published',
              display_order: documents.length + 1,
            })
          }
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Document</span>
        </LiquidGlassButton>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400">Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="all">All Categories ({documents.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        {sortedDocs.length === 0 ? (
          <LiquidGlassCard variant="default" className="p-12 text-center text-xs font-mono text-neutral-500">
            No engineering documentation artifacts found for this filter. Click "New Document" to upload architecture diagrams or PDF specs.
          </LiquidGlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedDocs.map((doc) => {
              const proj = projects.find((p) => p.id === doc.project_id);
              const Icon = getCategoryIcon(doc.category);
              const isPdf = doc.mime_type.includes('pdf') || doc.file_name.toLowerCase().endsWith('.pdf');

              return (
                <LiquidGlassCard key={doc.id} variant="default" className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Header Strip */}
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.06] pb-2 mb-3">
                      <div className="flex items-center gap-1.5 text-white">
                        <Icon className="w-3.5 h-3.5 text-neutral-300" />
                        <span className="font-semibold">{doc.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            doc.publication_status === 'published'
                              ? 'bg-white/10 text-white'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {doc.publication_status.toUpperCase()}
                        </span>
                        <span className="text-neutral-500">{isPdf ? 'PDF' : 'IMAGE'}</span>
                      </div>
                    </div>

                    {/* Title & Project */}
                    <h3 className="text-lg font-serif text-white tracking-tight">{doc.title}</h3>
                    <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Target System: <span className="text-neutral-300">{proj?.name || 'General Platform'}</span>
                    </div>

                    {/* Description */}
                    {doc.description && (
                      <p className="text-xs text-neutral-300 font-sans mt-2 leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    {/* File Attachment Pill */}
                    <div className="mt-3 p-2.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="truncate text-neutral-300">{doc.file_name}</span>
                        {doc.file_size && (
                          <span className="text-[10px] text-neutral-500 shrink-0">
                            ({(doc.file_size / 1024).toFixed(0)} KB)
                          </span>
                        )}
                      </div>

                      {doc.file_url && (
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-2 py-1 liquid-glass rounded text-[11px] text-white hover:bg-white/10 flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500 text-[11px]">
                      Display Order: #{doc.display_order}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="p-1.5 liquid-glass rounded text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Documentation"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete Documentation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </LiquidGlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / Create Document Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">
                {editingDoc.id ? 'Edit Engineering Documentation' : 'Upload Documentation Artifact'}
              </h2>
              <button
                onClick={() => setEditingDoc(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">DOCUMENT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VOLTRA — Ingestion Pipeline & Priority Heap Blueprint"
                  value={editingDoc.title || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">CATEGORY *</label>
                  <select
                    value={editingDoc.category || 'System Architecture'}
                    onChange={(e) =>
                      setEditingDoc({
                        ...editingDoc,
                        category: e.target.value as DocumentCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">ASSOCIATED PROJECT *</label>
                  <select
                    value={editingDoc.project_id || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, project_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Describe the architectural invariants, protocols, or algorithmic theorems demonstrated in this artifact..."
                  value={editingDoc.description || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              {/* File Upload Section */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <label className="block text-neutral-300 font-semibold">
                  ATTACH FILE (PNG, JPG, WEBP, OR PDF)
                </label>

                {editingDoc.file_name && (
                  <div className="flex items-center justify-between text-xs text-neutral-300 bg-white/5 p-2.5 rounded-lg">
                    <span className="truncate">{editingDoc.file_name}</span>
                    <span className="text-[10px] text-neutral-500">
                      {editingDoc.file_size ? `${(editingDoc.file_size / 1024).toFixed(0)} KB` : 'Uploaded'}
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex items-center gap-3">
                  <LiquidGlassButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{editingDoc.file_url ? 'Replace Document File' : 'Upload Diagram / PDF'}</span>
                  </LiquidGlassButton>

                  {isUploading && (
                    <span className="text-neutral-400 text-xs animate-pulse">
                      Uploading to Supabase Storage ({uploadProgress}%)...
                    </span>
                  )}
                </div>

                {uploadError && (
                  <div className="p-2 text-xs text-red-300 bg-red-500/10 rounded-lg">
                    {uploadError}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">PUBLICATION STATUS</label>
                  <select
                    value={editingDoc.publication_status || 'published'}
                    onChange={(e) =>
                      setEditingDoc({
                        ...editingDoc,
                        publication_status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={editingDoc.display_order ?? 0}
                    onChange={(e) =>
                      setEditingDoc({ ...editingDoc, display_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Document
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl liquid-glass border border-white/20 p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400">{previewDoc.category}</span>
                <h3 className="text-lg font-serif text-white">{previewDoc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {previewDoc.file_url && (
                  <a
                    href={previewDoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 liquid-glass rounded-lg text-white hover:bg-white/10"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 liquid-glass rounded-lg text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center">
              {previewDoc.mime_type.includes('pdf') || previewDoc.file_name.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full text-center py-16 space-y-4">
                  <FileText className="w-16 h-16 mx-auto text-neutral-400" />
                  <div className="text-sm font-semibold text-white">{previewDoc.file_name}</div>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    PDF Document stored in Supabase Storage. Click below to view or download.
                  </p>
                  <a
                    href={previewDoc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={previewDoc.file_name}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Download / View PDF File</span>
                  </a>
                </div>
              ) : (
                <img
                  src={previewDoc.file_url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
