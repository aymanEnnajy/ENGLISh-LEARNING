import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { BookOpen, ArrowRight, Github, Chrome } from 'lucide-react';
import { toast } from 'react-hot-toast';
import logoWhite from '../assets/logoWhite.png';
import logoBlack from '../assets/logoBlack.png';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const { login, signup, loading, user, register, loginWithProvider } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted. Current loading state:', loading);
    try {
      if (isLogin) {
        console.log('Calling login function in authStore...');
        await login(email, password);
        console.log('Login call finished, user should be updated soon.');
        navigate('/dashboard');
      } else {
        console.log('Calling register function in authStore...');
        await register(email, password, displayName, phone);
        toast.success('Account created! Please verify your email.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error('AuthPage caught error:', err.message);
      toast.error(err.message || 'Authentication failed. Check your connection.');
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      await loginWithProvider(provider);
    } catch (err) {
      console.error('Social Auth Error:', err);
      toast.error(err.message || `Login with ${provider} failed.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Brand Side - Monochrome Dark */}
      <div className="lg:w-1/2 bg-black flex flex-col justify-start p-8 sm:p-12 lg:p-16 lg:pt-16 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full translate-x-[-50%] translate-y-[-50%]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full translate-x-[50%] translate-y-[50%]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="mb-4 w-full max-w-[80vw] h-[35vh] sm:h-[45vh] lg:h-[45vh] flex items-center justify-center lg:justify-start">
            <img 
              src={logoWhite} 
              alt="vocaMster Logo" 
              className="h-full w-auto object-contain drop-shadow-2xl" 
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tighter leading-none">
              MASTER ENGLISH<br />DICTION.
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-md font-medium leading-relaxed">
              A minimalist workspace for high-performance vocabulary acquisition and long-term retention.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10 max-w-sm">
            {[
              { val: '10x', lab: 'Retention' },
              { val: 'Unlimited', lab: 'Vault' },
              { val: '0', lab: 'Ads' }
            ].map(stat => (
              <div key={stat.lab}>
                <div className="text-xl font-display font-black">{stat.val}</div>
                <div className="text-[10px] text-zinc-500 uppercase font-black mt-1 tracking-widest">{stat.lab}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side - Monochrome Light */}
      <div className="lg:w-1/2 flex items-center lg:items-start justify-center p-6 sm:p-12 lg:pt-16 bg-background overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-black tracking-tight mb-2 uppercase">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
            <p className="text-muted-foreground font-medium">
              {isLogin ? 'Welcome back. Enter your credentials.' : 'Join the master class of vocabulary.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Display Name</label>
                  <input
                    type="text"
                    required
                    className="input-monochrome font-bold"
                    placeholder="John Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Phone Number</label>
                  <input
                    type="tel"
                    className="input-monochrome font-bold"
                    placeholder="+1 234 567 890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Email Address</label>
              <input
                type="email"
                required
                className="input-monochrome font-bold"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-400">Password</label>
              <input
                type="password"
                required
                className="input-monochrome font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-monochrome h-14 relative group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-zinc-300">
            <div className="h-px bg-current flex-1" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">or continue with</span>
            <div className="h-px bg-current flex-1" />
          </div>

          <div className="mt-8">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full h-14 border-2 border-border rounded-xl flex items-center justify-center gap-3 hover:bg-secondary transition-all font-bold"
            >
              <Chrome size={20} />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="mt-12 text-center text-sm font-bold text-muted-foreground">
            {isLogin ? "No account yet?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-foreground underline underline-offset-4 decoration-2 hover:decoration-zinc-400"
            >
              {isLogin ? 'Sign Up Now' : 'Sign In Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
