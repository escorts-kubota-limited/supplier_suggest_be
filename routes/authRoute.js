import express from 'express';
import { login, verifyOtp } from '../controllers/authController.js';
import { loginLimiter, verifyLimiter } from '../middleware/rate_limiter.js';

const router = express.Router();

router.post('/login' ,loginLimiter,login);
router.post('/verify-otp', verifyLimiter,verifyOtp);

export default router;
