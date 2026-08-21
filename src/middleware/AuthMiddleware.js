/** Express middleware guarding protected routes via JWT + role checks. */
class AuthMiddleware {
  constructor(userRepository, tokenService) {
    this.users = userRepository;
    this.tokens = tokenService;
  }

  protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.tokens.verify(token);
      const user = this.users.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };

  requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required to publish listings'
      });
    }

    return next();
  };
}

module.exports = AuthMiddleware;
