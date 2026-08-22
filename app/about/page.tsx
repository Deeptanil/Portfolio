'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
  useEffect(() => {
    let animationFrameId: number;
    let isUserInteracting = false;
    let timeoutId: NodeJS.Timeout;

    const onUserInteract = () => {
      isUserInteracting = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        isUserInteracting = false;
      }, 3000);
    };

    window.addEventListener('wheel', onUserInteract, { passive: true });
    window.addEventListener('touchstart', onUserInteract, { passive: true });
    window.addEventListener('keydown', onUserInteract, { passive: true });

    const autoScroll = () => {
      if (!isUserInteracting) {
        window.scrollBy({ top: 0.18, behavior: 'instant' });
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
      window.removeEventListener('wheel', onUserInteract);
      window.removeEventListener('touchstart', onUserInteract);
      window.removeEventListener('keydown', onUserInteract);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full relative overflow-y-auto flex flex-col items-center text-white select-none scroll-smooth"
      style={{
        backgroundColor: "#3b2716",
        backgroundImage: "url('/minecraft_dirt.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "64px 64px",
        imageRendering: "pixelated",
      }}
    >
      {/* Strong Cinematic Vignette Overlay across all devices */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.85)_80%,rgba(0,0,0,0.98)_100%)]" />

      {/* Return to World Floating Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a1a0e]/95 hover:bg-[#47301c] border-2 border-[#8b653a] text-[#ffff55] font-mono text-sm tracking-wider shadow-2xl transition-all transform hover:scale-105 active:scale-95 rounded"
        >
          <span>←</span> Return to World
        </Link>
      </div>

      {/* Minecraft End Credits Container — Starts outside screen, glides up slowly */}
      <div className="w-full max-w-2xl px-6 py-16 z-10 animate-[endCredits_30s_cubic-bezier(0.1,0,0.2,1)_forwards] flex flex-col items-center text-center space-y-16">
        
        {/* Header */}
        <div className="space-y-4 pt-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#ffff55] font-mono uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            ABOUT ME
          </h1>
          <p className="text-[#55ff55] font-mono text-sm sm:text-base tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            The Journey of Deeptanil Sinha
          </p>
        </div>

        {/* About Cards */}
        {ABOUT_SECTIONS.map((item, idx) => (
          <div key={idx} className="w-full space-y-4 max-w-lg bg-black/60 p-6 rounded-lg border border-[#8b653a]/60 shadow-2xl backdrop-blur-xs">
            <h2 className="text-xl sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.title}
            </h2>
            <h3 className="text-base font-mono text-[#55ffff] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.subtitle}
            </h3>
            <div className="space-y-3 pt-2">
              {item.text.map((line, lIdx) => (
                <p key={lIdx} className="text-sm font-mono text-[#ffffff] leading-relaxed tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-16 space-y-4 text-center pb-12">
          <p className="text-[#55ff55] font-mono text-sm tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            And the universe said you are the daylight. And the universe said you are the night.
          </p>
          <p className="text-[#aaaaaa] font-mono text-xs tracking-widest uppercase">
            [End of Document]
          </p>
        </div>

      </div>

      {/* End Credits Keyframe: Starts at 100vh (outside screen), stops at 0 */}
      <style jsx global>{`
        @keyframes endCredits {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
