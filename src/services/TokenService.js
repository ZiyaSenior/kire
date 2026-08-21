const jwt = require('jsonwebtoken');

/** Issues and verifies the JWTs used for API authentication. */
class TokenService {
  constructor({ expiresIn = '7d' } = {}) {
    this.expiresIn = expiresIn;
  }

  // Read lazily so dotenv has loaded by the time a token is issued.
  get secret() {
    return process.env.JWT_SECRET || 'development-secret';
  }

  generate(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'user' },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = TokenService;
