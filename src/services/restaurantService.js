import { supabase } from '../supabase'

export const getRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .order('rating', { ascending: false })

  if (error) throw error
  return data
}

export const getRestaurantById = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      menu_items (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}