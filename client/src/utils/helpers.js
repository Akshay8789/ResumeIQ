/**
 * Utility helpers used across the frontend.
 */

/** Returns a CSS class for score coloring */
export function getScoreColor(score) {
  if (score >= 80) return 'score-excellent';
  if (score >= 60) return 'score-good';
  if (score >= 40) return 'score-fair';
  return 'score-poor';
}

export function getScoreBgColor(score) {
  if (score >= 80) return 'score-bg-excellent';
  if (score >= 60) return 'score-bg-good';
  if (score >= 40) return 'score-bg-fair';
  return 'score-bg-poor';
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}

export function getScoreStrokeColor(score) {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#2563eb';
  if (score >= 40) return '#d97706';
  return '#dc2626';
}

/** Format bytes to human-readable size */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Format a date to a readable string */
export function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(dateString) {
  const d = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateString);
}

/** Extract first name */
export function firstName(name) {
  return name?.split(' ')[0] || 'there';
}

/** Priority badge classes */
export function getPriorityClass(priority) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'low': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

/** Rating badge classes */
export function getRatingClass(rating) {
  switch (rating) {
    case 'excellent': return 'rating-excellent';
    case 'good': return 'rating-good';
    case 'fair': return 'rating-fair';
    case 'poor': return 'rating-poor';
    default: return 'bg-gray-100 text-gray-600';
  }
}
