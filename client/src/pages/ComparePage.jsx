import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, Loader2, Info, FileText, AlignLeft } from 'lucide-react';
import { resumeService } from '../services';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { toast.error('Please select a PDF resume.'); return; }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      toast.error('Please paste a job description of at least 50 characters.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription.trim());
    if (targetRole.trim()) formData.append('targetRole', targetRole.trim());

    try {
      const res = await resumeService.compareWithJob(formData);
      toast.success('Comparison analysis complete!');
      navigate(`/results/${res.data.data.analysisId}`);
    } catch (err) {
      toast.error(err.message || 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const charCount = jobDescription.length;
  const isJDValid = charCount >= 50;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-display">Compare with Job Description</h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload your resume and paste a job description to get keyword gap analysis and job-specific matching.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            This analysis includes keyword matching. Suggested missing keywords should only be added to your resume
            if they <strong>accurately reflect your actual skills and experience</strong>.
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
              <AlignLeft className="w-5 h-5 text-brand-500" />
              Job Description <span className="text-red-400 ml-1">*</span>
            </h2>
            <textarea
              id="job-description"
              className={`input resize-none h-48 ${!isJDValid && charCount > 0 ? 'error' : ''}`}
              placeholder="Paste the full job description here. Include responsibilities, requirements, and preferred qualifications…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={loading}
              maxLength={5000}
            />
            <div className="flex justify-between mt-1.5">
              {!isJDValid && charCount > 0 ? (
                <p className="text-xs text-red-500">At least 50 characters required ({charCount}/50)</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400 ml-auto">{charCount} / 5000</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-slate-800 mb-4">
              Target Role <span className="text-slate-400 font-normal text-sm">(optional)</span>
            </h2>
            <input
              type="text"
              className="input"
              placeholder="e.g. Frontend Engineer, Data Analyst…"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <button
            id="compare-submit"
            type="submit"
            disabled={loading || !file || !isJDValid}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Comparing…
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                Compare with Job Description
              </>
            )}
          </button>

          {loading && (
            <p className="text-center text-sm text-slate-400">
              This takes about 15–40 seconds. Please don&apos;t close this page.
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
