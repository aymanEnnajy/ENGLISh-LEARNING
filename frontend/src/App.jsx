import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import { DarkModeProvider } from './context/DarkModeContext';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage'; // This is now Library
import TestPage from './pages/TestPage';
import StatsPage from './pages/StatsPage'; // This is now Dashboard
import SettingsPage from './pages/SettingsPage';
import PronunciationPage from './pages/PronunciationPage';

import IOSInstallPrompt from './components/IOSInstallPrompt';

function AppInit({ children }) {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => { initialize(); }, []);
  return children;
}

export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <AppInit>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
            <Route path="/oral" element={<ProtectedRoute><PronunciationPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <IOSInstallPrompt />
        </AppInit>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </DarkModeProvider>
  );
}
