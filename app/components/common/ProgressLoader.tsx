'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ProgressLoader = ({ progress }: { progress: number }) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const simProgressRef = useRef(0);

  useEffect(() => {
    // Optimistic progress ticker: trickles forward continuously so it never feels stuck
    const interval = setInterval(() => {
      simProgressRef.current = Math.min(
        95,
        simProgressRef.current + (simProgressRef.current < 40 ? 2.5 : simProgressRef.current < 75 ? 1.2 : 0.4)
      );

      setDisplayProgress((prev) => {
        const actualClamped = Math.min(100, Math.round(progress));
        if (actualClamped === 100) return 100;
        return Math.max(prev, actualClamped, Math.round(simProgressRef.current));
      });
    }, 80);

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
        backgroundImage: "url('/minecraft_dirt.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        imageRendering: "pixelated",
      }}
      suppressHydrationWarning
    >
      {/* Heavy Radial Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.88)_65%,rgba(0,0,0,0.98)_100%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 font-minecraft-regular text-center select-none">
        
        {/* Line 1: Loading level */}
        <div
          className="text-white text-lg sm:text-xl font-normal tracking-wide"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
            fontFamily: "'MinecraftRegular', 'Minecraft', monospace",
          }}
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
        >
          <div
            style={{
              height: '100%',
              background: '#80ff20',
              width: `${displayProgress}%`,
              transition: 'width 0.15s ease-out',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProgressLoader), { ssr: false });
