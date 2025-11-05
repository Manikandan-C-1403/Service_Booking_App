import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  checkAvailability
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', protect, getAllBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/check-availability', checkAvailability);

export default router;
