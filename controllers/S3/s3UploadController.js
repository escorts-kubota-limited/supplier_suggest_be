import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config();
// Setup AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // Set in .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Set in .env
  region: process.env.AWS_REGION,                 // Set in .env
});

const s3 = new AWS.S3();

// Multer S3 storage
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'ekl-mob-app', // e.g., 'ekl-suggestions'
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, `suggestions/${filename}`); // Folder inside the bucket
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg','image/jpg','image/png','application/pdf','application/vnd.ms-excel','application/octet-stream'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, PDF, and Excel files are allowed'), false);
    }
  },
});

export default upload;
