'use client';

import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";
import { useScrollStore, useThemeStore } from "@stores";

export const ScrollHint = () => {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const isSunset = useThemeStore((state) => state.theme.type === 'sunset');

  const hintText = 'SCROLL';
  const showScrollHint = scrollProgress === 0;

  const textColor = isSunset ? 'text-[#1a0933]' : 'text-white';

  useEffect(() => {
    if (showScrollHint) {
      gsap.to('.scroll-hint', {
        opacity: 1,
        duration: 1.5,
        delay: 1.5,
      });
    } else {
      gsap.killTweensOf('.scroll-hint');
      gsap.to('.scroll-hint', {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [showScrollHint]);

  return (
    <div className="fixed w-full bottom-5 scroll-hint pointer-events-none" style={{ opacity: 0, zIndex: 10 }}>
      <div className="flex items-center justify-center gap-2 animate-pulse">
        <Image
          src="icons/chevrons-up-down.svg"
          width={18}
          height={18}
          alt="scroll hint"
          loading="lazy"
          className={isSunset ? 'invert brightness-0' : ''}
        />
        <span className={`text-sm tracking-widest font-sans font-bold ${textColor}`}>{hintText}</span>
      </div>
    </div>
  );
};
