const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Laundry API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
