const productService = require('../services/productService');

async function getProducts(req, res, next) {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
}

async function addProduct(req, res, next) {
  try {
    const { name, price } = req.body;
    if (!name || price == null || isNaN(price)) {
      return res.status(400).json({ success: false, message: 'Invalid product data' });
    }
    const product = await productService.addProduct({ name, price: Number(price) });
    res.status(201).json({ success: true, message: 'Product added', data: product });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}

async function editProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    if (!name || price == null || isNaN(price)) {
      return res.status(400).json({ success: false, message: 'Invalid product data' });
    }
    const product = await productService.editProduct(id, { name, price: Number(price) });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProducts, addProduct, deleteProduct, editProduct };
