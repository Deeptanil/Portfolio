'use client';

import { useThemeStore } from "@stores";
import Image from 'next/image';
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";

const ThemeSwitcher = () => {
  const themeSwitcherRef = useRef<HTMLDivElement>(null);
  const { nextTheme, theme } = useThemeStore();
  const positionClass = isMobile ? 'top-2 right-2' : 'top-6 right-6';
  const toggleTheme = () => nextTheme();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.type === 'sunset' ? '#e65c00' : '#0b1021');
    }
  }, [theme.type]);

  return (
    <div className={`fixed ${positionClass}`} ref={themeSwitcherRef} style={{ opacity: 1, zIndex: 2 }}>
      <div className="flex items-center justify-center gap-2">
        <a className="hover:cursor-pointer" onClick={toggleTheme}>
          <Image src="icons/night-mode.svg" width={24} height={24} alt="night mode" loading="lazy" />
        </a>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
