import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
};

export const resumeService = {
  analyze: (formData) =>
    api.post('/resumes/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  compareWithJob: (formData) =>
    api.post('/resumes/compare-job', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  improveBullet: (bullet, context) =>
    api.post('/resumes/improve-bullet', { bullet, context }),

  getHistory: (page = 1, limit = 10) =>
    api.get(`/resumes/history?page=${page}&limit=${limit}`),

  getAnalysis: (id) => api.get(`/resumes/${id}`),

  deleteAnalysis: (id) => api.delete(`/resumes/${id}`),
};
