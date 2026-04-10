import { Router } from 'express';
import { reportsController } from '../controllers/reportsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticate, authorize('Admin', 'Operator'), reportsController.summary);
router.get('/revenue-by-lot', authenticate, authorize('Admin', 'Operator'), reportsController.revenueByLot);

export default router;
