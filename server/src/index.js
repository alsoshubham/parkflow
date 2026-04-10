import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import { errorHandler } from './middleware/auth.js';

// Routes
import authRoutes from './routes/auth.js';
import lotsRoutes from './routes/lots.js';
import bookingsRoutes from './routes/bookings.js';
import paymentsRoutes from './routes/payments.js';
import sessionsRoutes from './routes/sessions.js';
import usersRoutes from './routes/users.js';
import reportsRoutes from './routes/reports.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger (dev)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'ParkFlow API' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lots', lotsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/reports', reportsRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
  🚗 ParkFlow API Server
  ──────────────────────
  Port:    ${config.port}
  Mode:    ${config.nodeEnv}
  URL:     http://localhost:${config.port}
  Health:  http://localhost:${config.port}/api/health
  ──────────────────────
  `);
});
