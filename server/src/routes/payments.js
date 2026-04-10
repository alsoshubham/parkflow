import { Router } from 'express';
import { paymentsController } from '../controllers/paymentsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, paymentsController.getAll);
router.post('/', authenticate, paymentsController.create);

export default router;
