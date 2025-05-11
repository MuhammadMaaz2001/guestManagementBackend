import express from 'express';
import {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest,
  filterGuests,
  getStats
} from '../controllers/guest.controller.js';

const router = express.Router();

router.post('/', createGuest);
router.get('/', getGuests);
router.patch('/:id', updateGuest);
router.delete('/:id', deleteGuest);

// Extra Routes
router.get('/filter', filterGuests);
router.get('/stats', getStats);

export default router;
