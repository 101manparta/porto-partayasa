import React from 'react';
import { ArrowUpRight, CheckCircle2, GitBranch, MapPin, Microscope, Server, Terminal } from 'lucide-react';
import { Profile } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlass';

interface AboutViewProps {
  profile: Profile;
  onNavigate: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ profile, onNavigate }) => {
  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/[0.08] pb-10 mb-12">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
          <span>{profile.location || 'Bali, Indonesia'}</span>
          <span aria-hidden="true">·</span>
          <span>Engineering Philosophy</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.05]">
          Engineering with Scientific Precision
        </h1>

        <p className="mt-4 text-lg font-serif italic text-neutral-300">
          From the diagnostic clinical laboratory to high-throughput backend architecture.
        </p>
      </header>

      {/* Narrative Section */}
      <div className="space-y-10">
        {/* Full Bio Card */}
        <LiquidGlassCard variant="default" className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight mb-4">
            Professional Overview
          </h2>
          <div className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed space-y-4">
            {profile.bio_full.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </LiquidGlassCard>

        {/* The Transition: Clinical Rigor to Distributed Systems */}
        <LiquidGlassCard variant="elevated" className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 liquid-glass rounded-xl text-neutral-300">
              <Microscope className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <span className="text-xs font-mono text-neutral-400">FOUNDATIONAL ETHOS</span>
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                The Medical Laboratory Foundation
              </h2>
            </div>
          </div>

          <div className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed space-y-4">
            {profile.medical_lab_journey.split('\n\n').map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>

          {/* Comparison Matrix: Clinical Science vs Backend Architecture */}
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <span className="text-xs font-mono text-neutral-400 block mb-4">
              PARALLELS IN REASONING:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 font-semibold">
                  <Microscope className="w-4 h-4 text-neutral-400" />
                  <span>Clinical Laboratory Practice</span>
                </div>
                <ul className="text-xs text-neutral-400 font-sans space-y-1.5 leading-relaxed">
                  <li>• Zero tolerance for uncalibrated analytical drift.</li>
                  <li>• Deterministic specimen chain-of-custody protocols.</li>
                  <li>• Methodical differential diagnosis based on verified assays.</li>
                </ul>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 font-semibold">
                  <Server className="w-4 h-4 text-neutral-400" />
                  <span>Backend Engineering Practice</span>
                </div>
                <ul className="text-xs text-neutral-400 font-sans space-y-1.5 leading-relaxed">
                  <li>• Zero tolerance for silent database state corruptions.</li>
                  <li>• Deterministic idempotent API pipelines and audit ledgers.</li>
                  <li>• Root-cause debugging based on telemetry, not guesswork.</li>
                </ul>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Core Principles */}
        <LiquidGlassCard variant="default" className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight mb-4">
            Engineering Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono text-neutral-300">
            <div className="space-y-1.5">
              <span className="text-white font-semibold">01. INVARIANTS FIRST</span>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Systems must guarantee transactional boundaries at the database engine level, never relying solely on fragile application heuristics.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-white font-semibold">02. DEFENSIVE METRICS</span>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                If a state mutation or external payment callback cannot be validated with an idempotency key, it must not execute.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="text-white font-semibold">03. EMPIRICAL TELEMETRY</span>
              <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                Optimization decisions must stem from query planner buffers (`EXPLAIN ANALYZE`), flamegraphs, and latency percentiles.
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      {/* CTA Strip */}
      <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-neutral-500">Interested in technical collaboration?</span>
          <div className="text-sm font-serif text-white">Let's discuss system architecture.</div>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          <span>Initiate Contact</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
