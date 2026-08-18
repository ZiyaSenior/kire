const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbFilePath = path.join(__dirname, 'db.json');

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

const ensureDbFile = () => {
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify(buildDefaultData(), null, 2));
  }
};

const readDbFile = () => {
  try {
    ensureDbFile();
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    const parsed = JSON.parse(raw);

    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.listings)) {
      throw new Error('Invalid db.json structure');
    }

    return parsed;
  } catch (error) {
    const fallback = buildDefaultData();
    fs.writeFileSync(dbFilePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
};

const dbData = readDbFile();

const db = {
  users: dbData.users,
  listings: dbData.listings,
  save() {
    fs.writeFileSync(dbFilePath, JSON.stringify({ users: this.users, listings: this.listings }, null, 2));
  }
};

module.exports = db;
