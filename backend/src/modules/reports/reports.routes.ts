import { Router } from 'express';
import * as reportsController from './reports.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { reportQuerySchema } from './reports.dto';

const router = Router();

router.use(authenticate);

// Inline query validator (req.query not body)
const validateQuery = (schema: any) => (req: any, res: any, next: any) => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.query = result.data;
  next();
};

router.get('/',      checkPermission('REPORTS', 'READ'), validateQuery(reportQuerySchema), reportsController.generateReport);
router.get('/saved', checkPermission('REPORTS', 'READ'), reportsController.getSavedReports);

export default router;
