import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import prisma from '../../config/database';
import { sendSuccess } from '../../shared/helpers';
import { z } from 'zod';
import { validate } from '../../middleware/validate.middleware';
import { AuthRequest } from '../../middleware/auth.middleware';
import { NextFunction, Response } from 'express';

const router = Router();

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['MENU', 'INVENTORY', 'EXPENSE']),
});

// GET /categories?type=
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { type } = req.query;
    const categories = await prisma.category.findMany({
      where: { tenantId: req.user!.tenantId, ...(type ? { type: String(type) } : {}) },
      orderBy: { name: 'asc' },
    });
    sendSuccess(res, categories);
  } catch (err) { next(err); }
});

// POST /categories
router.post('/', authenticate, validate(createCategorySchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.create({ data: { tenantId: req.user!.tenantId, ...req.body } });
    sendSuccess(res, category, 'Category created', 201);
  } catch (err) { next(err); }
});

// PUT /categories/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, category, 'Category updated');
  } catch (err) { next(err); }
});

// DELETE /categories/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Category deleted');
  } catch (err) { next(err); }
});

export default router;
