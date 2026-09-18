import { Router } from 'express';
import { exampleController } from './module.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { createExampleSchema, updateExampleSchema, exampleIdParamSchema } from './module.validation.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', exampleController.getExamples);
router.get('/:id', validateRequest({ params: exampleIdParamSchema }), exampleController.getExampleById);
router.post('/', authenticate, validateRequest({ body: createExampleSchema }), exampleController.createExample);
router.put('/:id', authenticate, validateRequest({ params: exampleIdParamSchema, body: updateExampleSchema }), exampleController.updateExample);
router.delete('/:id', authenticate, validateRequest({ params: exampleIdParamSchema }), exampleController.deleteExample);

export const exampleRoutes = router;
