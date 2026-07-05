import User from '../models/User.js';
import Job from '../models/Job.js';
import cloudinary from '../config/cloudinary.js';
import { extractTextFromResume } from '../utils/resumeParser.js';
import { generateATSAnalysis, extractSkillsFromResume } from '../utils/atsAnalyzer.js';

/**
 * Upload and parse resume to Cloudinary
 */
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file"
      });
    }

    console.log('📄 File uploaded to Cloudinary:', req.file.path);
    console.log('📄 Cloudinary URL:', req.file.path);

    // Cloudinary se file URL aur public ID
    const resumeUrl = req.file.path; // Cloudinary URL
    const publicId = req.file.filename; // Cloudinary public ID

    // Resume text extract karein
    const resumeText = await extractTextFromResume(req.file.path, req.file.mimetype);
    const extractedSkills = extractSkillsFromResume(resumeText);

    console.log('🔍 Extracted skills:', extractedSkills);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        resume: resumeUrl,
        resumeUrl: resumeUrl,
        resumePublicId: publicId,
        "profile.skills": extractedSkills,
        resumeParsed: true,
        resumeText: resumeText.slice(0, 5000),
        resumeName: req.file.originalname,
        resumeUploadedAt: new Date()
      },
      { new: true }
    );

    const matchedJobs = await findMatchingJobs(extractedSkills, userId);

    return res.json({
      success: true,
      message: "Resume uploaded and parsed successfully",
      skills: extractedSkills,
      matchedJobs: matchedJobs,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        resume: user.resume,
        resumeUrl: user.resumeUrl
      }
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload resume",
      error: error.message
    });
  }
};

/**
 * ATS Check - Analyze resume for ATS compatibility
 */
export const atsCheckResume = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file"
      });
    }

    console.log('📄 ATS Check - File uploaded to Cloudinary:', req.file.path);

    const resumeText = await extractTextFromResume(req.file.path, req.file.mimetype);
    const extractedSkills = extractSkillsFromResume(resumeText);

    const user = await User.findById(userId);
    const existingSkills = user?.profile?.skills || [];
    const allSkills = [...new Set([...existingSkills, ...extractedSkills])];

    const analysisResult = generateATSAnalysis(resumeText, req.file);

    await User.findByIdAndUpdate(
      userId,
      {
        resume: req.file.path,
        resumeUrl: req.file.path,
        resumePublicId: req.file.filename,
        "profile.skills": allSkills,
        resumeParsed: true,
        resumeText: resumeText.slice(0, 5000),
        resumeName: req.file.originalname,
        resumeUploadedAt: new Date()
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "ATS analysis completed successfully",
      ...analysisResult
    });

  } catch (error) {
    console.error("Error in ATS check:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error.message
    });
  }
};

/**
 * Find matching jobs based on skills
 */
const findMatchingJobs = async (skills, userId) => {
  if (!skills || skills.length === 0) {
    return [];
  }

  try {
    const jobs = await Job.find({
      status: 'active',
      $or: [
        { skills: { $in: skills } },
        { requirements: { $in: skills } }
      ]
    }).limit(20);

    const matchedJobs = jobs.map(job => {
      const jobSkills = [...(job.skills || []), ...(job.requirements || [])];
      const matchingSkills = jobSkills.filter(skill =>
        skills.some(userSkill =>
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );

      const matchPercentage = jobSkills.length > 0
        ? Math.round((matchingSkills.length / jobSkills.length) * 100)
        : 0;

      return {
        ...job.toObject(),
        matchPercentage,
        matchingSkills: matchingSkills.slice(0, 5)
      };
    });

    return matchedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);
  } catch (error) {
    console.error("Error finding matching jobs:", error);
    return [];
  }
};

/**
 * Get matched jobs for current user
 */
export const getMatchedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const skills = user.profile?.skills || [];

    if (skills.length === 0) {
      return res.json({
        success: true,
        jobs: [],
        skills: [],
        message: "Please upload your resume to get matched jobs"
      });
    }

    const matchedJobs = await findMatchingJobs(skills, req.user._id);

    return res.json({
      success: true,
      jobs: matchedJobs,
      total: matchedJobs.length,
      skills: skills
    });
  } catch (error) {
    console.error("Error getting matched jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get matched jobs"
    });
  }
};

/**
 * Get resume status
 */
export const getResumeStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      hasResume: !!user.resume,
      resumeParsed: user.resumeParsed || false,
      skills: user.profile?.skills || [],
      resumeUrl: user.resumeUrl || user.resume || null,
      resume: user.resume || null,
      resumeName: user.resumeName || null,
      resumeUploadedAt: user.resumeUploadedAt || null
    });
  } catch (error) {
    console.error("Error getting resume status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get resume status"
    });
  }
};

/**
 * Delete resume from Cloudinary
 */
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Cloudinary se delete karein agar public ID hai
    if (user.resumePublicId) {
      try {
        const result = await cloudinary.uploader.destroy(user.resumePublicId, {
          resource_type: 'raw'
        });
        console.log('✅ Resume deleted from Cloudinary:', result);
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        // Agar Cloudinary delete fail ho jaye toh bhi proceed karein
      }
    }

    // User document update karein
    user.resume = null;
    user.resumeUrl = null;
    user.resumePublicId = null;
    user.resumeParsed = false;
    user.resumeText = null;
    user.resumeName = null;
    user.resumeUploadedAt = null;
    
    if (user.profile) {
      user.profile.skills = [];
    }
    
    await user.save();

    return res.json({
      success: true,
      message: "Resume deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume"
    });
  }
};