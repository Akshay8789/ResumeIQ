
'use strict';

const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

/**
 * Extracts readable text from an uploaded PDF.
 */
async function extractPdfText(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw Object.assign(
      new Error('No valid PDF file path provided.'),
      { status: 400 }
    );
  }

  // Check file existence.
  if (!fs.existsSync(filePath)) {
    throw Object.assign(
      new Error('Uploaded PDF file not found.'),
      { status: 400 }
    );
  }

  // Check file extension.
  if (path.extname(filePath).toLowerCase() !== '.pdf') {
    throw Object.assign(
      new Error('Only PDF files are supported.'),
      { status: 400 }
    );
  }

  let buffer;

  try {
    buffer = fs.readFileSync(filePath);
  } catch (err) {
    console.error('[PDF] File read error:', err.message);

    throw Object.assign(
      new Error('Could not read uploaded PDF file.'),
      { status: 400 }
    );
  }

  // Check empty file.
  if (!buffer || buffer.length === 0) {
    throw Object.assign(
      new Error('Uploaded PDF file is empty.'),
      { status: 400 }
    );
  }

  // Verify PDF magic bytes.
  if (!buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw Object.assign(
      new Error('Uploaded file is not a valid PDF.'),
      { status: 400 }
    );
  }

  let data;

  try {
    data = await pdfParse(buffer);
  } catch (err) {
    console.error('[PDF] Parsing error:', err.message);

    throw Object.assign(
      new Error(
        'Failed to parse PDF. The file may be corrupted or password-protected.'
      ),
      { status: 400 }
    );
  }

  const text = String(data?.text || '').trim();

  // Scanned image-only PDFs generally have no selectable text.
  if (text.length < 100) {
    throw Object.assign(
      new Error(
        'Could not extract readable text from this PDF. Scanned image-only PDFs are not supported. Please upload a PDF with selectable text.'
      ),
      { status: 400 }
    );
  }

  console.log('[PDF] Text extracted successfully');
  console.log('[PDF] Extracted characters:', text.length);
  console.log('[PDF] PDF pages:', data?.numpages || 'Unknown');

  return text;
}

module.exports = {
  extractPdfText
};
