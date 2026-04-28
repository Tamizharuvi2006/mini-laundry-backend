const dashboardService = require('../services/dashboardService');

/**
 * Get dashboard metrics
 */
async function getDashboard(req, res) {
  try {
    const metrics = await dashboardService.getDashboardMetrics();

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
}

module.exports = { getDashboard };
