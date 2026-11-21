import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const ACCEPTED_TYPES = ['application/pdf'];
const MAX_MB = 5;

export default function FileUpload({ onFileSelect, file, onClear, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  function validate(f) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return 'Only PDF files are accepted.';
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      return `File size must be under ${MAX_MB} MB.`;
    }
    return null;
  }

  const handleFile = useCallback((f) => {
    if (!f) return;
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(f);
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);

  const onInputChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = ''; // Allow re-selecting same file
  };

  if (file) {
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 truncate">{file.name}</p>
          <p className="text-sm text-slate-500">{formatFileSize(file.size)} · PDF</p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => { setError(null); onClear(); }}
            className="btn btn-ghost btn-sm rounded-lg p-2"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`drop-zone cursor-pointer p-10 flex flex-col items-center gap-4 text-center transition-all
          ${dragActive ? 'drag-active' : 'hover:border-brand-400 hover:bg-brand-50/30'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && inputRef.current?.click(); }}}
        aria-label="Upload resume PDF"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Upload className="w-8 h-8 text-brand-500" />
        </div>
        <div>
          <p className="font-semibold text-slate-700 text-base">
            Drop your resume here, or <span className="text-brand-600">browse</span>
          </p>
          <p className="text-sm text-slate-400 mt-1">PDF only · Max {MAX_MB} MB</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileText className="w-4 h-4" />
          <span>Must contain selectable text (not a scanned image)</span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={onInputChange}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
