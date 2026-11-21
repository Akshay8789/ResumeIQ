import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { formatDate } from '../utils/helpers';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 font-display">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Your account information.</p>
        </div>

        <div className="card p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Full Name</p>
                <p className="text-slate-800 font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-slate-800 font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-brand-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Member Since</p>
                <p className="text-slate-800 font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Security note */}
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
            <Shield className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500">
              Your password is securely hashed and never stored in plain text.
              Authentication uses secure HttpOnly cookies. Resume text is analyzed and discarded — not stored.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
