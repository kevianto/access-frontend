import { useCallback } from 'react';

const useSpeech = () => {
  const speak = useCallback((text, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a high-quality "natural" voice
    const voices = window.speechSynthesis.getVoices();
    
    // Preferences: 1. Google US English, 2. Microsoft Jenny (Azure), 3. Any English/Swahili voice
    let selectedVoice = voices.find(v => v.name.includes('Google US English')) ||
                        voices.find(v => v.name.includes('Jenny')) ||
                        voices.find(v => v.lang.startsWith(lang.split('-')[0]));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = lang;
    utterance.rate = 0.95; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};

export default useSpeech;
