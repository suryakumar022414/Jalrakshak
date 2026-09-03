'use client';

let sirenOscillator: OscillatorNode | null = null;
let audioCtx: AudioContext | null = null;

// Play Public Address (P.A.) Chime before village announcements
export const playPAChime = () => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Chime 1 (High tone)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Chime 2 (Lower tone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, now + 0.25); // C5
    gain2.gain.setValueAtTime(0.2, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.8);

  } catch (e) {
    console.warn('P.A. chime error:', e);
  }
};

export const speakMultilingualMaleAlert = (status: 'UNSAFE' | 'SAFE') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Play village loudspeaker P.A. chime
    playPAChime();

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Phrasing tailored for rural & mining kiosk public address in Jharkhand
    const phrases = status === 'UNSAFE'
      ? [
          "सावधान! ध्यान दें। यह पानी दूषित है और पीने के लिए सुरक्षित नहीं है। कृपया पानी न पिएं।",
          "Khabardaar! Yeh paani peene ke laayaq nahi hai. Sehat ke liye khatarnaak hai.",
          "Danger! Water is contaminated and unsafe for drinking. Do not use!"
        ]
      : [
          "सूचना! पानी की जाँच पूरी हो चुकी है। यह पानी साफ़ और पीने के लिए बिल्कुल सुरक्षित है।",
          "Soochna! Yeh paani bilkul saaf aur mahfooz hai.",
          "Notice! Water parameters are normal. Water is safe for drinking."
        ];

    const fullText = phrases.join(" ... ");
    const utterance = new SpeechSynthesisUtterance(fullText);

    // Male voice settings: lower pitch (0.75 - 0.82) gives an authoritative, deep male public-address voice
    utterance.pitch = 0.80; // Deep male pitch
    utterance.rate = 0.88;  // Clear, deliberate pace for rural loudspeakers
    utterance.volume = 1.0;

    // Search for explicit Hindi / Male voices available in browser
    const voices = window.speechSynthesis.getVoices();
    
    // Priority search for Male / Hindi / Indian voices
    const maleHindiVoice = voices.find(v => 
      (v.lang.includes('hi') || v.lang.includes('IN') || v.name.toLowerCase().includes('hindi')) &&
      (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('karan') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('google'))
    );

    const genericMaleVoice = voices.find(v =>
      v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('george')
    );

    const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN'));

    if (maleHindiVoice) {
      utterance.voice = maleHindiVoice;
    } else if (genericMaleVoice) {
      utterance.voice = genericMaleVoice;
    } else if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    // Delay slightly for P.A. chime to complete
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 400);

  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};

/**
 * Audio / Voice alert simulator for illiteracy accessibility in rural villages (DFPlayer Mini simulation).
 * Triggers exact Hindi voice output:
 * Safe: "पानी पीने के लिए सुरक्षित है।"
 * Unsafe: "चेतावनी! पानी असुरक्षित है, कृपया प्रतीक्षा करें।"
 */
export const playHindiVoiceAlert = (status: 'UNSAFE' | 'SAFE') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    playPAChime();
    window.speechSynthesis.cancel();

    const hindiText = status === 'SAFE'
      ? "पानी पीने के लिए सुरक्षित है।"
      : "चेतावनी! पानी असुरक्षित है, कृपया प्रतीक्षा करें।";

    const utterance = new SpeechSynthesisUtterance(hindiText);
    utterance.lang = 'hi-IN';
    utterance.pitch = 0.9;
    utterance.rate = 0.85;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 350);
  } catch (e) {
    console.warn('Hindi voice alert error:', e);
  }
};

export const startSirenAudio = () => {
  if (typeof window === 'undefined') return;

  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (sirenOscillator) {
      return; // Already playing
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    osc.frequency.linearRampToValueAtTime(880, now + 0.5);
    osc.frequency.linearRampToValueAtTime(440, now + 1.0);

    gain.gain.setValueAtTime(0.12, now);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    sirenOscillator = osc;
  } catch (e) {
    console.warn('Audio Siren error:', e);
  }
};

export const stopSirenAudio = () => {
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch {
      // ignore
    }
    sirenOscillator = null;
  }
};
