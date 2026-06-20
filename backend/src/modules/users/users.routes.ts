import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from './users.dto';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER'));

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/', validate(createUserSchema), usersController.createUser);
router.put('/:id', validate(updateUserSchema), usersController.updateUser);
router.patch('/:id/toggle-status', usersController.toggleUserStatus);
router.put('/:id/reset-password', validate(resetPasswordSchema), usersController.resetPassword);

export default router;
