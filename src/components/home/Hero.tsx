import React from 'react';
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin, FileDown } from 'lucide-react';
import { Profile } from '../../types';
import { TypingAnimation } from '../common/TypingAnimation';
import { LiquidGlassButton, LiquidGlassCard } from '../common/LiquidGlass';

interface HeroProps {
  profile: Profile;
  onNavigate: (view: string, slug?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ profile, onNavigate }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Ambient monochromatic radial glow effects */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-white/[0.025] blur-[140px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-white/[0.015] blur-[100px] rounded-full pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines, Bio, Actions (7 cols on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Top Unboxed Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{profile.location || 'Bali, Indonesia'}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>Distributed Systems</span>
              <span aria-hidden="true">·</span>
              <span>PostgreSQL Architecture</span>
            </div>

            {/* Primary Hero Display Name */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[0.95] max-w-3xl text-balance">
              {profile.hero_headline || 'I Nyoman Parta Yasa.'}
            </h1>

            {/* Supporting Statement & Animated Role */}
            <div className="space-y-3">
              <p className="text-lg sm:text-2xl font-light text-neutral-200 tracking-tight font-serif italic">
                "{profile.hero_statement || 'Building Systems. Solving Problems. Engineering with Logic.'}"
              </p>

              {/* Typing Animation Component */}
              <div className="flex items-center gap-2 pt-1 text-sm sm:text-base text-neutral-400 font-mono">
                <span className="text-neutral-500">Focus:</span>
                <TypingAnimation />
              </div>
            </div>

            {/* Short Biography Box with Apple Liquid Glass */}
            <div className="max-w-2xl">
              <LiquidGlassCard variant="subtle" className="p-5 sm:p-6">
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans font-normal">
                  {profile.bio_short}
                </p>
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
                  <span className="text-neutral-300">Medical Laboratory Rigor → Backend Engineering Precision</span>
                  <button
                    onClick={() => onNavigate('about')}
                    className="text-white hover:text-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read Journey</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </LiquidGlassCard>
            </div>

            {/* Actions & Social Handles */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <LiquidGlassButton
                variant="primary"
                size="lg"
                onClick={() => onNavigate('projects')}
              >
                <span>Explore Systems</span>
                <ArrowDown className="w-4 h-4" />
              </LiquidGlassButton>

              <LiquidGlassButton
                variant="secondary"
                size="lg"
                onClick={() => {
                  onNavigate('contact');
                }}
              >
                <FileDown className="w-4 h-4" />
                <span>Download CV & Inquire</span>
              </LiquidGlassButton>

              {/* Social Icons Strip */}
              <div className="flex items-center gap-2 sm:ml-2 pt-2 sm:pt-0">
                <a
                  href={profile.github_url || 'https://github.com/101manparta'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 liquid-glass rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile.linkedin_url || 'https://www.linkedin.com/in/manparta01x0/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 liquid-glass rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${profile.email || 'nvidiaparta@gmail.com'}`}
                  className="p-3 liquid-glass rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Contact Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Executive Portrait in Apple Liquid Glass Frame (5 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative group max-w-[280px] sm:max-w-[320px] w-full">
              {/* Monochromatic Optical Glow Aura */}
              <div
                className="absolute -inset-1.5 bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                aria-hidden="true"
              />

              <LiquidGlassCard
                variant="elevated"
                className="relative p-2.5 sm:p-3 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-xl transition-all duration-300"
              >
                {/* Photo Container */}
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-[#0c0c10] border border-white/10">
                  <img
                    src={profile.avatar_url || '/assets/aistudio/image_27ab99ae.png'}
                    alt="I Nyoman Parta Yasa — Backend Engineer"
                    className="w-full h-full object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                    loading="eager"
                  />
                  {/* Bottom Refraction Vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* Sleek Identification Tag Overlay */}
                  <div className="absolute bottom-2.5 inset-x-2.5 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-left">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Available for Backend Roles</span>
                    </div>
                    <div className="text-xs font-serif text-white tracking-tight font-semibold mt-0.5">
                      I Nyoman Parta Yasa
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      Backend Engineer · Bali, ID
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
