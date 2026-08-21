/** HTTP adapter for listings: translates requests/responses, delegates to ListingService. */
class ListingController {
  constructor(listingService) {
    this.listingService = listingService;
  }

  list = (req, res, next) => {
    try {
      const listings = this.listingService.search(req.query);
      res.json({
        success: true,
        count: listings.length,
        data: listings
      });
    } catch (error) {
      next(error);
    }
  };

  create = (req, res, next) => {
    try {
      const listing = this.listingService.create(req.body, req.user);
      res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: listing
      });
    } catch (error) {
      next(error);
    }
  };

  suggestCategory = (req, res, next) => {
    try {
      res.json({
        success: true,
        category: this.listingService.suggestCategory(req.query.text || '')
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ListingController;
