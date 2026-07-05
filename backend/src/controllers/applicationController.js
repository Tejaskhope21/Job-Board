import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate)
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter, resume, expectedSalary, availability } = req.body;
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      coverLetter,
      resume,
      expectedSalary,
      availability
    });
    
    // Add application to job
    job.applications.push(application._id);
    await job.save();
    
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if user owns the job or is admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }
    
    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email profile')
      .sort({ appliedAt: -1 });
      
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type salary status')
      .sort({ appliedAt: -1 });
      
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findById(req.params.id)
      .populate('job', 'postedBy');
      
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user owns the job or is admin
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }
    
    application.status = status;
    if (notes) application.notes = notes;
    application.updatedAt = Date.now();
    
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Schedule interview
// @route   POST /api/applications/:id/interview
// @access  Private (Employer)
export const scheduleInterview = async (req, res) => {
  try {
    const { date, type, notes } = req.body;
    
    const application = await Application.findById(req.params.id)
      .populate('job', 'postedBy');
      
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Check if user owns the job or is admin
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to schedule interview' });
    }
    
    application.interviews.push({
      date,
      type: type || 'video',
      notes
    });
    application.status = 'interviewed';
    application.updatedAt = Date.now();
    
    await application.save();
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};