import { getScoreStrokeColor, getScoreLabel, getScoreColor } from '../utils/helpers';

const SIZE = 180;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export default function CircularScore({ score, size = 180, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, score || 0));
  const offset = C - (pct / 100) * C;
  const color = getScoreStrokeColor(pct);
  const label = getScoreLabel(pct);
  const colorClass = getScoreColor(pct);

  const s = size;
  const sw = (STROKE / SIZE) * s;
  const r = (s - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Resume score: ${pct} out of 100`}>
      <div className="relative" style={{ width: s, height: s }}>
        <svg
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          className="circular-progress"
          role="presentation"
        >
          {/* Track */}
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            className="circular-progress-track"
            strokeWidth={sw}
          />
          {/* Fill */}
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            className="circular-progress-fill"
            strokeWidth={sw}
            stroke={color}
            strokeDasharray={c}
            strokeDashoffset={off}
          />
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold leading-none ${colorClass}`}
            style={{ fontSize: s * 0.22 }}
          >
            {pct}
          </span>
          <span className="text-slate-400 font-medium" style={{ fontSize: s * 0.09 }}>
            / 100
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-sm font-semibold ${colorClass}`}>{label}</span>
      )}
    </div>
  );
}
