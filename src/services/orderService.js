const supabase = require('../config/supabase');

/**
 * Create a new order in Supabase
 */
async function createOrder(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error('Failed to create order in database');
  }

  return data;
}

/**
 * Get all orders with optional filters
 */
async function getAllOrders({ status, search, garment, limit, offset } = {}) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by status
  if (status) {
    query = query.eq('status', status.toUpperCase());
  }

  // Search by customer name or phone
  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  if (Number.isInteger(limit) && limit > 0) {
    const start = Number.isInteger(offset) && offset >= 0 ? offset : 0;
    const end = start + limit - 1;
    query = query.range(start, end);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase fetch error:', error);
    throw new Error('Failed to fetch orders from database');
  }

  let results = data;

  // Filter by garment type (client-side because JSONB search is complex)
  if (garment) {
    results = results.filter((order) =>
      order.garments.some((g) =>
        g.type.toLowerCase().includes(garment.toLowerCase())
      )
    );
  }

  return results;
}

/**
 * Get a single order by order_id
 */
async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Supabase fetch error:', error);
    throw new Error('Failed to fetch order from database');
  }

  return data;
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Supabase update error:', error);
    throw new Error('Failed to update order status');
  }

  return data;
}

/**
 * Delete an order
 */
async function deleteOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Supabase delete error:', error);
    throw new Error('Failed to delete order');
  }

  return data;
}

/**
 * Edit an order
 */
async function editOrder(orderId, updateData) {
  const { data, error } = await supabase
    .from('orders')
    .update({ ...updateData, updated_at: new Date().toISOString() })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Supabase edit error:', error);
    throw new Error('Failed to edit order');
  }

  return data;
}

/**
 * Refund an order
 */
async function refundOrder(orderId, reason) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'REFUNDED', refund_reason: reason, updated_at: new Date().toISOString() })
    .eq('order_id', orderId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Supabase refund error:', error);
    throw new Error('Failed to refund order');
  }

  return data;
}

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder, editOrder, refundOrder };
