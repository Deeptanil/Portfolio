'use client';

import Link from 'next/link';

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
  return (
    <main
      className="min-h-screen w-full relative overflow-hidden flex justify-center text-white select-none"
      style={{
        backgroundImage: "url('/minecraft_dirt.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "64px 64px",
        imageRendering: "pixelated",
      }}
    >
      {/* Dark overlay for rich contrast */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] pointer-events-none" />

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2a1a0e]/90 hover:bg-[#47301c] border-2 border-[#8b653a] text-[#ffff55] font-mono text-sm tracking-wider shadow-lg transition-all transform hover:scale-105 active:scale-95 rounded"
        >
          <span>←</span> Return to World
        </Link>
      </div>

      {/* Minecraft End Credits Scrolling Container */}
      <div className="w-full max-w-2xl px-6 py-20 z-10 animate-[endCredits_40s_linear_infinite] flex flex-col items-center text-center space-y-16">
        
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#ffff55] font-mono uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            WORK & EDUCATION
          </h1>
          <p className="text-[#55ff55] font-mono text-sm sm:text-base tracking-widest uppercase">
            The Chronicle of Deeptanil Sinha
          </p>
        </div>

        {/* Work Timeline Items */}
        {WORK_EXPERIENCE.map((item, idx) => (
          <div key={idx} className="w-full space-y-4 max-w-lg">
            <h2 className="text-xl sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest">
              {item.title}
            </h2>
            <h3 className="text-base font-mono text-[#55ffff] uppercase tracking-wider">
              {item.subtitle}
            </h3>
            <p className="text-xs font-mono text-[#aaaaaa] tracking-widest uppercase">
              [{item.date}]
            </p>
            <div className="space-y-2 pt-2">
              {item.description.map((line, lIdx) => (
                <p key={lIdx} className="text-sm font-mono text-[#ffffff] leading-relaxed tracking-wide">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-20 space-y-4 text-center">
          <p className="text-[#55ff55] font-mono text-sm tracking-widest uppercase">
            And the player awoke from the dream. And the player began a new dream.
          </p>
          <p className="text-[#aaaaaa] font-mono text-xs tracking-widest uppercase">
            [End of Document]
          </p>
        </div>

      </div>

      {/* End Credits Animation Keyframes */}
      <style jsx global>{`
        @keyframes endCredits {
          0% {
            transform: translateY(65vh);
          }
          100% {
            transform: translateY(-80%);
          }
        }
      `}</style>
    </main>
  );
}
