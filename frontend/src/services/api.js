import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase JWT and cache-buster to every request
api.interceptors.request.use(async (config) => {
  // Add cache-buster to GET requests
  if (config.method?.toLowerCase() === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;
    console.error(`API Error [${status || 'NETWORK'}]:`, message, error.config?.url);

    if (status === 401) {
      await supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default api;
