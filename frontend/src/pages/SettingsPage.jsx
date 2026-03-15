import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import Layout from '../components/Layout';
import { User, Lock, Save, ArrowLeft, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateProfile, loading } = useAuthStore();
  
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    try {
      await updateProfile({ password: newPassword });
      toast.success('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    }
  };

  return (
    <Layout>
      <div className="py-6 sm:py-10 max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase mb-3 text-foreground">
            System <span className="text-muted-foreground">Parameters</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <User size={16} />
            Configure your neural identity and security credentials.
          </p>
        </header>

        <div className="space-y-12">
          {/* Profile Section */}
          <section className="card-monochrome space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-border">
              <div className="p-2 bg-secondary rounded-lg">
                <User size={20} />
              </div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight">Identity Profile</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Display Identity</label>
                <input
                  type="text"
                  className="input-monochrome font-bold"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Electronic Mail (Read Only)</label>
                <input
                  type="email"
                  disabled
                  className="input-monochrome font-bold opacity-50 cursor-not-allowed"
                  value={user?.email || ''}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-monochrome w-full flex items-center justify-center gap-2"
              >
                <Save size={18} />
                <span>Save Profile</span>
              </button>
            </form>
          </section>

          {/* Security Section */}
          <section className="card-monochrome space-y-8 border-dashed">
            <div className="flex items-center gap-3 pb-6 border-b border-border">
              <div className="p-2 bg-secondary rounded-lg">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight">Security Protocol</h2>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">New Secret Key</label>
                <input
                  type="password"
                  required
                  className="input-monochrome font-bold"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Confirm Secret Key</label>
                <input
                  type="password"
                  required
                  className="input-monochrome font-bold"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                <span>Update Security Credentials</span>
              </button>
            </form>
          </section>
        </div>
      </div>
    </Layout>
  );
}
