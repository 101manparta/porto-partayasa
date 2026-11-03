import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { submitContactMessage } from '../../lib/api';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await submitContactMessage({
        sender_name: name,
        sender_email: email,
        subject: subject.trim() || 'General Engineering Inquiry',
        message: message,
      });

      if (res.success) {
        setStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to deliver message.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/[0.08] pb-10 mb-12">
        <div className="text-xs font-mono text-neutral-400 tracking-wider">
          COMMUNICATION & SYSTEM ENGAGEMENT
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-white tracking-tight leading-[1.05] mt-1">
          Initiate Contact
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-300 max-w-2xl font-sans leading-relaxed">
          Available for backend engineering contracts, distributed database consultations, system architecture reviews, and high-concurrency API initiatives.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Contact Info Column */}
        <div className="md:col-span-5 space-y-6">
          <LiquidGlassCard variant="default" className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono text-neutral-400">ENGINEER</span>
              <h2 className="text-xl font-serif text-white tracking-tight mt-0.5">
                I Nyoman Parta Yasa
              </h2>
              <div className="text-xs text-neutral-400 font-mono mt-1">
                Backend Engineer & System Architect
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/[0.06] text-xs font-mono">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-neutral-400">LOCATION</div>
                  <div className="text-white text-sm font-sans mt-0.5">Bali, Indonesia (WITA / UTC+8)</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-neutral-400">PRIMARY DIRECT EMAIL</div>
                  <a
                    href="mailto:nvidiaparta@gmail.com"
                    className="text-white text-sm font-sans hover:underline block mt-0.5"
                  >
                    nvidiaparta@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <span className="text-xs font-mono text-neutral-400 block mb-2">VERIFIED NETWORKS</span>
              <a
                href="https://github.com/101manparta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 liquid-glass rounded-xl text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>github.com/101manparta</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href="https://www.linkedin.com/in/manparta01x0/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 liquid-glass rounded-xl text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin.com/in/manparta01x0</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </LiquidGlassCard>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7">
          <LiquidGlassCard variant="elevated" className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight mb-2">
              Send Inbound Message
            </h2>
            <p className="text-xs text-neutral-400 font-sans mb-6">
              Messages are securely written to the Supabase PostgreSQL ledger.
            </p>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-white/[0.04] border border-white/20 rounded-xl flex items-start gap-3 text-xs text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Message successfully delivered!</div>
                  <div className="text-neutral-400 mt-0.5">
                    Your inquiry has been stored securely in Parta's admin portal. You will receive a response at your email address shortly.
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-white/[0.04] border border-white/20 rounded-xl flex items-start gap-3 text-xs text-neutral-200">
                <AlertCircle className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Submission failed</div>
                  <div className="text-neutral-400 mt-0.5">{errorMessage}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  YOUR NAME <span className="text-neutral-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wayang Sastra"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  EMAIL ADDRESS <span className="text-neutral-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Distributed Architecture Consultation / Opportunity"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  MESSAGE DETAILS <span className="text-neutral-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your technical requirements, architecture inquiry, or project scope..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-white/30 transition-colors resize-y"
                />
              </div>

              <div className="pt-2">
                <LiquidGlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{status === 'submitting' ? 'Delivering...' : 'Send Message'}</span>
                </LiquidGlassButton>
              </div>
            </form>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
};
