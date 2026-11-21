import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, GitCompare, TrendingUp, Clock, ArrowRight, Sparkles,
  BarChart3, Trophy, AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../services';
import { useAuth } from '../context/AuthContext';
import { firstName, formatRelativeDate, getScoreColor, getScoreBgColor, getScoreLabel } from '../utils/helpers';
import CircularScore from '../components/CircularScore';

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color || 'text-slate-900'}`}>
            {value ?? '—'}
          </p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-8 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-sm">
        <p className="text-slate-500 mb-1">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        <p className="font-bold text-brand-600">{payload[0].value} / 100</p>
        {payload[0].payload?.filename && (
          <p className="text-slate-400 text-xs truncate max-w-40">{payload[0].payload.filename}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-slate-900 font-display"
        >
          Welcome back, {firstName(user?.name)} 👋
        </motion.h1>
        <p className="text-slate-500 text-sm mt-1">
          Here&apos;s an overview of your resume analysis activity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Trophy}
              label="Latest Score"
              value={stats?.latestScore ?? '—'}
              color={stats?.latestScore ? getScoreColor(stats.latestScore) : 'text-slate-400'}
              sub={stats?.latestScore ? getScoreLabel(stats.latestScore) : 'No analyses yet'}
            />
            <StatCard icon={BarChart3} label="Average Score" value={stats?.avgScore ?? '—'} sub="Across all analyses" />
            <StatCard icon={FileText} label="Total Analyses" value={stats?.totalAnalyses ?? 0} sub="Since joining" />
            <StatCard icon={Clock} label="Recent Activity" value={stats?.recentAnalyses?.length ?? 0} sub="In last 5 analyses" />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-slate-900 text-lg">Score History</h2>
            <Link to="/history" className="text-sm text-brand-600 font-medium hover:text-brand-700">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="skeleton h-48 w-full" />
          ) : stats?.scoreHistory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6d51ff"
                  strokeWidth={2.5}
                  dot={{ fill: '#6d51ff', strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <TrendingUp className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">No score history yet</p>
              <p className="text-slate-400 text-sm mt-1">Analyze your resume to see your progress here.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/analyze"
                id="quick-analyze"
                className="flex items-center gap-3 p-4 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Analyze Resume</p>
                  <p className="text-xs text-slate-500">Upload your PDF for AI feedback</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
              </Link>
              <Link
                to="/compare"
                id="quick-compare"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <GitCompare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Compare with JD</p>
                  <p className="text-xs text-slate-500">Match your resume to a role</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </Link>
              <Link
                to="/improve"
                id="quick-improve"
                className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 text-sm">Improve a Bullet</p>
                  <p className="text-xs text-slate-500">Rewrite any bullet point with AI</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      {!loading && stats?.recentAnalyses?.length > 0 && (
        <div className="mt-6 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 text-lg">Recent Analyses</h2>
            <Link to="/history" className="text-sm text-brand-600 font-medium hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentAnalyses.map((a) => (
              <Link
                key={a.id}
                to={`/results/${a.id}`}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${getScoreBgColor(a.score)} ${getScoreColor(a.score)}`}>
                  {a.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate text-sm">{a.filename}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{formatRelativeDate(a.createdAt)}</span>
                    {a.targetRole && (
                      <>
                        <span>·</span>
                        <span className="truncate">{a.targetRole}</span>
                      </>
                    )}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for new users */}
      {!loading && stats?.totalAnalyses === 0 && (
        <div className="mt-8 card p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-50 flex items-center justify-center mb-5">
            <FileText className="w-10 h-10 text-brand-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyze your first resume</h3>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            Upload your PDF resume and get an AI-powered quality score with detailed, actionable feedback.
          </p>
          <Link to="/analyze" className="btn btn-primary btn-lg">
            <FileText className="w-5 h-5" />
            Analyze My Resume
          </Link>
        </div>
      )}
    </div>
  );
}
