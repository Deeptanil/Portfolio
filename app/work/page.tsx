'use client';

import Link from 'next/link';
import { useEffect } from 'react';

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
            WORK & EDUCATION
          </h1>
          <p className="text-[#55ff55] font-mono text-sm sm:text-base tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            The Chronicle of Deeptanil Sinha
          </p>
        </div>

        {/* Work Timeline Cards */}
        {WORK_EXPERIENCE.map((item, idx) => (
          <div key={idx} className="w-full space-y-4 max-w-lg bg-black/60 p-6 rounded-lg border border-[#8b653a]/60 shadow-2xl backdrop-blur-xs">
            <h2 className="text-xl sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.title}
            </h2>
            <h3 className="text-base font-mono text-[#55ffff] uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {item.subtitle}
            </h3>
            <p className="text-xs font-mono text-[#aaaaaa] tracking-widest uppercase">
              [{item.date}]
            </p>
            <div className="space-y-2 pt-2">
              {item.description.map((line, lIdx) => (
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
            And the player awoke from the dream. And the player began a new dream.
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
