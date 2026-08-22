'use client';

import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";
import { useScrollStore } from "@stores";

export const ScrollHint = () => {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);

  const hintText = 'SCROLL';
  const showScrollHint = scrollProgress === 0;

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
    <div className="fixed w-full bottom-5 scroll-hint" style={{ opacity: 0, zIndex: 10 }}>
      <div className="flex items-center justify-center gap-2 animate-pulse">
        <Image src="icons/chevrons-up-down.svg" width={18} height={18} alt="scroll hint" loading="lazy" />
        <span className="text-white text-sm tracking-widest font-sans">{hintText}</span>
      </div>
    </div>
  );
};
