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
      <div className="w-56 sm:w-72 space-y-3 font-mono text-center">
        <div className="w-full bg-black/70 border-2 border-[#8b653a] h-3 rounded overflow-hidden p-[1px] shadow-2xl">
          <div
            className="h-full bg-[#ffff55] transition-all duration-300 ease-out"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
        <div className="text-[#ffff55] text-xs sm:text-sm font-bold tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {`Loading World... ${clampedProgress.toFixed(0)}%`}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProgressLoader), { ssr: false });
