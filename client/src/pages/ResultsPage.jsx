import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Trash2, CheckCircle, XCircle, AlertTriangle,
  Tag, Lightbulb, BookOpen, Code2, Star, AlertCircle,
  Info, ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import { resumeService } from '../services';
import CircularScore from '../components/CircularScore';
import ScoreBar from '../components/ScoreBar';
import { formatDate, getPriorityClass, getRatingClass } from '../utils/helpers';
import toast from 'react-hot-toast';

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition-colors"
      >
        <h2 className="flex items-center gap-2.5 font-semibold text-slate-800">
          {Icon && <Icon className="w-5 h-5 text-brand-500" />}
          {title}
        </h2>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-6">{children}</div>}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    resumeService.getAnalysis(id)
      .then((res) => setAnalysis(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this analysis? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await resumeService.deleteAnalysis(id);
      toast.success('Analysis deleted.');
      navigate('/history');
    } catch (err) {
      toast.error(err.message || 'Failed to delete analysis.');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="card p-10 flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Could not load analysis</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Link to="/history" className="btn btn-secondary btn-md">← Back to History</Link>
        </div>
      </div>
    );
  }

  const a = analysis;
  const bd = a.scoreBreakdown || {};

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/history" className="btn btn-ghost btn-sm rounded-lg p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-display">{a.originalFilename}</h1>
            <p className="text-sm text-slate-400">
              {formatDate(a.createdAt)}
              {a.targetRole && ` · ${a.targetRole}`}
              {a.hasJobDescription && ' · JD Comparison'}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="btn btn-danger btn-sm"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          This score is an <strong>AI-generated estimate</strong> of resume quality, not an official ATS score.
          Use these suggestions as guidance for genuine, evidence-based improvements.
        </p>
      </div>

      {/* Score Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <CircularScore score={a.overallScore} size={160} />
          <div className="flex-1 space-y-4 w-full">
            {a.scoreExplanation && (
              <p className="text-slate-600 leading-relaxed">{a.scoreExplanation}</p>
            )}
            <div className="space-y-3">
              <ScoreBar label="Structure & Readability" score={bd.structure} />
              <ScoreBar label="Skills Relevance" score={bd.skillsRelevance} />
              <ScoreBar label="Experience Descriptions" score={bd.experienceDescriptions} />
              <ScoreBar label="Impact & Achievements" score={bd.impact} />
              {bd.keywordRelevance != null && (
                <ScoreBar label="Keyword Relevance (JD match)" score={bd.keywordRelevance} />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strengths */}
      {a.strengths?.length > 0 && (
        <Section title="Strengths" icon={CheckCircle}>
          <div className="space-y-2">
            {a.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Weaknesses */}
      {a.weaknesses?.length > 0 && (
        <Section title="Areas for Improvement" icon={AlertTriangle}>
          <div className="space-y-2">
            {a.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <XCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm">{w}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Skills Analysis */}
      {a.skillsAnalysis && (
        <Section title="Skills Analysis" icon={Code2}>
          <div className="space-y-5">
            {a.skillsAnalysis.technical?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Technical Skills Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {a.skillsAnalysis.technical.map((skill) => (
                    <span key={skill} className="badge bg-brand-100 text-brand-700">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {a.skillsAnalysis.soft?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Soft Skills (from evidence in resume)</h3>
                <div className="flex flex-wrap gap-2">
                  {a.skillsAnalysis.soft.map((skill) => (
                    <span key={skill} className="badge bg-emerald-100 text-emerald-700">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            {a.skillsAnalysis.missing?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Potential Missing Skills (vs. job description)</h3>
                <p className="text-xs text-slate-400 mb-2">Only add these to your resume if they accurately reflect your skills.</p>
                <div className="flex flex-wrap gap-2">
                  {a.skillsAnalysis.missing.map((skill) => (
                    <span key={skill} className="badge bg-red-100 text-red-600">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Section Feedback */}
      {a.sectionFeedback?.length > 0 && (
        <Section title="Section-by-Section Feedback" icon={BookOpen}>
          <div className="space-y-4">
            {a.sectionFeedback.map((sf, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-800 text-sm">{sf.section}</span>
                  <span className={`badge text-xs ${getRatingClass(sf.rating)}`}>{sf.rating}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{sf.feedback}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Suggestions */}
      {a.suggestions?.length > 0 && (
        <Section title="Improvement Suggestions" icon={Lightbulb}>
          <div className="space-y-5">
            {a.suggestions.map((s, i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge text-xs ${getPriorityClass(s.priority)}`}>
                    {s.priority} priority
                  </span>
                  {s.category && (
                    <span className="badge bg-slate-100 text-slate-500 text-xs">{s.category}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">{s.suggestion}</p>
                {s.bulletImprovements?.length > 0 && (
                  <div className="space-y-3">
                    {s.bulletImprovements.map((bi, j) => (
                      <div key={j} className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                        {bi.original && (
                          <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Before</span>
                            <p className="text-slate-600 mt-1 line-through opacity-70">{bi.original}</p>
                          </div>
                        )}
                        {bi.improved && (
                          <div>
                            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">After</span>
                            <p className="text-slate-800 font-medium mt-1">{bi.improved}</p>
                          </div>
                        )}
                        {bi.explanation && (
                          <p className="text-xs text-slate-400 italic border-t border-slate-200 pt-2">{bi.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Keyword Analysis */}
      {a.keywordAnalysis && (
        <Section title="Keyword Analysis" icon={Tag}>
          {a.keywordAnalysis.note && (
            <p className="text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg">{a.keywordAnalysis.note}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {a.keywordAnalysis.found?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Keywords Found</h3>
                <div className="flex flex-wrap gap-1.5">
                  {a.keywordAnalysis.found.map((kw) => (
                    <span key={kw} className="badge bg-emerald-100 text-emerald-700 text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            )}
            {a.keywordAnalysis.missing?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-2">Potentially Missing Keywords</h3>
                <p className="text-xs text-slate-400 mb-1.5">Add only if they reflect your real experience.</p>
                <div className="flex flex-wrap gap-1.5">
                  {a.keywordAnalysis.missing.map((kw) => (
                    <span key={kw} className="badge bg-red-100 text-red-600 text-xs">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* CTA */}
      <div className="card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-800">Ready to improve?</p>
          <p className="text-sm text-slate-500">Apply the suggestions, then re-analyze to track your progress.</p>
        </div>
        <Link to="/analyze" className="btn btn-primary btn-md flex-shrink-0">
          <TrendingUp className="w-4 h-4" />
          Re-analyze
        </Link>
      </div>
    </div>
  );
}
