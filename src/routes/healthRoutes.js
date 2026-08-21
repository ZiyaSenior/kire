const express = require('express');
const { healthController } = require('../container');

const router = express.Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', healthController.check);

module.exports = { healthRoutes: router };
