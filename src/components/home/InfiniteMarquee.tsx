import React from 'react';
import { Project } from '../../types';
import { ProjectVisualCard } from './ProjectVisuals';

interface InfiniteMarqueeProps {
  projects: Project[];
  onSelectProject: (slug: string) => void;
}

interface MarqueeItem {
  slug: string;
  name: string;
  type?: 'dashboard' | 'architecture';
  imageUrl?: string;
  caption: string;
  tech: string;
  title?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  projects,
  onSelectProject,
}) => {
  // Base SVG visual archetypes as baseline fallback
  const baseItemsRow1: MarqueeItem[] = [
    {
      slug: 'voltra',
      name: 'VOLTRA',
      type: 'dashboard',
      caption: 'Real-time EV load balancing & 200kW grid headroom monitor',
      tech: 'Go · TimescaleDB · OCPP',
    },
    {
      slug: 'mlb-icon-bali',
      name: 'MLB ICON BALI',
      type: 'dashboard',
      caption: 'Pessimistic row locking & 10-minute temporary seat-hold TTL',
      tech: 'PostgreSQL · Redis · Next.js',
    },
    {
      slug: 'mediflow',
      name: 'MEDIFLOW',
      type: 'dashboard',
      caption: 'Clinical diagnostic verification & finite state machine queue',
      tech: 'PostgreSQL · Node.js · Supabase',
    },
  ];

  const baseItemsRow2: MarqueeItem[] = [
    {
      slug: 'mlb-icon-bali',
      name: 'MLB ICON BALI',
      type: 'architecture',
      caption: 'Two-phase reservation pipeline & idempotent webhook architecture',
      tech: 'System Architecture · ACID',
    },
    {
      slug: 'mediflow',
      name: 'MEDIFLOW',
      type: 'architecture',
      caption: 'Deterministic specimen state transition pipeline & audit logs',
      tech: 'Finite State Machine · HL7',
    },
    {
      slug: 'voltra',
      name: 'VOLTRA',
      type: 'architecture',
      caption: 'Max-Heap priority queue telemetry ingestion & amperage modulation',
      tech: 'Go Concurrency · Heaps',
    },
  ];

  // Dynamically collect showcase screenshots uploaded to Supabase across published projects
  const publishedProjects = projects.filter((p) => p.publication_status === 'published');
  const dynamicShowcaseImages: MarqueeItem[] = publishedProjects.flatMap((p) =>
    (p.images || [])
      .filter((img) => img.is_showcase !== false && Boolean(img.image_url))
      .map((img) => ({
        slug: p.slug,
        name: p.name,
        imageUrl: img.image_url,
        caption: img.caption || img.title || `${p.name} Screenshot`,
        tech: p.technologies.slice(0, 3).join(' · '),
        title: img.title || `${p.name} Screenshot`,
      }))
  );

  // Distribute dynamic showcase screenshots evenly across rows
  const dynamicRow1 = dynamicShowcaseImages.filter((_, idx) => idx % 2 === 0);
  const dynamicRow2 = dynamicShowcaseImages.filter((_, idx) => idx % 2 === 1);

  const combinedRow1 = dynamicRow1.length > 0 ? [...dynamicRow1, ...baseItemsRow1] : baseItemsRow1;
  const combinedRow2 = dynamicRow2.length > 0 ? [...dynamicRow2, ...baseItemsRow2] : baseItemsRow2;

  // Duplicate arrays to achieve seamless infinite marquee loop
  const duplicatedRow1 = [...combinedRow1, ...combinedRow1, ...combinedRow1, ...combinedRow1];
  const duplicatedRow2 = [...combinedRow2, ...combinedRow2, ...combinedRow2, ...combinedRow2];

  return (
    <section className="relative w-full py-16 overflow-hidden bg-[#050507]">
      {/* Background ambient radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <div className="text-xs font-mono text-neutral-400 tracking-wider">
          LIVE SYSTEM CONSOLES & ARCHITECTURE SCHEMATICS
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight mt-1">
          Infinite Project Showcase
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto mt-2 font-sans">
          Continuous telemetry consoles and backend pipeline blueprints from published engineering systems. Hover to pause, click to inspect full case study.
        </p>
      </div>

      {/* Edge gradient masks for seamless fade */}
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-[#050507] via-[#050507]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-[#050507] via-[#050507]/80 to-transparent z-10 pointer-events-none" />

      {/* Marquee Rows Container */}
      <div className="space-y-6 pause-hover">
        {/* Row 1: Leftward movement */}
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee-left flex gap-6 px-3">
            {duplicatedRow1.map((item, idx) => (
              <div
                key={`row1-${item.slug}-${idx}`}
                onClick={() => onSelectProject(item.slug)}
                className="w-[360px] sm:w-[440px] h-[240px] shrink-0 cursor-pointer liquid-glass rounded-2xl p-2.5 group transition-all duration-300 hover:scale-[1.02] hover:border-white/20 active:scale-[0.99] relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(item.slug);
                  }
                }}
                aria-label={`View case study for ${item.name}`}
              >
                {/* Visual Content */}
                <div className="w-full h-[180px] rounded-xl overflow-hidden pointer-events-none relative bg-black/60 border border-white/5">
                  {item.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-[9px] font-mono text-neutral-300 backdrop-blur-sm">
                        {item.title || 'System Screenshot'}
                      </div>
                    </div>
                  ) : (
                    <ProjectVisualCard
                      slug={item.slug}
                      type={item.type || 'dashboard'}
                      title={item.name}
                    />
                  )}
                </div>

                {/* Card Footer Info */}
                <div className="flex items-center justify-between px-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors shrink-0">
                      {item.name}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px] shrink-0">·</span>
                    <span className="text-[11px] text-neutral-400 font-mono truncate">
                      {item.caption || item.tech}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 group-hover:text-white transition-colors flex items-center gap-1 font-mono shrink-0">
                    Inspect Case Study →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Rightward movement */}
        <div className="relative flex overflow-hidden">
          <div className="animate-marquee-right flex gap-6 px-3">
            {duplicatedRow2.map((item, idx) => (
              <div
                key={`row2-${item.slug}-${idx}`}
                onClick={() => onSelectProject(item.slug)}
                className="w-[360px] sm:w-[440px] h-[240px] shrink-0 cursor-pointer liquid-glass rounded-2xl p-2.5 group transition-all duration-300 hover:scale-[1.02] hover:border-white/20 active:scale-[0.99] relative"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(item.slug);
                  }
                }}
                aria-label={`View case study for ${item.name}`}
              >
                {/* Visual Content */}
                <div className="w-full h-[180px] rounded-xl overflow-hidden pointer-events-none relative bg-black/60 border border-white/5">
                  {item.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-[9px] font-mono text-neutral-300 backdrop-blur-sm">
                        {item.title || 'Architecture Blueprint'}
                      </div>
                    </div>
                  ) : (
                    <ProjectVisualCard
                      slug={item.slug}
                      type={item.type || 'dashboard'}
                      title={item.name}
                    />
                  )}
                </div>

                {/* Card Footer Info */}
                <div className="flex items-center justify-between px-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-semibold text-white tracking-tight group-hover:text-neutral-200 transition-colors shrink-0">
                      {item.name}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px] shrink-0">·</span>
                    <span className="text-[11px] text-neutral-400 font-mono truncate">
                      {item.caption || item.tech}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 group-hover:text-white transition-colors flex items-center gap-1 font-mono shrink-0">
                    Inspect Case Study →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
