const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

const normalizePhone = (value = '') => String(value).replace(/\s+/g, '').replace(/[-()]/g, '');

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  createdAt: user.createdAt
});

/**
 * @openapi
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid payload
 */
router.post('/signup', async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'fullName, email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone || '');

  const existingUser = db.users.find((user) => {
    const emailMatch = user.email && user.email.toLowerCase() === normalizedEmail;
    const phoneMatch = normalizedPhone && normalizePhone(user.phone) === normalizedPhone;
    return emailMatch || phoneMatch;
  });

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: String(Date.now() + Math.random()),
    fullName: String(fullName).trim(),
    email: normalizedEmail,
    phone: phone || '',
    password: hashedPassword,
    role: 'user',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.save();

  const token = generateToken(newUser);
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user: sanitizeUser(newUser)
  });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  const { email, phone, identifier, password } = req.body;
  const loginIdentifier = identifier || email || phone;

  if (!loginIdentifier || !password) {
    return res.status(400).json({ success: false, message: 'identifier/email/phone and password are required' });
  }

  const normalizedInput = String(loginIdentifier).trim();
  const normalizedPhone = normalizePhone(normalizedInput);

  const user = db.users.find((item) => {
    const matchesEmail = item.email && item.email.toLowerCase() === normalizedInput.toLowerCase();
    const matchesPhone = normalizedPhone && normalizePhone(item.phone || '') === normalizedPhone;
    return matchesEmail || matchesPhone;
  });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: sanitizeUser(user)
  });
});

module.exports = { authRoutes: router };
