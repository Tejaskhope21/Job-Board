import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Download file from URL to temporary location
 */
const downloadFile = async (url) => {
  const tempDir = path.join(process.cwd(), 'temp');
  
  // Temp directory create karein agar nahi hai
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('📁 Temp directory created:', tempDir);
  }

  // Unique filename generate karein
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const tempFile = path.join(tempDir, `temp-${timestamp}-${random}.pdf`);

  console.log('📥 Downloading file from Cloudinary:', url);
  console.log('📁 Saving to temp:', tempFile);

  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000, // 60 seconds timeout
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(tempFile);
      
      response.data.pipe(writer);
      
      writer.on('finish', () => {
        console.log('✅ File downloaded successfully to:', tempFile);
        resolve(tempFile);
      });
      
      writer.on('error', (error) => {
        console.error('❌ Error writing file:', error);
        reject(error);
      });
      
      response.data.on('error', (error) => {
        console.error('❌ Error downloading file:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('❌ Download error:', error.message);
    throw new Error(`Failed to download file: ${error.message}`);
  }
};

/**
 * Check if a string is a URL
 */
const isUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Extract raw text from an uploaded resume file (PDF, DOCX, DOC, or TXT)
 * Supports both local files and Cloudinary URLs
 */
export const extractTextFromResume = async (filePath, mimeType) => {
  let localFilePath = filePath;
  let isTempFile = false;

  try {
    // Check if it's a Cloudinary URL or remote URL
    if (isUrl(filePath)) {
      console.log('🌐 Remote file detected, downloading from Cloudinary...');
      localFilePath = await downloadFile(filePath);
      isTempFile = true;
    }

    // Check if file exists locally
    if (!fs.existsSync(localFilePath)) {
      console.error('❌ File not found at:', localFilePath);
      return '';
    }

    // Get file stats
    const stats = fs.statSync(localFilePath);
    console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);

    // Read file buffer
    const buffer = fs.readFileSync(localFilePath);
    const ext = path.extname(localFilePath).toLowerCase();

    let text = '';

    // Detect mime type from extension if not provided
    if (!mimeType || mimeType === 'application/octet-stream') {
      if (ext === '.pdf') mimeType = 'application/pdf';
      else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (ext === '.doc') mimeType = 'application/msword';
      else if (ext === '.txt') mimeType = 'text/plain';
    }

    console.log(`📄 Parsing file with mimeType: ${mimeType}, extension: ${ext}`);

    // Parse based on file type
    if (mimeType === 'application/pdf' || ext === '.pdf') {
      console.log('📄 Parsing PDF file...');
      const data = await pdfParse(buffer);
      text = cleanText(data.text);
      console.log(`✅ PDF parsed: ${text.length} characters`);
    }
    // DOCX (modern Word format)
    else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === '.docx'
    ) {
      console.log('📄 Parsing DOCX file...');
      const result = await mammoth.extractRawText({ buffer });
      text = cleanText(result.value);
      console.log(`✅ DOCX parsed: ${text.length} characters`);
    }
    // DOC (legacy binary Word format)
    else if (mimeType === 'application/msword' || ext === '.doc') {
      console.log('📄 Parsing DOC file (legacy format)...');
      // Best effort fallback
      const fallback = buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, ' ');
      text = cleanText(fallback);
      console.log(`✅ DOC parsed: ${text.length} characters`);
    }
    // Plain text
    else if (mimeType === 'text/plain' || ext === '.txt') {
      console.log('📄 Parsing TXT file...');
      text = cleanText(buffer.toString('utf8'));
      console.log(`✅ TXT parsed: ${text.length} characters`);
    }
    // Unknown type - attempt plain-text read as last resort
    else {
      console.log('📄 Unknown file type, attempting text extraction...');
      text = cleanText(buffer.toString('utf8'));
      console.log(`✅ Unknown type parsed: ${text.length} characters`);
    }

    // Clean up temp file if downloaded from Cloudinary
    if (isTempFile && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log('🧹 Temp file deleted:', localFilePath);
      } catch (error) {
        console.warn('⚠️ Could not delete temp file:', error.message);
      }
    }

    return text || '';

  } catch (error) {
    console.error('❌ Error extracting resume text:', error.message);
    console.error('❌ Stack trace:', error.stack);
    
    // Clean up temp file if exists
    if (isTempFile && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log('🧹 Temp file deleted after error:', localFilePath);
      } catch (cleanupError) {
        console.warn('⚠️ Could not delete temp file:', cleanupError.message);
      }
    }
    
    return ''; // Return empty string on error
  }
};

/**
 * Clean text - remove extra spaces, normalize newlines, etc.
 */
const cleanText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .trim();
};

/**
 * Extract text from buffer directly (for local files)
 */
export const extractTextFromBuffer = async (buffer, mimeType) => {
  try {
    let text = '';

    // PDF
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = cleanText(data.text);
    }
    // DOCX
    else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      text = cleanText(result.value);
    }
    // TXT
    else if (mimeType === 'text/plain') {
      text = cleanText(buffer.toString('utf8'));
    }
    // Other formats
    else {
      text = cleanText(buffer.toString('utf8'));
    }

    return text;
  } catch (error) {
    console.error('Error extracting text from buffer:', error.message);
    return '';
  }
};