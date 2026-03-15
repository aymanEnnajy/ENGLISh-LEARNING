import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),

  initialize: async () => {
    console.log('Initializing Auth Store...');
    set({ loading: true });
    try {
      if (!supabase) {
        console.error('Supabase client not initialized!');
        set({ loading: false });
        return;
      }
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session check error:', error);
      } else {
        console.log('Session initialized:', session ? 'User logged in' : 'No active session');
      }
      set({ session, user: session?.user ?? null, loading: false });

      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        set({ session, user: session?.user ?? null });
      });
    } catch (err) {
      console.error('Exception during Auth initialization:', err);
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    console.log('Attempting login for:', email);
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Login error:', error.message);
        set({ loading: false });
        throw error;
      }
      console.log('Login successful');
      set({ session: data.session, user: data.user, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  loginWithProvider: async (provider) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (email, password, displayName, phone) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          display_name: displayName,
          phone: phone
        }
      }
    });
    if (error) throw error;
    return data;
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const updatePayload = {};
      if (data.password) updatePayload.password = data.password;
      if (data.displayName) updatePayload.data = { display_name: data.displayName };

      const { data: userData, error } = await supabase.auth.updateUser(updatePayload);
      if (error) throw error;
      
      set({ user: userData.user, loading: false });
      return userData.user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
