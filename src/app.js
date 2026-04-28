const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
