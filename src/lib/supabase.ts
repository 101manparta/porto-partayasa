/**
 * PARTA Engineering Portfolio Platform
 * Supabase Client & Connection Manager
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Keys can come from Vite env vars, Next.js style env vars, or user in-app configuration
export function getStoredSupabaseConfig(): { url: string; key: string } {
  // 1. Check local storage override first (configured via Admin Settings)
  try {
    const saved = localStorage.getItem('parta_supabase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key };
      }
    }
  } catch {
    // ignore localStorage read error
  }

  // 2. Check Vite / Next environment variables
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || 
                  (import.meta.env as Record<string, string>).NEXT_PUBLIC_SUPABASE_URL || 
                  '') as string;
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 
                  (import.meta.env as Record<string, string>).NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                  '') as string;

  return { url: envUrl, key: envKey };
}

let cachedClient: SupabaseClient | null = null;
let cachedKeyHash = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getStoredSupabaseConfig();
  if (!url || !key) {
    return null;
  }

  const currentHash = `${url}::${key}`;
  if (cachedClient && cachedKeyHash === currentHash) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedKeyHash = currentHash;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem('parta_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
  cachedClient = null; // reset cached instance
}

export function clearSupabaseConfig() {
  localStorage.removeItem('parta_supabase_config');
  cachedClient = null;
}

export async function testSupabaseConnection(urlToTest?: string, keyToTest?: string): Promise<{
  success: boolean;
  message: string;
  tablesDetected?: string[];
}> {
  const targetUrl = urlToTest || getStoredSupabaseConfig().url;
  const targetKey = keyToTest || getStoredSupabaseConfig().key;

  if (!targetUrl || !targetKey) {
    return {
      success: false,
      message: 'Supabase URL or Anon Public Key is missing. Please configure credentials.',
    };
  }

  try {
    const tempClient = createClient(targetUrl, targetKey);
    // Attempt a light read on profiles or site_settings
    const { data: _data, error } = await tempClient
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, it's connected to Supabase project, but migration hasn't been executed
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase project! Schema tables not detected yet. Run the SQL migration script to bootstrap tables.',
          tablesDetected: [],
        };
      }
      return {
        success: false,
        message: `Supabase error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase database. Tables verified.',
      tablesDetected: ['profiles', 'projects', 'case_studies'],
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Connection failed: ${errorMsg}`,
    };
  }
}
