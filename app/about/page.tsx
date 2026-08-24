'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function preventOrphans(str: string): string {
  const lastSpaceIndex = str.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return str;
  return str.slice(0, lastSpaceIndex) + '\u00A0' + str.slice(lastSpaceIndex + 1);
}

const CREDITS = [
  {
    text: "Minecraft Phantom model by TR1STAN",
    href: "https://sketchfab.com/3d-models/minecraft-phantom-1af8ac6951544fb0a401b8c479fbc8ab",
    note: "Sketchfab, CC BY 4.0",
  },
  {
    text: "Minecraft Bee model by kuzneciv",
    href: "https://sketchfab.com/3d-models/bee-minecraft-b883baf691204b4d9a618e5e5841adf1",
    note: "Sketchfab, CC BY 4.0",
  },
  {
    text: "Minecraft Sky model by Walingtone Studios",
    href: "https://sketchfab.com/3d-models/minecraft-sky-4c1a6aef599641c6b0a6aee95e64001a",
    note: "Sketchfab, CC BY 4.0",
  },
  {
    text: "Residential Window model by AleixoAlonso",
    href: "https://sketchfab.com/3d-models/residential-window-ae11104237314463a61251fd46ded4b4",
    note: "Sketchfab, CC BY 4.0",
  },
  {
    text: "Minecraft font by JDGraphics (Jacob Debono)",
    href: null,
    note: null,
  },
  {
    text: "Soria font by Bydani",
    href: "https://www.behance.net/danibydani",
    note: "CC BY-ND 4.0",
  },
  {
    text: "Vercetti font by Filippos Fragkogiannis & Richard Mandona",
    href: "https://www.filipposfragkogiannis.com",
    note: null,
  },
  {
    text: "Design inspired by Mohit Virli",
    href: null,
    note: null,
  },
];

function CreditsPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center min-w-[190px] sm:min-w-[230px] h-[40px] sm:h-[46px] px-5 sm:px-7 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
        style={{
          backgroundColor: '#707070',
          border: '2px solid #000000',
          outline: 'none',
          boxShadow: 'inset 2px 2px 0px 0px #ffffff, inset -2px -2px 0px 0px #373737',
          fontFamily: '"Minecraft Regular", "MinecraftRegular-Bmg3", monospace',
          textShadow: '2px 2px 0px #373737',
          imageRendering: 'pixelated',
        }}
      >
        <span>Credits &amp; Attributions</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.95) 100%), rgba(0, 0, 0, 0.75)',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-5"
            style={{
              backgroundColor: '#402c1b',
              backgroundImage: "url('/minecraft_dirt.webp')",
              backgroundRepeat: 'repeat',
              backgroundSize: '128px 128px',
              border: '3px solid #000000',
              boxShadow: 'inset -3px -3px 0px 0px #1a1108, inset 3px 3px 0px 0px #8b8b8b',
              imageRendering: 'pixelated',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl sm:text-2xl font-bold text-white uppercase tracking-widest font-minecraft-regular text-center"
              style={{ textShadow: '2px 2px 0px #000000' }}
            >
              Credits &amp; Attributions
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-white font-sans list-none text-center" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}>
              {CREDITS.map((c, i) => (
                <li key={i}>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#ffff55] transition-colors"
                    >
                      {c.text}
                    </a>
                  ) : (
                    <span>{c.text}</span>
                  )}
                  {c.note && <span className="opacity-75 text-xs sm:text-sm block sm:inline sm:ml-2">({c.note})</span>}
                </li>
              ))}
            </ul>
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center min-w-[120px] h-[36px] sm:h-[40px] px-6 text-xs sm:text-sm font-minecraft-regular text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
                style={{
                  backgroundColor: '#707070',
                  border: '2px solid #000000',
                  outline: 'none',
                  boxShadow: 'inset 2px 2px 0px 0px #ffffff, inset -2px -2px 0px 0px #373737',
                  fontFamily: '"Minecraft Regular", "MinecraftRegular-Bmg3", monospace',
                  textShadow: '2px 2px 0px #373737',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const ABOUT_SECTIONS = [
  {
    title: "MY JOURNEY",
    subtitle: "How It All Started",
    text: [
      "My passion for technology began with Minecraft — tweaking configs, managing servers, and crafting custom experiences. That early curiosity naturally evolved into building full-stack web applications, graphics programming, and e-commerce infrastructure.",
      "Today, I co-found digital brands and build high-performance web applications that bridge intuitive design with robust software architecture."
    ]
  },
  {
    title: "WHAT DRIVES ME",
    subtitle: "Product Thinking & Execution",
    text: [
      "I believe great software lives at the intersection of speed, simplicity, and delight. Whether optimizing 3D web graphics to run smoothly on mobile devices or crafting seamless e-commerce checkout flows, I focus on shipping products that deliver measurable real-world impact."
    ]
  },
  {
    title: "CURRENT FOCUS",
    subtitle: "Building & Scaling",
    text: [
      "Pursuing B.Tech in Information Technology at Manipal Institute of Technology, Bengaluru ('28), while co-founding Prettiva & Co. and Strayed.in.",
      "Looking for Remote positions or Hybrid roles in Bengaluru, India."
    ]
  }
];

export default function AboutPage() {
  const isAutoScrollingRef = useRef(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

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
      }, 40);
    }, 15000);

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

      {/* Minecraft UI Return Button with standardized responsive proportions matching Minecraft main menu */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <Link
          href="/?scroll=footer"
          className="inline-flex items-center justify-center min-w-[160px] sm:min-w-[200px] h-[38px] sm:h-[44px] px-5 sm:px-7 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
          style={{
            backgroundColor: '#707070',
            border: '2px solid #000000',
            outline: 'none',
            boxShadow: 'inset 2px 2px 0px 0px #ffffff, inset -2px -2px 0px 0px #373737',
            fontFamily: '"Minecraft Regular", "MinecraftRegular-Bmg3", monospace',
            textShadow: '2px 2px 0px #373737',
            imageRendering: 'pixelated',
          }}
        >
          <span>{preventOrphans("Return to world")}</span>
        </Link>
      </div>

      {/* Minecraft End Credits Roll */}
      <div className="w-full max-w-[94vw] sm:max-w-3xl px-4 sm:px-8 py-12 sm:py-16 z-10 flex flex-col items-center text-center space-y-16 sm:space-y-24">
        {/* Header */}
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
            <h2
              className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest font-minecraft-regular"
              style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
            >
              {preventOrphans(item.title)}
            </h2>
            <h3
              className="text-lg sm:text-xl font-medium text-white uppercase tracking-wider font-sans opacity-95"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
            >
              {preventOrphans(item.subtitle)}
            </h3>
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
          <div className="pt-4">
            <CreditsPopup />
          </div>
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
