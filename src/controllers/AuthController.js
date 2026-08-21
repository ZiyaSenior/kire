/** HTTP adapter for auth: translates requests/responses, delegates to AuthService. */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  signup = async (req, res, next) => {
    try {
      const result = await this.authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        ...result
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AuthController;
