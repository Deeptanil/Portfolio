'use client';

import { useEffect, useRef, useState } from 'react';

const ProgressLoader = ({ progress }: { progress: number }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const simProgressRef = useRef(0);

  useEffect(() => {
    // Optimistic progress ticker: trickles forward continuously so it never feels stuck.
    // It exists purely to smooth out chunky real-progress jumps (e.g. a big glTF landing
    // all at once) — it must never outrun how fast assets are actually loading, so the
    // step size scales with elapsed time instead of a fixed multi-second floor.
    const start = performance.now();
    const interval = setInterval(() => {
      const elapsedMs = performance.now() - start;
      // Reaches 95% in ~900ms — fast enough to feel instant on cached/fast loads,
      // still smooth if real `progress` lags behind.
      simProgressRef.current = Math.min(95, (elapsedMs / 900) * 95);

      setDisplayProgress((prev) => {
        const actualClamped = Math.min(100, Math.round(progress));
        if (actualClamped === 100) return 100;
        return Math.max(prev, actualClamped, Math.round(simProgressRef.current));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress]);

  useEffect(() => {
    if (progress === 100) {
      setDisplayProgress(100);
    }
  }, [progress]);

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-50 transition-opacity duration-700 select-none"
      style={{
        opacity: displayProgress === 100 ? 0 : 1,
        pointerEvents: displayProgress === 100 ? 'none' : 'auto',
        backgroundColor: "#402c1b",
        backgroundImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.98) 100%), url('/minecraft_dirt.webp')",
        backgroundRepeat: "no-repeat, repeat",
        backgroundSize: "cover, 256px 256px",
        imageRendering: "pixelated",
      }}
      suppressHydrationWarning
    >
      {/* Heavy Radial Vignette Overlay with inline style for 100% reliable SSR/refresh rendering */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.98) 100%)',
        }}
        suppressHydrationWarning
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 font-minecraft-regular text-center select-none" suppressHydrationWarning>
        
        {/* Line 1: Loading level */}
        <div
          className="text-white text-lg sm:text-xl font-normal tracking-wide"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
            fontFamily: "'MinecraftRegular', 'Minecraft', monospace",
          }}
          suppressHydrationWarning
        >
          Loading level
        </div>

        {/* Line 2: Building terrain */}
        <div
          className="text-white text-lg sm:text-xl font-normal tracking-wide"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
            fontFamily: "'MinecraftRegular', 'Minecraft', monospace",
          }}
          suppressHydrationWarning
        >
          Building terrain
        </div>

        {/* Thin Minecraft Progress Bar */}
        <div
          className="w-56 sm:w-64 mt-1"
          style={{
            background: '#555555',
            height: '4px',
            imageRendering: 'pixelated',
          }}
          suppressHydrationWarning
        >
          <div
            style={{
              height: '100%',
              background: '#80ff20',
              width: `${displayProgress}%`,
              transition: 'width 0.15s ease-out',
              imageRendering: 'pixelated',
            }}
            suppressHydrationWarning
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressLoader;
