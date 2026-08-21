const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor(db) {
    super(db, 'users');
  }

  findByIdentifier(identifier) {
    return this.items.find((user) => user.matchesIdentifier(identifier));
  }

  /** True when another account already uses this email or phone. */
  existsByEmailOrPhone(email, phone) {
    return this.items.some((user) => user.matchesEmail(email) || user.matchesPhone(phone));
  }
}

module.exports = UserRepository;
