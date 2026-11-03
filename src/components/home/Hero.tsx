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

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Top Unboxed Metadata Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-6">
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
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[0.95] max-w-4xl text-balance">
          {profile.hero_headline || 'I Nyoman Parta Yasa.'}
        </h1>

        {/* Supporting Statement & Animated Role */}
        <div className="mt-5 sm:mt-6 space-y-3">
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
        <div className="mt-8 max-w-3xl">
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
        <div className="mt-8 flex flex-wrap items-center gap-4">
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
              // Smooth scroll to contact or open CV section
              onNavigate('contact');
            }}
          >
            <FileDown className="w-4 h-4" />
            <span>Download CV & Inquire</span>
          </LiquidGlassButton>

          {/* Social Icons Strip */}
          <div className="flex items-center gap-2 ml-auto sm:ml-2 pt-2 sm:pt-0">
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
    </section>
  );
};
