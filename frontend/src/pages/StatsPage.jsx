import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { BarChart3, TrendingUp, Target, Award, Clock, ArrowUpRight, Zap, Brain, BookOpen, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useVocabularyStore } from '../stores/vocabularyStore';
import WordForm from '../components/WordForm';
import { toast } from 'react-hot-toast';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const { addWord } = useVocabularyStore();

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (formData) => {
    try {
      await addWord(formData);
      toast.success('New word added');
      setIsFormOpen(false);
      fetchStats(); // Refresh stats after adding word
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="animate-pulse py-12 space-y-12"><div className="h-64 bg-secondary rounded-2xl" /><div className="grid grid-cols-3 gap-6"><div className="h-32 bg-secondary rounded-2xl" /><div className="h-32 bg-secondary rounded-2xl" /><div className="h-32 bg-secondary rounded-2xl" /></div></div></Layout>;

  return (
    <Layout>
      <div className="py-6 sm:py-10">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase mb-3">
              Neural <span className="text-muted-foreground">Analytica</span>
            </h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <TrendingUp size={16} />
              Quantified metrics for your linguistic expansion.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-monochrome flex items-center justify-center gap-2 shadow-hard hover:translate-y-[-2px] active:translate-y-0"
          >
            <Plus size={20} />
            <span className="uppercase tracking-widest text-[12px] font-black">Add Vocabulary</span>
          </button>
        </header>

        {/* Top Grid: Primary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="card-monochrome bg-black text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={48} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Total Vocabulary</p>
            <div className="text-5xl font-display font-black">{stats?.total_words || 0}</div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-zinc-300">
              <ArrowUpRight size={14} />
              <span>Vault is expanding</span>
            </div>
          </div>

          <div className="card-monochrome relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-zinc-400"><Brain size={48} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Ready for Review</p>
            <div className="text-5xl font-display font-black">{stats?.words_due || 0}</div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <BookOpen size={14} />
              <span>Focus on these first</span>
            </div>
          </div>
          
          <div className="card-monochrome relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-zinc-400"><Target size={48} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Session Accuracy</p>
            <div className="text-5xl font-display font-black">{stats?.accuracy_rate || 0}%</div>
            <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-black" style={{ width: `${stats?.accuracy_rate || 0}%` }} />
            </div>
          </div>

          <div className="card-monochrome relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-zinc-400"><Award size={48} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Learning Streak</p>
            <div className="text-5xl font-display font-black">{stats?.streak || 0} <span className="text-xl">Days</span></div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock size={14} />
              <span>Keep the momentum</span>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="card-monochrome mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-black uppercase tracking-tight">Retention Velocity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Intensity</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full min-h-[320px]">
            {stats?.activity_data?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={320}>
                <AreaChart data={stats.activity_data}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e5e7eb', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      fontSize: '10px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#000" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground font-medium text-sm">
                No activity data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Grid: Milestones & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Linguistic Milestones</h4>
            {[
              { 
                label: 'Novice Linguist', 
                desc: 'Acquire 50 fundamental terms.', 
                progress: Math.min(100, Math.round(((stats?.total_words || 0) / 50) * 100)), 
                icon: BookOpen 
              },
              { 
                label: 'Neural Pioneer', 
                desc: 'Maintain a 7-day practice protocol.', 
                progress: Math.min(100, Math.round(((stats?.streak || 0) / 7) * 100)), 
                icon: Brain 
              },
              { 
                label: 'Clarity Adept', 
                desc: 'Achieve 95% session accuracy.', 
                progress: stats?.accuracy_rate || 0, 
                icon: Zap 
              }
            ].map((milestone, idx) => (
              <div key={idx} className="card-monochrome flex items-center gap-6 group hover:border-black">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-black group-hover:text-white transition-all">
                  <milestone.icon size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-display font-black uppercase tracking-tight">{milestone.label}</span>
                    <span className="text-[10px] font-black">{milestone.progress}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-black transition-all duration-1000" style={{ width: `${milestone.progress}%` }} />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-widest">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-monochrome bg-zinc-50 dark:bg-zinc-900 border-dashed flex flex-col items-center justify-center text-center p-12">
            <div className="bg-white dark:bg-black p-4 rounded-3xl shadow-hard mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-tight mb-2">Performance Optimization</h3>
            <p className="text-muted-foreground font-medium max-w-xs mb-8">
              {stats?.accuracy_rate < 80 
                ? "Your accuracy is below target. Focus on 'Pattern Recognition' mode to reinforce your foundational memory."
                : stats?.total_words < 10
                  ? "Your library is small. Focus on adding more vocabulary to increase your linguistic vault."
                  : "Excellent precision. Focus on 'Active Recall' mode to boost long-term retention and writing speed."}
            </p>
            <button 
              onClick={() => navigate('/test')}
              className="btn-monochrome px-8"
            >
              Review Strategy
            </button>
          </div>
        </div>
      </div>

      <WordForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
      />
    </Layout>
  );
}
