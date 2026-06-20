import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
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

// GET /kot?status=PENDING
router.get('/', getKOTs);

// GET /kot/:id
router.get('/:id', getKOTById);

// POST /kot
router.post('/', validate(createKOTSchema), createKOT);

// PATCH /kot/:id/status
router.patch('/:id/status', validate(updateKOTStatusSchema), updateKOTStatus);

// POST /kot/:id/print
router.post('/:id/print', printKOT);

export default router;
