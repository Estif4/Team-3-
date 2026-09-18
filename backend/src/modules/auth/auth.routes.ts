import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authRateLimiter } from '../../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/register', authRateLimiter, validateRequest({ body: registerSchema }), authController.register);
router.post('/login', authRateLimiter, validateRequest({ body: loginSchema }), authController.login);
router.post('/refresh-token', validateRequest({ body: refreshTokenSchema }), authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export const authRoutes = router;
