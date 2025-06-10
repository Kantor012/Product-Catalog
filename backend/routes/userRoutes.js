import express from 'express';
import {
    registerUser,
    loginUser,
    verifyUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateUserProfile,
    createUserByAdmin
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .post('/register', registerUser);
router
    .post('/login', loginUser);
router
    .get('/verify/:token', verifyUser);
router
    .get('/', protect, admin, getUsers);
router
    .post('/admin', protect, admin, createUserByAdmin);

router.route('/profile')
    .put(protect, updateUserProfile);
router.route('/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

export default router;