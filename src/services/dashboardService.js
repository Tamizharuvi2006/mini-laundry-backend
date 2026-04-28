const supabase = require('../config/supabase');

/**
 * Get dashboard metrics: total orders, total revenue, orders per status
 */
async function getDashboardMetrics({ startDate, endDate } = {}) {
  let query = supabase
    .from('orders')
    .select('total_amount, status, created_at');

  if (startDate) {
    query = query.gte('created_at', `${startDate}T00:00:00.000Z`);
  }
  if (endDate) {
    query = query.lte('created_at', `${endDate}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase dashboard error:', error);
    throw new Error('Failed to fetch dashboard data');
  }

  const totalOrders = data.length;
  let grossRevenue = 0;
  let totalRefunded = 0;
  let totalRevenue = 0; // Net revenue after refunds

  const ordersPerStatus = {
    RECEIVED: 0,
    PROCESSING: 0,
    READY: 0,
    DELIVERED: 0,
    REFUNDED: 0, // Add REFUNDED tracking
  };

  const todayStr = new Date().toISOString().split('T')[0];
  let todayOrders = 0;
  let todayRevenue = 0; // Net
  let todayRefunded = 0;
  const revenueByDayMap = {};

  data.forEach((order) => {
    const amount = parseFloat(order.total_amount || 0);
    const normalizedStatus = String(order.status || '').toUpperCase();
    const isRefunded = normalizedStatus === 'REFUNDED';
    const netContribution = isRefunded ? -amount : amount;

    if (isRefunded) {
      totalRefunded += amount;
    } else {
      grossRevenue += amount;
    }

    totalRevenue += netContribution;

    if (ordersPerStatus.hasOwnProperty(normalizedStatus)) {
      ordersPerStatus[normalizedStatus]++;
    }

    if (order.created_at && order.created_at.startsWith(todayStr)) {
      todayOrders++;
      todayRevenue += netContribution;
      if (isRefunded) todayRefunded += amount;
    }

    if (order.created_at) {
      const dateKey = order.created_at.slice(0, 10);
      if (!revenueByDayMap[dateKey]) {
        revenueByDayMap[dateKey] = {
          date: dateKey,
          grossRevenue: 0,
          refunded: 0,
          netRevenue: 0,
          orders: 0,
        };
      }
      if (isRefunded) {
        revenueByDayMap[dateKey].refunded += amount;
      } else {
        revenueByDayMap[dateKey].grossRevenue += amount;
      }
      revenueByDayMap[dateKey].netRevenue += netContribution;
      revenueByDayMap[dateKey].orders += 1;
    }
  });

  const revenueByDayLast7 = Object.values(revenueByDayMap)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(-7);

  const averageNetRevenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    startDate: startDate || null,
    endDate: endDate || null,
    totalOrders,
    totalRevenue,
    grossRevenue,
    totalRefunded,
    averageNetRevenuePerOrder,
    ordersPerStatus,
    todayOrders,
    todayRevenue,
    todayRefunded,
    revenueByDayLast7,
  };
}

module.exports = { getDashboardMetrics };
