'use strict';

const ResumeAnalysis = require('../models/ResumeAnalysis');
const { extractPdfText } = require('../services/pdfService');
const { analyzeResume, improveBullet } = require('../services/geminiService');
const { cleanupFile } = require('../middleware/upload');

// POST /api/resumes/analyze
async function analyzeResumeHandler(req, res, next) {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      const err = new Error('No resume file was uploaded.');
      err.status = 400;
      return next(err);
    }

    const targetRole = req.body.targetRole?.trim() || null;
    const jobDescription = req.body.jobDescription?.trim() || null;

    // 1. Extract text from PDF
    const resumeText = await extractPdfText(filePath);

    // 2. Analyze with Gemini
    const aiResult = await analyzeResume(resumeText, jobDescription, targetRole);

    // 3. Save to database
    const analysis = await ResumeAnalysis.create({
      user: req.user._id,
      originalFilename: req.file.originalname,
      targetRole,
      hasJobDescription: Boolean(jobDescription),
      analysisType: jobDescription ? 'with_job_description' : 'resume_only',
      overallScore: aiResult.overallScore,
      scoreExplanation: aiResult.scoreExplanation,
      scoreBreakdown: aiResult.scoreBreakdown,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      skillsAnalysis: aiResult.skillsAnalysis,
      sectionFeedback: aiResult.sectionFeedback,
      suggestions: aiResult.suggestions,
      keywordAnalysis: aiResult.keywordAnalysis,
      jobDescriptionSnippet: jobDescription ? jobDescription.slice(0, 500) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      data: { analysisId: analysis._id, overallScore: analysis.overallScore },
    });
  } catch (err) {
    next(err);
  } finally {
    // Always clean up temp file
    cleanupFile(filePath);
  }
}

// GET /api/resumes/history
async function getHistory(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const [total, analyses] = await Promise.all([
      ResumeAnalysis.countDocuments({ user: req.user._id }),
      ResumeAnalysis.find({ user: req.user._id })
        .select('originalFilename overallScore analysisType targetRole createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      success: true,
      data: {
        analyses,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/resumes/:id
async function getAnalysis(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id, // ownership check — never allow cross-user access
    }).lean();

    if (!analysis) {
      const err = new Error('Analysis not found.');
      err.status = 404;
      return next(err);
    }

    res.json({ success: true, data: analysis });
  } catch (err) {
    if (err.name === 'CastError') {
      const castErr = new Error('Invalid analysis ID.');
      castErr.status = 400;
      return next(castErr);
    }
    next(err);
  }
}

// DELETE /api/resumes/:id
async function deleteAnalysis(req, res, next) {
  try {
    const analysis = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ownership check
    });

    if (!analysis) {
      const err = new Error('Analysis not found.');
      err.status = 404;
      return next(err);
    }

    res.json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (err) {
    if (err.name === 'CastError') {
      const castErr = new Error('Invalid analysis ID.');
      castErr.status = 400;
      return next(castErr);
    }
    next(err);
  }
}

// POST /api/resumes/compare-job
async function compareWithJobDescription(req, res, next) {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      const err = new Error('No resume file was uploaded.');
      err.status = 400;
      return next(err);
    }

    const { jobDescription, targetRole } = req.body;
    if (!jobDescription || jobDescription.trim().length < 50) {
      const err = new Error('Job description is required and must be at least 50 characters.');
      err.status = 400;
      return next(err);
    }

    const resumeText = await extractPdfText(filePath);
    const aiResult = await analyzeResume(resumeText, jobDescription.trim(), targetRole?.trim());

    const analysis = await ResumeAnalysis.create({
      user: req.user._id,
      originalFilename: req.file.originalname,
      targetRole: targetRole?.trim() || null,
      hasJobDescription: true,
      analysisType: 'with_job_description',
      overallScore: aiResult.overallScore,
      scoreExplanation: aiResult.scoreExplanation,
      scoreBreakdown: aiResult.scoreBreakdown,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      skillsAnalysis: aiResult.skillsAnalysis,
      sectionFeedback: aiResult.sectionFeedback,
      suggestions: aiResult.suggestions,
      keywordAnalysis: aiResult.keywordAnalysis,
      jobDescriptionSnippet: jobDescription.trim().slice(0, 500),
    });

    res.status(201).json({
      success: true,
      message: 'Job description comparison complete.',
      data: { analysisId: analysis._id, overallScore: analysis.overallScore },
    });
  } catch (err) {
    next(err);
  } finally {
    cleanupFile(filePath);
  }
}

// POST /api/resumes/improve-bullet
async function improveBulletHandler(req, res, next) {
  try {
    const { bullet, context } = req.body;
    if (!bullet || bullet.trim().length < 5) {
      const err = new Error('Bullet point text is required.');
      err.status = 400;
      return next(err);
    }

    const result = await improveBullet(bullet.trim(), context?.trim());
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  analyzeResumeHandler,
  getHistory,
  getAnalysis,
  deleteAnalysis,
  compareWithJobDescription,
  improveBulletHandler,
};
