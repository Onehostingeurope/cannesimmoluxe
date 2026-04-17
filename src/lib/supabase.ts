import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string | null
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          role?: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string | null
          role?: 'admin' | 'user'
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          slug: string
          ref_id: string
          mode: 'sale' | 'rent'
          status: 'available' | 'reserved' | 'sold' | 'highlight'
          type: string
          price: number | null
          price_on_request: boolean
          city: string
          district: string | null
          surface: number | null
          land_surface: number | null
          rooms: number | null
          bedrooms: number | null
          bathrooms: number | null
          amenities: string[]
          images: string[]
          dpe_data: Json | null
          description_short: string | null
          description_long: string | null
          assigned_contact_id: string | null
          created_at: string
          featured: boolean
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          message: string
          lead_status: 'new' | 'contacted' | 'qualified' | 'visit' | 'offer' | 'won' | 'lost'
          tracking_data: Json | null
          created_at: string
        }
      }
    }
  }
}
