import { Router } from 'express';
import { usersController } from '../controllers/usersController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('Admin'), usersController.getAll);
router.get('/:id', authenticate, authorize('Admin'), usersController.getById);
router.post('/', authenticate, authorize('Admin'), usersController.create);
router.put('/:id', authenticate, authorize('Admin'), usersController.update);
router.delete('/:id', authenticate, authorize('Admin'), usersController.delete);

export default router;
