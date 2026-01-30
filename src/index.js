import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/database.js';
import errorHandler from './middleware/error.js';
import { createProxy } from './middleware/proxy.js';
import passport from './config/passport.js';

import authRoutes from './routes/auth.js';
import statsRoutes from './routes/stats.js';

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://bitsinbinary.com', 'https://www.bitsinbinary.com']
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BitsInBinary API Gateway is running!',
    version: '1.0.0',
    gateway: true,
    endpoints: {
      auth: '/api/auth',
      newsletter: '/api/newsletter',
      stats: '/api/stats',
    },
    services: {
      newsletter: process.env.NEWSLETTER_SERVICE_URL,
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/newsletter', createProxy(process.env.NEWSLETTER_SERVICE_URL));
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📮 Newsletter Service: ${process.env.NEWSLETTER_SERVICE_URL}`);
});
