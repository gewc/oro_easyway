import express from 'express'
import { getAllProducts, getProductsByStore, createProduct, getProductByID, updateProduct, deactivateProduct, getProductsAndStore } from '../controllers/product.controller.js'

const router = express.Router();

router.route('/').get(getAllProducts);
router.route('/store/:id').get(getProductsByStore);
router.route('/materialsearch/:search').get(getProductsAndStore);
router.route('/').get(getAllProducts);
router.route('/').post(createProduct);
router.route('/:id').get(getProductByID);
router.route('/:id').patch(updateProduct);
router.route('/:id').delete(deactivateProduct);

export default router;