'use client';

import { useEffect, useRef, useState } from 'react';

const SoundToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const toggleSound = () => {
    if (!isPlaying) {
      startAmbientSound();
      setIsPlaying(true);
    } else {
      stopAmbientSound();
      setIsPlaying(false);
    }
  };

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft ambient harmonic chords (C minor 9th pad: C, Eb, G, Bb, D)
      const frequencies = [130.81, 155.56, 196.00, 233.08, 293.66];
      const oscillators: OscillatorNode[] = [];

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();

        oscillators.push(osc);
      });

      oscillatorsRef.current = oscillators;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  const stopAmbientSound = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
      }, 400);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-xs font-mono tracking-wider text-white/80 hover:text-white hover:border-white/50 transition-all duration-300 group"
      title="Toggle Ambient Audio"
    >
      <div className="flex items-center gap-0.5 h-4 w-4 justify-center">
        {isPlaying ? (
          <>
            <span className="w-0.5 bg-purple-400 rounded-full animate-bar-1" />
            <span className="w-0.5 bg-indigo-400 rounded-full animate-bar-2" />
            <span className="w-0.5 bg-blue-400 rounded-full animate-bar-3" />
            <span className="w-0.5 bg-cyan-400 rounded-full animate-bar-4" />
          </>
        ) : (
          <span className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
        )}
      </div>
      <span>{isPlaying ? 'SOUND [ON]' : 'SOUND [OFF]'}</span>
    </button>
  );
};

export default SoundToggle;
