'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function preventOrphans(str: string): string {
  const lastSpaceIndex = str.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return str;
  return str.slice(0, lastSpaceIndex) + '\u00A0' + str.slice(lastSpaceIndex + 1);
}

const ABOUT_SECTIONS = [
  {
    title: "ABOUT DEEPTANIL",
    subtitle: "Product Engineer, Designer & Builder",
    text: [
      "Hello! I am Deeptanil Sinha, a computer science student at MIT Bengaluru '28 and full-stack product engineer.",
      "I craft immersive digital experiences at the intersection of 3D WebGL graphics, elegant UI/UX design, and scalable frontend architecture.",
      "I love pushing the boundaries of interactive web technologies with Next.js, React Three Fiber, GSAP, and custom GLSL shaders."
    ]
  },
  {
    title: "PHILOSOPHY & CRAFT",
    subtitle: "How I Build Products",
    text: [
      "Every pixel, animation frame, and system architecture choice should serve a clear purpose: delighting users and delivering real value.",
      "I believe in building software that is blazingly fast, visually stunning, accessible, and resilient under production loads."
    ]
  },
  {
    title: "INTERESTS & PASSIONS",
    subtitle: "Beyond The Code",
    text: [
      "When I am not coding, you can find me exploring immersive game design, experimenting with electronic sound design & DJing, or researching high-performance WebGL rendering techniques.",
      "Always curious, always building."
    ]
  }
];

export default function AboutPage() {
  const [manualScroll, setManualScroll] = useState(false);
  const [startScrolling, setStartScrolling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartScrolling(true);
    }, 20000);

    const handleInteract = () => setManualScroll(true);
    window.addEventListener('wheel', handleInteract, { passive: true });
    window.addEventListener('touchstart', handleInteract, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center text-white select-none scroll-smooth [text-wrap:pretty]"
      style={{
        backgroundColor: "#24170d",
        backgroundImage: "url('/minecraft_dirt.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        imageRendering: "pixelated",
      }}
    >
      {/* Heavy Vignette + Dark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.88)_65%,rgba(0,0,0,0.98)_100%)]" />

      {/* Minecraft UI Return Button */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link
          href="/?scroll=footer"
          className="relative inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-2.5 bg-[#747474] text-white font-minecraft-regular text-xs sm:text-sm tracking-wider uppercase border-2 border-black active:translate-y-[1px] select-none shadow-[inset_-2px_-2px_0px_0px_#373737,inset_2px_2px_0px_0px_#ffffff] hover:bg-[#8b8b8b] hover:text-[#ffff55] transition-colors"
          style={{ imageRendering: 'pixelated' }}
        >
          <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)] text-center">
            {preventOrphans("Return to World")}
          </span>
        </Link>
      </div>

      {/* Minecraft End Credits Roll — High Contrast, Bigger Font, Unboxed */}
      <div
        className={`w-full max-w-[94vw] sm:max-w-3xl px-4 sm:px-8 py-12 sm:py-16 z-10 flex flex-col items-center text-center space-y-16 sm:space-y-24 ${
          manualScroll ? '' : startScrolling ? 'animate-[minecraftCreditsScroll_45s_linear_forwards]' : ''
        }`}
      >
        {/* Header */}
        <div className="space-y-4 pt-10 sm:pt-14 font-minecraft-regular">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-widest text-[#ffff55] uppercase"
            style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000' }}
          >
            {preventOrphans("ABOUT ME")}
          </h1>
          <p
            className="text-[#55ffff] text-base sm:text-xl tracking-widest uppercase"
            style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
          >
            {preventOrphans("The Story of Deeptanil Sinha")}
          </p>
        </div>

        {/* About Sections — Clean separated text without cards/boxes */}
        {ABOUT_SECTIONS.map((item, idx) => (
          <div key={idx} className="w-full space-y-5 font-minecraft-regular max-w-2xl">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#ffff55] uppercase tracking-widest"
              style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
            >
              {preventOrphans(item.title)}
            </h2>
            <h3
              className="text-lg sm:text-xl font-bold text-[#55ffff] uppercase tracking-wider"
              style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
            >
              {preventOrphans(item.subtitle)}
            </h3>
            <div className="space-y-4 pt-2">
              {item.text.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className={`text-base sm:text-lg leading-relaxed tracking-wide ${
                    pIdx % 2 === 0 ? 'text-[#55ff55]' : 'text-[#55ffff]'
                  }`}
                  style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
                >
                  {preventOrphans(paragraph)}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-16 sm:pt-24 space-y-6 font-minecraft-regular text-center pb-16">
          <p
            className="text-[#55ff55] text-base sm:text-lg tracking-widest uppercase"
            style={{ textShadow: '2px 2px 0px #000000' }}
          >
            {preventOrphans("and the universe said I love you because you are love.")}
          </p>
          <p
            className="text-[#aaaaaa] text-xs sm:text-sm tracking-widest uppercase pt-4"
            style={{ textShadow: '1px 1px 0px #000000' }}
          >
            [End of Document]
          </p>
        </div>

      </div>

      <style jsx global>{`
        @keyframes minecraftCreditsScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-80%);
          }
        }
      `}</style>
    </main>
  );
}
