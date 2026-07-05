// server/routes/ai.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { protect, isEmployer } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini with proper error handling
let ai = null;
let isGeminiAvailable = false;

const GEMINI_MODEL = 'gemini-2.5-flash'; // swap to 'gemini-2.5-pro' for higher quality, more cost/latency

try {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GOOGLE_GEMINI_API_KEY not found in environment variables');
    console.error('Please add your API key to .env file');
  } else if (apiKey === 'your_gemini_api_key_here' || apiKey.length < 20) {
    console.error('❌ Invalid GOOGLE_GEMINI_API_KEY format');
    console.error('Please add a valid API key to .env file');
  } else {
    ai = new GoogleGenAI({ apiKey });
    isGeminiAvailable = true;
    console.log('✅ Google Gemini initialized successfully');

    // Test the API key with a simple request
    ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: 'Test',
    })
      .then(() => console.log('✅ Gemini API key verified successfully'))
      .catch((err) => {
        console.error('❌ Gemini API key verification failed:', err.message);
        isGeminiAvailable = false;
      });
  }
} catch (error) {
  console.error('❌ Failed to initialize Google Gemini:', error.message);
  isGeminiAvailable = false;
}

// Middleware to check Gemini availability
const checkGeminiAvailability = (req, res, next) => {
  if (!isGeminiAvailable) {
    console.warn('⚠️ Gemini not available, using fallback mode');
    return res.json(getFallbackSuggestions(req.body));
  }
  next();
};

router.post('/generate-job-description', protect, isEmployer, checkGeminiAvailability, async (req, res) => {
  try {
    const {
      jobTitle,
      company,
      experienceLevel,
      jobType,
      category,
      location
    } = req.body;

    // Validate required fields
    if (!jobTitle || !company) {
      return res.status(400).json({
        error: 'Missing required fields: jobTitle and company are required'
      });
    }

    const prompt = `
You are a professional HR and recruitment expert. Generate a comprehensive job description for the following position:

Job Title: ${jobTitle}
Company: ${company}
Location: ${location || 'Not specified'}
Experience Level: ${experienceLevel || 'Not specified'}
Job Type: ${jobType || 'Not specified'}
Category: ${category || 'Not specified'}

Please provide a complete job description in the following JSON format ONLY:

{
  "description": "A comprehensive and engaging job description (3-4 paragraphs)",
  "requirements": ["List 5-7 specific requirements"],
  "responsibilities": ["List 5-7 day-to-day responsibilities"],
  "skills": ["List 5-7 technical and soft skills"]
}

The output must be valid JSON only, no additional text.`;

    // Generate response with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      });

      clearTimeout(timeoutId);

      const text = result.text;

      // Parse JSON from response
      let suggestions;
      try {
        // Clean the response to extract JSON
        let cleanedText = text;
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedText = jsonMatch[0];
        }
        suggestions = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        // Fallback to extraction
        suggestions = extractDataFromText(text);
      }

      // Ensure all fields exist
      suggestions = ensureFieldsExist(suggestions, { jobTitle, company, experienceLevel, category });

      res.json(suggestions);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
        return res.json(getFallbackSuggestions(req.body));
      }
      throw error;
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return fallback suggestions on error
    const fallback = getFallbackSuggestions(req.body);
    res.json(fallback);
  }
});

// Helper function to extract data from text
function extractDataFromText(text) {
  const extractedData = {
    description: '',
    requirements: [],
    responsibilities: [],
    skills: []
  };

  const lines = text.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const cleanLine = line.trim();

    if (cleanLine.toLowerCase().includes('description')) {
      currentSection = 'description';
      continue;
    } else if (cleanLine.toLowerCase().includes('requirement')) {
      currentSection = 'requirements';
      continue;
    } else if (cleanLine.toLowerCase().includes('responsibility')) {
      currentSection = 'responsibilities';
      continue;
    } else if (cleanLine.toLowerCase().includes('skill')) {
      currentSection = 'skills';
      continue;
    }

    if (cleanLine && currentSection) {
      if (currentSection === 'description') {
        extractedData.description += cleanLine + ' ';
      } else if (cleanLine.startsWith('-') || cleanLine.startsWith('•') || cleanLine.match(/^\d/)) {
        const item = cleanLine.replace(/^[-•\d.]\s*/, '').trim();
        if (item) {
          extractedData[currentSection].push(item);
        }
      }
    }
  }

  return extractedData;
}

// Helper function to ensure all fields exist
function ensureFieldsExist(suggestions, { jobTitle, company, experienceLevel, category }) {
  const result = { ...suggestions };

  if (!result.description || result.description.trim().length < 50) {
    result.description = `We are looking for a talented ${jobTitle} to join our team at ${company}. This is an exciting opportunity for a ${experienceLevel || 'dynamic'} level professional to make a significant impact in the ${category || 'growing'} industry.

As a ${jobTitle}, you will be responsible for driving innovation and delivering high-quality solutions. You will work closely with cross-functional teams to achieve our goals and contribute to the company's success. We value creativity, collaboration, and a commitment to excellence.

This is an exciting time to join ${company} as we continue to grow and expand our operations. You will have the opportunity to work with cutting-edge technologies and shape the future of our products and services.`;
  }

  if (!result.requirements || result.requirements.length === 0) {
    result.requirements = [
      `Bachelor's degree in ${category || 'relevant'} field`,
      `${experienceLevel === 'entry' ? '0-2' : experienceLevel === 'junior' ? '1-3' : experienceLevel === 'mid' ? '3-5' : '5+'} years of relevant experience`,
      'Strong problem-solving and analytical skills',
      'Excellent communication and teamwork abilities',
      'Ability to work in a fast-paced environment',
      'Self-motivated and results-driven',
      'Strong attention to detail'
    ];
  }

  if (!result.responsibilities || result.responsibilities.length === 0) {
    result.responsibilities = [
      'Collaborate with cross-functional teams to deliver high-quality solutions',
      'Contribute to the full development lifecycle',
      'Write clean, maintainable, and efficient code',
      'Participate in code reviews and technical discussions',
      'Troubleshoot and debug issues',
      'Stay updated with industry trends and best practices',
      'Mentor junior team members'
    ];
  }

  if (!result.skills || result.skills.length === 0) {
    result.skills = [
      'Problem-solving',
      'Team collaboration',
      'Communication',
      'Time management',
      'Adaptability',
      'Critical thinking',
      'Leadership'
    ];
  }

  return result;
}

// Fallback suggestions function
function getFallbackSuggestions({ jobTitle, company, experienceLevel, category }) {
  const title = jobTitle || 'Professional';
  const companyName = company || 'our company';
  const level = experienceLevel || 'experienced';
  const cat = category || 'relevant';

  return {
    description: `We are seeking a talented and motivated ${title} to join our dynamic team at ${companyName}. This role offers an excellent opportunity for professional growth and making a meaningful impact in the ${cat} industry.

As a ${title}, you will be responsible for driving innovation and delivering high-quality solutions. You will work closely with cross-functional teams to achieve our goals and contribute to the company's success. We value creativity, collaboration, and a commitment to excellence.

This is an exciting time to join ${companyName} as we continue to grow and expand our operations. You will have the opportunity to work with cutting-edge technologies and shape the future of our products and services.`,
    requirements: [
      `Bachelor's degree in ${cat} or related field`,
      `${level} level experience in a similar role`,
      'Strong problem-solving and analytical skills',
      'Excellent communication and interpersonal skills',
      'Ability to work in a fast-paced environment'
    ],
    responsibilities: [
      'Collaborate with team members to achieve project goals',
      'Develop and implement innovative solutions',
      'Ensure quality and consistency in all deliverables',
      'Participate in team meetings and contribute ideas',
      'Stay updated with industry trends and best practices'
    ],
    skills: [
      'Team Collaboration',
      'Problem Solving',
      'Communication',
      'Time Management',
      'Adaptability'
    ]
  };
}

export default router;