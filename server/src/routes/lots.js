import { Router } from 'express';
import { lotsController } from '../controllers/lotsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, lotsController.getAll);
router.get('/:id', authenticate, lotsController.getById);
router.post('/', authenticate, authorize('Admin', 'Operator'), lotsController.create);
router.put('/:id', authenticate, authorize('Admin', 'Operator'), lotsController.update);
router.delete('/:id', authenticate, authorize('Admin'), lotsController.delete);

export default router;
