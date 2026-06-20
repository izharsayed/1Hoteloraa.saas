import { Router } from 'express';
import * as menuController from './menu.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createMenuCategorySchema,
  updateMenuCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from './menu.dto';

const router = Router();

router.use(authenticate);

// Categories
router.get('/categories', menuController.getCategories);
router.post('/categories', validate(createMenuCategorySchema), menuController.createCategory);
router.put('/categories/:id', validate(updateMenuCategorySchema), menuController.updateCategory);
router.delete('/categories/:id', menuController.deleteCategory);

// Items
router.get('/items', menuController.getMenuItems);
router.get('/items/:id', menuController.getMenuItemById);
router.post('/items', validate(createMenuItemSchema), menuController.createMenuItem);
router.put('/items/:id', validate(updateMenuItemSchema), menuController.updateMenuItem);
router.delete('/items/:id', menuController.deleteMenuItem);

export default router;
