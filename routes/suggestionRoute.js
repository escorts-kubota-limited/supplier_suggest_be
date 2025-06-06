import express from 'express';
import { createSuggestion, downloadSuggestion, exportSuggestion, getAllSuggestion, getBuyers, getDepartments, getSuggestionByPhone, getSuggestionDetails, getSuggestionsByEmail, updateDepartment } from '../controllers/suggestionController.js';
import upload from '../controllers/S3/s3UploadController.js';
import { getSuggestionStatus, updateSuggestionStatus } from '../controllers/sugestionStatusController.js';
import { createComment, getCommentBySuggestion } from '../controllers/commentController.js';
import authenticateToken from '../middleware/authentication.js';
const router = express.Router();

// POST route for creating a suggestion with file upload
router.post('/create', upload.array('attachments', 5), createSuggestion);

router.post('/getByUserId',  getSuggestionByPhone);
router.post('/getSuggestionDetails',  getSuggestionDetails);


//Department APIS
router.get('/get-departments',  getDepartments);
router.get('/get-buyers',  getBuyers);

router.post('/export-sugestions',exportSuggestion)

///Admin Apis

router.post('/getSuggestionByEmail', authenticateToken ,getSuggestionsByEmail);
router.post('/send-to-department',authenticateToken , updateDepartment);
router.post('/getAll',authenticateToken , getAllSuggestion);
router.post('/getStatus',authenticateToken , getSuggestionStatus);
router.post('/updateStatus',authenticateToken,updateSuggestionStatus)
///comment Apis
router.post('/add-comment',  upload.array('attachment', 1) , createComment);
router.post('/get-comment', authenticateToken ,getCommentBySuggestion);
router.get('/download-suggestion', downloadSuggestion);







export default router;
