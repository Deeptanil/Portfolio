'use client';

import dynamic from 'next/dynamic';

const ProgressLoader = ({ progress }: { progress: number }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none z-50 transition-opacity duration-1000"
      style={{
        opacity: progress === 100 ? 0 : 1,
      }}
    >
      {/* Minecraft Button Styled Panel */}
      <div
        className="w-72 sm:w-88 space-y-4 font-minecraft text-center select-none p-5"
        style={{
          background: '#747474',
          border: '2px solid #000000',
          boxShadow: 'inset -2px -2px 0px 0px #373737, inset 2px 2px 0px 0px #ffffff',
          imageRendering: 'pixelated',
        }}
      >
        {/* Crisp White Minecraft Loading Text (No Yellow) */}
        <div
          className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase"
          style={{
            textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
            fontFamily: "'Minecraft', monospace",
          }}
        >
          {`Loading World... ${clampedProgress.toFixed(0)}%`}
        </div>

        {/* Minecraft Progress Bar Track */}
        <div
          style={{
            background: '#000000',
            border: '2px solid #373737',
            boxShadow: 'inset 2px 2px 0px 0px #000000',
            height: '16px',
            width: '100%',
            padding: '2px',
            imageRendering: 'pixelated',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#55ff55',
              boxShadow: 'inset 0px 2px 0px 0px #aaffaa, inset 0px -2px 0px 0px #00aa00',
              width: `${clampedProgress}%`,
              transition: 'width 0.2s ease-out',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProgressLoader), { ssr: false });
