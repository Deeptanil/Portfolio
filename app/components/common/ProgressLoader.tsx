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
        className="w-72 sm:w-88 space-y-3 font-minecraft text-center select-none p-5"
        style={{
          background: '#c6c6c6',
          border: '3px solid #000',
          boxShadow: 'inset -3px -3px 0px 0px #555555, inset 3px 3px 0px 0px #ffffff',
          imageRendering: 'pixelated',
        }}
      >
        {/* Official Minecraft Yellow Loading Text */}
        <div
          className="text-[#ffff55] text-sm sm:text-base font-bold tracking-wide uppercase"
          style={{
            textShadow: '2px 2px 0px #3f3f00',
            fontFamily: "'Minecraft', 'Minecraftia', monospace",
          }}
        >
          {`Loading World... ${clampedProgress.toFixed(0)}%`}
        </div>

        {/* Authentic Minecraft XP / Progress Bar */}
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
