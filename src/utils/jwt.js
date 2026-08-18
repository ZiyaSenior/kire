const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };
