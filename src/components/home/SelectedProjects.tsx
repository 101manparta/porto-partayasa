import React from 'react';
import { ArrowUpRight, ExternalLink, ShieldCheck, Cpu, Database } from 'lucide-react';
import { Project } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlass';
import { ProjectVisualCard } from './ProjectVisuals';

interface SelectedProjectsProps {
  projects: Project[];
  onSelectProject: (slug: string) => void;
}

export const SelectedProjects: React.FC<SelectedProjectsProps> = ({
  projects,
  onSelectProject,
}) => {
  return (
    <section className="w-full py-20 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="text-xs font-mono text-neutral-400 tracking-wider">
            PRODUCTION ARCHITECTURE & CASE STUDIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight mt-1">
            Featured Systems
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-sans">
          Engineered for mission-critical reliability, zero double-allocations, and predictable sub-millisecond query performance.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-12">
        {projects.map((project, index) => {
          return (
            <LiquidGlassCard
              key={project.id}
              variant="default"
              className="p-6 sm:p-8 overflow-hidden group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Technical Narrative & Engineering Breakdown */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Category & Index Metadata */}
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="text-white font-semibold">0{index + 1}.</span>
                    <span>{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-400">Production</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                    {project.short_description}
                  </p>

                  {/* Key Architectural Highlights */}
                  <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                    {project.slug === 'mlb-icon-bali' && (
                      <>
                        <div className="flex items-center gap-2 text-neutral-300">
                          <Database className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Pessimistic Row-Level Lock & Temporal Exclusion</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Redis Atomic 10-Minute Lease Window Token</span>
                        </div>
                      </>
                    )}
                    {project.slug === 'voltra' && (
                      <>
                        <div className="flex items-center gap-2 text-neutral-300">
                          <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Max-Heap Priority Queue Amperage Shedding</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Database className="w-3.5 h-3.5 text-neutral-500" />
                          <span>OCPP 1.6-J High-Frequency WebSocket Ingestion</span>
                        </div>
                      </>
                    )}
                    {project.slug === 'mediflow' && (
                      <>
                        <div className="flex items-center gap-2 text-neutral-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Deterministic Finite State Machine (FSM) Specimen Chain</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Database className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Automated Quality Control Multi-Rule Engine</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Technologies List (Unboxed typography with separators) */}
                  <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-neutral-400">
                    <span className="text-neutral-500">Stack:</span>
                    {project.technologies.map((tech, i) => (
                      <React.Fragment key={tech}>
                        <span className="text-neutral-300">{tech}</span>
                        {i < project.technologies.length - 1 && <span className="text-neutral-600">/</span>}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* CTA Actions */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onSelectProject(project.slug)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      <span>Engineering Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 liquid-glass text-xs text-neutral-300 hover:text-white rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        <span>Live System</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: High-Fidelity UI Console / Architecture Canvas */}
                <div className="lg:col-span-6 h-[280px] sm:h-[320px] rounded-xl overflow-hidden liquid-glass border border-white/10 p-2">
                  <ProjectVisualCard
                    slug={project.slug}
                    type="dashboard"
                    caption={`${project.name} · Real-time Technical Telemetry`}
                  />
                </div>
              </div>
            </LiquidGlassCard>
          );
        })}
      </div>
    </section>
  );
};
