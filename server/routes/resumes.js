'use strict';

const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const { upload, multerErrorHandler } = require('../middleware/upload');
const {
  analyzeResumeHandler,
  getHistory,
  getAnalysis,
  deleteAnalysis,
  compareWithJobDescription,
  improveBulletHandler,
} = require('../controllers/resumeController');

// Stricter rate limit for expensive AI operations
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, message: 'AI analysis limit reached. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  skip: (req) => !req.user, // Skip if not authenticated (auth middleware runs first)
});

router.use(authenticate); // All resume routes require authentication

router.post('/analyze', aiLimiter, upload.single('resume'), multerErrorHandler, analyzeResumeHandler);
router.post('/compare-job', aiLimiter, upload.single('resume'), multerErrorHandler, compareWithJobDescription);
router.post('/improve-bullet', aiLimiter, improveBulletHandler);

router.get('/history', getHistory);
router.get('/:id', getAnalysis);
router.delete('/:id', deleteAnalysis);

module.exports = router;


 