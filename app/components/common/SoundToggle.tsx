'use client';

import { useEffect, useRef, useState } from 'react';

// Iconic C418 Sweden / Subwoofer Lullaby pentatonic note sequence (frequencies in Hz)
// D4, E4, F#4, A4, B4, D5, E5, F#5
const C418_MELODY_NOTES = [
  293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99,
  440.00, 369.99, 293.66, 220.00, 146.83
];

const SoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    if (!isPlaying) {
      startMinecraftSoundtrack();
      setIsPlaying(true);
    } else {
      stopMinecraftSoundtrack();
      setIsPlaying(false);
    }
  };

  const playPianoNote = (ctx: AudioContext, freq: number) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Triangle/sine blend for warm Minecraft electric piano tone
      osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);

      // C418 soft piano envelope: fast attack, long gentle decay
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.3);
    } catch {}
  };

  const startMinecraftSoundtrack = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      let noteIdx = 0;

      const scheduleNextNote = () => {
        if (!audioCtxRef.current) return;
        
        const freq = C418_MELODY_NOTES[noteIdx % C418_MELODY_NOTES.length];
        playPianoNote(ctx, freq);
        
        // Also play a soft bass note occasionally
        if (noteIdx % 3 === 0) {
          playPianoNote(ctx, freq / 2);
        }

        noteIdx++;
        // Sparse Minecraft timing: 1.8s to 3.5s delay between notes
        const delay = 1800 + Math.random() * 1600;
        timerRef.current = setTimeout(scheduleNextNote, delay);
      };

      scheduleNextNote();
    } catch (e) {
      console.warn("Web Audio API error", e);
    }
  };

  const stopMinecraftSoundtrack = () => {
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
      stopMinecraftSoundtrack();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-lg border border-amber-400/40 bg-black/60 backdrop-blur-md text-xs font-mono tracking-widest text-amber-200 hover:text-white hover:border-amber-400 transition-all duration-300 shadow-lg shadow-amber-950/20 group"
      title="Toggle C418 Minecraft Ambient Piano"
    >
      <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-amber-400 rounded-sm animate-bar-1" />
            <span className="w-0.5 bg-yellow-300 rounded-sm animate-bar-2" />
            <span className="w-0.5 bg-amber-500 rounded-sm animate-bar-3" />
            <span className="w-0.5 bg-orange-400 rounded-sm animate-bar-4" />
          </>
        ) : (
          <span className="w-2 h-2 rounded-sm bg-amber-400/50 group-hover:bg-amber-300 transition-colors" />
        )}
      </div>
      <span>{isPlaying ? 'MINECRAFT MUSIC [ON]' : 'MINECRAFT MUSIC [OFF]'}</span>
    </button>
  );
};

export default SoundToggle;
