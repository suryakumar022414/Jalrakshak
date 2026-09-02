'use client';

let sirenOscillator: OscillatorNode | null = null;
let audioCtx: AudioContext | null = null;

export const speakMultilingualAlert = (status: 'UNSAFE' | 'SAFE') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const phrases = status === 'UNSAFE'
      ? [
          "Paani surakshit nahin hai.",
          "Paani mahfooz nahi hai.",
          "Water is not safe."
        ]
      : [
          "Paani surakshit hai.",
          "Paani mahfooz hai.",
          "Water is safe."
        ];

    // Combine phrases into a clear sequence
    const fullText = phrases.join(" ... ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
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

    gain.gain.setValueAtTime(0.15, now);

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
