const fs = require('fs');

/**
 * Simple JSON-file-backed data store.
 *
 * - `persistent: true`  → reads/writes the JSON file on disk.
 * - `persistent: false` → keeps everything in memory (used by tests so
 *   they never pollute db.json and stay repeatable).
 *
 * `hydrate` converts raw JSON records into domain model instances.
 */
class Database {
  constructor({ filePath, seed, hydrate = (data) => data, persistent = true }) {
    this.filePath = filePath;
    this.seed = seed;
    this.hydrate = hydrate;
    this.persistent = persistent;
    this.data = this.hydrate(this.load());
  }

  load() {
    if (!this.persistent) {
      return this.seed();
    }

    try {
      if (!fs.existsSync(this.filePath)) {
        const data = this.seed();
        this.writeToDisk(data);
        return data;
      }

      const parsed = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

      if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.listings)) {
        throw new Error('Invalid db.json structure');
      }

      return parsed;
    } catch (error) {
      const fallback = this.seed();
      this.writeToDisk(fallback);
      return fallback;
    }
  }

  writeToDisk(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  get users() {
    return this.data.users;
  }

  get listings() {
    return this.data.listings;
  }

  save() {
    if (this.persistent) {
      this.writeToDisk({ users: this.users, listings: this.listings });
    }
  }
}

module.exports = Database;
