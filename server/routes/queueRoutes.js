import express from 'express';
import {
  joinQueue,
  getQueueStatus,
  getCurrentServing,
  getQueueList,
  startServing,
  completeServing,
  increasePriority,
  removeFromQueue,
  getQueueStats,
} from '../controllers/queueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/join', joinQueue);
router.get('/status/:id', getQueueStatus);
router.get('/current', getCurrentServing);
router.get('/list', getQueueList);

// Protected routes (Admin only)
router.put('/start/:id', protect, startServing);
router.put('/complete/:id', protect, completeServing);
router.put('/priority/:id', protect, increasePriority);
router.delete('/:id', protect, removeFromQueue);
router.get('/stats', protect, getQueueStats);

export default router;

