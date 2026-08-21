const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Domain model for a user account. Encapsulates password hashing,
 * identifier matching and safe serialization.
 */
class User {
  constructor({ id, fullName, email, phone, password, role, createdAt }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone || '';
    this.password = password;
    this.role = role || 'user';
    this.createdAt = createdAt || new Date().toISOString();
  }

  /** Factory: build a new user from a signup payload (hashes the password). */
  static async register({ fullName, email, password, phone }) {
    return new User({
      id: crypto.randomUUID(),
      fullName: String(fullName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone || '',
      password: await bcrypt.hash(password, SALT_ROUNDS),
      role: 'user'
    });
  }

  /** Strip formatting characters so phone numbers compare reliably. */
  static normalizePhone(value = '') {
    return String(value).replace(/\s+/g, '').replace(/[-()]/g, '');
  }

  get isAdmin() {
    return this.role === 'admin';
  }

  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  }

  matchesEmail(email) {
    return Boolean(this.email) && this.email.toLowerCase() === String(email).trim().toLowerCase();
  }

  matchesPhone(phone) {
    const normalized = User.normalizePhone(phone);
    return Boolean(normalized) && User.normalizePhone(this.phone) === normalized;
  }

  /** True when the identifier (email or phone) refers to this user. */
  matchesIdentifier(identifier) {
    return this.matchesEmail(identifier) || this.matchesPhone(identifier);
  }

  /** Public representation — never exposes the password hash. */
  toSafeJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
