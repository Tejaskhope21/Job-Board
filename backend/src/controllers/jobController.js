import Job from '../models/Job.js';
import Application from '../models/Application.js';

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };
    
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
  try {
    const { 
      search, 
      location, 
      type, 
      category, 
      experienceLevel,
      remote,
      page = 1,
      limit = 10 
    } = req.query;
    
    const query = { status: 'active' };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (remote !== undefined) query.remote = remote === 'true';
    
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
      
    const total = await Job.countDocuments(query);
    
    res.json({
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email profile')
      .populate('applications', 'status candidate appliedAt');
      
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Increment views
    job.views += 1;
    await job.save();
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
export const deleteJob = async (req, res) => {
  try {
    // First check if job exists and user is authorized
    const job = await Job.findOne({ 
      _id: req.params.id,
      postedBy: req.user._id 
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found or not authorized' });
    }
    
    // Admin override check
    if (req.user.role === 'admin') {
      await Job.findByIdAndDelete(req.params.id);
    } else {
      await job.deleteOne();
    }
    
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Get jobs posted by employer
// @route   GET /api/jobs/employer
// @access  Private (Employer)
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('applications')
      .sort({ createdAt: -1 });
      
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};