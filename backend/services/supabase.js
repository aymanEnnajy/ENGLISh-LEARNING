import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Missing Supabase credentials in environment variables. Backend will fail to query database.');
}

console.log('Supabase Client Initializing...');
if (supabaseKey.startsWith('sb_publishable')) {
  console.error('ERROR: Using Stripe key instead of Supabase key in backend!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
