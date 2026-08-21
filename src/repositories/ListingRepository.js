const BaseRepository = require('./BaseRepository');

class ListingRepository extends BaseRepository {
  constructor(db) {
    super(db, 'listings');
  }

  search(filters) {
    return this.items.filter((listing) => listing.matches(filters));
  }
}

module.exports = ListingRepository;
