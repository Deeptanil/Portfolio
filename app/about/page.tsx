'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function preventOrphans(str: string): string {
  const lastSpaceIndex = str.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return str;
  return str.slice(0, lastSpaceIndex) + '\u00A0' + str.slice(lastSpaceIndex + 1);
}

const ABOUT_SECTIONS = [
  {
    title: "ABOUT DEEPTANIL",
    subtitle: "Product Engineer, UX Specialist & Entrepreneur",
    text: [
      "Hello! I am Deeptanil Sinha, a Product Engineer based in Bengaluru, India.",
      "Currently pursuing B.Tech in Information Technology at Manipal Institute of Technology, Bengaluru ('28) and working towards the Google UX Design Professional Certificate.",
      "I bridge frontend software engineering, user experience design, and digital e-commerce systems."
    ]
  },
  {
    title: "VENTURES & LEADERSHIP",
    subtitle: "Building Brands & E-commerce Infrastructure",
    text: [
      "As Co-Founder & Technical Director of STRAYED and Co-Founder & Digital Director of Prettiva & Co., I lead end-to-end digital product strategy.",
      "From architecting custom e-commerce engines with sub-second load times and 100/100 PageSpeed scores to engineering payment gateways and real-time inventory tools, I build products designed for high scale and conversions."
    ]
  },
  {
    title: "ENGINEERING PHILOSOPHY",
    subtitle: "Crafting High-Performance Digital Products",
    text: [
      "I leverage modern technologies like Next.js, React Three Fiber, WebGL, Node.js, and Supabase alongside AI-assisted development tools (Codex, Antigravity, Claude Code).",
      "I believe every user interaction should be fast, visually captivating, intuitive, and built on rock-solid architectural foundations."
    ]
  },
  {
    title: "INTERESTS & BEYOND",
    subtitle: "Motorsports, Drums & Sports",
    text: [
      "Outside of software engineering and digital design, I am passionate about motorsports, playing the drums, swimming, sports, and culinary experiences.",
      "Driven by curiosity, creativity, and relentless execution."
    ]
  },
  {
    title: "OPPORTUNITIES & AVAILABILITY",
    subtitle: "Open to Internships & Roles",
    text: [
      "I am actively open to internship opportunities and engineering roles.",
      "Looking for Remote positions or Hybrid roles in Bengaluru, India."
    ]
  }
];

export default function AboutPage() {
  const isAutoScrollingRef = useRef(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Respect prefers-reduced-motion — don't auto-scroll visitors who asked not to be moved
    if (prefersReducedMotion) return;

    // Start slow auto-scroll after 15 seconds only if screen is in focus and visible
    const timer = setTimeout(() => {
      isAutoScrollingRef.current = true;
      scrollIntervalRef.current = setInterval(() => {
        if (
          isAutoScrollingRef.current &&
          typeof document !== 'undefined' &&
          !document.hidden &&
          document.hasFocus()
        ) {
          window.scrollBy({ top: 1, behavior: 'auto' });
        }
      }, 40); // Slow 25px/sec auto-scroll
    }, 15000);

    // Stop auto-scroll on user interaction or when screen loses focus / tab changes
    const handleInteract = () => {
      isAutoScrollingRef.current = false;
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
        handleInteract();
      }
    };

    window.addEventListener('wheel', handleInteract, { passive: true });
    window.addEventListener('touchstart', handleInteract, { passive: true });
    window.addEventListener('touchmove', handleInteract, { passive: true });
    window.addEventListener('keydown', handleInteract, { passive: true });
    window.addEventListener('blur', handleInteract, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

    return () => {
      clearTimeout(timer);
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      window.removeEventListener('wheel', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
      window.removeEventListener('touchmove', handleInteract);
      window.removeEventListener('keydown', handleInteract);
      window.removeEventListener('blur', handleInteract);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

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

      {/* Minecraft UI Return Button */}
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

      {/* Minecraft End Credits Roll */}
      <div className="w-full max-w-[94vw] sm:max-w-3xl px-4 sm:px-8 py-12 sm:py-16 z-10 flex flex-col items-center text-center space-y-16 sm:space-y-24">
        {/* Header: Minecraft Font for Heading, Normal Font for Subtitle */}
        <div className="space-y-4 pt-10 sm:pt-14">
          <h1
            className="text-3xl sm:text-5xl font-bold tracking-widest text-white uppercase font-minecraft-regular"
            style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
          >
            {preventOrphans("ABOUT ME")}
          </h1>
          <p
            className="text-white text-base sm:text-xl tracking-widest uppercase font-sans"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
          >
            {preventOrphans("The Story of Deeptanil Sinha")}
          </p>
        </div>

        {/* About Sections */}
        {ABOUT_SECTIONS.map((item, idx) => (
          <div key={idx} className="w-full space-y-5 max-w-2xl">
            {/* Heading: Minecraft font */}
            <h2
              className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest font-minecraft-regular"
              style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
            >
              {preventOrphans(item.title)}
            </h2>
            {/* Subtitle: Normal font */}
            <h3
              className="text-lg sm:text-xl font-medium text-white uppercase tracking-wider font-sans opacity-95"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
            >
              {preventOrphans(item.subtitle)}
            </h3>
            {/* Body: Normal font */}
            <div className="space-y-4 pt-2">
              {item.text.map((paragraph, pIdx) => (
                <p
                  key={pIdx}
                  className="text-base sm:text-lg leading-relaxed tracking-wide text-white font-sans"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                >
                  {preventOrphans(paragraph)}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-16 sm:pt-24 space-y-6 text-center pb-16">
          <p
            className="text-[#ffff55] text-xs sm:text-sm tracking-widest uppercase pt-4 font-minecraft-regular"
            style={{ textShadow: '2px 2px 0px #000000' }}
          >
            {preventOrphans("Open to Internships • Remote / Hybrid (Bengaluru, India)")}
          </p>
          <p
            className="text-white text-xs sm:text-sm tracking-widest uppercase font-minecraft-regular opacity-80"
            style={{ textShadow: '1px 1px 0px #000000' }}
          >
            [End of Document]
          </p>
        </div>

      </div>
    </main>
  );
}
