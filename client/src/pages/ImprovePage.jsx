import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Info, ArrowRight, Copy } from 'lucide-react';
import { resumeService } from '../services';
import toast from 'react-hot-toast';

export default function ImprovePage() {
  const [bullet, setBullet] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!bullet.trim() || bullet.trim().length < 5) {
      toast.error('Please enter a bullet point to improve.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await resumeService.improveBullet(bullet.trim(), context.trim());
      setResult(res.data.data);
    } catch (err) {
      toast.error(err.message || 'Failed to improve bullet. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy.'));
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-display">Improve a Bullet Point</h1>
          <p className="text-slate-500 text-sm mt-1">
            Paste any resume bullet point and get an improved, more impactful version.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            The AI will improve the <strong>style and specificity</strong> of your bullet without inventing
            metrics or achievements. Only use the improved version if it accurately reflects your experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="card p-6 space-y-5">
            <div>
              <label htmlFor="bullet-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                Resume Bullet Point <span className="text-red-400">*</span>
              </label>
              <textarea
                id="bullet-input"
                className="input resize-none h-28"
                placeholder="e.g. Worked on improving the performance of the backend API…"
                value={bullet}
                onChange={(e) => setBullet(e.target.value)}
                disabled={loading}
                maxLength={500}
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{bullet.length}/500</p>
            </div>

            <div>
              <label htmlFor="context-input" className="block text-sm font-medium text-slate-700 mb-1.5">
                Role Context <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="context-input"
                type="text"
                className="input"
                placeholder="e.g. Backend Engineer, Data Scientist, Product Manager…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={loading}
                maxLength={100}
              />
            </div>
          </div>

          <button
            id="improve-submit"
            type="submit"
            disabled={loading || bullet.trim().length < 5}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Improving…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Improve Bullet
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 card p-6 space-y-4"
          >
            <h2 className="font-semibold text-slate-900">Result</h2>

            <div className="space-y-3">
              {result.original && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">Before</p>
                  <p className="text-sm text-slate-600 line-through opacity-70">{result.original}</p>
                </div>
              )}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 relative">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">After</p>
                <p className="text-sm text-slate-800 font-medium leading-relaxed pr-8">{result.improved}</p>
                <button
                  onClick={() => copyToClipboard(result.improved)}
                  className="absolute top-4 right-4 btn btn-ghost btn-sm rounded-lg p-1.5"
                  aria-label="Copy improved bullet"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
              {result.explanation && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Why it&apos;s better</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { setBullet(''); setResult(null); }}
              className="btn btn-secondary btn-sm w-full"
            >
              <ArrowRight className="w-4 h-4" />
              Improve another bullet
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
