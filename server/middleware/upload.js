'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

const MAX_SIZE_BYTES = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024;

// Store uploads in the OS temp directory — cleaned up after processing
const uploadDir = path.join(os.tmpdir(), 'resumeiq-uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    const err = new Error('Only PDF files are accepted.');
    err.status = 400;
    cb(err, false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES, files: 1 },
});

/**
 * Cleanup a temp file safely (no error thrown if already gone).
 */
function cleanupFile(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.warn('[Upload] Could not delete temp file:', err.message);
    }
  });
}

/**
 * Multer error handler — converts multer errors to friendly HTTP errors.
 */
function multerErrorHandler(err, _req, _res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const sizeErr = new Error(
        `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 5} MB.`
      );
      sizeErr.status = 413;
      return next(sizeErr);
    }
    const multerErr = new Error(`File upload error: ${err.message}`);
    multerErr.status = 400;
    return next(multerErr);
  }
  next(err);
}

module.exports = { upload, cleanupFile, multerErrorHandler };
