// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL; //import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export const imageService = {
  // Get all images
  async getImages(category = null) {
    let query = supabase
      .from('images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Add new image
  async addImage(imageData) {
    const { data, error } = await supabase
      .from('images')
      .insert([imageData])
      .select()

    if (error) throw error
    return data[0]
  },

  // Update image
  async updateImage(id, updates) {
    const { data, error } = await supabase
      .from('images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete image
  async deleteImage(id) {
    const { data, error } = await supabase
      .from('images')
      .delete()
      .eq('id', id)

    if (error) throw error
    return data
  },

  // Get categories
  async getCategories() {
    const { data, error } = await supabase
      .from('images')
      .select('category')
      .not('category', 'is', null)

    if (error) throw error
    
    const categories = [...new Set(data.map(item => item.category))]
    return ['All', ...categories]
  }
}

// Auth operations
export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  }
}