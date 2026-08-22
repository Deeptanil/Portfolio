'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const WORK_EXPERIENCE = [
  {
    title: "DEEPTANIL SINHA",
    subtitle: "Product Engineer & Creative Technologist",
    date: "2024 - PRESENT",
    description: [
      "Building high-performance digital products, 3D WebGL experiences, and e-commerce platforms.",
      "Specializing in Next.js, React Three Fiber, WebGL, TailwindCSS, and GSAP animations.",
      "Focused on pixel-perfect UI/UX, SEO performance optimization, and immersive web graphics."
    ]
  },
  {
    title: "STRAYED & PRETTIVA",
    subtitle: "Co-Founder & Lead Engineer",
    date: "2024 - PRESENT",
    description: [
      "Architected scalable e-commerce infrastructure and digital brand experiences.",
      "Engineered custom storefronts with real-time 3D product previews and optimized conversion funnels.",
      "Achieved top-tier Lighthouse SEO scores and sub-second page loading speeds."
    ]
  },
  {
    title: "MIT BENGALURU",
    subtitle: "B.Tech in Computer Science & Engineering ('28)",
    date: "2024 - 2028",
    description: [
      "Pursuing Computer Science with a core focus on Graphics Programming, Systems, and Software Architecture.",
      "Active contributor to open-source developer communities, web standards, and creative technology projects."
    ]
  },
  {
    title: "SKILLS & TECHNOLOGIES",
    subtitle: "Engineering Stack",
    date: "CORE COMPETENCIES",
    description: [
      "Languages: TypeScript, JavaScript, HTML5, CSS3, Python, C++",
      "Frameworks: Next.js, React, Node.js, Three.js / React Three Fiber, GSAP, Zustand",
      "Design & Graphics: WebGL Shaders, Blender 3D Modeling, UI/UX Systems, Tailwind CSS"
    ]
  }
];

export default function WorkPage() {
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
          <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.9)]">
            ← Return to World
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
            WORK & EDUCATION
          </h1>
          <p className="text-[#55ff55] font-mono text-xs sm:text-base tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            The Chronicle of Deeptanil Sinha
          </p>
        </div>

        {/* Work Timeline Cards */}
        {WORK_EXPERIENCE.map((item, idx) => (
          <div key={idx} className="w-full space-y-3 sm:space-y-4 max-w-lg bg-black/60 p-4 sm:p-6 rounded-lg border border-[#8b653a]/60 shadow-2xl backdrop-blur-xs">
            <h2 className="text-lg sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.title}
            </h2>
            <h3 className="text-sm sm:text-base font-mono text-[#55ffff] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.subtitle}
            </h3>
            <p className="text-[10px] sm:text-xs font-mono text-[#aaaaaa] tracking-widest uppercase">
              [{item.date}]
            </p>
            <div className="space-y-2 pt-1 sm:pt-2">
              {item.description.map((line, lIdx) => (
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
            And the player awoke from the dream. And the player began a new dream.
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
