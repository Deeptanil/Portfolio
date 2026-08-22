'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const ABOUT_SECTIONS = [
  {
    title: "ABOUT DEEPTANIL",
    subtitle: "Product Engineer, Designer & Builder",
    text: [
      "Hello! I am Deeptanil Sinha, a computer science student at MIT Bengaluru '28 and full-stack product engineer.",
      "I craft immersive digital experiences at the intersection of 3D WebGL graphics, elegant UI/UX design, and scalable frontend architecture.",
      "I love pushing the boundaries of what is possible on the web—turning complex engineering challenges into seamless, joyful user experiences."
    ]
  },
  {
    title: "PASSIONS & INTERESTS",
    subtitle: "What Drives Me",
    text: [
      "🎮 Gaming & World Building: Inspired by Minecraft, voxel art, and sandbox gaming environments.",
      "🎧 Music & DJing: Passionate about sound design, electronic music composition, and audio visualization.",
      "⚡ High-Performance Web: Obsessed with sub-second page loads, WebGL shaders, 60fps animations, and clean code."
    ]
  },
  {
    title: "THE PHILOSOPHY",
    subtitle: "Code & Craft",
    text: [
      "Great software is like a great game world: intuitive, beautiful, responsive, and filled with delightful micro-details.",
      "Whether building e-commerce platforms, 3D interactive canvases, or developer tools, I code with meticulous precision and creative vision."
    ]
  }
];

export default function AboutPage() {
  const [manualScroll, setManualScroll] = useState(false);

  useEffect(() => {
    const handleInteract = () => setManualScroll(true);
    window.addEventListener('wheel', handleInteract, { passive: true });
    window.addEventListener('touchstart', handleInteract, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center text-white select-none scroll-smooth"
      style={{
        backgroundColor: "#3b2716",
        backgroundImage: "url('/minecraft_dirt.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        imageRendering: "pixelated",
      }}
    >
      {/* Strong Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_80%,rgba(0,0,0,0.98)_100%)]" />

      {/* Authentic Minecraft UI Button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link
          href="/"
          className="relative inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 bg-[#747474] text-white font-mono text-xs sm:text-sm tracking-wider uppercase border-2 border-black active:translate-y-[1px] select-none shadow-[inset_-2px_-2px_0px_0px_#373737,inset_2px_2px_0px_0px_#ffffff] hover:bg-[#8b8b8b] hover:text-[#ffff55] transition-colors"
          style={{ imageRendering: 'pixelated' }}
        >
          <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-center">
            Return to World
          </span>
        </Link>
      </div>

      {/* End Credits Roll — Starts instantly at bottom (translateY 100vh) */}
      <div
        className={`w-full max-w-[92vw] sm:max-w-2xl px-4 sm:px-6 py-12 sm:py-16 z-10 flex flex-col items-center text-center space-y-12 sm:space-y-16 ${
          manualScroll ? '' : 'animate-[minecraftCredits_45s_linear_forwards]'
        }`}
      >
        {/* Header */}
        <div className="space-y-3 sm:space-y-4 pt-10 sm:pt-12">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-widest text-[#ffff55] font-mono uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            ABOUT ME
          </h1>
          <p className="text-[#55ff55] font-mono text-xs sm:text-base tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            The Journey of Deeptanil Sinha
          </p>
        </div>

        {/* About Cards */}
        {ABOUT_SECTIONS.map((item, idx) => (
          <div key={idx} className="w-full space-y-3 sm:space-y-4 max-w-lg bg-black/60 p-4 sm:p-6 rounded-lg border border-[#8b653a]/60 shadow-2xl backdrop-blur-xs">
            <h2 className="text-lg sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.title}
            </h2>
            <h3 className="text-sm sm:text-base font-mono text-[#55ffff] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.subtitle}
            </h3>
            <div className="space-y-2 pt-1 sm:pt-2">
              {item.text.map((line, lIdx) => (
                <p key={lIdx} className="text-xs sm:text-sm font-mono text-[#ffffff] leading-relaxed tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-12 sm:pt-16 space-y-4 text-center pb-12">
          <p className="text-[#55ff55] font-mono text-xs sm:text-sm tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            And the universe said you are the daylight. And the universe said you are the night.
          </p>
          <p className="text-[#aaaaaa] font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            [End of Document]
          </p>
        </div>

      </div>

      <style jsx global>{`
        @keyframes minecraftCredits {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-40%);
          }
        }
      `}</style>
    </main>
  );
}
