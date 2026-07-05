// utils/resumeParser.js
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supported file types
const SUPPORTED_MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  txt: 'text/plain',
  rtf: 'application/rtf',
  odt: 'application/vnd.oasis.opendocument.text'
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TEXT_LENGTH = 50000; // Max characters to extract

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
  const ext = path.extname(url).split('?')[0] || '.pdf';
  const tempFile = path.join(tempDir, `temp-${timestamp}-${random}${ext}`);

  console.log('📥 Downloading file from URL:', url);
  console.log('📁 Saving to temp:', tempFile);

  try {
    const response = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000, // 60 seconds timeout
      maxContentLength: MAX_FILE_SIZE,
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Check content length
    const contentLength = parseInt(response.headers['content-length'], 10);
    if (contentLength > MAX_FILE_SIZE) {
      throw new Error(`File too large: ${contentLength} bytes (max ${MAX_FILE_SIZE} bytes)`);
    }

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

      // Timeout handler
      const timeout = setTimeout(() => {
        writer.destroy();
        reject(new Error('Download timeout after 60 seconds'));
      }, 60000);

      writer.on('finish', () => {
        clearTimeout(timeout);
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
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Extract text from PDF with better error handling
 */
const extractPDFText = async (buffer) => {
  try {
    console.log('📄 Parsing PDF file...');
    
    // Try with default options
    const data = await pdfParse(buffer, {
      max: 10000, // Max pages to parse
      version: 'v1.10.100'
    });
    
    if (!data || !data.text) {
      console.warn('⚠️ PDF parsing returned no text');
      return '';
    }
    
    const text = cleanText(data.text);
    console.log(`✅ PDF parsed: ${text.length} characters`);
    
    // Check if it's a scanned image PDF (no real text)
    if (text.length < 100 && data.text.includes('gzip')) {
      console.warn('⚠️ PDF appears to be a scanned image or compressed');
    }
    
    return text;
  } catch (error) {
    console.error('❌ PDF parsing error:', error.message);
    
    // Try fallback - extract raw text
    try {
      const rawText = buffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' ');
      if (rawText.length > 50) {
        console.log('✅ Fallback text extraction successful');
        return cleanText(rawText);
      }
    } catch (fallbackError) {
      console.error('❌ Fallback extraction failed:', fallbackError.message);
    }
    
    return '';
  }
};

/**
 * Extract text from DOCX with better error handling
 */
const extractDOCXText = async (buffer) => {
  try {
    console.log('📄 Parsing DOCX file...');
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result || !result.value) {
      console.warn('⚠️ DOCX parsing returned no text');
      return '';
    }
    
    const text = cleanText(result.value);
    console.log(`✅ DOCX parsed: ${text.length} characters`);
    return text;
  } catch (error) {
    console.error('❌ DOCX parsing error:', error.message);
    
    // Try fallback
    try {
      const rawText = buffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' ');
      if (rawText.length > 50) {
        console.log('✅ Fallback text extraction successful');
        return cleanText(rawText);
      }
    } catch (fallbackError) {
      console.error('❌ Fallback extraction failed:', fallbackError.message);
    }
    
    return '';
  }
};

/**
 * Extract text from DOC (legacy) with better handling
 */
const extractDOCText = async (buffer) => {
  try {
    console.log('📄 Parsing DOC file (legacy format)...');
    // Try to extract as much readable text as possible
    let rawText = buffer.toString('utf8');
    
    // Remove binary garbage but keep readable text
    rawText = rawText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ') // Remove control characters except newlines
      .replace(/[^\x20-\x7E\n\r]/g, ' '); // Keep only printable ASCII
    
    // Try to find actual readable content
    const lines = rawText.split('\n').filter(line => {
      // Filter out lines that are mostly gibberish
      const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
      const totalLength = line.length;
      return totalLength > 0 && (alphaCount / totalLength) > 0.3;
    });
    
    const text = cleanText(lines.join('\n'));
    console.log(`✅ DOC parsed: ${text.length} characters`);
    return text;
  } catch (error) {
    console.error('❌ DOC parsing error:', error.message);
    return '';
  }
};

/**
 * Extract raw text from an uploaded resume file (PDF, DOCX, DOC, or TXT)
 * Supports both local files and Cloudinary URLs
 */
export const extractTextFromResume = async (filePath, mimeType) => {
  console.log('🚀 Starting text extraction from:', filePath);
  console.log('📋 MIME type:', mimeType);
  
  let localFilePath = filePath;
  let isTempFile = false;

  try {
    // Check if it's a Cloudinary URL or remote URL
    if (isUrl(filePath)) {
      console.log('🌐 Remote file detected, downloading...');
      localFilePath = await downloadFile(filePath);
      isTempFile = true;
      console.log('✅ File downloaded successfully');
    }

    // Check if file exists locally
    if (!fs.existsSync(localFilePath)) {
      console.error('❌ File not found at:', localFilePath);
      return '';
    }

    // Check file size
    const stats = fs.statSync(localFilePath);
    console.log(`📄 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    
    if (stats.size === 0) {
      console.error('❌ File is empty');
      return '';
    }
    
    if (stats.size > MAX_FILE_SIZE) {
      console.error(`❌ File too large: ${stats.size} bytes`);
      return '';
    }

    // Read file buffer
    const buffer = fs.readFileSync(localFilePath);
    const ext = path.extname(localFilePath).toLowerCase();
    console.log(`📄 File extension: ${ext}`);

    let text = '';

    // Determine mime type
    let detectedMimeType = mimeType;
    if (!detectedMimeType || detectedMimeType === 'application/octet-stream') {
      if (ext === '.pdf') detectedMimeType = SUPPORTED_MIME_TYPES.pdf;
      else if (ext === '.docx') detectedMimeType = SUPPORTED_MIME_TYPES.docx;
      else if (ext === '.doc') detectedMimeType = SUPPORTED_MIME_TYPES.doc;
      else if (ext === '.txt') detectedMimeType = SUPPORTED_MIME_TYPES.txt;
      else if (ext === '.rtf') detectedMimeType = SUPPORTED_MIME_TYPES.rtf;
      else if (ext === '.odt') detectedMimeType = SUPPORTED_MIME_TYPES.odt;
    }

    console.log(`📄 Parsing with detected mimeType: ${detectedMimeType}`);

    // Parse based on file type
    try {
      if (detectedMimeType === SUPPORTED_MIME_TYPES.pdf || ext === '.pdf') {
        text = await extractPDFText(buffer);
      } 
      else if (detectedMimeType === SUPPORTED_MIME_TYPES.docx || ext === '.docx') {
        text = await extractDOCXText(buffer);
      } 
      else if (detectedMimeType === SUPPORTED_MIME_TYPES.doc || ext === '.doc') {
        text = await extractDOCText(buffer);
      } 
      else if (detectedMimeType === SUPPORTED_MIME_TYPES.txt || ext === '.txt') {
        console.log('📄 Parsing TXT file...');
        text = cleanText(buffer.toString('utf8'));
        console.log(`✅ TXT parsed: ${text.length} characters`);
      } 
      else if (detectedMimeType === SUPPORTED_MIME_TYPES.rtf || ext === '.rtf') {
        console.log('📄 Parsing RTF file...');
        // Try to extract text from RTF
        const raw = buffer.toString('utf8');
        // Remove RTF control words and keep text between braces
        const textContent = raw.replace(/\\[a-zA-Z]+|\{|\}/g, ' ').replace(/\s+/g, ' ');
        text = cleanText(textContent);
        console.log(`✅ RTF parsed: ${text.length} characters`);
      }
      else {
        // Unknown type - try to extract text
        console.log('📄 Unknown file type, attempting text extraction...');
        const rawText = buffer.toString('utf8')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
          .replace(/[^\x20-\x7E\n\r]/g, ' ');
        text = cleanText(rawText);
        console.log(`✅ Unknown type parsed: ${text.length} characters`);
      }
    } catch (parseError) {
      console.error('❌ Parse error:', parseError.message);
      // Try emergency extraction
      try {
        const rawText = buffer.toString('utf8')
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ')
          .replace(/[^\x20-\x7E\n\r]/g, ' ');
        text = cleanText(rawText);
        console.log(`✅ Emergency extraction: ${text.length} characters`);
      } catch (emergencyError) {
        console.error('❌ Emergency extraction failed:', emergencyError.message);
        text = '';
      }
    }

    // Log text stats
    console.log(`📊 Extracted text length: ${text.length}`);
    console.log(`📊 Word count: ${text.split(/\s+/).filter(w => w.length > 0).length}`);
    
    if (text.length > 0) {
      console.log('📝 First 200 characters:', text.substring(0, 200));
    }

    // Trim text if too long
    if (text.length > MAX_TEXT_LENGTH) {
      console.log(`⚠️ Text too long (${text.length}), truncating to ${MAX_TEXT_LENGTH}`);
      text = text.substring(0, MAX_TEXT_LENGTH);
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
    if (isTempFile && localFilePath && fs.existsSync(localFilePath)) {
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
    .replace(/\r\n/g, '\n')     // Windows newlines
    .replace(/\r/g, '\n')       // Old Mac newlines
    .replace(/\t/g, ' ')        // Tabs to spaces
    .replace(/[ ]{2,}/g, ' ')   // Multiple spaces to single
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/\u0000/g, '')     // Remove null characters
    .replace(/[^\x20-\x7E\n\r]/g, ' ') // Remove non-printable characters
    .trim();
};

/**
 * Extract text from buffer directly (for local files)
 */
export const extractTextFromBuffer = async (buffer, mimeType) => {
  try {
    console.log('📄 Extracting text from buffer, mimeType:', mimeType);
    
    let text = '';

    if (mimeType === SUPPORTED_MIME_TYPES.pdf) {
      text = await extractPDFText(buffer);
    } 
    else if (mimeType === SUPPORTED_MIME_TYPES.docx) {
      text = await extractDOCXText(buffer);
    } 
    else if (mimeType === SUPPORTED_MIME_TYPES.doc) {
      text = await extractDOCText(buffer);
    } 
    else if (mimeType === SUPPORTED_MIME_TYPES.txt) {
      text = cleanText(buffer.toString('utf8'));
    } 
    else {
      // Try to extract as plain text
      text = cleanText(buffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' '));
    }

    console.log(`✅ Buffer extraction complete: ${text.length} characters`);
    return text;
  } catch (error) {
    console.error('❌ Error extracting text from buffer:', error.message);
    return '';
  }
};

/**
 * Check if a file is a valid resume file based on extension and mime type
 */
export const isValidResumeFile = (filename, mimeType) => {
  const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.odt'];
  const ext = path.extname(filename).toLowerCase();
  
  // Check extension
  if (!validExtensions.includes(ext)) {
    return false;
  }
  
  // Check mime type
  const validMimeTypes = Object.values(SUPPORTED_MIME_TYPES);
  if (mimeType && !validMimeTypes.includes(mimeType)) {
    return false;
  }
  
  return true;
};

/**
 * Get file type from filename and mime type
 */
export const getFileType = (filename, mimeType) => {
  const ext = path.extname(filename).toLowerCase();
  
  if (ext === '.pdf' || mimeType === SUPPORTED_MIME_TYPES.pdf) return 'PDF';
  if (ext === '.docx' || mimeType === SUPPORTED_MIME_TYPES.docx) return 'DOCX';
  if (ext === '.doc' || mimeType === SUPPORTED_MIME_TYPES.doc) return 'DOC';
  if (ext === '.txt' || mimeType === SUPPORTED_MIME_TYPES.txt) return 'TXT';
  if (ext === '.rtf' || mimeType === SUPPORTED_MIME_TYPES.rtf) return 'RTF';
  if (ext === '.odt' || mimeType === SUPPORTED_MIME_TYPES.odt) return 'ODT';
  
  return 'Unknown';
};

export default {
  extractTextFromResume,
  extractTextFromBuffer,
  isValidResumeFile,
  getFileType
};