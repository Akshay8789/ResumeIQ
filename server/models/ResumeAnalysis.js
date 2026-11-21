'use strict';

const mongoose = require('mongoose');

const scoreBreakdownSchema = new mongoose.Schema(
  {
    structure: { type: Number, min: 0, max: 100 },
    skillsRelevance: { type: Number, min: 0, max: 100 },
    experienceDescriptions: { type: Number, min: 0, max: 100 },
    impact: { type: Number, min: 0, max: 100 },
    keywordRelevance: { type: Number, min: 0, max: 100, default: null },
  },
  { _id: false }
);

const skillsAnalysisSchema = new mongoose.Schema(
  {
    technical: [String],
    soft: [String],
    missing: [String],
  },
  { _id: false }
);

const sectionFeedbackSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: String, enum: ['excellent', 'good', 'fair', 'poor'], default: 'fair' },
  },
  { _id: false }
);

const bulletImprovementSchema = new mongoose.Schema(
  {
    original: String,
    improved: String,
    explanation: String,
  },
  { _id: false }
);

const suggestionSchema = new mongoose.Schema(
  {
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    category: String,
    suggestion: String,
    bulletImprovements: [bulletImprovementSchema],
  },
  { _id: false }
);

const keywordAnalysisSchema = new mongoose.Schema(
  {
    found: [String],
    missing: [String],
    note: String,
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      trim: true,
      default: null,
    },
    hasJobDescription: {
      type: Boolean,
      default: false,
    },
    analysisType: {
      type: String,
      enum: ['resume_only', 'with_job_description'],
      default: 'resume_only',
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    scoreExplanation: String,
    scoreBreakdown: scoreBreakdownSchema,
    strengths: [String],
    weaknesses: [String],
    skillsAnalysis: skillsAnalysisSchema,
    sectionFeedback: [sectionFeedbackSchema],
    suggestions: [suggestionSchema],
    keywordAnalysis: keywordAnalysisSchema,
    // Raw text is NOT stored permanently for privacy
    // Job description is stored only as needed for keyword analysis
    jobDescriptionSnippet: {
      type: String,
      maxlength: 500,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index: user + createdAt for efficient history queries
resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
