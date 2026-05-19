import { supabase } from '../supabase'

export const createOrder = async (orderData) => {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      restaurant_id: orderData.restaurantId,
      items: orderData.items,
      total_price: orderData.totalPrice,
      delivery_fee: orderData.deliveryFee,
      delivery_address: orderData.address,
      delivery_name: orderData.name,
      delivery_phone: orderData.phone,
      note: orderData.note,
      payment_method: orderData.paymentMethod,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getMyOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}