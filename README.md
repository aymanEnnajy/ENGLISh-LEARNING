# VocabMaster — English Vocabulary Learning App

A full-stack app to store English vocabulary and test yourself, built with **React + Vite**, **Express**, **Supabase**, and **Tailwind CSS**.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Supabase project

### 1. Supabase Setup
1. Go to your [Supabase project](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Paste and run the contents of `supabase-setup.sql`
4. In **Authentication → Settings**, ensure "Confirm email" is configured as needed

### 2. Backend

```bash
cd backend
# Edit .env with your keys (already pre-filled with your project)
# Add your Gemini API key: AI_API_KEY=
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
# Edit .env.local if needed
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|--|--|
| `PORT` | Server port (default 5000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |
| `AI_API_KEY` | Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey)) |
| `FRONTEND_URL` | Allowed CORS origin (set to Vercel URL in production) |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|--|--|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |
| `VITE_API_URL` | Backend API URL (e.g. `https://your-backend.vercel.app/api`) |

---

## ☁️ Deploy to Vercel

### Backend
1. Push `backend/` folder to a GitHub repo (or root deploy)
2. Create new Vercel project → import repo
3. Set **Root Directory** to `backend`
4. Add all env variables from `backend/.env`
5. Deploy → note your backend URL

### Frontend
1. Create another Vercel project → import same repo
2. Set **Root Directory** to `frontend`
3. Add env variables:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` = `https://your-backend.vercel.app/api`
4. Deploy

### Backend — update CORS
Go back to backend Vercel project → Settings → Environment Variables:
- Add `FRONTEND_URL` = `https://your-frontend.vercel.app`
- Redeploy

---

## 📁 Project Structure

```
learn english/
├── frontend/          # React + Vite + Tailwind
│   └── src/
│       ├── components/   # VocabCard, WordForm, Navbar, Sidebar...
│       ├── pages/        # AuthPage, DashboardPage, TestPage, StatsPage
│       ├── stores/       # Zustand (auth, vocabulary, test)
│       ├── services/     # Axios api.js, supabase.js
│       ├── hooks/        # useTTS, useKeyboardShortcut
│       └── context/      # DarkModeContext
├── backend/           # Express API
│   ├── api/           # Express entry (index.js)
│   ├── controllers/   # Auth, Words, AI, Stats
│   ├── routes/        # Route definitions
│   ├── middleware/    # auth.js, rateLimit.js
│   └── services/      # supabase.js, ai.js
└── supabase-setup.sql # DB schema + RLS policies
```

---

## ✨ Features

- **Auth**: Sign up / login / logout with Supabase Auth + session persistence
- **Vocabulary CRUD**: Add, edit, delete, search, paginate words
- **Test Modes**: Write the word + Multiple Choice (AI-generated distractors)
- **Stats Dashboard**: Accuracy, streak, answer breakdown, 7-day activity chart
- **TTS**: Web Speech API pronunciation for every word
- **Dark Mode**: Toggle with localStorage persistence
- **Mobile-first**: Bottom navigation on mobile, sidebar on desktop
- **Keyboard shortcuts**: Enter to submit, N for next (test page)
