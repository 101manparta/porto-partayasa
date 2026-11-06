import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenContactModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Projects', view: 'projects' },
    { label: 'Engineering', view: 'engineering' },
    { label: 'Achievements', view: 'achievements' },
    { label: 'Certifications', view: 'certifications' },
    { label: 'About', view: 'about' },
  ];

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="liquid-glass-elevated !bg-[#07070a]/90 backdrop-blur-2xl rounded-2xl px-5 py-3 flex items-center justify-between gap-8 transition-all duration-300 shadow-2xl">
          {/* Zone 1: Brand title wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="text-left cursor-pointer group focus-visible:outline-none shrink-0"
            aria-label="I Nyoman Parta Yasa Home"
          >
            <span className="font-serif text-lg sm:text-xl text-white tracking-tight group-hover:text-neutral-300 transition-colors whitespace-nowrap">
              Parta Yasa
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400 shrink-0">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => handleLinkClick(link.view)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer hover:text-white ${
                    isActive ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-white rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleLinkClick('contact')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all duration-200 cursor-pointer ${
                currentView === 'contact'
                  ? 'bg-white text-black shadow-md'
                  : 'liquid-glass text-neutral-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 liquid-glass-elevated rounded-2xl p-4 shadow-2xl space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleLinkClick(link.view)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  currentView === link.view
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-between"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
