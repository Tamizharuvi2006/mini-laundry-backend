const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderEvents,
  updateOrderStatus,
  deleteOrder,
  editOrder,
  refundOrder,
} = require('../controllers/orderController');

// All order routes are protected
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:orderId', getOrderById);
router.get('/:orderId/events', getOrderEvents);
router.patch('/:orderId/status', updateOrderStatus);
router.put('/:orderId', editOrder);
router.post('/:orderId/refund', refundOrder);
router.delete('/:orderId', deleteOrder);

module.exports = router;
