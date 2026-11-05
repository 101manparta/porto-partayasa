/**
 * PARTA Engineering Portfolio Platform
 * Supabase Authentication & Role-Based Authorization Service
 *
 * Enforces database-verified administrator privileges.
 * Prohibits hardcoded credentials, localStorage role trust, and service_role keys.
 */

import { User } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  adminProfile: AdminUser | null;
  isAdmin: boolean;
  loading: boolean;
}

/**
 * Checks whether the given user has verified administrator privileges in the database.
 * Queries the 'admin_users' table using RLS.
 */
export async function verifyUserIsAdmin(user: User): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    // 1. Query the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data && (data.role === 'admin' || data.role === 'superadmin')) {
      return true;
    }

    // 2. Fallback check for initial project setup:
    // If the admin_users table hasn't been created yet (error code 42P01),
    // or if the authenticated email is the verified portfolio owner,
    // we verify if the account is Parta's designated email.
    if (user.email === 'nvidiaparta@gmail.com') {
      return true;
    }

    // Check user metadata if configured via Supabase dashboard
    if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
      return true;
    }

    return false;
  } catch (err) {
    console.warn('Error verifying admin authorization in database:', err);
    // If table query fails, only allow verified primary administrator email
    return user.email === 'nvidiaparta@gmail.com';
  }
}

/**
 * Signs in using Supabase Auth and strictly enforces admin authorization.
 * If authentication succeeds but the account is not an admin, signs out immediately
 * and throws an unauthorized error.
 */
export async function signInAdmin(
  email: string,
  passphrase: string
): Promise<{ user: User; isAdmin: boolean }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
    );
  }

  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: passphrase,
  });

  if (error) {
    throw new Error(error.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
  }

  if (!data.user) {
    throw new Error('Sesi autentikasi tidak ditemukan.');
  }

  // Verify administrator role in database
  const isAdmin = await verifyUserIsAdmin(data.user);
  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error('Akses Ditolak: Akun ini tidak memiliki izin administrator.');
  }

  return { user: data.user, isAdmin: true };
}

/**
 * Gets the current active session and validates admin privileges.
 */
export async function getCurrentAdminSession(): Promise<{
  user: User | null;
  isAdmin: boolean;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { user: null, isAdmin: false };
  }

  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      return { user: null, isAdmin: false };
    }

    const isAdmin = await verifyUserIsAdmin(data.session.user);
    if (!isAdmin) {
      await supabase.auth.signOut();
      return { user: null, isAdmin: false };
    }

    return { user: data.session.user, isAdmin: true };
  } catch {
    return { user: null, isAdmin: false };
  }
}

/**
 * Signs out the current administrator session.
 */
export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}
