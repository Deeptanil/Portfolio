'use client';

import Link from 'next/link';

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
      <div className="w-full max-w-2xl px-6 py-20 z-10 animate-[endCredits_38s_linear_infinite] flex flex-col items-center text-center space-y-16">
        
        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-[#ffff55] font-mono uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            ABOUT ME
          </h1>
          <p className="text-[#55ff55] font-mono text-sm sm:text-base tracking-widest uppercase">
            The Journey of Deeptanil Sinha
          </p>
        </div>

        {/* About Sections */}
        {ABOUT_SECTIONS.map((item, idx) => (
          <div key={idx} className="w-full space-y-4 max-w-lg">
            <h2 className="text-xl sm:text-2xl font-mono text-[#ffff55] uppercase tracking-widest">
              {item.title}
            </h2>
            <h3 className="text-base font-mono text-[#55ffff] uppercase tracking-wider">
              {item.subtitle}
            </h3>
            <div className="space-y-3 pt-2">
              {item.text.map((line, lIdx) => (
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
            And the universe said you are the daylight. And the universe said you are the night.
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
