'use client';

import dynamic from 'next/dynamic';

const ProgressLoader = ({ progress }: { progress: number }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-50 transition-opacity duration-700 select-none"
      style={{
        opacity: progress === 100 ? 0 : 1,
        pointerEvents: progress === 100 ? 'none' : 'auto',
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
