import express from 'express';
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/credits', authUser, userCredits);
router.post('/pay-razor', authUser, paymentRazorpay);
router.post('/verify-razor', verifyRazorpay);

export default router;