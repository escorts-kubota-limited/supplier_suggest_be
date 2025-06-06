import express from 'express';
import { storeDeviceDetails } from '../controllers/deviceController.js';

const router = express.Router();

// Route to store device details
router.post('/store', storeDeviceDetails);

export default router;
