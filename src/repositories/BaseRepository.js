/**
 * Generic collection access on top of the Database store.
 * Subclasses add entity-specific query methods.
 */
class BaseRepository {
  constructor(db, collectionName) {
    this.db = db;
    this.collectionName = collectionName;
  }

  get items() {
    return this.db[this.collectionName];
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }

  add(entity) {
    this.items.push(entity);
    this.db.save();
    return entity;
  }
}

module.exports = BaseRepository;
