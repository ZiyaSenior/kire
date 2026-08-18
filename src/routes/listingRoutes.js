const express = require('express');
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

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
router.get('/', (req, res) => {
  return res.json({
    success: true,
    count: db.listings.length,
    data: db.listings
  });
});

/**
 * @openapi
 * /api/listings:
 *   post:
 *     summary: Create a new listing
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
 */
router.post('/', protect, (req, res) => {
  const { title, description, price, category } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ success: false, message: 'title, price and category are required' });
  }

  const newListing = {
    id: String(Date.now() + Math.random()),
    title,
    description: description || '',
    price,
    category,
    owner: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.listings.push(newListing);

  return res.status(201).json({
    success: true,
    message: 'Listing created successfully',
    data: newListing
  });
});

module.exports = { listingRoutes: router };
