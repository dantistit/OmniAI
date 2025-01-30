import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { RootState } from '@store/index';

// Base axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post('/auth/refresh', { refreshToken });
        const { token } = response.data;
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// RTK Query API
export const api = createApi({
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: import.meta.env.VITE_API_URL,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
      },
    }),
    { maxRetries: 3 }
  ),
  tagTypes: ['Chat', 'User', 'Document', 'Image'],
  endpoints: () => ({}),
});

export default axiosInstance;