import express from 'express';
import { getStats, updatePlatformStats, bulkUpdateStats } from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - get all stats
router.get('/', getStats);

// Protected routes - update stats (require authentication)
router.put('/platform', protect, updatePlatformStats);
router.put('/bulk', protect, bulkUpdateStats);

export default router;
