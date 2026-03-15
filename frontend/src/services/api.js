import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    console.log('Attaching Authorization header...');
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn('No active session found for API request');
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default api;
