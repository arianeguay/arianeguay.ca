// Database types matching Supabase schema

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  tax_number_tps?: string;
  tax_number_tvq?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  client_id?: string;
  name: string;
  status: ProjectStatus;
  budget?: number;
  currency: string;
  deadline?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  // Populated relations
  client?: Client;
}

export interface LinkedInPost {
  id: string;
  url?: string;
  author?: string;
  snippet?: string;
  date?: string;
  like_count?: number;
  comment_count?: number;
  engagement_score?: number;
  created_at: string;
  updated_at: string;
}

export type CommentTone = 'professional' | 'friendly' | 'playful';

export interface LinkedInComment {
  id: string;
  post_id: string;
  tone: CommentTone;
  content: string;
  used: boolean;
  created_at: string;
}

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceItem {
  desc: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  client_id?: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax_tps: number;
  tax_tvq: number;
  total: number;
  currency: string;
  pdf_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Populated relations
  client?: Client;
}

export interface EngagementMetric {
  id: string;
  date: string;
  comments_posted: number;
  posts_engaged: number;
  minutes_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
