const express = require('express');
const db = require('../config/db');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

const normalizeSearchText = (value = '') => String(value).trim().toLowerCase();

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
  const { search, category, city, minPrice, maxPrice, listingType } = req.query;

  const searchTerm = normalizeSearchText(search);
  const categoryFilter = normalizeSearchText(category);
  const cityFilter = normalizeSearchText(city);
  const minPriceValue = minPrice !== undefined ? Number(minPrice) : null;
  const maxPriceValue = maxPrice !== undefined ? Number(maxPrice) : null;
  const listingTypeFilter = normalizeSearchText(listingType);

  const filteredListings = db.listings.filter((listing) => {
    const matchSearch = !searchTerm || [
      listing.title,
      listing.description,
      listing.location,
      listing.city,
      listing.category
    ].some((field) => String(field || '').toLowerCase().includes(searchTerm));

    const matchCategory = !categoryFilter || normalizeSearchText(listing.category) === categoryFilter;
    const matchCity = !cityFilter || normalizeSearchText(listing.city) === cityFilter;
    const matchMinPrice = minPriceValue === null || Number(listing.price) >= minPriceValue;
    const matchMaxPrice = maxPriceValue === null || Number(listing.price) <= maxPriceValue;
    const matchType = !listingTypeFilter || normalizeSearchText(listing.listingType) === listingTypeFilter;

    return matchSearch && matchCategory && matchCity && matchMinPrice && matchMaxPrice && matchType;
  });

  return res.json({
    success: true,
    count: filteredListings.length,
    data: filteredListings
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
router.post('/', protect, requireAdmin, (req, res) => {
  const { title, description, price, category, city, location, listingType } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ success: false, message: 'title, price and category are required' });
  }

  const newListing = {
    id: String(Date.now() + Math.random()),
    title: String(title).trim(),
    description: description || '',
    price: Number(price),
    category: String(category).trim(),
    city: city || 'Bakı',
    location: location || '',
    listingType: listingType || 'rent',
    owner: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.listings.push(newListing);
  db.save();

  return res.status(201).json({
    success: true,
    message: 'Listing created successfully',
    data: newListing
  });
});

module.exports = { listingRoutes: router };
