import express from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} from '../controllers/jobController.js';
import { protect, isEmployer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/employer', protect, isEmployer, getEmployerJobs);
router.get('/:id', getJob);

router.post('/', protect, isEmployer, createJob);
router.put('/:id', protect, isEmployer, updateJob);
router.delete('/:id', protect, isEmployer, deleteJob);

export default router;