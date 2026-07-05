import express from 'express';
import {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  scheduleInterview
} from '../controllers/applicationController.js';
import { protect, isEmployer, isCandidate } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, isCandidate, getMyApplications);
router.get('/job/:jobId', protect, isEmployer, getJobApplications);

router.post('/', protect, isCandidate, applyForJob);
router.put('/:id/status', protect, isEmployer, updateApplicationStatus);
router.post('/:id/interview', protect, isEmployer, scheduleInterview);

export default router;