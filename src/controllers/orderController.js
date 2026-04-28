const orderService = require('../services/orderService');
const { validateOrderData, validateStatus, validateStatusTransition } = require('../utils/validators');
const { calculateBill } = require('../utils/calculateBill');
const generateOrderId = require('../utils/generateOrderId');

async function createOrder(req, res) {
  try {
    const validation = validateOrderData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { customerName, phone, garments, estimatedDeliveryDate } = req.body;
    const billing = calculateBill(garments);
    const orderId = generateOrderId();

    let deliveryDate = estimatedDeliveryDate;
    if (!deliveryDate) {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      deliveryDate = d.toISOString().split('T')[0];
    }

    const orderData = {
      order_id: orderId,
      customer_name: customerName.trim(),
      phone: phone.trim(),
      garments: billing.garments,
      total_amount: billing.totalAmount,
      status: 'RECEIVED',
      estimated_delivery_date: deliveryDate,
    };

    const order = await orderService.createOrder(orderData);

    try {
      await orderService.logOrderEvent({
        orderId: order.order_id,
        eventType: 'ORDER_CREATED',
        message: `Order created with status ${order.status}`,
        metadata: { totalAmount: order.total_amount },
      });
    } catch (e) {
      console.error('Order event log failed:', e.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
}

async function getAllOrders(req, res) {
  try {
    const { status, search, garment, limit, offset } = req.query;
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    const parsedOffset = offset ? parseInt(offset, 10) : undefined;
    const orders = await orderService.getAllOrders({
      status,
      search,
      garment,
      limit: Number.isNaN(parsedLimit) ? undefined : parsedLimit,
      offset: Number.isNaN(parsedOffset) ? undefined : parsedOffset,
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
}

async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
}

async function getOrderEvents(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const events = await orderService.getOrderEvents(orderId);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Get order events error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order events' });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validation = validateStatus(status);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const existingOrder = await orderService.getOrderById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const transitionValidation = validateStatusTransition(existingOrder.status, status);
    if (!transitionValidation.valid) {
      return res.status(400).json({ success: false, message: transitionValidation.message });
    }

    const order = await orderService.updateOrderStatus(orderId, status);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    try {
      await orderService.logOrderEvent({
        orderId: order.order_id,
        eventType: 'STATUS_UPDATED',
        message: `Status changed from ${existingOrder.status} to ${status}`,
        metadata: { from: existingOrder.status, to: status },
      });
    } catch (e) {
      console.error('Order event log failed:', e.message);
    }

    res.json({ success: true, message: 'Order status updated successfully', data: order });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
}

async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deleted = await orderService.deleteOrder(orderId);
    if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
}

async function editOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { customerName, phone, garments, estimatedDeliveryDate } = req.body;

    if (!customerName || !phone || !garments || garments.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { garments: processedGarments, totalAmount } = calculateBill(garments);
    const updateData = {
      customer_name: customerName,
      phone: phone,
      garments: processedGarments,
      total_amount: totalAmount,
      estimated_delivery_date: estimatedDeliveryDate || null,
    };

    const order = await orderService.editOrder(orderId, updateData);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    try {
      await orderService.logOrderEvent({
        orderId: order.order_id,
        eventType: 'ORDER_EDITED',
        message: 'Order details were updated',
        metadata: { totalAmount: order.total_amount },
      });
    } catch (e) {
      console.error('Order event log failed:', e.message);
    }

    res.json({ success: true, message: 'Order updated successfully', data: order });
  } catch (error) {
    console.error('Edit order error:', error);
    res.status(500).json({ success: false, message: 'Failed to edit order' });
  }
}

async function refundOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ success: false, message: 'Refund reason is required' });
    }

    const order = await orderService.refundOrder(orderId, reason.trim());
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    try {
      await orderService.logOrderEvent({
        orderId: order.order_id,
        eventType: 'ORDER_REFUNDED',
        message: `Order refunded. Reason: ${reason.trim()}`,
        metadata: { reason: reason.trim(), amount: order.total_amount },
      });
    } catch (e) {
      console.error('Order event log failed:', e.message);
    }

    res.json({ success: true, message: 'Order refunded successfully', data: order });
  } catch (error) {
    console.error('Refund order error:', error);
    res.status(500).json({ success: false, message: 'Failed to refund order' });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderEvents,
  updateOrderStatus,
  deleteOrder,
  editOrder,
  refundOrder,
};
