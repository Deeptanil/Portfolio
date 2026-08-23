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
      <div className="flex flex-col items-center justify-center space-y-4 font-minecraft-regular text-center select-none">
        
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
