'use client';

import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

// C418 "Subwoofer Lullaby" main theme note sequence (frequencies in Hz)
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
  const [isPlaying, setIsPlaying] = useState(true);
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

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);

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
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      let noteIdx = 0;

      const scheduleNextNote = () => {
        if (!audioCtxRef.current) return;
        
        const note = SUBWOOFER_LULLABY_NOTES[noteIdx % SUBWOOFER_LULLABY_NOTES.length];
        playSubwooferNote(ctx, note.freq);
        
        if (noteIdx % 4 === 0) {
          playSubwooferNote(ctx, note.freq / 2);
        }

        noteIdx++;
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
    const handleFirstUserInteraction = () => {
      if (isPlaying && !audioCtxRef.current) {
        startSubwooferLullaby();
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('scroll', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      stopSubwooferLullaby();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, [isPlaying]);

  const positionClass = isMobile ? 'top-2 left-2' : 'top-6 left-6';

  return (
    <div className={`fixed ${positionClass}`} style={{ opacity: 1, zIndex: 50 }}>
      <div className="flex items-center justify-center">
        <a
          onClick={toggleSound}
          className="hover:cursor-pointer flex items-center justify-center"
          title={isPlaying ? "Mute Sound" : "Enable Sound"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-white"
          >
            {isPlaying ? (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            ) : (
              <>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <line x1="23" y1="1" x2="1" y2="23" stroke="#ff4d4d" strokeWidth="2.5" />
              </>
            )}
          </svg>
        </a>
      </div>
    </div>
  );
};

export default SoundToggle;
