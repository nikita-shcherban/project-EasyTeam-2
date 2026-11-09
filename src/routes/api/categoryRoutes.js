import { Router } from 'express';
import { celebrate } from 'celebrate';
import { getAllCategories } from '../../controllers/categoryController.js';
import { getAllCategoriesSchema } from '../../validations/categoryValidation.js';

const router = Router();

router.get(
  '/api/categories',
  celebrate(getAllCategoriesSchema),
  getAllCategories,
);

export default router;
