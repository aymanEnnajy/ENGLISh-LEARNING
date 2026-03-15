import { supabase } from '../services/supabase.js';

// POST /auth/register
export async function register(req, res) {
  const { email, password, displayName, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
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

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ user: data.user, session: data.session });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
}

// POST /auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json({ user: data.user, session: data.session });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
}

// PUT /auth/update
export async function updateUser(req, res) {
  const { displayName, password } = req.body;
  const updateData = {};

  if (displayName) {
    updateData.data = { display_name: displayName };
  }
  if (password) {
    updateData.password = password;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }

  try {
    const { data, error } = await req.supabase.auth.updateUser(updateData);
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ user: data.user });
  } catch (err) {
    return res.status(500).json({ error: 'Update failed' });
  }
}
