'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function preventOrphans(str: string): string {
  const lastSpaceIndex = str.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return str;
  return str.slice(0, lastSpaceIndex) + '\u00A0' + str.slice(lastSpaceIndex + 1);
}

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
      suppressHydrationWarning
    >
      {/* Heavy Vignette + Dark Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.88)_65%,rgba(0,0,0,0.98)_100%)]" />

      {/* Minecraft UI Return Button — Pixel-Perfect Matching Screenshot */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link
          href="/?scroll=footer"
          className="inline-flex items-center justify-center px-5 py-2 sm:px-7 sm:py-2.5 select-none font-minecraft-regular text-sm sm:text-base text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
          style={{
            backgroundColor: '#747474',
            border: '2px solid #000000',
            boxShadow: 'inset -2px -2px 0px 0px #373737, inset 2px 2px 0px 0px #ffffff',
            imageRendering: 'pixelated',
          }}
        >
          <span style={{ textShadow: '2px 2px 0px #373737' }}>
            {preventOrphans("Return to world")}
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
            {preventOrphans("WORK & EDUCATION")}
          </h1>
          <p
            className="text-[#55ffff] text-base sm:text-xl tracking-widest uppercase"
            style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
          >
            {preventOrphans("The Chronicle of Deeptanil Sinha")}
          </p>
        </div>

        {/* Work Timeline Sections — Clean separated text without cards/boxes */}
        {WORK_EXPERIENCE.map((item, idx) => (
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
            <p
              className="text-xs sm:text-sm text-[#ffffff] tracking-widest uppercase opacity-90"
              style={{ textShadow: '1px 1px 0px #000000' }}
            >
              [{item.date}]
            </p>
            <div className="space-y-4 pt-2">
              {item.description.map((line, lIdx) => (
                <p
                  key={lIdx}
                  className={`text-base sm:text-lg leading-relaxed tracking-wide ${
                    lIdx % 2 === 0 ? 'text-[#55ff55]' : 'text-[#55ffff]'
                  }`}
                  style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
                >
                  {preventOrphans(line)}
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
            {preventOrphans("And the player awoke from the dream. And the player began a new dream.")}
          </p>
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
