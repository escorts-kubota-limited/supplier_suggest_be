import express from 'express';
import { download, downloadS3Files } from '../controllers/fileController.js';

const router = express.Router();

router.get('/view', download);
router.get('/downloadFile', downloadS3Files);

export default router;
