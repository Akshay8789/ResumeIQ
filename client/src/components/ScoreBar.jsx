import { getScoreStrokeColor } from '../utils/helpers';

export default function ScoreBar({ label, score, maxScore = 100 }) {
  const pct = Math.min(100, Math.max(0, score ?? 0));
  const color = getScoreStrokeColor(pct);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className="font-semibold text-slate-900">{pct}</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={maxScore}
          aria-label={label}
        />
      </div>
    </div>
  );
}
