import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createUserSchema, updateUserSchema, resetPasswordSchema } from './users.dto';

const router = Router();

router.use(authenticate);

// GET — Manager can read, only TENANT_ADMIN can create/update/delete (enforced via checkPermission)
router.get('/',    checkPermission('USERS', 'READ'),   usersController.getUsers);
router.get('/:id', checkPermission('USERS', 'READ'),   usersController.getUserById);
router.post('/',   checkPermission('USERS', 'CREATE'), validate(createUserSchema), usersController.createUser);
router.put('/:id', checkPermission('USERS', 'UPDATE'), validate(updateUserSchema), usersController.updateUser);
router.patch('/:id/toggle-status', checkPermission('USERS', 'UPDATE'), usersController.toggleUserStatus);
router.put('/:id/reset-password',  checkPermission('USERS', 'UPDATE'), validate(resetPasswordSchema), usersController.resetPassword);

export default router;
