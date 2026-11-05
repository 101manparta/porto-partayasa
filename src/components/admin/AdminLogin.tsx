import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Loader2,
  HelpCircle,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { LiquidGlassCard, LiquidGlassButton } from '../common/LiquidGlass';
import { signInAdmin } from '../../lib/auth';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
} from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
  onExit: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onExit }) => {
  const [email, setEmail] = useState('nvidiaparta@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSolutionGuide, setShowSolutionGuide] = useState(false);

  // Supabase Configuration Inspector
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    success?: boolean;
    message?: string;
  }>({ tested: false });
  const [testingConn, setTestingConn] = useState(false);

  useEffect(() => {
    const cfg = getStoredSupabaseConfig();
    setSupabaseUrl(cfg.url || '');
    setSupabaseAnonKey(cfg.key || '');
  }, []);

  const handleTestAndSaveConfig = async () => {
    setTestingConn(true);
    try {
      const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
      if (res.success) {
        saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
      }
      setTestStatus({
        tested: true,
        success: res.success,
        message: res.message,
      });
    } catch (e) {
      setTestStatus({
        tested: true,
        success: false,
        message: e instanceof Error ? e.message : 'Koneksi gagal',
      });
    } finally {
      setTestingConn(false);
    }
  };

  const isInvalidCreds =
    errorMessage?.toLowerCase().includes('invalid login credentials') ||
    errorMessage?.toLowerCase().includes('invalid credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Harap masukkan email dan kata sandi.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await signInAdmin(email, password);
      onLoginSuccess(result.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Autentikasi gagal.';
      setErrorMessage(message);
      if (
        message.toLowerCase().includes('invalid login credentials') ||
        message.toLowerCase().includes('invalid credentials')
      ) {
        setShowSolutionGuide(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#EDEDEF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Optical Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        <LiquidGlassCard variant="elevated" className="p-8 sm:p-10 border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl text-white tracking-tight block">
                  Admin Console
                </span>
                <span className="text-[10px] font-mono text-neutral-400 block tracking-wider uppercase">
                  Authentication Barrier
                </span>
              </div>
            </div>
            <button
              onClick={onExit}
              className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer"
              title="Return to Public Portfolio"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          </div>

          <p className="text-xs text-neutral-400 font-sans mb-6 leading-relaxed">
            Akses terbatas untuk administrator terverifikasi. Masuk menggunakan akun Supabase Auth Anda untuk mengelola platform.
          </p>

          {/* Error Banner with Actionable Solution */}
          {errorMessage && (
            <div className="mb-6 space-y-3">
              <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200 flex items-start gap-2.5 animate-fade-in font-mono">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-300">
                    {isInvalidCreds ? 'Invalid Login Credentials (Kredensial Tidak Valid)' : errorMessage}
                  </div>
                  {isInvalidCreds && (
                    <p className="text-[11px] text-red-300/80 mt-1 font-sans leading-relaxed">
                      Akun <strong className="text-white">{email}</strong> belum terdaftar di proyek Supabase Auth Anda, atau kata sandi tidak cocok.
                    </p>
                  )}
                </div>
              </div>

              {/* Collapsible Solution Guide */}
              {isInvalidCreds && (
                <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl text-xs font-sans text-neutral-300 space-y-3">
                  <div
                    onClick={() => setShowSolutionGuide(!showSolutionGuide)}
                    className="flex items-center justify-between cursor-pointer font-mono text-[11px] text-white hover:text-neutral-200"
                  >
                    <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Cara Mengatasi Masalah Ini:</span>
                    </span>
                    {showSolutionGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>

                  {showSolutionGuide && (
                    <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-[11px] leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">1</span>
                        <span>
                          Buka <strong>Supabase Dashboard</strong> (<a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-white underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a>).
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">2</span>
                        <span>
                          Pilih project Anda, lalu ke menu <strong>Authentication</strong> &gt; <strong>Users</strong>.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">3</span>
                        <span>
                          Klik <strong>Add user</strong> &gt; <strong>Create user</strong>:
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-neutral-400">
                            <li>Email: <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">nvidiaparta@gmail.com</code></li>
                            <li>Password: (masukkan password pilihan Anda)</li>
                            <li>Pastikan centang <strong className="text-white">Auto Confirm User?</strong> agar email langsung aktif tanpa perlu verifikasi email masuk.</li>
                          </ul>
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-white bg-white/10 rounded-full w-4 h-4 flex items-center justify-center shrink-0 text-[10px]">4</span>
                        <span>
                          Setelah user berhasil dibuat, ketik password yang sama di form ini dan klik <strong>Masuk ke Dashboard</strong>.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                Email Administrator
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="nama@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-600 text-sm font-sans focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-600 text-sm font-sans focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-3">
              <LiquidGlassButton
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full justify-center text-sm font-mono tracking-tight"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Sesi...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </span>
                )}
              </LiquidGlassButton>
            </div>
          </form>

          {/* Supabase Connection Configuration Drawer */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-neutral-400" />
                <span>Pengaturan Koneksi Supabase ({supabaseUrl ? 'Terkonfigurasi' : 'Belum diisi'})</span>
              </span>
              {showConfigDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showConfigDrawer && (
              <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 animate-fade-in text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">
                    SUPABASE PROJECT URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 mb-1">
                    SUPABASE ANON / PUBLIC API KEY
                  </label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <LiquidGlassButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={testingConn || !supabaseUrl.trim() || !supabaseAnonKey.trim()}
                    onClick={handleTestAndSaveConfig}
                    className="text-[11px]"
                  >
                    {testingConn ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Menguji...</span>
                      </span>
                    ) : (
                      <span>Simpan & Tes Koneksi</span>
                    )}
                  </LiquidGlassButton>
                </div>

                {testStatus.tested && (
                  <div
                    className={`p-2.5 rounded-lg text-[11px] border ${
                      testStatus.success
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                        : 'bg-red-500/10 border-red-500/20 text-red-200'
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1 mb-0.5">
                      {testStatus.success ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Koneksi Supabase Berhasil</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Koneksi Gagal</span>
                        </>
                      )}
                    </div>
                    <div>{testStatus.message}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security footnote */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-neutral-400">
              Supabase Auth & PostgreSQL Row Level Security (RLS)
            </span>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
};
