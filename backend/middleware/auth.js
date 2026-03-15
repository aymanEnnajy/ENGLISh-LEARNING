import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Create a per-request Supabase client with the user's token
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error } = await userSupabase.auth.getUser();

    if (error || !user) {
      console.error('Auth check failed:', error?.message || 'No user found');
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    req.supabase = userSupabase; // Attach scoped client
    next();
  } catch (err) {
    console.error('Critical Auth middleware error:', err);
    return res.status(500).json({ 
      error: 'Authentication error', 
      details: err.message,
      hint: 'Check if SUPABASE_URL and SUPABASE_ANON_KEY are set correctly on Vercel.'
    });
  }
}
