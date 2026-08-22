'use client';

import { useEffect, useRef, useState } from 'react';

// Exact C418 "Subwoofer Lullaby" main theme note sequence (frequencies in Hz)
const SUBWOOFER_LULLABY_NOTES = [
  { freq: 311.13, duration: 0.8 }, // Eb4
  { freq: 392.00, duration: 0.8 }, // G4
  { freq: 466.16, duration: 0.8 }, // Bb4
  { freq: 622.25, duration: 1.2 }, // Eb5
  { freq: 587.33, duration: 1.2 }, // D5
  { freq: 466.16, duration: 0.8 }, // Bb4
  { freq: 392.00, duration: 0.8 }, // G4
  { freq: 349.23, duration: 0.8 }, // F4
  { freq: 311.13, duration: 1.6 }, // Eb4

  { freq: 392.00, duration: 0.8 }, // G4
  { freq: 466.16, duration: 0.8 }, // Bb4
  { freq: 587.33, duration: 1.2 }, // D5
  { freq: 523.25, duration: 1.2 }, // C5
  { freq: 466.16, duration: 0.8 }, // Bb4
  { freq: 392.00, duration: 1.6 }, // G4
];

const SoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    if (!isPlaying) {
      startSubwooferLullaby();
      setIsPlaying(true);
    } else {
      stopSubwooferLullaby();
      setIsPlaying(false);
    }
  };

  const playSubwooferNote = (ctx: AudioContext, freq: number) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Soft triangle tone for warm electric piano feel
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);

      // Subwoofer Lullaby soft attack & warm decay envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.1);
    } catch {}
  };

  const startSubwooferLullaby = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      let noteIdx = 0;

      const scheduleNextNote = () => {
        if (!audioCtxRef.current) return;
        
        const note = SUBWOOFER_LULLABY_NOTES[noteIdx % SUBWOOFER_LULLABY_NOTES.length];
        playSubwooferNote(ctx, note.freq);
        
        // Play soft sub-bass harmony note occasionally
        if (noteIdx % 4 === 0) {
          playSubwooferNote(ctx, note.freq / 2);
        }

        noteIdx++;
        // Subwoofer Lullaby tempo delay
        const delay = note.duration * 1000 + 400;
        timerRef.current = setTimeout(scheduleNextNote, delay);
      };

      scheduleNextNote();
    } catch (e) {
      console.warn("Web Audio API error", e);
    }
  };

  const stopSubwooferLullaby = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopSubwooferLullaby();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="fixed top-6 left-6 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-xs font-sans tracking-wider text-white/90 hover:text-white hover:border-white/50 transition-all duration-300 shadow-xl group"
      title="Toggle Subwoofer Lullaby Audio"
    >
      <div className="flex items-center gap-0.5 h-3.5 w-3.5 justify-center">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-rose-400 rounded-full animate-bar-1" />
            <span className="w-0.5 bg-amber-400 rounded-full animate-bar-2" />
            <span className="w-0.5 bg-purple-400 rounded-full animate-bar-3" />
            <span className="w-0.5 bg-pink-400 rounded-full animate-bar-4" />
          </>
        ) : (
          <span className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white transition-colors" />
        )}
      </div>
      <span>{isPlaying ? 'SOUND [ON]' : 'SOUND [OFF]'}</span>
    </button>
  );
};

export default SoundToggle;
