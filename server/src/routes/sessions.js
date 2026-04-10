import { Router } from 'express';
import { sessionsController } from '../controllers/sessionsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, sessionsController.getAll);
router.get('/active', authenticate, sessionsController.getActive);
router.post('/entry', authenticate, authorize('Admin', 'Guard'), sessionsController.logEntry);
router.patch('/:id/exit', authenticate, authorize('Admin', 'Guard'), sessionsController.logExit);

export default router;
