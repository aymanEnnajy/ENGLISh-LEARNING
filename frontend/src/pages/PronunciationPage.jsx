import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Mic, MicOff, RefreshCw, Volume2, CheckCircle, XCircle, Brain, Play } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useVocabularyStore } from '../stores/vocabularyStore';
import TTSButton from '../components/TTSButton';

const PronunciationPage = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [aiSentence, setAiSentence] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState(null); // { score, match, text }
  const recognitionRef = useRef(null);

  const [speechRate, setSpeechRate] = useState(0.8);

  useEffect(() => {
    fetchNewWord();
    
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        verifyPronunciation(result);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error: ' + event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      toast.error('Your browser does not support speech recognition.');
    }
  }, []);

  const fetchNewWord = async () => {
    setIsGenerating(true);
    setFeedback(null);
    setTranscript('');
    try {
      const { data } = await api.get('/words/random');
      setCurrentWord(data.word);
      generateSentence(data.word);
    } catch (err) {
      toast.error('Failed to fetch a word. Please add some vocabulary first.');
      setIsGenerating(false);
    }
  };

  const generateSentence = async (word) => {
    try {
      const { data } = await api.post('/ai/generate-sentence', {
        word: word.word,
        meaning: word.meaning_en || word.meaning_ar || word.meaning_fr
      });
      setAiSentence(data.sentence);
    } catch (err) {
      setAiSentence(`I am using the word "${word.word}" in a sentence.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      setFeedback(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const verifyPronunciation = (spokenText) => {
    const target = aiSentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const spoken = spokenText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    
    // Simple comparison for now
    if (spoken === target) {
      setFeedback({ match: true, text: 'Perfect! Natural pronunciation.' });
      toast.success('Excelent pronunciation!');
    } else {
      // Check if the main word is included
      if (spoken.includes(currentWord.word.toLowerCase())) {
        setFeedback({ match: 'partial', text: 'Good! But try to be clearer with the whole sentence.' });
      } else {
        setFeedback({ match: false, text: "I didn't quite catch that. Try again!" });
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-black text-white rounded-2xl mb-6 shadow-hard">
            <Mic size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter uppercase mb-3">
            Oral <span className="text-muted-foreground">Optimizer</span>
          </h1>
          <p className="text-muted-foreground font-medium">Practice your pronunciation with AI-generated context.</p>
        </header>

        <div className="card-monochrome overflow-hidden shadow-hard">
          <div className="p-8 sm:p-12 text-center">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 py-12">
                <RefreshCw className="animate-spin text-muted-foreground" size={40} />
                <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">AI is crafting your challenge...</p>
              </div>
            ) : currentWord ? (
              <div className="space-y-10">
                {/* Target Section */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">Target word: <span className="text-foreground">{currentWord.word}</span></span>
                  <div className="relative inline-block">
                    <h2 className="text-3xl sm:text-4xl font-display font-black mb-4">"{aiSentence}"</h2>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex justify-center gap-3">
                        <TTSButton 
                          text={aiSentence} 
                          rate={speechRate}
                          className="bg-black text-white p-4 rounded-full hover:scale-110 transition-all shadow-hard" 
                        />
                      </div>
                      <div className="flex items-center gap-2 bg-secondary p-1 rounded-xl border border-zinc-200">
                        {[0.5, 0.8, 1.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => setSpeechRate(rate)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                              speechRate === rate 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {rate === 0.5 ? 'Slow' : rate === 0.8 ? 'Normal' : 'Fast'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interaction Section */}
                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={toggleListening}
                    disabled={isGenerating}
                    className={`group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-hard ${
                      isListening 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-black text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                    {isListening && (
                      <span className="absolute inset-0 rounded-full border-4 border-rose-500 animate-ping opacity-25"></span>
                    )}
                  </button>
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                    {isListening ? 'Listening...' : 'Tap the mic to start speaking'}
                  </p>
                </div>

                {/* Feedback Section */}
                {(transcript || feedback) && (
                  <div className={`mt-8 p-6 rounded-2xl border-2 transition-all duration-500 ${
                    feedback?.match === true ? 'bg-emerald-50/50 border-emerald-500' : 
                    feedback?.match === 'partial' ? 'bg-amber-50/50 border-amber-500' :
                    feedback ? 'bg-rose-50/50 border-rose-500' : 'bg-secondary/50 border-zinc-200'
                  }`}>
                    {transcript && (
                      <div className="mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">What I heard:</span>
                        <p className="text-lg italic font-medium">"{transcript}"</p>
                      </div>
                    )}
                    {feedback && (
                      <div className="flex items-center gap-3">
                        {feedback.match === true ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
                        <span className="font-bold text-sm">{feedback.text}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="bg-secondary p-4 flex justify-between items-center border-t-2 border-zinc-100">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Brain size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Powered by Llama 3</span>
            </div>
            <button
              onClick={fetchNewWord}
              disabled={isGenerating}
              className="px-4 py-2 bg-white rounded-xl border-2 border-black hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2"
            >
              <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
              Next Challenge
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card-monochrome p-6 border-zinc-100 italic text-sm text-muted-foreground">
            "Repeat the sentence naturally. Our AI tracks both the vocabulary accuracy and the flow of your speech."
          </div>
          <div className="card-monochrome p-6 border-zinc-100 italic text-sm text-muted-foreground">
            "Use the speaker icon to listen to the correct pronunciation before you try your version."
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PronunciationPage;
