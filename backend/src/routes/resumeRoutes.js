// routes/resume.js
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  uploadResume,
  getMatchedJobs,
  getResumeStatus,
  deleteResume,
  atsCheckResume
} from '../controllers/resumeController.js';

const router = express.Router();

// ✅ FIX: memoryStorage use kar rahe hain instead of CloudinaryStorage.
// CloudinaryStorage seedha stream karke Cloudinary pe upload kar deta hai,
// isliye req.file.buffer kabhi milta hi nahi tha (ye hamesha undefined tha).
// memoryStorage se req.file.buffer reliably milega, jo text extraction
// (pdf-parse / mammoth) ke liye zaroori hai. Cloudinary upload ab hum
// controller me manually, buffer se, karte hain (streamifier ke through).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  console.log('📄 File type:', file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
router.post('/upload-resume', protect, (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, uploadResume);

router.post('/ats-check', protect, (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, atsCheckResume);

router.get('/matched-jobs', protect, getMatchedJobs);
router.get('/resume-status', protect, getResumeStatus);
router.delete('/delete-resume', protect, deleteResume);

export default router;