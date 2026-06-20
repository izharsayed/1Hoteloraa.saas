import { Router } from 'express';
import * as rolesController from './roles.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRoleSchema, updateRoleSchema } from './roles.dto';

const router = Router();

router.use(authenticate);
router.use(authorize('SUPER_ADMIN', 'TENANT_ADMIN'));

router.get('/', rolesController.getRoles);
router.get('/:id', rolesController.getRoleById);
router.post('/', validate(createRoleSchema), rolesController.createRole);
router.put('/:id', validate(updateRoleSchema), rolesController.updateRole);
router.delete('/:id', rolesController.deleteRole);

export default router;
