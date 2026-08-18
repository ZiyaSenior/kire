const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = { healthRoutes: router };
