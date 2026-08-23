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
      <div
        className="w-64 sm:w-80 space-y-3 font-mono text-center select-none p-4"
        style={{
          background: '#3c3c3c',
          border: '2px solid #000',
          boxShadow: 'inset -2px -2px 0px 0px #1a1a1a, inset 2px 2px 0px 0px #8b8b8b',
          imageRendering: 'pixelated',
        }}
      >
        {/* Loading Label */}
        <div
          className="text-[#ffff55] text-xs sm:text-sm font-bold tracking-wider uppercase"
          style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.9)' }}
        >
          {`Loading World... ${clampedProgress.toFixed(0)}%`}
        </div>

        {/* Minecraft-styled loading bar */}
        <div
          style={{
            background: '#1c1c1c',
            border: '2px solid #000',
            boxShadow: 'inset 2px 2px 0px 0px #0a0a0a',
            height: '14px',
            width: '100%',
            padding: '2px',
            imageRendering: 'pixelated',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#55ff55',
              width: `${clampedProgress}%`,
              transition: 'width 0.3s ease-out',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProgressLoader), { ssr: false });
