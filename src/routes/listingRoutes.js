const express = require('express');
const { listingController, authMiddleware } = require('../container');

const router = express.Router();

/**
 * @openapi
 * /api/listings:
 *   get:
 *     summary: Get all listings
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', listingController.list);

/**
 * @openapi
 * /api/listings:
 *   post:
 *     summary: Create a new listing (admin only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Listing created
 *       403:
 *         description: Admin access required
 */
router.post('/', authMiddleware.protect, authMiddleware.requireAdmin, listingController.create);

/**
 * @openapi
 * /api/listings/suggest-category:
 *   get:
 *     summary: Suggest a category based on title/description keywords
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: text
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Suggested category
 */
router.get('/suggest-category', listingController.suggestCategory);

module.exports = { listingRoutes: router };
