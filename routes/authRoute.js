import express from 'express';
import { login, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/login' ,login);
router.post('/verify-otp', verifyOtp);

export default router;
