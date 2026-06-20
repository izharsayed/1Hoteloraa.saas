import { Router } from 'express';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema, updateStatusSchema } from './housekeeping.dto';
import * as controller from './housekeeping.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /housekeeping?status=PENDING
router.get('/', checkPermission('HOUSEKEEPING', 'READ'), controller.getTasks);

// GET /housekeeping/my-tasks  — must be before /:id
router.get('/my-tasks', checkPermission('HOUSEKEEPING', 'READ'), controller.getMyTasks);

// GET /housekeeping/dashboard — must be before /:id
router.get('/dashboard', checkPermission('HOUSEKEEPING', 'READ'), controller.getDashboard);

// GET /housekeeping/:id
router.get('/:id', checkPermission('HOUSEKEEPING', 'READ'), controller.getTaskById);

// POST /housekeeping
router.post('/', checkPermission('HOUSEKEEPING', 'CREATE'), validate(createTaskSchema), controller.createTask);

// PUT /housekeeping/:id
router.put('/:id', checkPermission('HOUSEKEEPING', 'UPDATE'), validate(updateTaskSchema), controller.updateTask);

// PATCH /housekeeping/:id/status
router.patch('/:id/status', checkPermission('HOUSEKEEPING', 'UPDATE'), validate(updateStatusSchema), controller.updateStatus);

export default router;
