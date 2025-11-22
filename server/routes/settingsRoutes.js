import express from 'express';
import { getSettings, getPublicSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route (for checking queue status)
router.get('/public', getPublicSettings);

// Protected routes (Admin only)
router.get('/', protect, getSettings);
router.put('/update', protect, updateSettings);

export default router;

