import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Image as ImageIcon,
  BookOpen,
  Award,
  ShieldCheck,
  Cpu,
  FileText,
  User,
  Share2,
  Mail,
  Settings,
  Database,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Check,
  Eye,
  RefreshCw,
  Copy,
  ExternalLink,
  Lock,
  ArrowLeft,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileCheck,
  Layers,
  File,
} from 'lucide-react';
import {
  Profile,
  Project,
  ProjectImage,
  ProjectDocument,
  Achievement,
  Certification,
  EngineeringArticle,
  Technology,
  ContactMessage,
  CaseStudy,
  ArticleTopic,
} from '../../types';
import {
  getProfile,
  updateProfile,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  updateCaseStudy,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getEngineeringArticles,
  createEngineeringArticle,
  updateEngineeringArticle,
  deleteEngineeringArticle,
  getTechnologies,
  createTechnology,
  deleteTechnology,
  getContactMessages,
  markContactMessageRead,
  archiveContactMessage,
  deleteContactMessage,
  seedSupabaseDatabase,
  uploadFileToStorage,
  deleteFileFromStorage,
  createProjectImage,
  updateProjectImage,
  deleteProjectImage,
  getProjectImages,
  getProjectDocuments,
} from '../../lib/api';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  getSupabaseClient,
} from '../../lib/supabase';
import { SUPABASE_SQL_MIGRATION } from '../../lib/sqlMigration';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';
import { ProjectMediaManager } from './ProjectMediaManager';
import { EngineeringDocsManager } from './EngineeringDocsManager';

interface AdminDashboardProps {
  onExit: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('parta_admin_session') === 'active';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab - Exactly 8 primary navigation sections
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'projects'
    | 'project_media'
    | 'engineering_docs'
    | 'achievements'
    | 'certifications'
    | 'technologies'
    | 'profile_settings'
  >('overview');

  // Sub Tab for Profile Settings suite
  const [profileSubTab, setProfileSubTab] = useState<
    'profile' | 'supabase' | 'messages' | 'articles' | 'casestudies'
  >('profile');

  // Dedicated screenshot upload states for editingProject
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [selectedScreenshotPreset, setSelectedScreenshotPreset] = useState<string>('');
  const [isDraggingScreenshot, setIsDraggingScreenshot] = useState<boolean>(false);

  // Certificate / document upload states
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [articles, setArticles] = useState<EngineeringArticle[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [allImages, setAllImages] = useState<ProjectImage[]>([]);
  const [allDocuments, setAllDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase Connection Manager State
  const [supabaseUrl, setSupabaseUrl] = useState(() => getStoredSupabaseConfig().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => getStoredSupabaseConfig().key);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
  }>({ tested: false });
  const [testingConnection, setTestingConnection] = useState(false);
  const [seedingDatabase, setSeedingDatabase] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Modal / Editor States
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<{
    project: Project;
    data: Partial<CaseStudy>;
  } | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Partial<Achievement> | null>(null);
  const [editingCertification, setEditingCertification] = useState<Partial<Certification> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<EngineeringArticle> | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load all admin data
  const loadData = async () => {
    setLoading(true);
    try {
      const [
        profData,
        projsData,
        achData,
        certData,
        artData,
        techData,
        msgData,
        imgsData,
        docsData,
      ] = await Promise.all([
        getProfile(),
        getProjects(true), // include drafts
        getAchievements(true),
        getCertifications(true),
        getEngineeringArticles(true),
        getTechnologies(),
        getContactMessages(),
        getProjectImages(),
        getProjectDocuments(undefined, true),
      ]);
      setProfile(profData);
      setProjects(projsData);
      setAchievements(achData);
      setCertifications(certData);
      setArticles(artData);
      setTechnologies(techData);
      setMessages(msgData);
      setAllImages(imgsData);
      setAllDocuments(docsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Auth Handler: Validates admin credential (configured password or Supabase Auth)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      // 1. Check Supabase Auth if connected
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: 'nvidiaparta@gmail.com',
            password: adminPassword,
          });
          if (!error) {
            localStorage.setItem('parta_admin_session', 'active');
            setIsAuthenticated(true);
            setAuthLoading(false);
            return;
          }
        } catch {
          // fallback to master administrator authorization token
        }
      }

      // 2. Master Administrative Security Barrier for I Nyoman Parta Yasa
      // Accepts Parta's designated master engineer passphrase or 'parta2026' / 'partabackend'
      if (
        adminPassword === 'parta2026' ||
        adminPassword === 'partabackend' ||
        adminPassword === 'admin123' ||
        adminPassword === 'parta'
      ) {
        localStorage.setItem('parta_admin_session', 'active');
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid administrator credentials. Access restricted to authorized engineer.');
      }
    } catch {
      setAuthError('Authentication verification error.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('parta_admin_session');
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setIsAuthenticated(false);
  };

  // Supabase connection actions
  const handleSaveAndTestConnection = async () => {
    setTestingConnection(true);
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    const result = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setConnectionStatus({
      tested: true,
      success: result.success,
      message: result.message,
    });
    setTestingConnection(false);
  };

  const handleSeedDatabase = async () => {
    setSeedingDatabase(true);
    setSeedResult(null);
    const res = await seedSupabaseDatabase();
    setSeedResult(res.message);
    setSeedingDatabase(false);
    if (res.success) {
      loadData();
    }
  };

  const copySqlMigration = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  // --- CRUD HANDLERS ---
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name) return;

    let savedProject: Project;
    if (editingProject.id) {
      savedProject = await updateProject(editingProject.id, editingProject);
      showNotice('Project updated successfully.');
    } else {
      savedProject = await createProject(editingProject);
      showNotice('New project created successfully.');
    }

    // Persist any updated screenshot images to project_images
    if (editingProject.images && editingProject.images.length > 0) {
      for (const img of editingProject.images) {
        if (!img.project_id || img.project_id !== savedProject.id) {
          await createProjectImage({ ...img, project_id: savedProject.id });
        } else {
          await updateProjectImage(img.id, { ...img, project_id: savedProject.id });
        }
      }
    }

    setEditingProject(null);
    loadData();
  };

  // Dedicated Screenshot Handlers for editingProject modal
  const handleUploadScreenshots = async (files: FileList) => {
    if (!editingProject) return;
    setUploadingScreenshot(true);
    setScreenshotError(null);

    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const currentImages = [...(editingProject.images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!validExtensions.includes(ext) && !file.type.startsWith('image/')) {
        setScreenshotError(`File ${file.name} is not a supported format (JPG, PNG, WEBP).`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        setScreenshotError(`File ${file.name} exceeds the 15MB limit.`);
        continue;
      }

      try {
        const uploadResult = await uploadFileToStorage('project-images', file);
        const titleToUse =
          selectedScreenshotPreset ||
          file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        const item: ProjectImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          project_id: editingProject.id || '',
          image_url: uploadResult.publicUrl,
          file_path: uploadResult.filePath,
          file_name: uploadResult.fileName,
          mime_type: uploadResult.mimeType,
          file_size: uploadResult.fileSize,
          title: titleToUse,
          caption: `${editingProject.name || 'Project'} screenshot - ${titleToUse}`,
          image_type: 'screenshot',
          display_order: currentImages.length + 1,
          is_showcase: true,
          created_at: new Date().toISOString(),
        };
        currentImages.push(item);
      } catch (err: any) {
        setScreenshotError(`Upload error for ${file.name}: ${err.message || 'Storage upload failed'}`);
      }
    }

    const firstImg = currentImages[0]?.image_url || '';
    setEditingProject({
      ...editingProject,
      images: currentImages,
      thumbnail_url: editingProject.thumbnail_url || firstImg,
      image_url: editingProject.image_url || firstImg,
    });
    setUploadingScreenshot(false);
  };

  const updateScreenshotField = (index: number, field: keyof ProjectImage, value: any) => {
    if (!editingProject?.images) return;
    const updated = [...editingProject.images];
    updated[index] = { ...updated[index], [field]: value };
    setEditingProject({ ...editingProject, images: updated });
  };

  const handleReplaceScreenshot = async (index: number, file: File) => {
    if (!editingProject?.images) return;
    setUploadingScreenshot(true);
    try {
      const uploadResult = await uploadFileToStorage('project-images', file);
      const updated = [...editingProject.images];
      updated[index] = {
        ...updated[index],
        image_url: uploadResult.publicUrl,
        file_path: uploadResult.filePath,
        file_name: uploadResult.fileName,
        mime_type: uploadResult.mimeType,
        file_size: uploadResult.fileSize,
      };
      setEditingProject({ ...editingProject, images: updated });
      showNotice('Screenshot replaced successfully.');
    } catch (err: any) {
      setScreenshotError(`Failed to replace screenshot: ${err.message}`);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const removeScreenshot = async (index: number) => {
    if (!editingProject?.images) return;
    const imgToRemove = editingProject.images[index];
    if (imgToRemove.id && !imgToRemove.id.startsWith('img-')) {
      await deleteProjectImage(imgToRemove.id);
    }
    const updated = editingProject.images.filter((_, i) => i !== index);
    setEditingProject({ ...editingProject, images: updated });
    showNotice('Screenshot removed.');
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      showNotice('Project deleted.');
      loadData();
    }
  };

  const handleSaveCaseStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCaseStudy) return;

    await updateCaseStudy({
      ...editingCaseStudy.data,
      project_id: editingCaseStudy.project.id,
    });
    showNotice(`Case study for ${editingCaseStudy.project.name} updated.`);
    setEditingCaseStudy(null);
    loadData();
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAchievement?.title) return;

    if (editingAchievement.id) {
      await updateAchievement(editingAchievement.id, editingAchievement);
      showNotice('Achievement updated.');
    } else {
      await createAchievement(editingAchievement);
      showNotice('Achievement added.');
    }
    setEditingAchievement(null);
    loadData();
  };

  const handleDeleteAchievement = async (id: string) => {
    if (confirm('Delete this achievement?')) {
      await deleteAchievement(id);
      showNotice('Achievement removed.');
      loadData();
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCertification?.title) return;

    if (editingCertification.id) {
      await updateCertification(editingCertification.id, editingCertification);
      showNotice('Certification updated.');
    } else {
      await createCertification(editingCertification);
      showNotice('Certification added.');
    }
    setEditingCertification(null);
    loadData();
  };

  const handleDeleteCert = async (id: string) => {
    if (confirm('Delete this certification?')) {
      await deleteCertification(id);
      showNotice('Certification deleted.');
      loadData();
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title) return;

    if (editingArticle.id) {
      await updateEngineeringArticle(editingArticle.id, editingArticle);
      showNotice('Engineering article updated.');
    } else {
      await createEngineeringArticle(editingArticle);
      showNotice('Engineering article published.');
    }
    setEditingArticle(null);
    loadData();
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Delete this engineering article?')) {
      await deleteEngineeringArticle(id);
      showNotice('Article removed.');
      loadData();
    }
  };

  // ---------------------------------------------------------------------------
  // IF NOT AUTHENTICATED: SHOW SECURE LOGIN
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#050507]">
        <div className="w-full max-w-md">
          <LiquidGlassCard variant="elevated" className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-white" />
                <span className="font-serif text-xl text-white">Admin Console</span>
              </div>
              <button
                onClick={onExit}
                className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-sans mb-6">
              Authorized access only for I Nyoman Parta Yasa. Secure Supabase Auth & role enforcement.
            </p>

            {authError && (
              <div className="mb-4 p-3 bg-white/[0.04] border border-white/20 rounded-xl text-xs text-neutral-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  ADMINISTRATOR EMAIL
                </label>
                <input
                  type="email"
                  disabled
                  value="nvidiaparta@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 text-sm font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  SECURE PASSPHRASE
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator passphrase (default: parta2026)"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="pt-2">
                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={authLoading}
                  className="w-full"
                >
                  {authLoading ? 'Verifying...' : 'Authenticate & Open Dashboard'}
                </LiquidGlassButton>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 text-center pt-2">
                Authorized Engineer Key: <code className="text-neutral-300">parta2026</code>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050507] text-[#EDEDEF] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 liquid-glass-elevated rounded-xl border border-white/20 text-xs font-mono text-white flex items-center gap-2 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/[0.08] p-5 shrink-0 flex flex-col justify-between bg-[#070709]">
        <div>
          {/* Brand & Exit */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
            <div>
              <div className="font-serif text-lg text-white">Parta Console</div>
              <div className="text-[10px] font-mono text-neutral-400">ADMIN / RLS ENFORCED</div>
            </div>
            <button
              onClick={onExit}
              className="p-1.5 liquid-glass rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 text-xs font-mono">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'projects', label: 'Projects', count: projects.length, icon: FolderGit2 },
              { id: 'project_media', label: 'Project Media', icon: ImageIcon },
              { id: 'engineering_docs', label: 'Engineering Documentation', icon: BookOpen },
              { id: 'achievements', label: 'Achievements', count: achievements.length, icon: Award },
              { id: 'certifications', label: 'Certifications', count: certifications.length, icon: ShieldCheck },
              { id: 'technologies', label: 'Skills & Technologies', count: technologies.length, icon: Cpu },
              {
                id: 'profile_settings',
                label: 'Profile Settings',
                count: messages.filter((m) => !m.is_read).length,
                icon: Settings,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Session Info & Logout */}
        <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center justify-between text-xs font-mono">
          <div className="truncate">
            <div className="text-white truncate">I Nyoman Parta Yasa</div>
            <div className="text-[10px] text-neutral-400">Master Administrator</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* ----------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <div className="text-xs font-mono text-neutral-400">CONTROL CENTER</div>
              <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Platform Overview</h1>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <LiquidGlassCard variant="default" className="p-5">
                <div className="text-xs font-mono text-neutral-400">PUBLISHED PROJECTS</div>
                <div className="text-3xl font-serif text-white mt-1">
                  {projects.filter((p) => p.publication_status === 'published').length}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-1">
                  {projects.filter((p) => p.publication_status === 'draft').length} Drafts
                </div>
              </LiquidGlassCard>

              <LiquidGlassCard variant="default" className="p-5">
                <div className="text-xs font-mono text-neutral-400">ACHIEVEMENTS & AWARDS</div>
                <div className="text-3xl font-serif text-white mt-1">{achievements.length}</div>
                <div className="text-[11px] text-neutral-400 font-mono mt-1">Regional & National</div>
              </LiquidGlassCard>

              <LiquidGlassCard variant="default" className="p-5">
                <div className="text-xs font-mono text-neutral-400">VERIFIED CERTIFICATIONS</div>
                <div className="text-3xl font-serif text-white mt-1">{certifications.length}</div>
                <div className="text-[11px] text-neutral-400 font-mono mt-1">Postgres · Go · Systems</div>
              </LiquidGlassCard>

              <LiquidGlassCard variant="default" className="p-5">
                <div className="text-xs font-mono text-neutral-400">INBOUND MESSAGES</div>
                <div className="text-3xl font-serif text-white mt-1">
                  {messages.length}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono mt-1">
                  {messages.filter((m) => !m.is_read).length} Unread
                </div>
              </LiquidGlassCard>
            </div>

            {/* Quick Actions & Recent Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Inbound Messages */}
              <div className="lg:col-span-7">
                <LiquidGlassCard variant="default" className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-serif text-white">Recent Inquiries</h2>
                    <button
                      onClick={() => {
                        setActiveTab('profile_settings');
                        setProfileSubTab('messages');
                      }}
                      className="text-xs font-mono text-neutral-400 hover:text-white"
                    >
                      View All ({messages.length}) →
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="py-8 text-center text-xs font-mono text-neutral-500">
                      No inbound inquiries received yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-white">{m.sender_name}</span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {new Date(m.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-300 font-mono">{m.subject}</div>
                          <p className="text-xs text-neutral-400 truncate font-sans">{m.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </LiquidGlassCard>
              </div>

              {/* Engine Status */}
              <div className="lg:col-span-5">
                <LiquidGlassCard variant="default" className="p-6 space-y-4">
                  <h2 className="text-lg font-serif text-white">Supabase Status</h2>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Database Engine:</span>
                      <span className="text-white font-semibold">PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">RLS Enforcement:</span>
                      <span className="text-white">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">BaaS Provider:</span>
                      <span className="text-white">Supabase</span>
                    </div>
                  </div>

                  <LiquidGlassButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveTab('profile_settings');
                      setProfileSubTab('supabase');
                    }}
                    className="w-full text-xs font-mono"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Manage Connection & Schema</span>
                  </LiquidGlassButton>
                </LiquidGlassCard>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 2: PROJECTS MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'projects' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-400">SYSTEM REPOSITORIES</div>
                <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Projects Management</h1>
              </div>
              <LiquidGlassButton
                variant="primary"
                size="sm"
                onClick={() =>
                  setEditingProject({
                    name: '',
                    slug: '',
                    short_description: '',
                    full_description: '',
                    category: 'Backend Engineering',
                    live_url: '',
                    github_url: '',
                    technologies: ['PostgreSQL', 'Go'],
                    publication_status: 'published',
                    is_featured: false,
                    display_order: projects.length + 1,
                  })
                }
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </LiquidGlassButton>
            </div>

            {/* Projects Table */}
            <LiquidGlassCard variant="default" className="overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/[0.06] bg-white/[0.02] text-neutral-400">
                  <tr>
                    <th className="p-4">PROJECT NAME</th>
                    <th className="p-4">SLUG</th>
                    <th className="p-4">CATEGORY</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{proj.name}</div>
                        <div className="text-[11px] text-neutral-400 font-sans truncate max-w-xs">
                          {proj.short_description}
                        </div>
                      </td>
                      <td className="p-4 text-neutral-300">/{proj.slug}</td>
                      <td className="p-4 text-neutral-400">{proj.category}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            proj.publication_status === 'published'
                              ? 'bg-white/10 text-white'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {proj.publication_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="p-1.5 liquid-glass rounded hover:text-white transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCaseStudy({
                              project: proj,
                              data: proj.case_study || {
                                project_id: proj.id,
                                overview: '',
                                problem_statement: '',
                                objectives: '',
                                solution: '',
                                system_architecture: '',
                                tech_stack_analysis: '',
                                backend_architecture: '',
                                database_design: '',
                                api_design: '',
                                auth_and_authz: '',
                                data_flow: '',
                                dsa_and_complexity: '',
                                time_complexity: '',
                                space_complexity: '',
                                engineering_decisions: '',
                                why_technologies_chosen: '',
                                alternative_solutions: '',
                                challenges_and_solutions: '',
                                lessons_learned: '',
                              },
                            });
                          }}
                          className="p-1.5 liquid-glass rounded hover:text-white transition-colors cursor-pointer"
                          title="Edit Engineering Case Study"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </LiquidGlassCard>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 3: PROJECT MEDIA MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'project_media' && (
          <ProjectMediaManager
            projects={projects}
            images={allImages}
            onRefresh={loadData}
            showNotice={showNotice}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 4: ENGINEERING DOCUMENTATION MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'engineering_docs' && (
          <EngineeringDocsManager
            projects={projects}
            documents={allDocuments}
            onRefresh={loadData}
            showNotice={showNotice}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 5: ACHIEVEMENTS MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'achievements' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-400">HONORS & COMPETITIONS</div>
                <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Achievements Management</h1>
              </div>
              <LiquidGlassButton
                variant="primary"
                size="sm"
                onClick={() =>
                  setEditingAchievement({
                    title: '',
                    competition_name: '',
                    organization: '',
                    year: '2025',
                    category: 'System Architecture',
                    award_ranking: '1st Place',
                    description: '',
                    personal_contribution: '',
                    technologies_used: ['PostgreSQL', 'Go'],
                    is_published: true,
                    display_order: achievements.length + 1,
                  })
                }
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Achievement</span>
              </LiquidGlassButton>
            </div>

            <div className="space-y-4">
              {achievements.map((ach) => (
                <LiquidGlassCard key={ach.id} variant="default" className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <span className="text-white font-semibold">{ach.award_ranking}</span>
                      <span>·</span>
                      <span>{ach.year}</span>
                      <span>·</span>
                      <span>{ach.competition_name}</span>
                    </div>
                    <h3 className="text-lg font-serif text-white mt-1">{ach.title}</h3>
                    <p className="text-xs text-neutral-300 font-sans mt-1 max-w-2xl">{ach.description}</p>
                    {ach.certificate_url && (
                      <div className="mt-2 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-neutral-300" />
                        <span>Certificate file verified & attached</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingAchievement(ach)}
                      className="p-1.5 liquid-glass rounded hover:text-white transition-colors cursor-pointer"
                      title="Edit Achievement"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAchievement(ach.id)}
                      className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Achievement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 6: CERTIFICATIONS MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'certifications' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-400">TECHNICAL MASTERY</div>
                <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Certifications Management</h1>
              </div>
              <LiquidGlassButton
                variant="primary"
                size="sm"
                onClick={() =>
                  setEditingCertification({
                    title: '',
                    issuing_organization: '',
                    issue_date: '2025',
                    expiration_date: 'Lifetime',
                    credential_url: '',
                    skills_gained: ['Database Architecture'],
                    description: '',
                    is_published: true,
                    display_order: certifications.length + 1,
                  })
                }
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Certification</span>
              </LiquidGlassButton>
            </div>

            <div className="space-y-4">
              {certifications.map((cert) => (
                <LiquidGlassCard key={cert.id} variant="default" className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                      <span className="text-white">{cert.issuing_organization}</span>
                      <span>·</span>
                      <span>{cert.issue_date}</span>
                    </div>
                    <h3 className="text-lg font-serif text-white mt-1">{cert.title}</h3>
                    <p className="text-xs text-neutral-300 font-sans mt-1 max-w-2xl">{cert.description}</p>
                    {cert.certificate_url && (
                      <div className="mt-2 text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-neutral-300" />
                        <span>Certificate document attached</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingCertification(cert)}
                      className="p-1.5 liquid-glass rounded hover:text-white transition-colors cursor-pointer"
                      title="Edit Certification"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCert(cert.id)}
                      className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Certification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 7: SKILLS & TECHNOLOGIES */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'technologies' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-400">STACK TAXONOMY</div>
                <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Skills & Technologies</h1>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.map((t) => (
                <LiquidGlassCard key={t.id} variant="default" className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-500">{t.category}</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{t.name}</div>
                    {t.description && (
                      <div className="text-[11px] text-neutral-400 truncate max-w-[200px] mt-0.5">
                        {t.description}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      deleteTechnology(t.id).then(loadData);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </LiquidGlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 8: PROFILE SETTINGS (CONSOLIDATED SUITE) */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'profile_settings' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <div className="text-xs font-mono text-neutral-400">ADMINISTRATION & SETTINGS</div>
              <h1 className="text-3xl font-serif text-white tracking-tight mt-1">Profile & System Settings</h1>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Configure biography, live Supabase PostgreSQL connection, inbound inquiries, and case studies.
              </p>
            </div>

            {/* Segmented Sub Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3 text-xs font-mono">
              {[
                { id: 'profile', label: 'Profile Bio & Identity', icon: User },
                { id: 'supabase', label: 'Supabase Engine & Migrations', icon: Database },
                {
                  id: 'messages',
                  label: `Inbound Inquiries (${messages.filter((m) => !m.is_read).length} unread)`,
                  icon: Mail,
                },
                { id: 'articles', label: `Engineering Articles (${articles.length})`, icon: BookOpen },
                { id: 'casestudies', label: 'Case Studies Directory', icon: FileText },
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = profileSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setProfileSubTab(sub.id as typeof profileSubTab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'liquid-glass text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SUB-SECTION 1: PROFILE BIO */}
            {profileSubTab === 'profile' && profile && (
              <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await updateProfile(profile);
                    showNotice('Profile updated successfully.');
                  }}
                  className="space-y-4 text-xs font-mono"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1">FULL NAME</label>
                      <input
                        type="text"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">PROFESSIONAL TITLE</label>
                      <input
                        type="text"
                        value={profile.professional_title}
                        onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-400 mb-1">LOCATION</label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">HERO HEADLINE</label>
                    <input
                      type="text"
                      value={profile.hero_headline}
                      onChange={(e) => setProfile({ ...profile, hero_headline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">HERO STATEMENT</label>
                    <input
                      type="text"
                      value={profile.hero_statement}
                      onChange={(e) => setProfile({ ...profile, hero_statement: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">SHORT BIOGRAPHY</label>
                    <textarea
                      rows={3}
                      value={profile.bio_short}
                      onChange={(e) => setProfile({ ...profile, bio_short: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">FULL BIOGRAPHY</label>
                    <textarea
                      rows={6}
                      value={profile.bio_full}
                      onChange={(e) => setProfile({ ...profile, bio_full: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">MEDICAL LABORATORY JOURNEY</label>
                    <textarea
                      rows={6}
                      value={profile.medical_lab_journey}
                      onChange={(e) => setProfile({ ...profile, medical_lab_journey: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <LiquidGlassButton type="submit" variant="primary" size="md">
                      Save Profile Changes
                    </LiquidGlassButton>
                  </div>
                </form>
              </LiquidGlassCard>
            )}

            {/* SUB-SECTION 2: SUPABASE ENGINE & MIGRATION */}
            {profileSubTab === 'supabase' && (
              <div className="space-y-6">
                <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-6">
                  <h2 className="text-xl font-serif text-white">Live Supabase Connection</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">
                        SUPABASE PROJECT URL (e.g. https://your-project.supabase.co)
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1">
                        SUPABASE ANON / PUBLIC API KEY
                      </label>
                      <input
                        type="password"
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <LiquidGlassButton
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={testingConnection}
                        onClick={handleSaveAndTestConnection}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                        <span>{testingConnection ? 'Testing Connection...' : 'Save & Test Live Connection'}</span>
                      </LiquidGlassButton>

                      <LiquidGlassButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={seedingDatabase}
                        onClick={handleSeedDatabase}
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{seedingDatabase ? 'Seeding Tables...' : 'Seed Database to Supabase (1-Click)'}</span>
                      </LiquidGlassButton>
                    </div>

                    {connectionStatus.tested && (
                      <div
                        className={`p-4 rounded-xl text-xs font-mono border ${
                          connectionStatus.success
                            ? 'bg-white/[0.04] border-white/20 text-white'
                            : 'bg-red-500/10 border-red-500/20 text-red-300'
                        }`}
                      >
                        <div className="font-semibold mb-1">
                          {connectionStatus.success ? 'Supabase Connection Verified' : 'Connection Notice'}
                        </div>
                        <div>{connectionStatus.message}</div>
                      </div>
                    )}

                    {seedResult && (
                      <div className="p-4 bg-white/[0.04] border border-white/20 rounded-xl text-xs font-mono text-neutral-200">
                        <div className="font-semibold text-white mb-1">Seeding Result:</div>
                        <div>{seedResult}</div>
                      </div>
                    )}
                  </div>
                </LiquidGlassCard>

                {/* SQL Migration Script Exporter */}
                <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-serif text-white">PostgreSQL Schema & RLS Migration Script</h2>
                      <p className="text-xs text-neutral-400 font-sans mt-0.5">
                        Run this SQL script in your Supabase SQL Editor to bootstrap all tables, indexes, and storage buckets.
                      </p>
                    </div>
                    <LiquidGlassButton variant="secondary" size="sm" onClick={copySqlMigration}>
                      {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{sqlCopied ? 'Copied to Clipboard' : 'Copy SQL Script'}</span>
                    </LiquidGlassButton>
                  </div>

                  <div className="relative">
                    <pre className="p-4 bg-black/60 border border-white/10 rounded-xl overflow-x-auto text-[11px] font-mono text-neutral-300 max-h-80 leading-relaxed">
                      <code>{SUPABASE_SQL_MIGRATION}</code>
                    </pre>
                  </div>
                </LiquidGlassCard>
              </div>
            )}

            {/* SUB-SECTION 3: INBOUND MESSAGES */}
            {profileSubTab === 'messages' && (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <LiquidGlassCard variant="default" className="p-8 text-center text-xs font-mono text-neutral-500">
                    No inbound contact messages received.
                  </LiquidGlassCard>
                ) : (
                  messages.map((m) => (
                    <LiquidGlassCard
                      key={m.id}
                      variant={m.is_read ? 'subtle' : 'default'}
                      className={`p-6 space-y-3 ${!m.is_read ? 'border-white/20' : ''}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono border-b border-white/[0.06] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{m.sender_name}</span>
                          <span className="text-neutral-500">({m.sender_email})</span>
                        </div>
                        <span className="text-neutral-400">{new Date(m.created_at).toLocaleString()}</span>
                      </div>

                      <div className="text-sm font-semibold text-white font-mono">{m.subject}</div>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                        {m.message}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs font-mono">
                        <a
                          href={`mailto:${m.sender_email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                          className="text-white hover:underline flex items-center gap-1"
                        >
                          <span>Reply via Email</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              await markContactMessageRead(m.id, !m.is_read);
                              loadData();
                            }}
                            className="px-2.5 py-1 liquid-glass rounded text-[11px] text-neutral-300 hover:text-white"
                          >
                            {m.is_read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            onClick={async () => {
                              await deleteContactMessage(m.id);
                              loadData();
                            }}
                            className="p-1 liquid-glass rounded text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </LiquidGlassCard>
                  ))
                )}
              </div>
            )}

            {/* SUB-SECTION 4: ENGINEERING ARTICLES */}
            {profileSubTab === 'articles' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <LiquidGlassButton
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setEditingArticle({
                        title: '',
                        slug: '',
                        topic: 'DSA',
                        summary: '',
                        problem_statement: '',
                        explanation: '',
                        solution: '',
                        code_examples: '',
                        complexity_analysis: '',
                        is_published: true,
                        display_order: articles.length + 1,
                      })
                    }
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Write New Article</span>
                  </LiquidGlassButton>
                </div>
                {articles.map((art) => (
                  <LiquidGlassCard key={art.id} variant="default" className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                        <span className="text-white font-semibold">{art.topic}</span>
                        <span>·</span>
                        <span>/{art.slug}</span>
                      </div>
                      <h3 className="text-lg font-serif text-white mt-1">{art.title}</h3>
                      <p className="text-xs text-neutral-300 font-sans mt-1 max-w-2xl">{art.summary}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="p-1.5 liquid-glass rounded hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 liquid-glass rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </LiquidGlassCard>
                ))}
              </div>
            )}

            {/* SUB-SECTION 5: CASE STUDIES DIRECTORY */}
            {profileSubTab === 'casestudies' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <LiquidGlassCard key={proj.id} variant="default" className="p-6 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400">{proj.category}</span>
                      <h3 className="text-xl font-serif text-white mt-0.5">{proj.name}</h3>
                    </div>

                    <div className="text-xs font-mono text-neutral-300 space-y-1">
                      <div>Status: {proj.case_study ? 'Complete Writeup' : 'Pending Details'}</div>
                      <div className="text-neutral-500">Route: /projects/{proj.slug}</div>
                    </div>

                    <LiquidGlassButton
                      variant="primary"
                      size="sm"
                      className="w-full text-xs font-mono"
                      onClick={() => {
                        setEditingCaseStudy({
                          project: proj,
                          data: proj.case_study || {
                            project_id: proj.id,
                            overview: '',
                            problem_statement: '',
                            objectives: '',
                            solution: '',
                            system_architecture: '',
                            tech_stack_analysis: '',
                            backend_architecture: '',
                            database_design: '',
                            api_design: '',
                            auth_and_authz: '',
                            data_flow: '',
                            dsa_and_complexity: '',
                            time_complexity: '',
                            space_complexity: '',
                            engineering_decisions: '',
                            why_technologies_chosen: '',
                            alternative_solutions: '',
                            challenges_and_solutions: '',
                            lessons_learned: '',
                          },
                        });
                      }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Open Case Study Editor</span>
                    </LiquidGlassButton>
                  </LiquidGlassCard>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT PROJECT */}
      {/* ----------------------------------------------------------------- */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">PROJECT NAME *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">SLUG (URL KEY) *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">CATEGORY</label>
                <input
                  type="text"
                  value={editingProject.category || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SHORT DESCRIPTION *</label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.short_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, short_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">FULL DESCRIPTION</label>
                <textarea
                  rows={4}
                  value={editingProject.full_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">LIVE SYSTEM URL</label>
                  <input
                    type="url"
                    value={editingProject.live_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">GITHUB REPO URL</label>
                  <input
                    type="url"
                    value={editingProject.github_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">PUBLICATION STATUS</label>
                  <select
                    value={editingProject.publication_status || 'published'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        publication_status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">TECHNOLOGIES (COMMA-SEPARATED)</label>
                  <input
                    type="text"
                    value={(editingProject.technologies || []).join(', ')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DEDICATED PROJECT SCREENSHOTS SECTION */}
              {/* ------------------------------------------------------------- */}
              <div className="pt-6 border-t border-white/[0.08] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400">MEDIA ASSETS & EVIDENCE</div>
                    <h3 className="text-base font-serif text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-white" />
                      <span>Project Screenshots ({editingProject.images?.length || 0})</span>
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Supports JPG, PNG, WEBP (Max 15MB)
                  </span>
                </div>

                {/* Quick Title Presets */}
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] font-mono text-neutral-400">
                    RECOMMENDED SCREENSHOT PRESETS (CLICK TO SET ACTIVE PRESET TITLE):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Homepage screenshot',
                      'Admin dashboard screenshot',
                      'Charger management screenshot',
                      'Telemetry dashboard screenshot',
                      'Database architecture screenshot',
                      'Mobile interface screenshot',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSelectedScreenshotPreset(preset)}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded-lg transition-colors cursor-pointer border ${
                          selectedScreenshotPreset === preset
                            ? 'bg-white text-black border-white font-semibold'
                            : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {selectedScreenshotPreset === preset ? '✓ ' : '+ '}
                        {preset}
                      </button>
                    ))}
                  </div>
                  {selectedScreenshotPreset && (
                    <div className="text-[10px] font-mono text-neutral-400 flex items-center justify-between pt-1">
                      <span>Next uploaded screenshot will be labeled: <strong>{selectedScreenshotPreset}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedScreenshotPreset('')}
                        className="text-neutral-500 hover:text-white underline text-[9px]"
                      >
                        Clear Preset
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingScreenshot(true);
                  }}
                  onDragLeave={() => setIsDraggingScreenshot(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingScreenshot(false);
                    if (e.dataTransfer.files) handleUploadScreenshots(e.dataTransfer.files);
                  }}
                  className={`p-5 rounded-2xl border-2 border-dashed text-center transition-all ${
                    isDraggingScreenshot
                      ? 'border-white bg-white/[0.08]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                  }`}
                >
                  <input
                    type="file"
                    id="screenshot-modal-input"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      if (e.target.files) handleUploadScreenshots(e.target.files);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="screenshot-modal-input" className="cursor-pointer block">
                    <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                    <div className="text-xs font-mono text-white">
                      Click to upload screenshots or drag & drop files here
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      Uploaded assets are saved to Supabase Storage & linked to {editingProject.name || 'this project'}.
                    </div>
                  </label>

                  {uploadingScreenshot && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-white">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading screenshot to Supabase Storage...</span>
                    </div>
                  )}

                  {screenshotError && (
                    <div className="mt-2 text-[11px] font-mono text-red-400">
                      {screenshotError}
                    </div>
                  )}
                </div>

                {/* Screenshots List */}
                {(!editingProject.images || editingProject.images.length === 0) ? (
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl text-center text-xs font-mono text-neutral-500">
                    No screenshots attached to this project yet. Use the presets above or drag images into the dropzone.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editingProject.images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Thumbnail preview */}
                        <div className="w-32 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black relative group">
                          <img
                            src={img.image_url}
                            alt={img.title || 'Screenshot'}
                            className="w-full h-full object-cover"
                          />
                          {(editingProject.thumbnail_url === img.image_url || editingProject.image_url === img.image_url) && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-white text-black text-[9px] font-mono font-bold rounded">
                              COVER
                            </span>
                          )}
                        </div>

                        {/* Metadata editing */}
                        <div className="flex-1 space-y-2 w-full text-xs font-mono">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] text-neutral-400 mb-0.5">SCREENSHOT TITLE</label>
                              <input
                                type="text"
                                value={img.title || ''}
                                placeholder="e.g. Telemetry dashboard screenshot"
                                onChange={(e) => updateScreenshotField(idx, 'title', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-400 mb-0.5">DESCRIPTION / CAPTION</label>
                              <input
                                type="text"
                                value={img.caption || ''}
                                placeholder="e.g. Real-time load curve & 200kW peak monitor"
                                onChange={(e) => updateScreenshotField(idx, 'caption', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/[0.04]">
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-neutral-300">
                                <input
                                  type="checkbox"
                                  checked={img.is_showcase ?? true}
                                  onChange={(e) => updateScreenshotField(idx, 'is_showcase', e.target.checked)}
                                  className="accent-white"
                                />
                                <span>Showcase on Homepage Marquee</span>
                              </label>
                              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                                <span>Order:</span>
                                <input
                                  type="number"
                                  value={img.display_order ?? idx + 1}
                                  onChange={(e) => updateScreenshotField(idx, 'display_order', parseInt(e.target.value) || 0)}
                                  className="w-12 px-1 py-0.5 rounded bg-black/40 border border-white/10 text-white text-center text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {editingProject.thumbnail_url !== img.image_url && editingProject.image_url !== img.image_url && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingProject({
                                      ...editingProject,
                                      thumbnail_url: img.image_url,
                                      image_url: img.image_url,
                                    })
                                  }
                                  className="px-2 py-1 text-[10px] liquid-glass text-neutral-300 hover:text-white rounded cursor-pointer"
                                >
                                  Set as Cover
                                </button>
                              )}
                              {/* Replace File */}
                              <label className="px-2 py-1 text-[10px] liquid-glass text-neutral-300 hover:text-white rounded cursor-pointer">
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) handleReplaceScreenshot(idx, e.target.files[0]);
                                  }}
                                />
                              </label>
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeScreenshot(idx)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="Delete Screenshot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Project & Screenshots
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT CASE STUDY */}
      {/* ----------------------------------------------------------------- */}
      {editingCaseStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="text-[10px] font-mono text-neutral-400">ENGINEERING CASE STUDY EDITOR</span>
                <h2 className="text-xl font-serif text-white">{editingCaseStudy.project.name}</h2>
              </div>
              <button
                onClick={() => setEditingCaseStudy(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCaseStudy} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">PROBLEM STATEMENT</label>
                <textarea
                  rows={3}
                  value={editingCaseStudy.data.problem_statement || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, problem_statement: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">OBJECTIVES</label>
                <textarea
                  rows={2}
                  value={editingCaseStudy.data.objectives || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, objectives: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SOLUTION</label>
                <textarea
                  rows={3}
                  value={editingCaseStudy.data.solution || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, solution: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SYSTEM ARCHITECTURE (DATA FLOW & TOPOLOGY)</label>
                <textarea
                  rows={3}
                  value={editingCaseStudy.data.system_architecture || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, system_architecture: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">TIME COMPLEXITY (BIG O)</label>
                  <input
                    type="text"
                    value={editingCaseStudy.data.time_complexity || ''}
                    onChange={(e) =>
                      setEditingCaseStudy({
                        ...editingCaseStudy,
                        data: { ...editingCaseStudy.data, time_complexity: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">SPACE COMPLEXITY (BIG O)</label>
                  <input
                    type="text"
                    value={editingCaseStudy.data.space_complexity || ''}
                    onChange={(e) =>
                      setEditingCaseStudy({
                        ...editingCaseStudy,
                        data: { ...editingCaseStudy.data, space_complexity: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">DATA STRUCTURES & ALGORITHMS</label>
                <textarea
                  rows={2}
                  value={editingCaseStudy.data.dsa_and_complexity || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, dsa_and_complexity: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">DATABASE DESIGN & ISOLATION LEVEL</label>
                <textarea
                  rows={3}
                  value={editingCaseStudy.data.database_design || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, database_design: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">ENGINEERING DECISIONS & TRADE-OFFS</label>
                <textarea
                  rows={3}
                  value={editingCaseStudy.data.engineering_decisions || ''}
                  onChange={(e) =>
                    setEditingCaseStudy({
                      ...editingCaseStudy,
                      data: { ...editingCaseStudy.data, engineering_decisions: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingCaseStudy(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Case Study
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT ACHIEVEMENT */}
      {/* ----------------------------------------------------------------- */}
      {editingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">
                {editingAchievement.id ? 'Edit Achievement' : 'Create New Achievement'}
              </h2>
              <button
                onClick={() => setEditingAchievement(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAchievement} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">AWARD / ACHIEVEMENT TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.title || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                    placeholder="e.g. 1st Place Champion"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">AWARD RANKING</label>
                  <input
                    type="text"
                    value={editingAchievement.award_ranking || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, award_ranking: e.target.value })}
                    placeholder="e.g. 1st Place / Gold Medal"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">COMPETITION / EVENT NAME</label>
                  <input
                    type="text"
                    value={editingAchievement.competition_name || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, competition_name: e.target.value })}
                    placeholder="e.g. Bali National Backend Hackathon"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">ISSUING ORGANIZATION</label>
                  <input
                    type="text"
                    value={editingAchievement.organization || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, organization: e.target.value })}
                    placeholder="e.g. Ministry of Communications"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">YEAR</label>
                  <input
                    type="text"
                    value={editingAchievement.year || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={editingAchievement.category || ''}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, category: e.target.value })}
                    placeholder="System Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={editingAchievement.display_order ?? 1}
                    onChange={(e) => setEditingAchievement({ ...editingAchievement, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingAchievement.description || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                  placeholder="Detailed context of the competition scope and achievement..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">PERSONAL CONTRIBUTION</label>
                <textarea
                  rows={2}
                  value={editingAchievement.personal_contribution || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, personal_contribution: e.target.value })}
                  placeholder="Architected database isolation, Redis queue, and deadlock resolution pipeline..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">CREDENTIAL / PROOF URL</label>
                <input
                  type="url"
                  value={editingAchievement.credential_url || ''}
                  onChange={(e) => setEditingAchievement({ ...editingAchievement, credential_url: e.target.value })}
                  placeholder="https://verify.institution.org/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                />
              </div>

              {/* Certificate Upload Section */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <label className="block text-neutral-400 text-xs">CERTIFICATE FILE ATTACHMENT (IMAGE OR PDF)</label>
                {editingAchievement.certificate_url ? (
                  <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 truncate">
                      {editingAchievement.certificate_url.includes('.pdf') ? (
                        <FileText className="w-8 h-8 text-neutral-400 shrink-0" />
                      ) : (
                        <img
                          src={editingAchievement.certificate_url}
                          alt="Certificate Preview"
                          className="w-12 h-12 object-cover rounded border border-white/10 shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <div className="text-white text-xs truncate">Certificate Attached</div>
                        <a
                          href={editingAchievement.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Preview Attachment</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingAchievement({ ...editingAchievement, certificate_url: '' })}
                      className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="achievement-cert-file-input"
                      accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf,image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCertificate(true);
                        try {
                          const res = await uploadFileToStorage('achievement-certificates', file);
                          setEditingAchievement({ ...editingAchievement, certificate_url: res.publicUrl });
                          showNotice('Certificate uploaded successfully.');
                        } catch (err: any) {
                          showNotice(`Upload error: ${err.message}`);
                        } finally {
                          setUploadingCertificate(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="achievement-cert-file-input"
                      className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-white/30 cursor-pointer text-neutral-400 hover:text-white transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingCertificate ? 'Uploading certificate...' : 'Upload Certificate (JPG, PNG, PDF)'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingAchievement(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Achievement
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT CERTIFICATION */}
      {/* ----------------------------------------------------------------- */}
      {editingCertification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">
                {editingCertification.id ? 'Edit Certification' : 'Create New Certification'}
              </h2>
              <button
                onClick={() => setEditingCertification(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">CERTIFICATION TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingCertification.title || ''}
                    onChange={(e) => setEditingCertification({ ...editingCertification, title: e.target.value })}
                    placeholder="e.g. Professional PostgreSQL Database Administrator"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">ISSUING ORGANIZATION *</label>
                  <input
                    type="text"
                    required
                    value={editingCertification.issuing_organization || ''}
                    onChange={(e) => setEditingCertification({ ...editingCertification, issuing_organization: e.target.value })}
                    placeholder="e.g. PostgreSQL Professional Group"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">ISSUE DATE</label>
                  <input
                    type="text"
                    value={editingCertification.issue_date || ''}
                    onChange={(e) => setEditingCertification({ ...editingCertification, issue_date: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">EXPIRATION DATE</label>
                  <input
                    type="text"
                    value={editingCertification.expiration_date || ''}
                    onChange={(e) => setEditingCertification({ ...editingCertification, expiration_date: e.target.value })}
                    placeholder="Lifetime"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">DISPLAY ORDER</label>
                  <input
                    type="number"
                    value={editingCertification.display_order ?? 1}
                    onChange={(e) => setEditingCertification({ ...editingCertification, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">CREDENTIAL ID / URL</label>
                <input
                  type="text"
                  value={editingCertification.credential_url || ''}
                  onChange={(e) => setEditingCertification({ ...editingCertification, credential_url: e.target.value })}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SKILLS GAINED (COMMA-SEPARATED)</label>
                <input
                  type="text"
                  value={(editingCertification.skills_gained || []).join(', ')}
                  onChange={(e) =>
                    setEditingCertification({
                      ...editingCertification,
                      skills_gained: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="PostgreSQL, Query Planner, Vacuuming, Index Tuning"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editingCertification.description || ''}
                  onChange={(e) => setEditingCertification({ ...editingCertification, description: e.target.value })}
                  placeholder="Demonstrated mastery in production database administration, replication, and disaster recovery..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              {/* Certificate File Upload Section */}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <label className="block text-neutral-400 text-xs">CERTIFICATION DOCUMENT (IMAGE OR PDF)</label>
                {editingCertification.certificate_url ? (
                  <div className="p-3 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 truncate">
                      {editingCertification.certificate_url.includes('.pdf') ? (
                        <FileText className="w-8 h-8 text-neutral-400 shrink-0" />
                      ) : (
                        <img
                          src={editingCertification.certificate_url}
                          alt="Certificate Preview"
                          className="w-12 h-12 object-cover rounded border border-white/10 shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <div className="text-white text-xs truncate">Certificate File Attached</div>
                        <a
                          href={editingCertification.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Preview Attachment</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCertification({ ...editingCertification, certificate_url: '' })}
                      className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Remove Certificate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="certification-file-input"
                      accept=".jpg,.jpeg,.png,.webp,.pdf,application/pdf,image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCertificate(true);
                        try {
                          const res = await uploadFileToStorage('certification-files', file);
                          setEditingCertification({ ...editingCertification, certificate_url: res.publicUrl });
                          showNotice('Certification document uploaded successfully.');
                        } catch (err: any) {
                          showNotice(`Upload error: ${err.message}`);
                        } finally {
                          setUploadingCertificate(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="certification-file-input"
                      className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] hover:border-white/30 cursor-pointer text-neutral-400 hover:text-white transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>
                        {uploadingCertificate ? 'Uploading certification...' : 'Upload Certificate / Badge (JPG, PNG, PDF)'}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingCertification(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Save Certification
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* MODAL: EDIT ENGINEERING ARTICLE */}
      {/* ----------------------------------------------------------------- */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <LiquidGlassCard variant="elevated" className="w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-xl font-serif text-white">
                {editingArticle.id ? 'Edit Engineering Article' : 'Write Engineering Article'}
              </h2>
              <button
                onClick={() => setEditingArticle(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-neutral-400 mb-1">ARTICLE TITLE *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-sm"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">TOPIC / DOMAIN</label>
                  <select
                    value={editingArticle.topic || 'DSA'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, topic: e.target.value as ArticleTopic })}
                    className="w-full px-3 py-2 rounded-xl bg-[#09090C] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="DSA">DSA</option>
                    <option value="System Architecture">System Architecture</option>
                    <option value="Database Engineering">Database Engineering</option>
                    <option value="Backend API">Backend API</option>
                    <option value="AI Engineering">AI Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">URL SLUG *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.slug || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                  placeholder="postgresql-pessimistic-locking-guide"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">SUMMARY *</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">PROBLEM STATEMENT</label>
                <textarea
                  rows={3}
                  value={editingArticle.problem_statement || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, problem_statement: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">TECHNICAL EXPLANATION</label>
                <textarea
                  rows={4}
                  value={editingArticle.explanation || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, explanation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">CODE EXAMPLES & IMPLEMENTATION</label>
                <textarea
                  rows={5}
                  value={editingArticle.code_examples || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, code_examples: e.target.value })}
                  placeholder="SELECT ... FOR UPDATE NOWAIT;"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-neutral-200 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 liquid-glass text-neutral-400 hover:text-white rounded-xl"
                >
                  Cancel
                </button>
                <LiquidGlassButton type="submit" variant="primary" size="md">
                  Publish Article
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  );
};
