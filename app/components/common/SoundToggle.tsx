'use client';

import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { usePathname } from 'next/navigation';
import { useSoundStore } from '@stores';

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
  const isPlaying = useSoundStore((state) => state.isPlaying);
  const setIsPlaying = useSoundStore((state) => state.setIsPlaying);
  const pathname = usePathname();

  const [isActivelyPlaying, setIsActivelyPlaying] = useState(false);
  const isPlayingRef = useRef(false); // ref mirrors state so handlers always read current value
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref updated with store state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    if (!isPlaying) {
      stopSubwooferLullaby();
    }
  }, [isPlaying]);

  const toggleSound = () => {
    if (!isPlaying || !isActivelyPlaying) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      startSubwooferLullaby();
    } else {
      isPlayingRef.current = false;
      setIsPlaying(false);
      stopSubwooferLullaby();
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
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().then(() => {
          setIsActivelyPlaying(true);
        }).catch(() => {});
      } else {
        setIsActivelyPlaying(true);
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          setIsActivelyPlaying(true);
        }).catch(() => {});
      } else {
        setIsActivelyPlaying(true);
      }

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
    setIsActivelyPlaying(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  // Register first-user-interaction listener ONCE on mount only.
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (isPlayingRef.current) {
        startSubwooferLullaby();
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('touchend', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      stopSubwooferLullaby();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('touchend', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const isAboutOrWork = pathname === '/about' || pathname === '/work';
  const positionClass = isAboutOrWork
    ? 'top-4 right-4 sm:top-6 sm:right-6'
    : isMobile
    ? 'top-2 left-2'
    : 'top-6 left-6';

  const showActivePlayingIcon = isPlaying && isActivelyPlaying;

  return (
    <div className={`fixed ${positionClass}`} style={{ opacity: 1, zIndex: 50 }} suppressHydrationWarning>
      <div className="flex items-center justify-center">
        <a
          onClick={toggleSound}
          className="hover:cursor-pointer flex items-center justify-center"
          title={showActivePlayingIcon ? "Mute Sound" : "Enable Sound"}
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
            {showActivePlayingIcon ? (
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
