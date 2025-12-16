import { createClient } from '@supabase/supabase-js'

const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Please check your .env file.')
}

// Helpful diagnostics (does not print the full key)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.debug('[supabase] url ok:', supabaseUrl.startsWith('https://'))
  // eslint-disable-next-line no-console
  console.debug('[supabase] anon key length:', supabaseAnonKey.length)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          status: string
          sku: string
          price: number
          buy_link: string | null
          image_url: string | null
          group_name: string | null
          color: string | null
          hex_color: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          specifications: Record<string, any> | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          status?: string
          sku: string
          price: number
          buy_link?: string | null
          image_url?: string | null
          group_name?: string | null
          color?: string | null
          hex_color?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          specifications?: Record<string, any> | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          status?: string
          sku?: string
          price?: number
          buy_link?: string | null
          image_url?: string | null
          group_name?: string | null
          color?: string | null
          hex_color?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          specifications?: Record<string, any> | null
        }
      }
    }
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
