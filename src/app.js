const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

dotenv.config();

const ApiError = require('./errors/ApiError');
const { authRoutes } = require('./routes/authRoutes');
const { listingRoutes } = require('./routes/listingRoutes');
const { healthRoutes } = require('./routes/healthRoutes');

/**
 * Builds and configures the Express application
 * (middleware → docs → routes → error handling).
 */
class KireApp {
  // Vite dev server may fall back to any of these ports.
  static ALLOWED_ORIGINS = [5173, 5174, 5175, 5176, 5177, 5178].flatMap((port) => [
    `http://localhost:${port}`,
    `http://127.0.0.1:${port}`
  ]);

  constructor() {
    this.express = express();
    this.configureMiddleware();
    this.configureDocs();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddleware() {
    this.express.use(cors({
      origin: (origin, callback) => {
        if (!origin || KireApp.ALLOWED_ORIGINS.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(morgan('dev'));
  }

  configureDocs() {
    const swaggerSpec = swaggerJsdoc({
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Kire API',
          version: '1.0.0',
          description: 'MVP backend for Kire marketplace platform.'
        },
        servers: [
          { url: 'http://localhost:5000' }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        }
      },
      apis: ['./src/routes/*.js']
    });

    this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  configureRoutes() {
    this.express.get('/', (req, res) => {
      res.json({
        message: 'Kire API is running',
        docs: '/api-docs',
        version: '1.0.0'
      });
    });

    this.express.use('/api', healthRoutes);
    this.express.use('/api/auth', authRoutes);
    this.express.use('/api/listings', listingRoutes);
  }

  configureErrorHandling() {
    // eslint-disable-next-line no-unused-vars
    this.express.use((err, req, res, next) => {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
      }

      console.error(err.stack);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    });
  }
}

module.exports = new KireApp().express;
