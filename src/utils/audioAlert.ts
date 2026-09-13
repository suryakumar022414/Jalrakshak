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
    playPAChime();
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => 
      v.lang.includes('hi') || v.name.toLowerCase().includes('hindi') || v.lang.includes('IN')
    );

    // 1. English Announcement
    const englishText = status === 'UNSAFE'
      ? "Caution! Water status is UNSAFE and contaminated. You MUST NOT drink this water. High risk individuals must not drink this water!"
      : "Attention! Water is SAFE and within screening range. You can drink this water! Healthy adults and community members can safely drink this water.";

    // 2. Clear Hindi Announcement (with phonetic fallback so every browser TTS voice speaks Hindi words aloud!)
    const hindiText = status === 'UNSAFE'
      ? (hindiVoice
          ? "सावधान! पानी दूषित और असुरक्षित है। आप यह पानी बिल्कुल न पिएं! छोटे बच्चे, गर्भवती महिलाएँ, बुजुर्ग और बीमार लोग यह पानी बिल्कुल न पिएं!"
          : "Chetaavni! Yeh paani unsafe aur contaminated hai! Aap yeh paani bilkul mat pijiye! Children, pregnant women, elderly, and sick people must not drink this water!")
      : (hindiVoice
          ? "सूचना! पानी पीने के लिए बिल्कुल सुरक्षित है। आप यह पानी पी सकते हैं! सभी लोग और ग्रामीण यह पानी सुरक्षित रूप से पी सकते हैं।"
          : "Soochna! Water is safe! Aap yeh paani peesakte hain! Yeh paani peene ke liye bilkul safe hai! All healthy people can drink this water.");

    // Create English Utterance
    const engUtterance = new SpeechSynthesisUtterance(englishText);
    engUtterance.lang = 'en-US';
    engUtterance.pitch = 0.85;
    engUtterance.rate = 0.90;
    engUtterance.volume = 1.0;

    // Create Hindi Utterance
    const hiUtterance = new SpeechSynthesisUtterance(hindiText);
    hiUtterance.lang = hindiVoice ? 'hi-IN' : 'en-IN';
    hiUtterance.pitch = 0.88;
    hiUtterance.rate = 0.85;
    hiUtterance.volume = 1.0;

    const engVoice = voices.find(v => v.lang.startsWith('en'));
    if (engVoice) engUtterance.voice = engVoice;
    if (hindiVoice) hiUtterance.voice = hindiVoice;

    let hindiSpoken = false;

    const speakHindiPart = () => {
      if (hindiSpoken) return;
      hindiSpoken = true;
      try {
        window.speechSynthesis.speak(hiUtterance);
      } catch (err) {
        console.warn("Error playing Hindi utterance:", err);
      }
    };

    // Chain Hindi announcement to play EXACTLY when English speech completes!
    engUtterance.onend = () => {
      speakHindiPart();
    };

    engUtterance.onerror = () => {
      speakHindiPart();
    };

    // Fallback timer in case Chrome onend event drops
    setTimeout(() => {
      window.speechSynthesis.speak(engUtterance);
    }, 350);

    // Backup safety trigger for Hindi if onend doesn't fire after 5 seconds
    setTimeout(() => {
      speakHindiPart();
    }, 5500);

  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};

export const playHindiVoiceAlert = (status: 'UNSAFE' | 'SAFE') => {
  speakMultilingualMaleAlert(status);
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
      return;
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
