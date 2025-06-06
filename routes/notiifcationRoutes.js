import express from 'express';
import { getNotificationofUser ,openNotifications} from '../controllers/notificationController.js';

const router = express.Router();

// Route to send push notification
router.post('/fetch-notification', getNotificationofUser);
router.post('/open', openNotifications);

export default router;
