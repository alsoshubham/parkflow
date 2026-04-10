import { Router } from 'express';
import { bookingsController } from '../controllers/bookingsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, bookingsController.getAll);
router.get('/:id', authenticate, bookingsController.getById);
router.post('/', authenticate, bookingsController.create);
router.patch('/:id/cancel', authenticate, bookingsController.cancel);

export default router;
