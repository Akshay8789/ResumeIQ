import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send HttpOnly cookies on every request
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — uniform error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'An unexpected error occurred.';
    const errors = err.response?.data?.errors || [];
    const status = err.response?.status || 0;
    return Promise.reject({ message, errors, status });
  }
);

export default api;
