import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    // limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  }).array('files', 3); // Expecting 'files' field and a maximum of 3 files
  
export default upload;