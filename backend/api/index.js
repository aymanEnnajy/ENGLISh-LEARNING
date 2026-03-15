import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { generalLimiter } from '../middleware/rateLimit.js';
import authRoutes from '../routes/auth.js';
import wordsRoutes from '../routes/words.js';
import aiRoutes from '../routes/ai.js';
import statsRoutes from '../routes/stats.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(generalLimiter);

// Routes
app.get('/api/debug-env', (req, res) => {
  res.json({
    supabaseUrl: !!(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
    supabaseAnonKey: !!(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd()
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);

// Random word for test (mounted separately to allow /api/words/random)
app.use('/api/test', wordsRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
