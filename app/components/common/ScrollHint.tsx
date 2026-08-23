'use client';

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useScrollStore, useThemeStore } from "@stores";

export const ScrollHint = () => {
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const isDay = useThemeStore((state) => state.theme.type === 'day');
  const [initialBoost, setInitialBoost] = useState(false);

  const showScrollHint = scrollProgress === 0;
  const textColor = isDay ? 'text-[#1a0933]' : 'text-white';

  useEffect(() => {
    // Only show prominent scroll-down prompt if user opens website for the first time
    // If returning from /work or /about (has ?scroll= parameter) or has scrolled before, do NOT show prompt
    if (typeof window !== 'undefined') {
      const isReturnFromSubpage = window.location.search.includes('scroll=');
      const hasScrolledBefore = sessionStorage.getItem('hasScrolledBefore');

      if (!isReturnFromSubpage && !hasScrolledBefore) {
        setInitialBoost(true);
      }
    }
  }, []);

  useEffect(() => {
    if (scrollProgress > 0 && typeof window !== 'undefined') {
      sessionStorage.setItem('hasScrolledBefore', 'true');
      setInitialBoost(false);
    }
  }, [scrollProgress]);

  useEffect(() => {
    // 10 second timeout to dismiss initial boost if user stays on top
    if (initialBoost) {
      const timer = setTimeout(() => {
        setInitialBoost(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [initialBoost]);

  useEffect(() => {
    if (showScrollHint) {
      gsap.to('.scroll-hint', {
        opacity: 1,
        duration: 1.0,
        delay: initialBoost ? 0.2 : 1.2,
      });
    } else {
      gsap.killTweensOf('.scroll-hint');
      gsap.to('.scroll-hint', {
        opacity: 0,
        duration: 0.4,
      });
    }
  }, [showScrollHint, initialBoost]);

  return (
    <div
      className="fixed w-full bottom-7 scroll-hint pointer-events-none"
      style={{ opacity: 0, zIndex: 10 }}
      suppressHydrationWarning
    >
      <div className="flex items-center justify-center">
        {initialBoost ? (
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/75 border border-white/40 shadow-2xl backdrop-blur-md animate-bounce transition-all duration-500">
            <Image
              src="icons/chevrons-up-down.svg"
              width={22}
              height={22}
              alt="scroll hint"
              loading="lazy"
              className={isDay ? 'invert brightness-0' : 'brightness-200'}
            />
            <span className="text-xs sm:text-sm tracking-widest font-minecraft-regular text-[#ffff55] font-bold drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
              SCROLL DOWN TO EXPLORE
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-pulse transition-all duration-500">
            <Image
              src="icons/chevrons-up-down.svg"
              width={18}
              height={18}
              alt="scroll hint"
              loading="lazy"
              className={isDay ? 'invert brightness-0' : ''}
            />
            <span className={`text-xs sm:text-sm tracking-widest font-sans font-bold ${textColor}`}>
              SCROLL
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
