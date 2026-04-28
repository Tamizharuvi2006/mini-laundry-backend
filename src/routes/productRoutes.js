const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProducts, addProduct, deleteProduct, editProduct } = require('../controllers/productController');

// All product routes are protected
router.use(authMiddleware);

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', editProduct);

module.exports = router;
