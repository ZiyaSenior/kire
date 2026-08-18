const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');

const { authRoutes } = require('./routes/authRoutes');
const { listingRoutes } = require('./routes/listingRoutes');
const { healthRoutes } = require('./routes/healthRoutes');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const swaggerOptions = {
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
  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    message: 'Kire API is running',
    docs: '/api-docs',
    version: '1.0.0'
  });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;
