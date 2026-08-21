const Listing = require('../models/Listing');
const ApiError = require('../errors/ApiError');

/** Keyword → category rules for the suggestion endpoint. Expand as needed. */
const CATEGORY_KEYWORDS = [
  { keywords: ['mənzil', 'ev', 'otaq', 'villa', 'apart'], category: 'real-estate' },
  { keywords: ['avtomobil', 'bmw', 'mers', 'toyota', 'nəqliyyat', 'maşın'], category: 'vehicles' },
  { keywords: ['macbook', 'laptop', 'telefon', 'kamera', 'elektron', 'pc'], category: 'electronics' },
  { keywords: ['stol', 'divan', 'mebel', 'bağ', 'bag'], category: 'home-garden' },
  { keywords: ['paltar', 'geyim', 'don', 'accessor', 'aksesuar'], category: 'fashion-events' },
  { keywords: ['kitab', 'roman', 'jurnal', 'hobbi', 'oyun'], category: 'books-hobbies' },
  { keywords: ['servis', 'xidmət', 'alət', 'avadanlıq'], category: 'services-industrial' }
];

const DEFAULT_CATEGORY = 'real-estate';

/** Listing search/creation business rules, independent of Express. */
class ListingService {
  constructor(listingRepository) {
    this.listings = listingRepository;
  }

  search(filters) {
    return this.listings.search(filters);
  }

  create(payload, owner) {
    const { title, price, category } = payload;

    if (!title || !price || !category) {
      throw ApiError.badRequest('title, price and category are required');
    }

    return this.listings.add(Listing.create(payload, owner.id));
  }

  suggestCategory(text) {
    const normalized = Listing.normalizeText(text);
    const match = CATEGORY_KEYWORDS.find(({ keywords }) =>
      keywords.some((keyword) => normalized.includes(keyword))
    );

    return match ? match.category : DEFAULT_CATEGORY;
  }
}

module.exports = ListingService;
