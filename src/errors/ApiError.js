/**
 * Typed HTTP error thrown by services/controllers and translated
 * into a JSON response by the global error handler.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized(message) {
    return new ApiError(401, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }
}

module.exports = ApiError;
