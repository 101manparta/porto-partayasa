import React from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050507] py-14 px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand & Location */}
        <div className="space-y-2">
          <div className="font-serif text-xl text-white tracking-tight">
            I Nyoman Parta Yasa
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>Bali, Indonesia</span>
            <span>·</span>
            <span>Backend Engineer & System Architect</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-sm font-sans pt-1">
            Building deterministic, fault-tolerant backend systems and cloud database architectures.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-mono">
          <a
            href="https://github.com/101manparta"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://www.linkedin.com/in/manparta01x0/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="mailto:nvidiaparta@gmail.com"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Email</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>

      {/* Bottom Quiet Copyright */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono">
        <span>© {new Date().getFullYear()} I Nyoman Parta Yasa. All rights reserved.</span>
        <span className="mt-2 sm:mt-0">PostgreSQL · Go · TypeScript · System Design</span>
      </div>
    </footer>
  );
};
