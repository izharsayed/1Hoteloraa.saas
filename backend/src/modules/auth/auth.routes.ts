import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { registerTenantSchema, loginSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.dto';

const router = Router();

router.post('/register', validate(registerTenantSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

// Password reset (public — no auth required)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

export default router;

