import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, ArrowRight, Trash2, AlertCircle, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { resumeService } from '../services';
import { formatDate, getScoreColor, getScoreBgColor, getScoreLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  function load(p = 1) {
    setLoading(true);
    resumeService.getHistory(p, 10)
      .then((res) => { setData(res.data.data); setPage(p); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(1); }, []);

  async function handleDelete(id, filename) {
    if (!confirm(`Delete analysis for "${filename}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await resumeService.deleteAnalysis(id);
      toast.success('Analysis deleted.');
      load(page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  }

  const pages = data?.pagination?.pages || 1;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">Analysis History</h1>
            <p className="text-slate-500 text-sm mt-1">
              All your past resume analyses.
              {data?.pagination?.total > 0 && ` ${data.pagination.total} total.`}
            </p>
          </div>
          <Link to="/analyze" className="btn btn-primary btn-md">
            <FileText className="w-4 h-4" />
            New Analysis
          </Link>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
          </div>
        ) : data?.analyses?.length === 0 ? (
          <div className="card p-12 flex flex-col items-center justify-center text-center">
            <History className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No analyses yet</h3>
            <p className="text-slate-400 text-sm mb-6">Upload your resume to see your analysis history here.</p>
            <Link to="/analyze" className="btn btn-primary btn-md">Analyze My Resume</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.analyses.map((a, i) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${getScoreBgColor(a.overallScore)}`}>
                    <span className={`text-xl font-bold leading-none ${getScoreColor(a.overallScore)}`}>{a.overallScore}</span>
                    <span className="text-xs text-slate-400">score</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{a.originalFilename}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-slate-400">{formatDate(a.createdAt)}</span>
                      <span className={`badge text-xs ${getScoreBgColor(a.overallScore)} ${getScoreColor(a.overallScore)}`}>
                        {getScoreLabel(a.overallScore)}
                      </span>
                      {a.analysisType === 'with_job_description' && (
                        <span className="badge bg-brand-100 text-brand-700 text-xs">JD Comparison</span>
                      )}
                      {a.targetRole && (
                        <span className="badge bg-slate-100 text-slate-600 text-xs truncate max-w-32">{a.targetRole}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/results/${a._id}`}
                      className="btn btn-secondary btn-sm"
                      aria-label="View analysis"
                    >
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(a._id, a.originalFilename)}
                      disabled={deletingId === a._id}
                      className="btn btn-ghost btn-sm rounded-lg p-2 text-slate-400 hover:text-red-500"
                      aria-label="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1 || loading}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-slate-600 font-medium">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => load(page + 1)}
              disabled={page >= pages || loading}
              className="btn btn-secondary btn-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
