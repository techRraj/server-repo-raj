// import express from 'express';
// import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
// import authUser from '../middlewares/auth.js';

// const router = express.Router();

// // Public routes
// router.post('/register', registerUser); // Register a new user
// router.post('/login', loginUser); // Login an existing user

// // Protected routes (require authentication)
// router.get('/credits', authUser, userCredits);
// router.post('/pay-razor', authUser, paymentRazorpay); // Initiate Razorpay payment
// router.post('/verify-razor', verifyRazorpay); // Verify Razorpay payment

// export default router;


import express from 'express';
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } from '../controllers/userController.js';
import authUser from '../middlewares/auth.js';

const router = express.Router();

// Utility middleware to handle async errors
function asyncHandler(fn) {
  return (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
}

// Public routes
router.post('/register', asyncHandler(registerUser)); // Register a new user
router.post('/login', asyncHandler(loginUser)); // Login an existing user

// Protected routes (require authentication)
router.get('/credits', authUser, asyncHandler(userCredits));
router.post('/pay-razor', authUser, asyncHandler(paymentRazorpay)); // Initiate Razorpay payment
router.post('/verify-razor', asyncHandler(verifyRazorpay)); // Verify Razorpay payment

export default router;