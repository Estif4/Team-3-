import { Router } from 'express';
import { userController } from './user.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { createUserSchema, updateUserSchema, userIdParamSchema } from './user.validation.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/role.middleware.js';

const router = Router();

// Public routes (or protected by admin depending on requirement)
router.get('/', authenticate, userController.getUsers);
router.get('/:id', authenticate, validateRequest({ params: userIdParamSchema }), userController.getUserById);
router.post('/', authenticate, authorizeRoles('admin'), validateRequest({ body: createUserSchema }), userController.createUser);
router.put('/:id', authenticate, validateRequest({ params: userIdParamSchema, body: updateUserSchema }), userController.updateUser);
router.delete('/:id', authenticate, authorizeRoles('admin'), validateRequest({ params: userIdParamSchema }), userController.deleteUser);

export const userRoutes = router;
