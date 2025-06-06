import path from "path";
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { URL } from 'url';


export const download = async (req, res) => {
    const { p } = req.query;
   try{
    res.download(path.resolve(`./${p}`), function (err) {
      if (err) {
        console.error("Error sending file:", err);
      } else {
        console.log("Sent:", p);
      }
    });
   }
   catch(e){
    res.status(500).json({ message: "Error", error });
  
   }
  };



dotenv.config();

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const downloadS3Files = async (req, res) => {
  const { p } = req.query; // Full S3 file URL

  try {
    if (!p) {
      return res.status(400).json({ message: 'File URL (p) is required' });
    }

    // Parse the object key from the URL
    const url = new URL(p);
    const Key = decodeURIComponent(url.pathname.substring(1)); // remove leading '/'

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME || 'ekl-mob-app',
      Key,
    };

    // Check if the file exists
    await s3.headObject(params).promise(); // Will throw error if not found (404)

    // Create stream and set headers
    const s3Stream = s3.getObject(params).createReadStream();
    res.setHeader('Content-Disposition', `attachment; filename="${Key.split('/').pop()}"`);

    s3Stream.pipe(res).on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).json({ message: 'Error streaming file', error: err });
    });
  } catch (error) {
    if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
      return res.status(404).json({ message: 'File not found on S3' });
    }

    console.error('Download error:', error);
    res.status(500).json({ message: 'Download failed', error });
  }
};

