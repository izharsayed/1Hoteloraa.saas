import { Router } from 'express';
import * as reportsController from './reports.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { reportQuerySchema } from './reports.dto';

const router = Router();

router.use(authenticate);

// Validate req.query using validate helper or do it in controller. Since validate(schema) expects req.body, let's write a custom query validator or do it in routes.
// We can use a query validation middleware. Let's do a simple one:
const validateQuery = (schema: any) => {
  return (req: any, res: any, next: any) => {
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
};

router.get('/', validateQuery(reportQuerySchema), reportsController.generateReport);
router.get('/saved', reportsController.getSavedReports);

export default router;
