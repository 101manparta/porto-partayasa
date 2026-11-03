import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  ChevronDown,
  ChevronUp,
  Cpu,
  Database,
  ShieldCheck,
  Network,
  Clock,
  HardDrive,
  Code2,
  Workflow,
  AlertTriangle,
  Lightbulb,
  Image as ImageIcon,
  FileText,
  Download,
  Eye,
  X,
  BookOpen,
  FileDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Project, ProjectImage, ProjectDocument } from '../../types';
import { getProjectImages, getProjectDocuments } from '../../lib/api';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';
import { ProjectVisualCard } from '../home/ProjectVisuals';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'api' | 'dsa' | 'decisions'>('architecture');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    architecture: true,
    database: true,
    dsa: true,
  });

  // Dynamic media and documentation state
  const [liveImages, setLiveImages] = useState<ProjectImage[]>(() => project.images || []);
  const [liveDocuments, setLiveDocuments] = useState<ProjectDocument[]>(() => project.documents || []);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ProjectDocument | null>(null);

  useEffect(() => {
    getProjectImages(project.id).then((imgs) => {
      if (imgs && imgs.length > 0) setLiveImages(imgs);
    });
    getProjectDocuments(project.id, false).then((docs) => {
      if (docs && docs.length > 0) setLiveDocuments(docs);
    });
  }, [project.id]);

  const cs = project.case_study;

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <article className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Systems</span>
        </button>
      </div>

      {/* Header Banner */}
      <header className="border-b border-white/[0.08] pb-10 mb-12">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-4">
          <span className="text-white font-semibold">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>Engineering Case Study</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-400">Production Deployed</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.05] text-balance">
          {project.name}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-3xl font-sans leading-relaxed">
          {project.full_description || project.short_description}
        </p>

        {/* Links & Technical Meta Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.06]">
          {/* External Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
              >
                <span>Launch Live System</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 liquid-glass text-xs font-medium text-neutral-200 hover:text-white rounded-xl transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>View Source Repository</span>
              </a>
            )}
          </div>

          {/* Stack list */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-neutral-400">
            <span className="text-neutral-500">Core Technologies:</span>
            {project.technologies.map((t, idx) => (
              <React.Fragment key={t}>
                <span className="text-neutral-200">{t}</span>
                {idx < project.technologies.length - 1 && <span className="text-neutral-600">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid: Problem / Solution Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
        {/* Problem Statement */}
        <LiquidGlassCard variant="default" className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-neutral-400" />
            <span>01. THE BOTTLENECK & CHALLENGE</span>
          </div>
          <h2 className="text-xl font-serif text-white tracking-tight mb-3">
            Problem Statement
          </h2>
          <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
            {cs?.problem_statement || 'High concurrency race conditions and distributed state drift under peak traffic.'}
          </p>

          {cs?.objectives && (
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="text-xs font-mono text-neutral-500 mb-2">ENGINEERING OBJECTIVES</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed whitespace-pre-line">
                {cs.objectives}
              </p>
            </div>
          )}
        </LiquidGlassCard>

        {/* Technical Solution */}
        <LiquidGlassCard variant="default" className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-neutral-400" />
            <span>02. THE ARCHITECTURAL ANSWER</span>
          </div>
          <h2 className="text-xl font-serif text-white tracking-tight mb-3">
            Technical Solution
          </h2>
          <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
            {cs?.solution || 'Two-phase reservation with Redis distributed tokens and PostgreSQL row-level locks.'}
          </p>

          {cs?.why_technologies_chosen && (
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="text-xs font-mono text-neutral-500 mb-2">RATIONALE FOR STACK SELECTION</div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed whitespace-pre-line">
                {cs.why_technologies_chosen}
              </p>
            </div>
          )}
        </LiquidGlassCard>
      </div>

      {/* Visual System Blueprint Section */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-mono text-neutral-500 tracking-wider">SYSTEM SCHEMATICS & TELEMETRY</div>
            <h2 className="text-2xl font-serif text-white tracking-tight mt-0.5">
              Live Architecture & Ingestion Flow
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[280px] sm:h-[320px] rounded-2xl overflow-hidden liquid-glass border border-white/10 p-2">
            <ProjectVisualCard
              slug={project.slug}
              type="dashboard"
              caption="Live Telemetry Console & State Synchronization"
            />
          </div>
          <div className="h-[280px] sm:h-[320px] rounded-2xl overflow-hidden liquid-glass border border-white/10 p-2">
            <ProjectVisualCard
              slug={project.slug}
              type="architecture"
              caption="Component Boundary & Invariant Guarantee Topology"
            />
          </div>
        </div>
      </section>

      {/* Dynamic Screenshots & Visual Evidence Gallery */}
      {liveImages && liveImages.length > 0 && (
        <section className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <div className="text-xs font-mono text-neutral-500 tracking-wider">PRODUCTION CONSOLES & SCREENSHOTS</div>
              <h2 className="text-2xl font-serif text-white tracking-tight mt-0.5">
                Visual Evidence & System Interfaces ({liveImages.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">Click to expand high-res screenshot</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="group cursor-pointer liquid-glass rounded-2xl overflow-hidden p-3 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.01]"
              >
                <div className="h-48 rounded-xl overflow-hidden bg-black/60 relative">
                  <img
                    src={img.image_url}
                    alt={img.title || img.caption || 'Project Screenshot'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-xl text-xs font-mono text-white flex items-center gap-1.5 border border-white/20">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect High-Res</span>
                    </span>
                  </div>
                  {img.is_showcase && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-white text-black text-[9px] font-mono font-bold rounded">
                      SHOWCASE
                    </span>
                  )}
                </div>

                <div className="mt-3 px-1">
                  <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-200 truncate">
                    {img.title || 'System Screenshot'}
                  </h3>
                  {img.caption && (
                    <p className="text-xs text-neutral-400 font-sans mt-0.5 line-clamp-2">
                      {img.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Documentation & Architecture Artifacts */}
      {liveDocuments && liveDocuments.length > 0 && (
        <section className="mb-14">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <div className="text-xs font-mono text-neutral-500 tracking-wider">TECHNICAL ARTIFACTS & SPECIFICATIONS</div>
              <h2 className="text-2xl font-serif text-white tracking-tight mt-0.5">
                Engineering Documentation ({liveDocuments.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">PDF schematics, ERDs & Sequence Flows</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveDocuments.map((doc) => (
              <LiquidGlassCard
                key={doc.id}
                variant="default"
                className="p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-semibold">
                      {doc.category}
                    </span>
                    <span className="text-neutral-500 text-[10px] uppercase">
                      {doc.mime_type.includes('pdf') ? 'PDF DOCUMENT' : 'DIAGRAM IMAGE'}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif text-white mt-2">{doc.title}</h3>
                  <p className="text-xs text-neutral-300 font-sans mt-1 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                  <span className="text-neutral-500 text-[11px] truncate max-w-[200px]">
                    {doc.file_name}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="px-3 py-1.5 liquid-glass text-white text-xs rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Artifact</span>
                    </button>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={doc.file_name}
                      className="p-1.5 liquid-glass text-neutral-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Download Artifact"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Deep Technical Chapters Accordion */}
      <section className="space-y-6">
        {/* 1. System Architecture */}
        <LiquidGlassCard variant="default" className="overflow-hidden">
          <button
            onClick={() => toggleSection('architecture')}
            className="w-full p-6 text-left flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-neutral-400" />
              <div>
                <span className="text-xs font-mono text-neutral-500">03. DISTRIBUTED TOPOLOGY</span>
                <h3 className="text-lg font-serif text-white">System & Backend Architecture</h3>
              </div>
            </div>
            {expandedSections.architecture ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {expandedSections.architecture && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-4">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-1">DATA FLOW & COMPONENT TOPOLOGY</div>
                <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                  {cs?.system_architecture}
                </p>
              </div>

              {cs?.backend_architecture && (
                <div className="pt-3 border-t border-white/[0.04]">
                  <div className="text-xs font-mono text-neutral-400 mb-1">BACKEND SERVICE DECOMPOSITION</div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                    {cs.backend_architecture}
                  </p>
                </div>
              )}

              {cs?.frontend_architecture && (
                <div className="pt-3 border-t border-white/[0.04]">
                  <div className="text-xs font-mono text-neutral-400 mb-1">CLIENT CONSUMPTION TIER</div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                    {cs.frontend_architecture}
                  </p>
                </div>
              )}
            </div>
          )}
        </LiquidGlassCard>

        {/* 2. Database Design & Relational Schema */}
        <LiquidGlassCard variant="default" className="overflow-hidden">
          <button
            onClick={() => toggleSection('database')}
            className="w-full p-6 text-left flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-neutral-400" />
              <div>
                <span className="text-xs font-mono text-neutral-500">04. DATA PERSISTENCE</span>
                <h3 className="text-lg font-serif text-white">Database Design & Invariants</h3>
              </div>
            </div>
            {expandedSections.database ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {expandedSections.database && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-4">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-1">RELATIONAL SCHEMA & ISOLATION LEVEL</div>
                <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                  {cs?.database_design}
                </p>
              </div>

              {cs?.database_relationships && (
                <div className="pt-3 border-t border-white/[0.04]">
                  <div className="text-xs font-mono text-neutral-400 mb-1">ENTITY RELATIONSHIPS (1:N, N:M)</div>
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                    {cs.database_relationships}
                  </p>
                </div>
              )}
            </div>
          )}
        </LiquidGlassCard>

        {/* 3. DSA, Complexity & Algorithms */}
        <LiquidGlassCard variant="default" className="overflow-hidden">
          <button
            onClick={() => toggleSection('dsa')}
            className="w-full p-6 text-left flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Workflow className="w-5 h-5 text-neutral-400" />
              <div>
                <span className="text-xs font-mono text-neutral-500">05. ALGORITHMIC RIGOR</span>
                <h3 className="text-lg font-serif text-white">Data Structures & Complexity Analysis</h3>
              </div>
            </div>
            {expandedSections.dsa ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
          </button>

          {expandedSections.dsa && (
            <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] space-y-4">
              <div>
                <div className="text-xs font-mono text-neutral-400 mb-1">ALGORITHMIC MECHANICS</div>
                <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                  {cs?.dsa_and_complexity}
                </p>
              </div>

              {/* Time & Space Complexity Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>TIME COMPLEXITY</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {cs?.time_complexity || 'O(1) / O(log N)'}
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>SPACE COMPLEXITY</span>
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {cs?.space_complexity || 'O(N)'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </LiquidGlassCard>

        {/* 4. API & Authentication */}
        <LiquidGlassCard variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-5 h-5 text-neutral-400" />
            <div>
              <span className="text-xs font-mono text-neutral-500">06. PROTOCOLS & SECURITY</span>
              <h3 className="text-lg font-serif text-white">API Design & Authentication</h3>
            </div>
          </div>
          <div className="space-y-4 pt-2 border-t border-white/[0.06]">
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-1">API CONTRACT & IDEMPOTENCY</div>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {cs?.api_design}
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.04]">
              <div className="text-xs font-mono text-neutral-400 mb-1">AUTHENTICATION & ROW LEVEL SECURITY</div>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {cs?.auth_and_authz}
              </p>
            </div>
          </div>
        </LiquidGlassCard>

        {/* 5. Engineering Decisions & Lessons Learned */}
        <LiquidGlassCard variant="default" className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-5 h-5 text-neutral-400" />
            <div>
              <span className="text-xs font-mono text-neutral-500">07. RETROSPECTIVE & TRADE-OFFS</span>
              <h3 className="text-lg font-serif text-white">Engineering Decisions & Lessons</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/[0.06]">
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-1">CRITICAL DECISIONS & ALTERNATIVES</div>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {cs?.engineering_decisions}
              </p>
              {cs?.alternative_solutions && (
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <span className="text-xs font-mono text-neutral-500">Rejected Alternatives:</span>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-1">
                    {cs.alternative_solutions}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-mono text-neutral-400 mb-1">LESSONS & RUNTIME INSIGHTS</div>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                {cs?.lessons_learned}
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      {/* Footer Navigation */}
      <div className="mt-14 pt-8 border-t border-white/[0.08] flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 liquid-glass text-xs text-neutral-300 hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Case Studies</span>
        </button>

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <span>Visit {project.name}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Lightbox Modal: High-Res Project Screenshot */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[92vh] flex flex-col liquid-glass-elevated rounded-2xl overflow-hidden border border-white/20"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#070709]">
              <div>
                <div className="text-[10px] font-mono text-neutral-400">PROJECT SCREENSHOT</div>
                <h3 className="text-base font-serif text-white">{selectedImage.title || project.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedImage.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 liquid-glass text-neutral-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-black/80 flex-1">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || 'Screenshot'}
                className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>

            {selectedImage.caption && (
              <div className="px-6 py-3 border-t border-white/[0.08] bg-[#070709] text-xs font-sans text-neutral-300">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal: Engineering Documentation / Diagram */}
      {selectedDocument && (
        <div
          onClick={() => setSelectedDocument(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[92vh] flex flex-col liquid-glass-elevated rounded-2xl overflow-hidden border border-white/20"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#070709]">
              <div>
                <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-mono font-semibold">
                  {selectedDocument.category}
                </span>
                <h3 className="text-base font-serif text-white mt-1">{selectedDocument.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={selectedDocument.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selectedDocument.file_name}
                  className="px-3 py-1.5 liquid-glass text-neutral-200 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-black/80 flex-1 min-h-[300px]">
              {selectedDocument.mime_type.includes('pdf') ? (
                <div className="text-center p-8 space-y-4">
                  <FileText className="w-16 h-16 text-neutral-400 mx-auto" />
                  <div className="text-base font-serif text-white">{selectedDocument.title}</div>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
                    {selectedDocument.description}
                  </p>
                  <div className="text-xs font-mono text-neutral-500">
                    Filename: {selectedDocument.file_name}
                  </div>
                  <a
                    href={selectedDocument.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    <span>Open PDF Document in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <img
                  src={selectedDocument.file_url}
                  alt={selectedDocument.title}
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                />
              )}
            </div>

            {selectedDocument.description && !selectedDocument.mime_type.includes('pdf') && (
              <div className="px-6 py-3 border-t border-white/[0.08] bg-[#070709] text-xs font-sans text-neutral-300">
                {selectedDocument.description}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
};
