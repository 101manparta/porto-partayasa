import React, { useState } from 'react';
import {
  Code,
  Layers,
  Database,
  Cpu,
  Workflow,
  Clock,
  HardDrive,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { EngineeringArticle } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlass';

interface EngineeringKnowledgeProps {
  articles: EngineeringArticle[];
  onSelectProject?: (slug: string) => void;
}

export const EngineeringKnowledge: React.FC<EngineeringKnowledgeProps> = ({
  articles,
  onSelectProject,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topics = [
    'All',
    'DSA',
    'Database Engineering',
    'System Architecture',
    'Backend API',
    'AI Engineering',
  ];

  const filteredArticles = selectedTopic === 'All'
    ? articles
    : articles.filter((a) => a.topic === selectedTopic);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/[0.08] pb-8 mb-10">
        <div className="text-xs font-mono text-neutral-400 tracking-wider">
          TECHNICAL REPOSITORIES & ALGORITHMIC ARCHITECTURE
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mt-1">
          Engineering Knowledge
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl font-sans leading-relaxed">
          In-depth architectural breakdowns covering Data Structures & Algorithms, high-throughput database concurrency, deterministic state machines, and system design patterns.
        </p>

        {/* Filter Tabs (Interactive filter tabs conforming to constitution §1.A) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/[0.06]">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                selectedTopic === t
                  ? 'bg-white text-black font-medium'
                  : 'liquid-glass text-neutral-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      {/* Articles Stream */}
      <div className="space-y-12">
        {filteredArticles.map((art, index) => (
          <LiquidGlassCard key={art.id} variant="default" className="p-6 sm:p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400 mb-3">
              <span className="text-white font-semibold">0{index + 1}.</span>
              <span className="text-neutral-300">{art.topic}</span>
              <span aria-hidden="true">·</span>
              <span>Engineering Principle</span>
              {art.related_projects && art.related_projects.length > 0 && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-neutral-400">
                    Implemented in: {art.related_projects.join(', ')}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              {art.title}
            </h2>

            {/* Summary */}
            <p className="mt-2 text-sm text-neutral-300 font-sans leading-relaxed">
              {art.summary}
            </p>

            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/[0.06]">
              <div className="space-y-1.5">
                <div className="text-xs font-mono text-neutral-400">PROBLEM STATEMENT & INVARIANTS</div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                  {art.problem_statement}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-neutral-400">ENGINEERING SOLUTION</div>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-line">
                  {art.solution}
                </p>
              </div>
            </div>

            {/* Code Snippet Box */}
            {art.code_examples && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 bg-white/[0.03] px-4 py-2 border-t border-x border-white/10 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5" />
                    <span>Implementation Snippet</span>
                  </div>
                  <button
                    onClick={() => handleCopy(art.id, art.code_examples)}
                    className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    title="Copy code snippet"
                  >
                    {copiedId === art.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-black/60 border border-white/10 rounded-b-xl overflow-x-auto text-xs font-mono text-neutral-200 leading-relaxed">
                  <code>{art.code_examples}</code>
                </pre>
              </div>
            )}

            {/* Complexity Analysis Strip */}
            {art.complexity_analysis && (
              <div className="mt-5 p-4 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-xs text-neutral-300 whitespace-pre-line">
                <div className="text-[10px] text-neutral-400 mb-1">COMPLEXITY ANALYSIS (TIME & SPACE)</div>
                {art.complexity_analysis}
              </div>
            )}

            {/* Related Project Link CTA */}
            {art.related_projects && art.related_projects.length > 0 && onSelectProject && (
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-mono">
                  Applied in Production:
                </span>
                <button
                  onClick={() => onSelectProject(art.related_projects[0])}
                  className="text-xs font-mono text-white hover:text-neutral-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Case Study ({art.related_projects[0]})</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </LiquidGlassCard>
        ))}
      </div>
    </div>
  );
};
