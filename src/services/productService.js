const supabase = require('../config/supabase');

async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Supabase fetch products error:', error);
    throw new Error('Failed to fetch products');
  }

  return data;
}

async function addProduct({ name, price }) {
  const { data, error } = await supabase
    .from('products')
    .insert([{ name: name.trim(), price }])
    .select()
    .single();

  if (error) {
    console.error('Supabase add product error:', error);
    throw new Error('Failed to add product (may already exist)');
  }

  return data;
}

async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase delete product error:', error);
    throw new Error('Failed to delete product');
  }

  return data;
}

async function editProduct(id, { name, price }) {
  const { data, error } = await supabase
    .from('products')
    .update({ name: name.trim(), price })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase edit product error:', error);
    throw new Error('Failed to edit product');
  }

  return data;
}

module.exports = { getAllProducts, addProduct, deleteProduct, editProduct };
