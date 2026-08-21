const path = require('path');
const bcrypt = require('bcryptjs');
const Database = require('./Database');
const User = require('../models/User');
const Listing = require('../models/Listing');

const buildDefaultData = () => ({
  users: [
    {
      id: 'admin-1',
      fullName: 'Safar Aliyev',
      email: 'safaraliyevziya@gmail.com',
      phone: '+994500000000',
      password: bcrypt.hashSync('Admin123!', 10),
      role: 'admin',
      createdAt: new Date().toISOString()
    }
  ],
  listings: []
});

/** Shared singleton store; tests run fully in memory. */
const db = new Database({
  filePath: path.join(__dirname, 'db.json'),
  seed: buildDefaultData,
  persistent: process.env.NODE_ENV !== 'test',
  hydrate: (data) => ({
    users: data.users.map((record) => new User(record)),
    listings: data.listings.map((record) => new Listing(record))
  })
});

module.exports = db;
