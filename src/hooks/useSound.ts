import { useRef, useCallback } from "react";
import { STORAGE_KEYS } from "@/config/constants";

export type SoundType = "start" | "pause" | "stop" | "achievement" | "mountain";

interface AudioContextWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
  const audioContextCtor = window.AudioContext || (window as AudioContextWindow).webkitAudioContext;
  if (!audioContextCtor) return;

  const audioContext = new audioContextCtor();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

const playSequence = (notes: { freq: number; duration: number; delay: number }[]) => {
  notes.forEach((note) => {
    setTimeout(() => {
      createBeep(note.freq, note.duration);
    }, note.delay);
  });
};

export const useSound = () => {
  const enabledRef = useRef(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== "false";
  });

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current()) return;

    switch (type) {
      case "start":
        playSequence([
          { freq: 440, duration: 0.1, delay: 0 },
          { freq: 554, duration: 0.15, delay: 100 },
        ]);
        break;

      case "pause":
        createBeep(440, 0.15);
        break;

      case "stop":
        playSequence([
          { freq: 554, duration: 0.1, delay: 0 },
          { freq: 440, duration: 0.15, delay: 100 },
        ]);
        break;

      case "achievement":
        playSequence([
          { freq: 523, duration: 0.1, delay: 0 },
          { freq: 659, duration: 0.1, delay: 100 },
          { freq: 784, duration: 0.2, delay: 200 },
        ]);
        break;

      case "mountain":
        playSequence([
          { freq: 523, duration: 0.15, delay: 0 },
          { freq: 659, duration: 0.15, delay: 150 },
          { freq: 784, duration: 0.15, delay: 300 },
          { freq: 1047, duration: 0.3, delay: 450 },
        ]);
        break;
    }
  }, []);

  const toggleSound = useCallback(() => {
    const current = enabledRef.current();
    const newValue = !current;
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(newValue));
    enabledRef.current = () => newValue;
    return newValue;
  }, []);

  const isSoundEnabled = useCallback(() => enabledRef.current(), []);

  return {
    playSound,
    toggleSound,
    isSoundEnabled,
  };
};
