class HealthController {
  check = (req, res) => {
    res.json({
      success: true,
      message: 'API healthy',
      timestamp: new Date().toISOString()
    });
  };
}

module.exports = HealthController;
