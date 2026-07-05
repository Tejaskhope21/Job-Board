// src/utils/atsAnalyzer.js

// Master keyword bank grouped by category (used for both skill extraction
// and the "found vs missing" keyword report).
const KEYWORD_BANK = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
    'React', 'Angular', 'Vue.js', 'Next.js', 'Redux', 'HTML', 'CSS', 'SASS', 'Tailwind CSS', 'Bootstrap',
    'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Ruby on Rails', 'ASP.NET', 'Laravel',
    'GraphQL', 'REST API', 'MongoDB', 'MySQL', 'PostgreSQL', 'Redis', 'Elasticsearch', 'Firebase',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Terraform',
    'Ansible', 'CI/CD', 'Linux', 'Nginx', 'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow',
    'PyTorch', 'Data Analysis', 'Pandas', 'NumPy', 'Scikit-learn', 'Tableau', 'Power BI',
    'React Native', 'Flutter', 'iOS', 'Android', 'Microservices', 'System Design'
  ],
  soft: [
    'Leadership', 'Communication', 'Team Player', 'Problem Solving', 'Time Management',
    'Adaptability', 'Collaboration', 'Critical Thinking', 'Decision Making', 'Conflict Resolution'
  ],
  achievements: [
    'Increased', 'Improved', 'Reduced', 'Achieved', 'Developed', 'Led', 'Managed', 'Created',
    'Launched', 'Optimized', 'Delivered', 'Streamlined', 'Automated', 'Scaled'
  ],
  education: ['Bachelor', 'Master', 'PhD', 'MBA', 'Certified', 'Certification', 'Degree'],
  process: ['Agile', 'Scrum', 'Kanban', 'Project Management', 'Product Management', 'DevOps']
};

const ALL_KEYWORDS = Object.values(KEYWORD_BANK).flat();

const SECTION_PATTERNS = {
  'Contact Information': /(email|e-mail|phone|linkedin|@)/i,
  'Summary/Objective': /(summary|objective|profile)\b/i,
  'Work Experience': /(experience|employment history|work history)\b/i,
  'Education': /(education|academic)\b/i,
  'Skills': /(skills|technical skills|core competencies)\b/i,
  'Certifications': /(certification|certificate|license)\b/i
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const BULLET_REGEX = /^[\s]*[•\-\*▪◦]/m;
const QUANTIFIED_REGEX = /\b\d+(\.\d+)?\s?(%|percent|x|k|million|billion|hours|days|weeks|months|years|users|customers|clients)\b/gi;

/**
 * Find which known keywords actually appear in the resume text.
 */
const matchKeywords = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  const missing = [];

  ALL_KEYWORDS.forEach((kw) => {
    // word-ish boundary match so "Go" doesn't match inside "Google"
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|[^a-z0-9])${escaped.toLowerCase()}([^a-z0-9]|$)`, 'i');
    if (pattern.test(lower)) {
      found.push(kw);
    } else {
      missing.push(kw);
    }
  });

  return { found, missing };
};

/**
 * Detect which standard resume sections are present, based on header text.
 */
const detectSections = (text) => {
  const results = {};
  Object.entries(SECTION_PATTERNS).forEach(([name, pattern]) => {
    results[name] = pattern.test(text);
  });
  return results;
};

/**
 * Core ATS analysis — takes the ACTUAL extracted resume text and produces
 * a real, content-driven score instead of a fixed fallback.
 */
export const generateATSAnalysis = (resumeText, file) => {
  // Guard: if text extraction failed or file is empty/scanned-image-only
  if (!resumeText || resumeText.trim().length < 50) {
    return {
      overallScore: 0,
      foundKeywords: [],
      missingKeywords: ALL_KEYWORDS.slice(0, 10),
      strengths: [],
      weaknesses: ['Could not extract readable text from this file'],
      suggestions: [
        'Make sure your resume is not a scanned image — use a text-based PDF or DOCX',
        'Avoid heavily designed templates with text inside images/tables',
        'Try re-saving/exporting the file and uploading again'
      ],
      sections: [],
      file: { name: file.originalname, size: file.size, path: file.path },
      parseWarning: true
    };
  }

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const { found, missing } = matchKeywords(resumeText);
  const sectionsFound = detectSections(resumeText);
  const hasEmail = EMAIL_REGEX.test(resumeText);
  const hasPhone = PHONE_REGEX.test(resumeText);
  const hasBullets = BULLET_REGEX.test(resumeText);
  const quantifiedMatches = resumeText.match(QUANTIFIED_REGEX) || [];

  // ---- Weighted scoring ----
  // 1. Keyword coverage (35%)
  const keywordScore = Math.min((found.length / 25) * 100, 100);

  // 2. Section completeness (25%)
  const sectionCount = Object.values(sectionsFound).filter(Boolean).length;
  const sectionScore = (sectionCount / Object.keys(SECTION_PATTERNS).length) * 100;

  // 3. Contact info (10%)
  const contactScore = (hasEmail ? 60 : 0) + (hasPhone ? 40 : 0);

  // 4. Quantified achievements (15%)
  const achievementScore = Math.min((quantifiedMatches.length / 5) * 100, 100);

  // 5. Formatting / length (15%)
  let formatScore = 0;
  if (hasBullets) formatScore += 50;
  if (wordCount >= 250 && wordCount <= 1000) formatScore += 50;
  else if (wordCount > 100) formatScore += 25;

  const overallScore = Math.round(
    keywordScore * 0.35 +
    sectionScore * 0.25 +
    contactScore * 0.10 +
    achievementScore * 0.15 +
    formatScore * 0.15
  );

  // ---- Strengths / Weaknesses / Suggestions ----
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (found.length >= 10) strengths.push(`Strong keyword coverage (${found.length} relevant terms found)`);
  else if (found.length < 5) {
    weaknesses.push('Very few industry keywords detected');
    suggestions.push('Add more role-specific technical and soft-skill keywords');
  }

  if (sectionCount >= 5) strengths.push('All standard resume sections are present');
  else {
    const missingSections = Object.entries(sectionsFound).filter(([, present]) => !present).map(([name]) => name);
    weaknesses.push(`Missing sections: ${missingSections.join(', ')}`);
    suggestions.push(`Add clearly labeled sections for: ${missingSections.join(', ')}`);
  }

  if (!hasEmail || !hasPhone) {
    weaknesses.push('Contact information may be incomplete');
    suggestions.push('Ensure your email and phone number are clearly listed near the top');
  } else {
    strengths.push('Contact information is clearly present');
  }

  if (quantifiedMatches.length >= 3) {
    strengths.push('Resume includes quantifiable achievements');
  } else {
    weaknesses.push('Few quantifiable achievements found');
    suggestions.push('Add measurable results, e.g. "Improved load time by 30%" or "Managed a team of 5"');
  }

  if (!hasBullets) {
    weaknesses.push('No bullet points detected — may hurt readability for ATS and recruiters');
    suggestions.push('Use bullet points to list responsibilities and achievements');
  }

  if (wordCount < 200) {
    weaknesses.push('Resume content seems short');
    suggestions.push('Expand on your experience — aim for 400-800 words');
  } else if (wordCount > 1200) {
    weaknesses.push('Resume may be too long for typical ATS/recruiter review');
    suggestions.push('Trim to 1-2 pages, focusing on most relevant recent experience');
  }

  if (suggestions.length === 0) {
    suggestions.push('Tailor keywords to each specific job description for best results');
  }

  // ---- Section-level breakdown for the "Sections" tab ----
  const sections = [
    {
      name: 'Contact Information',
      score: contactScore,
      feedback: hasEmail && hasPhone ? 'Email and phone number detected' : 'Missing email or phone number',
      missingItems: [!hasEmail && 'Email address', !hasPhone && 'Phone number'].filter(Boolean)
    },
    {
      name: 'Skills',
      score: Math.round(keywordScore),
      feedback: `${found.length} relevant keywords detected out of ${ALL_KEYWORDS.length} scanned`,
      missingItems: missing.slice(0, 5)
    },
    {
      name: 'Work Experience',
      score: Math.round((sectionsFound['Work Experience'] ? 70 : 20) + Math.min(quantifiedMatches.length * 5, 30)),
      feedback: sectionsFound['Work Experience']
        ? 'Work experience section detected'
        : 'No clear work experience section header found',
      missingItems: quantifiedMatches.length < 3 ? ['Quantifiable achievements'] : []
    },
    {
      name: 'Education',
      score: sectionsFound['Education'] ? 85 : 30,
      feedback: sectionsFound['Education'] ? 'Education section is present' : 'No education section detected',
      missingItems: sectionsFound['Education'] ? [] : ['Education section']
    },
    {
      name: 'Formatting',
      score: Math.round(formatScore),
      feedback: hasBullets ? 'Good use of bullet points' : 'Consider using bullet points for clarity',
      missingItems: [!hasBullets && 'Bullet points'].filter(Boolean)
    }
  ];

  return {
    overallScore: Math.max(0, Math.min(overallScore, 100)),
    foundKeywords: found.slice(0, 15),
    missingKeywords: missing.slice(0, 15),
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    suggestions: suggestions.slice(0, 6),
    sections,
    wordCount,
    file: { name: file.originalname, size: file.size, path: file.path }
  };
};

/**
 * Extract a clean skills list from resume text (used to populate the
 * user's profile — separate from the ATS keyword report above).
 */
export const extractSkillsFromResume = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  ALL_KEYWORDS.forEach((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(^|[^a-z0-9])${escaped.toLowerCase()}([^a-z0-9]|$)`, 'i');
    if (pattern.test(lower)) found.push(kw);
  });
  return [...new Set(found)];
};