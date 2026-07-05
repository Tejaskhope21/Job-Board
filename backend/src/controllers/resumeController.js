// controllers/resumeController.js
import streamifier from 'streamifier';
import User from '../models/User.js';
import Job from '../models/Job.js';
import cloudinary from '../config/cloudinary.js';
import { extractTextFromBuffer } from '../utils/resumeParser.js';
import { generateATSAnalysis, extractSkillsFromResume } from '../utils/atsAnalyzer.js';

/**
 * ✅ FIX: Since we now use multer.memoryStorage(), the file only exists
 * in memory (req.file.buffer). We upload it to Cloudinary ourselves using
 * an upload_stream, instead of relying on multer-storage-cloudinary
 * (which never gave us a usable buffer for text extraction).
 */
const uploadBufferToCloudinary = (buffer, originalname, userId) => {
  return new Promise((resolve, reject) => {
    const ext = originalname.split('.').pop();
    const public_id = `resume-${userId}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resumes',
        resource_type: 'raw',
        public_id,
        format: ext
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Shared helper: takes the raw extracted text and applies the same
 * fallback-cleanup chain that was previously duplicated in both
 * uploadResume and atsCheckResume.
 */
const resolveResumeText = async (buffer, mimeType) => {
  let text = await extractTextFromBuffer(buffer, mimeType);

  if (!text || text.trim().length < 50) {
    console.log('⚠️ Primary extraction weak/empty, trying plain-text fallback...');
    try {
      const fallbackText = buffer
        .toString('utf8')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
        .replace(/[^\x20-\x7E\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (fallbackText && fallbackText.length > 50) {
        text = fallbackText;
        console.log('✅ Fallback extraction successful, length:', fallbackText.length);
      }
    } catch (fallbackError) {
      console.error('❌ Fallback extraction failed:', fallbackError.message);
    }
  }

  return text;
};

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

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Extract text BEFORE uploading (we already have the buffer in memory)
    const resumeText = await resolveResumeText(buffer, mimeType);
    console.log('📝 Extracted text length:', resumeText?.length || 0);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({
        success: false,
        message: "Could not extract readable text from this file. Please upload a text-based PDF/DOCX, not a scanned image."
      });
    }

    const extractedSkills = extractSkillsFromResume(resumeText);
    console.log('🔍 Extracted skills:', extractedSkills);

    // Upload buffer to Cloudinary manually
    const cloudinaryResult = await uploadBufferToCloudinary(buffer, req.file.originalname, userId);
    console.log('📄 Uploaded to Cloudinary:', cloudinaryResult.secure_url);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        resume: cloudinaryResult.secure_url,
        resumeUrl: cloudinaryResult.secure_url,
        resumePublicId: cloudinaryResult.public_id,
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

    console.log('📄 ATS Check - file received:', req.file.originalname);
    console.log('📄 File mime type:', req.file.mimetype);
    console.log('📄 File size:', req.file.size);

    const buffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    console.log('📄 Buffer size:', buffer?.length || 0);

    const finalText = await resolveResumeText(buffer, mimeType);

    console.log('📝 Final extracted text length:', finalText?.length || 0);
    console.log('📝 First 300 characters:', finalText?.substring(0, 300) || 'No text extracted');

    // ✅ FIX: no more fake "John Doe" placeholder resume. If we genuinely
    // couldn't read the file, tell the user honestly instead of returning
    // a fabricated score based on dummy content.
    if (!finalText || finalText.trim().length < 50) {
      return res.status(422).json({
        success: false,
        message: "Could not extract readable text from this file. Please make sure it's a text-based PDF/DOCX (not a scanned image) and try again."
      });
    }

    // Extract skills from the text
    const extractedSkills = extractSkillsFromResume(finalText);
    console.log('🔍 Extracted skills count:', extractedSkills.length);
    console.log('🔍 First 10 skills:', extractedSkills.slice(0, 10));

    // Get user and merge with existing skills
    const user = await User.findById(userId);
    const existingSkills = user?.profile?.skills || [];
    const allSkills = [...new Set([...existingSkills, ...extractedSkills])];

    // Generate ATS analysis with the extracted text
    const analysisResult = generateATSAnalysis(finalText, {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    console.log('📊 Analysis Result:', {
      overallScore: analysisResult.overallScore,
      foundKeywords: analysisResult.foundKeywords?.length || 0,
      sections: analysisResult.sections?.length || 0
    });

    // Upload the resume buffer to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(buffer, req.file.originalname, userId);

    // Update user with resume info
    await User.findByIdAndUpdate(
      userId,
      {
        resume: cloudinaryResult.secure_url,
        resumeUrl: cloudinaryResult.secure_url,
        resumePublicId: cloudinaryResult.public_id,
        "profile.skills": allSkills,
        resumeParsed: true,
        resumeText: finalText.slice(0, 5000),
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
    console.error("❌ Error in ATS check:", error);
    console.error("❌ Error stack:", error.stack);
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