export function useTTS() {
  const speak = (text, rateSource = 0.9) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rateSource;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}
