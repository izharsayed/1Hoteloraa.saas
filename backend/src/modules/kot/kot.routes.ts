import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createKOTSchema, updateKOTStatusSchema } from './kot.dto';
import {
  getKOTs,
  getKOTById,
  createKOT,
  updateKOTStatus,
  printKOT,
} from './kot.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/',    checkPermission('KOT', 'READ'),   getKOTs);
router.get('/:id', checkPermission('KOT', 'READ'),   getKOTById);
router.post('/',   checkPermission('KOT', 'CREATE'), validate(createKOTSchema), createKOT);
router.patch('/:id/status', checkPermission('KOT', 'UPDATE'), validate(updateKOTStatusSchema), updateKOTStatus);
router.post('/:id/print',   checkPermission('KOT', 'READ'),   printKOT);

export default router;
