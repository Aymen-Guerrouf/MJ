import express from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import userRoutes from './user.routes.js'

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/user', userRoutes)

export default router;
