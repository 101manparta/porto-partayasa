import React from 'react';
import { ExternalLink, CheckCircle, Shield, Award, Calendar } from 'lucide-react';
import { Certification } from '../../types';
import { LiquidGlassCard } from '../common/LiquidGlass';

interface CertificationsViewProps {
  certifications: Certification[];
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({ certifications }) => {
  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/[0.08] pb-8 mb-12">
        <div className="text-xs font-mono text-neutral-400 tracking-wider">
          VERIFIED CREDENTIALS & SPECIALIZED COMPETENCIES
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight mt-1">
          Certifications & Mastery
        </h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-2xl font-sans leading-relaxed">
          Rigorous certifications verifying deep technical foundations in database engineering, concurrent microservices, distributed system design, and clinical analytical protocol discipline.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {certifications.map((cert) => (
          <LiquidGlassCard key={cert.id} variant="default" className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Header Meta */}
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{cert.issuing_organization}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{cert.issue_date}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                {cert.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-sm text-neutral-300 font-sans leading-relaxed">
                {cert.description}
              </p>

              {/* Skills gained */}
              <div className="mt-5">
                <span className="text-xs font-mono text-neutral-400 block mb-2">VERIFIED COMPETENCIES:</span>
                <div className="space-y-1.5">
                  {cert.skills_gained.map((skill) => (
                    <div key={skill} className="flex items-start gap-2 text-xs text-neutral-300 font-sans">
                      <CheckCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Credential Action */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                Validity: {cert.expiration_date || 'Lifetime'}
              </span>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-white hover:text-neutral-300 transition-colors cursor-pointer"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </LiquidGlassCard>
        ))}
      </div>
    </div>
  );
};
