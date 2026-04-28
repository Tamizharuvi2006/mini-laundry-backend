const jwt = require('jsonwebtoken');

/**
 * Admin login controller.
 * Validates credentials against env-configured demo admin credentials.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@laundry.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { email: adminEmail, role: 'admin' },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
    });
  }
}

module.exports = { login };
