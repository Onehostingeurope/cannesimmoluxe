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
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
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
          currency: string
          city: string
          district: string | null
          postal_code: string | null
          country: string
          address: string | null
          latitude: number | null
          longitude: number | null
          hide_map: boolean
          surface: number | null
          interior_area: number | null
          land_surface: number | null
          terrace_surface: number | null
          balcony_surface: number | null
          rooms: number | null
          bedrooms: number | null
          bathrooms: number | null
          levels: number | null
          garage: number | null
          piscine: boolean
          air_conditioning: boolean
          exposition: string | null
          vue: string | null
          condition: string | null
          style: string | null
          heating_energy: string | null
          heating_type: string | null
          hot_water: string | null
          waste_water: string | null
          energy_value: number | null
          climate_class: string | null
          climate_value: number | null
          annual_energy_min: number | null
          annual_energy_max: number | null
          amenities: string[]
          images: string[]
          description_short: string | null
          description_long: string | null
          featured: boolean
          gated_brochure: boolean
          gated_dossier: boolean
          gated_save: boolean
          agent_notes: string | null
          seo_title: string | null
          seo_description: string | null
          og_title: string | null
          og_description: string | null
          youtube_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          ref_id: string
          mode: 'sale' | 'rent'
          status?: 'available' | 'reserved' | 'sold' | 'highlight'
          type: string
          price?: number | null
          price_on_request?: boolean
          currency?: string
          city: string
          district?: string | null
          postal_code?: string | null
          country?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          hide_map?: boolean
          surface?: number | null
          interior_area?: number | null
          land_surface?: number | null
          terrace_surface?: number | null
          balcony_surface?: number | null
          rooms?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          levels?: number | null
          garage?: number | null
          piscine?: boolean
          air_conditioning?: boolean
          exposition?: string | null
          vue?: string | null
          condition?: string | null
          style?: string | null
          heating_energy?: string | null
          heating_type?: string | null
          hot_water?: string | null
          waste_water?: string | null
          energy_value?: number | null
          climate_class?: string | null
          climate_value?: number | null
          annual_energy_min?: number | null
          annual_energy_max?: number | null
          amenities?: string[]
          images?: string[]
          description_short?: string | null
          description_long?: string | null
          featured?: boolean
          gated_brochure?: boolean
          gated_dossier?: boolean
          gated_save?: boolean
          agent_notes?: string | null
          seo_title?: string | null
          seo_description?: string | null
          og_title?: string | null
          og_description?: string | null
          youtube_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          ref_id?: string
          mode?: 'sale' | 'rent'
          status?: 'available' | 'reserved' | 'sold' | 'highlight'
          type?: string
          price?: number | null
          price_on_request?: boolean
          currency?: string
          city?: string
          district?: string | null
          postal_code?: string | null
          country?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          hide_map?: boolean
          surface?: number | null
          interior_area?: number | null
          land_surface?: number | null
          terrace_surface?: number | null
          balcony_surface?: number | null
          rooms?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          levels?: number | null
          garage?: number | null
          piscine?: boolean
          air_conditioning?: boolean
          exposition?: string | null
          vue?: string | null
          condition?: string | null
          style?: string | null
          heating_energy?: string | null
          heating_type?: string | null
          hot_water?: string | null
          waste_water?: string | null
          energy_value?: number | null
          climate_class?: string | null
          climate_value?: number | null
          annual_energy_min?: number | null
          annual_energy_max?: number | null
          amenities?: string[]
          images?: string[]
          description_short?: string | null
          description_long?: string | null
          featured?: boolean
          gated_brochure?: boolean
          gated_dossier?: boolean
          gated_save?: boolean
          agent_notes?: string | null
          seo_title?: string | null
          seo_description?: string | null
          og_title?: string | null
          og_description?: string | null
          youtube_id?: string | null
          updated_at?: string
        }
      }
      property_media: {
        Row: {
          id: string
          property_id: string
          type: string
          url: string
          alt_text: string | null
          is_cover: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          type: string
          url: string
          alt_text?: string | null
          is_cover?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          property_id?: string
          type?: string
          url?: string
          alt_text?: string | null
          is_cover?: boolean
          sort_order?: number
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          message: string
          lead_status: 'new' | 'contacted' | 'qualified' | 'visit' | 'offer' | 'won' | 'lost'
          tracking_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          message: string
          lead_status?: 'new' | 'contacted' | 'qualified' | 'visit' | 'offer' | 'won' | 'lost'
          tracking_data?: Json | null
          created_at?: string
        }
        Update: {
          property_id?: string | null
          user_id?: string | null
          message?: string
          lead_status?: 'new' | 'contacted' | 'qualified' | 'visit' | 'offer' | 'won' | 'lost'
          tracking_data?: Json | null
        }
      }
    }
  }
}
