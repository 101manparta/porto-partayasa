/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { InfiniteMarquee } from './components/home/InfiniteMarquee';
import { SelectedProjects } from './components/home/SelectedProjects';
import { ProjectDetail } from './components/projects/ProjectDetail';
import { EngineeringKnowledge } from './components/engineering/EngineeringKnowledge';
import { AchievementsView } from './components/achievements/AchievementsView';
import { CertificationsView } from './components/certifications/CertificationsView';
import { AboutView } from './components/about/AboutView';
import { ContactView } from './components/contact/ContactView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { getCurrentAdminSession, signOutAdmin } from './lib/auth';
import { getSupabaseClient } from './lib/supabase';
import {
  getProfile,
  getProjects,
  getAchievements,
  getCertifications,
  getEngineeringArticles,
} from './lib/api';
import {
  Profile,
  Project,
  Achievement,
  Certification,
  EngineeringArticle,
} from './types';
import {
  INITIAL_PROFILE,
  INITIAL_PROJECTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CERTIFICATIONS,
  INITIAL_ARTICLES,
} from './lib/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Authenticated Admin User
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Public state
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [articles, setArticles] = useState<EngineeringArticle[]>(INITIAL_ARTICLES);

  // Check initial admin session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { user, isAdmin } = await getCurrentAdminSession();
        if (isMounted) {
          if (user && isAdmin) {
            setAdminUser(user);
          } else {
            setAdminUser(null);
          }
        }
      } catch {
        if (isMounted) setAdminUser(null);
      } finally {
        if (isMounted) setAuthChecking(false);
      }
    }

    checkSession();

    // Listen to Supabase Auth state changes
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          if (isMounted) {
            setAdminUser(null);
            if (window.location.pathname.startsWith('/admin')) {
              window.history.replaceState({}, '', '/admin');
              setCurrentView('admin-login');
            }
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          const { user, isAdmin } = await getCurrentAdminSession();
          if (isMounted && user && isAdmin) {
            setAdminUser(user);
          }
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync route based on browser pathname
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;

      if (path === '/admin') {
        if (adminUser) {
          window.history.replaceState({}, '', '/admin/dashboard');
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('admin-login');
        }
      } else if (path === '/admin/dashboard') {
        if (adminUser) {
          setCurrentView('admin-dashboard');
        } else {
          // Protected route barrier: redirect to /admin login if unauthenticated
          window.history.replaceState({}, '', '/admin');
          setCurrentView('admin-login');
        }
      } else if (path.startsWith('/projects/')) {
        const slug = path.replace('/projects/', '');
        if (slug) {
          setSelectedSlug(slug);
          setCurrentView('project-detail');
        }
      } else if (path === '/projects') {
        setCurrentView('projects');
      } else if (path === '/engineering') {
        setCurrentView('engineering');
      } else if (path === '/achievements') {
        setCurrentView('achievements');
      } else if (path === '/certifications') {
        setCurrentView('certifications');
      } else if (path === '/about') {
        setCurrentView('about');
      } else if (path === '/contact') {
        setCurrentView('contact');
      } else {
        setCurrentView('home');
      }
    };

    if (!authChecking) {
      handleLocation();
    }

    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, [authChecking, adminUser]);

  // Fetch live published data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [profData, projsData, achData, certData, artData] = await Promise.all([
          getProfile(),
          getProjects(false), // published only for public views
          getAchievements(false),
          getCertifications(false),
          getEngineeringArticles(false),
        ]);
        if (profData) setProfile(profData);
        if (projsData && projsData.length > 0) setProjects(projsData);
        if (achData && achData.length > 0) setAchievements(achData);
        if (certData && certData.length > 0) setCertifications(certData);
        if (artData && artData.length > 0) setArticles(artData);
      } catch (err) {
        console.warn('Initial data load completed with default seed state:', err);
      }
    }
    fetchData();
  }, [currentView]);

  const handleNavigate = (view: string, slug?: string) => {
    if (view === 'admin' || view === 'admin-login') {
      if (adminUser) {
        setCurrentView('admin-dashboard');
        window.history.pushState({}, '', '/admin/dashboard');
      } else {
        setCurrentView('admin-login');
        window.history.pushState({}, '', '/admin');
      }
    } else if (view === 'admin-dashboard') {
      if (adminUser) {
        setCurrentView('admin-dashboard');
        window.history.pushState({}, '', '/admin/dashboard');
      } else {
        setCurrentView('admin-login');
        window.history.pushState({}, '', '/admin');
      }
    } else {
      setCurrentView(view);
      if (slug) {
        setSelectedSlug(slug);
        window.history.pushState({}, '', `/projects/${slug}`);
      } else {
        setSelectedSlug(null);
        const targetPath = view === 'home' ? '/' : `/${view}`;
        window.history.pushState({}, '', targetPath);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setAdminUser(null);
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin-login');
  };

  // Selected project for project-detail view
  const currentProject = selectedSlug
    ? projects.find((p) => p.slug === selectedSlug) || projects[0]
    : projects[0];

  const isAdminRoute = currentView === 'admin-login' || currentView === 'admin-dashboard';

  return (
    <div className="min-h-screen bg-[#050507] text-[#EDEDEF] selection:bg-white/20 selection:text-white flex flex-col font-sans">
      {/* Navbar: strictly displayed on public portfolio pages; completely hidden on admin route */}
      {!isAdminRoute && (
        <Navbar currentView={currentView} onNavigate={handleNavigate} />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <>
            <Hero profile={profile} onNavigate={handleNavigate} />
            <InfiniteMarquee
              projects={projects}
              onSelectProject={(slug) => handleNavigate('project-detail', slug)}
            />
            <SelectedProjects
              projects={projects}
              onSelectProject={(slug) => handleNavigate('project-detail', slug)}
            />
          </>
        )}

        {/* VIEW: PROJECTS (ALL) */}
        {currentView === 'projects' && (
          <div className="pt-20">
            <SelectedProjects
              projects={projects}
              onSelectProject={(slug) => handleNavigate('project-detail', slug)}
            />
            <InfiniteMarquee
              projects={projects}
              onSelectProject={(slug) => handleNavigate('project-detail', slug)}
            />
          </div>
        )}

        {/* VIEW: PROJECT DETAIL (DYNAMIC CASE STUDY) */}
        {currentView === 'project-detail' && currentProject && (
          <ProjectDetail
            project={currentProject}
            onBack={() => handleNavigate('projects')}
          />
        )}

        {/* VIEW: ENGINEERING KNOWLEDGE */}
        {currentView === 'engineering' && (
          <EngineeringKnowledge
            articles={articles}
            onSelectProject={(slug) => handleNavigate('project-detail', slug)}
          />
        )}

        {/* VIEW: ACHIEVEMENTS */}
        {currentView === 'achievements' && (
          <AchievementsView achievements={achievements} />
        )}

        {/* VIEW: CERTIFICATIONS */}
        {currentView === 'certifications' && (
          <CertificationsView certifications={certifications} />
        )}

        {/* VIEW: ABOUT */}
        {currentView === 'about' && (
          <AboutView profile={profile} onNavigate={handleNavigate} />
        )}

        {/* VIEW: CONTACT */}
        {currentView === 'contact' && <ContactView />}

        {/* VIEW: ADMIN LOGIN (/admin) */}
        {currentView === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={(user) => {
              setAdminUser(user);
              handleNavigate('admin-dashboard');
            }}
            onExit={() => handleNavigate('home')}
          />
        )}

        {/* VIEW: PROTECTED ADMIN DASHBOARD (/admin/dashboard) */}
        {currentView === 'admin-dashboard' && adminUser && (
          <AdminDashboard
            user={adminUser}
            onLogout={handleLogout}
            onExit={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer: strictly displayed on public portfolio pages; completely hidden on admin route */}
      {!isAdminRoute && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}
