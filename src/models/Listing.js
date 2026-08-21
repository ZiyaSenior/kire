const crypto = require('crypto');

/**
 * Domain model for a marketplace listing. Owns its normalization,
 * validation defaults and filter-matching logic.
 */
class Listing {
  constructor({ id, title, description, price, category, city, location, listingType, owner, createdAt }) {
    this.id = id;
    this.title = title;
    this.description = description || '';
    this.price = Number(price);
    this.category = category;
    this.city = city || 'Bakı';
    this.location = location || '';
    this.listingType = listingType || 'rent';
    this.owner = owner;
    this.createdAt = createdAt || new Date().toISOString();
  }

  /** Factory: build a new listing from a request payload for the given owner. */
  static create({ title, description, price, category, city, location, listingType }, ownerId) {
    return new Listing({
      id: crypto.randomUUID(),
      title: String(title).trim(),
      description,
      price,
      category: String(category).trim(),
      city,
      location,
      listingType,
      owner: ownerId
    });
  }

  static normalizeText(value = '') {
    return String(value).trim().toLowerCase();
  }

  /** True when the listing satisfies every provided search filter. */
  matches({ search, category, city, minPrice, maxPrice, listingType } = {}) {
    const searchTerm = Listing.normalizeText(search);
    const categoryFilter = Listing.normalizeText(category);
    const cityFilter = Listing.normalizeText(city);
    const typeFilter = Listing.normalizeText(listingType);
    const minPriceValue = minPrice !== undefined ? Number(minPrice) : null;
    const maxPriceValue = maxPrice !== undefined ? Number(maxPrice) : null;

    const matchSearch = !searchTerm || [
      this.title,
      this.description,
      this.location,
      this.city,
      this.category
    ].some((field) => String(field || '').toLowerCase().includes(searchTerm));

    const matchCategory = !categoryFilter || Listing.normalizeText(this.category) === categoryFilter;
    const matchCity = !cityFilter || Listing.normalizeText(this.city) === cityFilter;
    const matchMinPrice = minPriceValue === null || this.price >= minPriceValue;
    const matchMaxPrice = maxPriceValue === null || this.price <= maxPriceValue;
    const matchType = !typeFilter || Listing.normalizeText(this.listingType) === typeFilter;

    return matchSearch && matchCategory && matchCity && matchMinPrice && matchMaxPrice && matchType;
  }
}

module.exports = Listing;
