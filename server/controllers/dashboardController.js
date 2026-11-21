'use strict';

const ResumeAnalysis = require('../models/ResumeAnalysis');

// GET /api/dashboard/stats
async function getStats(req, res, next) {
  try {
    const userId = req.user._id;

    const [totalAnalyses, analyses] = await Promise.all([
      ResumeAnalysis.countDocuments({ user: userId }),
      ResumeAnalysis.find({ user: userId })
        .select('overallScore createdAt originalFilename analysisType targetRole')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean(),
    ]);

    const latestScore = analyses.length > 0 ? analyses[0].overallScore : null;
    const avgScore =
      analyses.length > 0
        ? Math.round(analyses.reduce((s, a) => s + a.overallScore, 0) / analyses.length)
        : null;

    // Score history for chart (most recent 10, oldest first)
    const scoreHistory = analyses
      .slice(0, 10)
      .reverse()
      .map((a) => ({
        date: a.createdAt,
        score: a.overallScore,
        filename: a.originalFilename,
      }));

    // Recent 5 analyses for the dashboard list
    const recentAnalyses = analyses.slice(0, 5).map((a) => ({
      id: a._id,
      filename: a.originalFilename,
      score: a.overallScore,
      type: a.analysisType,
      targetRole: a.targetRole,
      createdAt: a.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalAnalyses,
        latestScore,
        avgScore,
        scoreHistory,
        recentAnalyses,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
