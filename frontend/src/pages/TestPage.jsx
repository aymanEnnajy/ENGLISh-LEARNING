import { useEffect, useState } from 'react';
import { useTestStore } from '../stores/testStore';
import Layout from '../components/Layout';
import { GraduationCap, ArrowRight, CheckCircle2, XCircle, RotateCcw, Brain, Zap, ChevronRight, Volume2 } from 'lucide-react';
import TTSButton from '../components/TTSButton';
import { clsx } from 'clsx';

export default function TestPage() {
  const { mode, setMode, currentWord, mcqOptions, startTest, nextQuestion, submitAnswer, feedback, correctAnswers, totalQuestions, isFinished, loading, resetTest, finishTest } = useTestStore();
  const [answer, setAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hintCount, setHintCount] = useState(0);

  const handleReset = () => {
    setAnswer('');
    setHasSubmitted(false);
    setHintCount(0);
    resetTest();
  };

  useEffect(() => {
    return () => handleReset();
  }, []);

  const handleStart = (m) => {
    setMode(m);
    startTest();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim() || hasSubmitted) return;
    
    setHasSubmitted(true);
    await submitAnswer(answer);
    
    if (totalQuestions + 1 >= 10) {
      setTimeout(() => finishTest(), 1000);
    }
  };

  const handleNext = () => {
    setAnswer('');
    setHasSubmitted(false);
    setHintCount(0);
    nextQuestion();
  };

  const handleHint = () => {
    if (hasSubmitted || !currentWord) return;

    if (hintCount === 0) {
      setAnswer(currentWord.word[0]);
      setHintCount(1);
    } else if (hintCount === 1) {
      setAnswer(currentWord.word.slice(0, 2));
      setHintCount(2);
    } else if (hintCount === 2) {
      // "I don't know" mode - reveal full word and submit as incorrect
      setAnswer(currentWord.word);
      submitAnswer(currentWord.word + " (HINT)"); // Intentional mismatch or just mark as failed
      setHasSubmitted(true);
      if (totalQuestions + 1 >= 10) {
        setTimeout(finishTest, 1000);
      }
    }
  };

  if (isFinished) {
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-12 sm:py-20 text-center animate-scale-in">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-hard">
            <GraduationCap size={44} />
          </div>
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter mb-4">Session Complete</h1>
          <p className="text-muted-foreground font-medium mb-12">Your performance has been logged to the neural archives.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="card-monochrome h-32 flex flex-col justify-center">
              <span className="text-4xl font-display font-black">{score}%</span>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Accuracy</span>
            </div>
            <div className="card-monochrome h-32 flex flex-col justify-center">
              <span className="text-4xl font-display font-black">{correctAnswers}/10</span>
              <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Retained</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleReset} className="flex-1 btn-monochrome h-14 flex items-center justify-center gap-2">
              <RotateCcw size={18} />
              <span>Next Session</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!mode) {
    return (
      <Layout>
        <div className="py-12 sm:py-20 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-secondary rounded-2xl mb-6 text-foreground">
              <Brain size={32} />
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-4">
              PRACTICE <span className="text-muted-foreground">ENGINE</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">
              Select an optimization mode to begin reinforcing your vocabulary library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'write', title: 'Active Recall', desc: 'Type the word based on its meaning. Maximum retention for high-frequency usage.', icon: Zap },
              { id: 'mcq', title: 'Pattern Recognition', desc: 'Identify the correct definition. Ideal for secondary vocabulary reinforcement.', icon: GraduationCap }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => handleStart(m.id)}
                className="card-monochrome text-left group hover:bg-black hover:text-white transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="p-3 bg-secondary text-foreground group-hover:bg-white/10 group-hover:text-white rounded-xl transition-colors">
                    <m.icon size={24} />
                  </div>
                  <ChevronRight className="text-zinc-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-2">{m.title}</h3>
                <p className="text-muted-foreground group-hover:text-zinc-400 font-medium leading-relaxed">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 sm:py-16">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest">Question {totalQuestions + 1}/10</span>
          </div>
          <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">Abort Session</button>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden mb-12">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${((totalQuestions) / 10) * 100}%` }}
          />
        </div>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-secondary rounded-xl w-3/4 mx-auto" />
            <div className="h-40 bg-secondary rounded-2xl" />
          </div>
        ) : currentWord ? (
          <div className="animate-fade-in space-y-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
                {currentWord.meaning_ar || currentWord.meaning_fr}
              </h2>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="bg-secondary px-2 py-0.5 rounded">Definition</span>
                {currentWord.meaning_ar && <span>•</span>}
                {currentWord.meaning_ar && <span>Arabic</span>}
              </div>
            </div>

            {mode === 'write' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    autoFocus
                    autoComplete="off"
                    className={clsx(
                      "w-full h-16 sm:h-20 bg-transparent text-center text-3xl sm:text-4xl font-display font-black border-b-4 focus:outline-none transition-colors",
                      (hasSubmitted && feedback) 
                        ? (feedback === 'correct' ? "border-emerald-500 text-emerald-600" : "border-rose-300 text-rose-400")
                        : "border-zinc-200 focus:border-black"
                    )}
                    placeholder="TYPE WORD"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={hasSubmitted}
                  />
                  {hasSubmitted && (
                    <div className="absolute top-1/2 right-0 -translate-y-1/2">
                      {feedback === 'correct' ? <CheckCircle2 className="text-emerald-500" size={32} /> : <XCircle className="text-rose-400" size={32} />}
                    </div>
                  )}
                </div>
                
                {!hasSubmitted && (
                  <div className="flex gap-4">
                    <button type="submit" className="flex-[2] btn-monochrome h-14">
                      Submit Word
                    </button>
                    <button 
                      type="button" 
                      onClick={handleHint}
                      className="flex-1 border-2 border-zinc-200 rounded-xl hover:bg-secondary transition-colors font-bold uppercase text-[10px] tracking-widest"
                    >
                      {hintCount === 2 ? "I DON'T KNOW" : "HINT"}
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-scale-in">
                {mcqOptions.map((option) => (
                  <button
                    key={option}
                    disabled={hasSubmitted}
                    onClick={() => { setAnswer(option); submitAnswer(option); setHasSubmitted(true); if (totalQuestions + 1 >= 10) setTimeout(finishTest, 1000); }}
                    className={clsx(
                      "h-16 rounded-2xl border-2 font-bold text-lg transition-all text-left px-6 relative group",
                      (hasSubmitted && feedback)
                        ? (option.toLowerCase() === currentWord.word.toLowerCase() 
                            ? "border-emerald-500 bg-emerald-500 text-white" 
                            : (answer === option ? "border-rose-300 bg-rose-50 text-rose-400" : "border-border opacity-50"))
                        : "border-border hover:border-black hover:bg-secondary"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {hasSubmitted && !isFinished && (
              <div className="animate-slide-up space-y-4">
                {feedback === 'incorrect' && (
                  <div className="bg-zinc-100 p-6 rounded-2xl flex items-center justify-between border-l-4 border-black">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">Correct Identity</p>
                      <p className="text-2xl font-display font-black text-black">{currentWord.word}</p>
                    </div>
                    <TTSButton text={currentWord.word} className="!text-black" />
                  </div>
                )}
                <button
                  onClick={handleNext}
                  autoFocus
                  className="w-full btn-monochrome h-16 flex items-center justify-center gap-2 group"
                >
                  <span>Continue Protocol</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
