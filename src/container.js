/**
 * Composition root: builds and wires every service, repository,
 * controller and middleware exactly once (constructor injection).
 */
const db = require('./config/db');
const UserRepository = require('./repositories/UserRepository');
const ListingRepository = require('./repositories/ListingRepository');
const TokenService = require('./services/TokenService');
const AuthService = require('./services/AuthService');
const ListingService = require('./services/ListingService');
const AuthController = require('./controllers/AuthController');
const ListingController = require('./controllers/ListingController');
const HealthController = require('./controllers/HealthController');
const AuthMiddleware = require('./middleware/AuthMiddleware');

const userRepository = new UserRepository(db);
const listingRepository = new ListingRepository(db);

const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const listingService = new ListingService(listingRepository);

module.exports = {
  db,
  userRepository,
  listingRepository,
  tokenService,
  authService,
  listingService,
  authController: new AuthController(authService),
  listingController: new ListingController(listingService),
  healthController: new HealthController(),
  authMiddleware: new AuthMiddleware(userRepository, tokenService)
};
