'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import VideoBackground from '../components/common/VideoBackground';

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
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsMounted(false);
    }, 250);
  };

  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMounted]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
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

      {isMounted && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 select-none backdrop-blur-md transition-opacity duration-250 ease-out ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.92) 65%, rgba(0, 0, 0, 0.99) 100%), rgba(0, 0, 0, 0.85)',
          }}
          onClick={handleClose}
        >
          <div
            className={`w-full max-w-lg max-h-[80vh] overflow-y-auto p-6 sm:p-8 space-y-5 transform transition-all duration-250 ease-out ${
              isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-2'
            }`}
            style={{
              backgroundColor: '#402c1b',
              backgroundImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.95) 100%), url('/minecraft_dirt.webp')",
              backgroundRepeat: 'no-repeat, repeat',
              backgroundSize: 'cover, 128px 128px',
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
                onClick={handleClose}
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
    subtitle: "Full-Stack Product Engineer",
    text: [
      "I'm a Product Engineer studying Information Technology at MIT Bengaluru ('28). My passion for technology began with Minecraft - tweaking server configs and crafting custom scripts, which evolved into building production web applications and scalable e-commerce infrastructure.",
      "Today, I build high-performance web applications, co-found digital brands, and bridge intuitive UX design with robust full-stack software architecture."
    ]
  },
  {
    title: "WHAT DRIVES ME",
    subtitle: "Performance, Simplicity & Scale",
    text: [
      "I believe great software lives at the intersection of speed, simplicity, and delight. Whether optimizing web performance to achieve sub-second page loads, architecting secure payment flows, or crafting responsive interfaces, I focus on shipping products that deliver measurable real-world impact."
    ]
  },
  {
    title: "CURRENT FOCUS",
    subtitle: "Open to Engineering Opportunities",
    text: [
      "Pursuing B.Tech in Information Technology at Manipal Institute of Technology, Bengaluru ('28), while co-founding Prettiva & Co. and Strayed.in.",
      "Actively looking for Software Engineering Internships and Full-Stack / Frontend Roles (Remote or Hybrid in Bengaluru, India)."
    ]
  }
];

export default function AboutPage() {
  const isAutoScrollingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const scrollAccumulatorRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // 40px/s provides smooth, comfortable credits auto-scroll
    const SPEED_PX_PER_SEC = 40;

    const stopAutoScroll = () => {
      isAutoScrollingRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const step = (time: number) => {
      if (!isAutoScrollingRef.current) return;

      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        if (delta > 0 && delta < 0.1 && typeof document !== 'undefined' && !document.hidden && document.hasFocus()) {
          scrollAccumulatorRef.current += SPEED_PX_PER_SEC * delta;
          const pxToScroll = Math.floor(scrollAccumulatorRef.current);
          if (pxToScroll >= 1) {
            window.scrollBy(0, pxToScroll);
            scrollAccumulatorRef.current -= pxToScroll;
          }
        }
      }

      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      isAutoScrollingRef.current = true;
      lastTimeRef.current = null;
      scrollAccumulatorRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    }, 10000);

    const handleInteract = () => {
      stopAutoScroll();
    };

    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
        stopAutoScroll();
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
      stopAutoScroll();
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
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center text-white select-none [text-wrap:pretty]"
      style={{
        backgroundColor: "#24170d",
        backgroundImage: "url('/minecraft_dirt.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        imageRendering: "pixelated",
      }}
      suppressHydrationWarning
    >
      {/* Video Background with dirt fallback */}
      <VideoBackground />

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
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/917760343724?text=Hi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[150px] h-[38px] px-5 select-none font-minecraft-regular text-xs text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
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
              <span>{preventOrphans("WhatsApp Chat ↗")}</span>
            </a>
            <a
              href="mailto:deeptanilsinha27@gmail.com"
              className="inline-flex items-center justify-center min-w-[150px] h-[38px] px-5 select-none font-minecraft-regular text-xs text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
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
              <span>{preventOrphans("Email Me ↗")}</span>
            </a>
          </div>
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
