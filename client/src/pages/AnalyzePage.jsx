import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Loader2, Info, Briefcase } from 'lucide-react';
import { resumeService } from '../services';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

export default function AnalyzePage() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { toast.error('Please select a PDF resume.'); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole.trim()) formData.append('targetRole', targetRole.trim());

    try {
      const res = await resumeService.analyze(formData);
      toast.success('Analysis complete!');
      navigate(`/results/${res.data.data.analysisId}`);
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-display">Analyze Your Resume</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload your PDF resume for an AI-powered quality analysis and improvement suggestions.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            The score is an <strong>AI-generated quality estimate</strong>, not an official ATS score.
            Use it as helpful guidance, not as a definitive measure of interview success.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              Upload Resume
            </h2>
            <FileUpload
              file={file}
              onFileSelect={setFile}
              onClear={() => setFile(null)}
              disabled={loading}
            />
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-500" />
              Target Role <span className="text-slate-400 font-normal text-sm">(optional)</span>
            </h2>
            <input
              id="target-role"
              type="text"
              className="input"
              placeholder="e.g. Senior Software Engineer, Product Manager…"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
            <p className="text-xs text-slate-400 mt-2">
              Providing a target role helps contextualize the skills relevance assessment.
              For keyword gap analysis, use the "Compare with JD" feature.
            </p>
          </div>

          <button
            id="analyze-submit"
            type="submit"
            disabled={loading || !file}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your resume…
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Analyze Resume
              </>
            )}
          </button>

          {loading && (
            <p className="text-center text-sm text-slate-400">
              This takes about 10–30 seconds. Please don&apos;t close this page.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
