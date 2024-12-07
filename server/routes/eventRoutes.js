import express from 'express';
import {
  createEvent,
  getUserEvents,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createEvent)
  .get(getUserEvents);

router.route('/:id')
  .put(updateEvent)
  .delete(deleteEvent);

export default router;