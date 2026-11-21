
import axios from 'axios';

// Backend API URL from Vercel environment variables
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://resumeiq-lxe7.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor — uniform error handling
api.interceptors.response.use(
  (response) => response,

  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'An unexpected error occurred.';

    const errors = err.response?.data?.errors || [];
    const status = err.response?.status || 0;

    return Promise.reject({
      message,
      errors,
      status,
    });
  }
);

export default api;
