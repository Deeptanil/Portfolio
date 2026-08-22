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
      <div className="w-64 sm:w-80 space-y-4 font-mono text-center select-none bg-[#3c3c3c]/90 p-4 border-2 border-black">
        
        {/* Loading Label */}
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold tracking-wider uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)]">
          {`Loading World... ${clampedProgress.toFixed(0)}%`}
        </div>

        {/* Flat Loading Bar without inverted borders */}
        <div className="w-full bg-[#1c1c1c] border-2 border-black h-4 p-[2px]">
          <div
            className="h-full bg-[#55ff55] transition-all duration-300 ease-out"
            style={{
              width: `${clampedProgress}%`,
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProgressLoader), { ssr: false });
