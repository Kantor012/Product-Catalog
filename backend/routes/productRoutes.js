import express from 'express';
import {
    createProduct,
    getProductById,
    searchProducts,
    addProductReview,
    getPromotionalProducts,
    getAllProductsAdmin,
    updateProduct,
    deleteProduct,
    getRecommendations,
    updateProductField,
    deleteAllReviews,
    deleteSingleReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(searchProducts)
    .post(protect, admin, createProduct);

router.route('/admin')
    .get(protect, admin, getAllProductsAdmin);

router.route('/promotional')
    .get(getPromotionalProducts);

router.route('/recommendations/:id')
    .get(getRecommendations);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct)
    .patch(protect, admin, updateProductField);

router.route('/:id/reviews')
    .post(protect, addProductReview)
    .delete(protect, admin, deleteAllReviews);

router.route('/:id/reviews/:reviewId')
    .delete(protect, admin, deleteSingleReview);


export default router;