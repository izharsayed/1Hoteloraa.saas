import { Router } from 'express';
import * as menuController from './menu.controller';
import { authenticate, checkPermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  createMenuCategorySchema,
  updateMenuCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
} from './menu.dto';

import { uploadImage } from '../../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

// Menu Categories
router.get('/categories',     checkPermission('MENU', 'READ'),   menuController.getCategories);
router.post('/categories',    checkPermission('MENU', 'CREATE'), validate(createMenuCategorySchema), menuController.createCategory);
router.put('/categories/:id', checkPermission('MENU', 'UPDATE'), validate(updateMenuCategorySchema), menuController.updateCategory);
router.delete('/categories/:id', checkPermission('MENU', 'DELETE'), menuController.deleteCategory);

// Menu Items
router.get('/items',     checkPermission('MENU', 'READ'),   menuController.getMenuItems);
router.get('/items/:id', checkPermission('MENU', 'READ'),   menuController.getMenuItemById);
router.post('/items/upload', checkPermission('MENU', 'CREATE'), uploadImage.single('image'), menuController.uploadItemImage);
router.post('/items',    checkPermission('MENU', 'CREATE'), validate(createMenuItemSchema), menuController.createMenuItem);
router.put('/items/:id', checkPermission('MENU', 'UPDATE'), validate(updateMenuItemSchema), menuController.updateMenuItem);
router.delete('/items/:id', checkPermission('MENU', 'DELETE'), menuController.deleteMenuItem);

export default router;
