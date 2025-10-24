import type { Client, Project, Invoice, LinkedInPost, LinkedInComment } from '../../types/database';

// Simple in-memory DB for local/dev when Supabase is not configured
// Persists across requests within the same server process via globalThis
const g = globalThis as unknown as {
  __MEM_DB?: {
    clients: Client[];
    projects: Project[];
    invoices: Invoice[];
    linkedin_posts: LinkedInPost[];
    linkedin_comments: LinkedInComment[];
  };
};

if (!g.__MEM_DB) {
  g.__MEM_DB = {
    clients: [],
    projects: [],
    invoices: [],
    linkedin_posts: [],
    linkedin_comments: [],
  };
}

export const memDb = g.__MEM_DB!;

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);
