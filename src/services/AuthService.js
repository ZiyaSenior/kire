const User = require('../models/User');
const ApiError = require('../errors/ApiError');

/** Signup/login business rules, independent of Express. */
class AuthService {
  constructor(userRepository, tokenService) {
    this.users = userRepository;
    this.tokens = tokenService;
  }

  async signup({ fullName, email, password, phone }) {
    if (!fullName || !email || !password) {
      throw ApiError.badRequest('fullName, email and password are required');
    }

    if (this.users.existsByEmailOrPhone(email, phone)) {
      throw ApiError.conflict('User already exists');
    }

    const user = this.users.add(await User.register({ fullName, email, password, phone }));

    return {
      token: this.tokens.generate(user),
      user: user.toSafeJSON()
    };
  }

  async login({ identifier, email, phone, password }) {
    const loginIdentifier = identifier || email || phone;

    if (!loginIdentifier || !password) {
      throw ApiError.badRequest('identifier/email/phone and password are required');
    }

    const user = this.users.findByIdentifier(loginIdentifier);

    if (!user || !(await user.verifyPassword(password))) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    return {
      token: this.tokens.generate(user),
      user: user.toSafeJSON()
    };
  }
}

module.exports = AuthService;
