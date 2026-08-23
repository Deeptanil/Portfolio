'use client';

import { isMobile } from "react-device-detect";
import { useScrollStore } from "@stores";

// A persistent, always-reachable shortcut for visitors (recruiters skimming quickly, in
// particular) who don't want to scroll/explore the full 3D scene — jumps straight to the
// Experience section instead of making them hunt for it.
const SkipToExperienceButton = () => {
  const requestSkipToEnd = useScrollStore((state) => state.requestSkipToEnd);
  // On mobile the ScrollHint's "SCROLL DOWN TO EXPLORE" pill spans wide across the bottom
  // for its first ~10s — sit well above it there to avoid crowding; desktop has plenty of
  // room next to the centered, narrower hint.
  const positionClass = isMobile ? 'bottom-20 right-2' : 'bottom-6 right-6';

  return (
    <div className={`fixed ${positionClass}`} style={{ opacity: 1, zIndex: 50 }} suppressHydrationWarning>
      <button
        type="button"
        onClick={requestSkipToEnd}
        title="Skip straight to the Experience section"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
        style={{
          backgroundColor: '#747474',
          border: '2px solid #000000',
          boxShadow: 'inset -2px -2px 0px 0px #373737, inset 2px 2px 0px 0px #ffffff',
          imageRendering: 'pixelated',
        }}
      >
        <span style={{ textShadow: '2px 2px 0px #373737' }}>Skip to Experience</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </button>
    </div>
  );
};

export default SkipToExperienceButton;
