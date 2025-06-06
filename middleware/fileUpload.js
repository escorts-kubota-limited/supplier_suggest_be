import multer from 'multer';
import path from 'path';

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/suggestions'); // Define the directory for file storage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg','image/jpg', 'image/png', 'application/pdf','application/vnd.ms-excel','application/octet-stream'];
    cb(null, true);
    
    // if (allowedTypes.includes(file.mimetype)) {
    //   cb(null, true);
    // } else {
    //   cb(new Error('Only JPEG, PNG, PDF, and Excel files are allowed'), false);
    // }
  },
});

export default upload;
