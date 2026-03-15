import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
if (supabaseAnonKey?.startsWith('sb_publishable')) {
  console.warn('CRITICAL: VITE_SUPABASE_ANON_KEY starts with "sb_publishable". This is likely a Stripe key, NOT a Supabase key. Supabase keys must start with "eyJ".');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
