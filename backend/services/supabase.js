import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

console.log('Supabase Client Initializing...');
if (supabaseKey.startsWith('sb_publishable')) {
  console.error('ERROR: Using Stripe key instead of Supabase key in backend!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
