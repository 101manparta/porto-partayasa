import React from 'react';
import { Award, Calendar, CheckCircle2, Trophy } from 'lucide-react';
import { Achievement } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlass';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/[0.08] pb-8 mb-12">
        <div className="text-xs font-mono text-neutral-400 tracking-wider">
          HONORS, COMPETITIONS & TECHNICAL DISTINCTIONS
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mt-1">
          Achievements & Awards
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl font-sans leading-relaxed">
          Recognitions received for distributed system design, high-concurrency API performance, and healthcare information engineering.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {achievements.map((ach, idx) => (
          <LiquidGlassCard key={ach.id} variant="default" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-white">
                  <Trophy className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="font-semibold">{ach.award_ranking}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ach.year}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                {ach.title}
              </h2>

              <div className="mt-1 text-xs font-mono text-neutral-400">
                {ach.competition_name} · {ach.organization}
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-neutral-300 font-sans leading-relaxed">
                {ach.description}
              </p>

              {/* Contribution */}
              <div className="mt-5 p-3.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-sans text-neutral-300">
                <span className="font-mono text-neutral-400 block mb-1">PERSONAL ARCHITECTURAL CONTRIBUTION</span>
                {ach.personal_contribution}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-neutral-400">
              <span className="text-neutral-500">Technologies:</span>
              {ach.technologies_used.map((t, i) => (
                <React.Fragment key={t}>
                  <span className="text-neutral-300">{t}</span>
                  {i < ach.technologies_used.length - 1 && <span className="text-neutral-600">/</span>}
                </React.Fragment>
              ))}
            </div>
          </LiquidGlassCard>
        ))}
      </div>
    </div>
  );
};
