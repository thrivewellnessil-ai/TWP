import { supabase, Product } from '@/lib/supabase'

export class ProductService {
  // Fetch all products
  static async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  // Fetch products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  // Fetch product by SKU
  static async getProductBySku(sku: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product by SKU:', error)
      return null
    }
  }

  // Fetch product by ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      return null
    }
  }

  // Get unique categories
  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error
      
      const categories = [...new Set(data?.map(p => p.category) || [])]
      return ['All', ...categories]
    } catch (error) {
      console.error('Error fetching categories:', error)
      return ['All']
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Get products by status
  static async getProductsByStatus(status: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products by status:', error)
      return []
    }
  }
}
