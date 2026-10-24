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

function EmailButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('deeptanilsinha27@gmail.com');
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="relative inline-block">
      <a
        href="mailto:deeptanilsinha27@gmail.com"
        onClick={handleClick}
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
        <span>{preventOrphans(copied ? "Copied Email Address!" : "Email Me")}</span>
      </a>
      {copied && (
        <div
          className="absolute left-1/2 -top-10 -translate-x-1/2 px-3 py-1 bg-[#3c3c3c]/95 text-[#ffff55] border-2 border-black font-minecraft-regular text-xs tracking-wider uppercase select-none shadow-[inset_-2px_-2px_0px_0px_#262626,inset_2px_2px_0px_0px_#8b8b8b] animate-bounce whitespace-nowrap pointer-events-none z-50"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          Copied Email Address!
        </div>
      )}
    </div>
  );
}

interface SkillCategory {
  category: string;
  items: string;
}

interface MetricItem {
  value: string;
  label: string;
}

interface ArchItem {
  name: string;
  role: string;
  icon: string;
}

interface WorkItem {
  title: string;
  subtitle: string;
  date: string;
  url?: string;
  buttonText?: string;
  screenshot?: string;
  screenshots?: string[];
  tags?: string[];
  metrics?: MetricItem[];
  architecture?: ArchItem[];
  description: string[];
  skillsList?: SkillCategory[];
}

function TechIcon({ name }: { name: string }) {
  const iconClass = "w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0";
  switch (name) {
    case 'nextjs':
      return (
        <svg className={iconClass} viewBox="0 0 180 180" fill="none">
          <circle cx="90" cy="90" r="86" fill="black" stroke="#ffffff" strokeWidth="6" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.0136V69.386L137.388 161.424C141.658 160.29 145.727 159.004 149.508 157.52Z" fill="#ffffff" />
          <rect x="115" y="54" width="12" height="42" fill="#ffffff" />
        </svg>
      );
    case 'react':
      return (
        <svg className={iconClass} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
          <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
          <g stroke="#61dafb" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );
    case 'docker':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#0db7ed">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.79 11.77c-.41-.264-1.343-.372-2.162-.128-.15-.436-.407-.82-.74-1.127l-.427-.384-.33.473c-.567.81-.72 1.954-.42 2.94-.37.195-.89.324-1.52.348H1.272a.852.852 0 00-.83.693C-.07 16.924 1.488 20.5 7.03 20.5c5.38 0 9.878-3.056 11.492-7.568 1.48.066 3.655-.185 4.968-2.617.2-.37.33-.8.36-1.24a1.86 1.86 0 00-.06-.305z"/>
        </svg>
      );
    case 'postgresql':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#336791">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/>
        </svg>
      );
    case 'redis':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#dc382d">
          <path d="M2 7l10-4 10 4v10l-10 4-10-4V7zm10 2l-6-2.4v3.6L12 13l6-2.8V6.6L12 9z"/>
        </svg>
      );
    case 'odoo':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#714B67">
          <circle cx="12" cy="12" r="10" stroke="#A24689" strokeWidth="2" fill="none" />
          <circle cx="12" cy="12" r="4" fill="#A24689" />
        </svg>
      );
    case 'cloud':
    case 'oci':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#F80000">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
        </svg>
      );
    case 'payments':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#00d66f">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      );
    case 'mobile':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#a855f7">
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
        </svg>
      );
    case 'database':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#38bdf8">
          <path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm0 16c-4.42 0-8-1.34-8-2v-2.18c2.08 1.34 5.06 2.18 8 2.18s5.92-.84 8-2.18V18c0 .66-3.58 2-8 2zm0-4c-4.42 0-8-1.34-8-2v-2.18c2.08 1.34 5.06 2.18 8 2.18s5.92-.84 8-2.18V14c0 .66-3.58 2-8 2z"/>
        </svg>
      );
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="#ffff55">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      );
  }
}

function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="pt-2">
        <img
          src={images[0]}
          alt={`Screenshot of the ${title} project`}
          className="w-full h-auto"
          style={{
            border: '9px solid #3b2415',
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
          }}
          loading="lazy"
        />
      </div>
    );
  }

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const targetIndex = (index + images.length) % images.length;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: targetIndex * width,
      behavior: 'smooth',
    });
    setCurrentIndex(targetIndex);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="pt-2 w-full space-y-2">
      {/* 1 image at a time scrolling container */}
      <div
        className="relative overflow-hidden"
        style={{
          border: '9px solid #3b2415',
          boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
        }}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {images.map((src, i) => (
            <div key={i} className="w-full flex-shrink-0 snap-center">
              <img
                src={src}
                alt={`Screenshot ${i + 1} of ${title}`}
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Overlay Navigation Arrows */}
        <button
          type="button"
          onClick={() => scrollTo(currentIndex - 1)}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-minecraft-regular text-sm sm:text-base text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer select-none active:translate-y-[-48%]"
          style={{
            backgroundColor: 'rgba(112, 112, 112, 0.9)',
            border: '2px solid #000000',
            boxShadow: 'inset 2px 2px 0px 0px #ffffff, inset -2px -2px 0px 0px #373737',
            textShadow: '1px 1px 0px #000000',
          }}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollTo(currentIndex + 1)}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-minecraft-regular text-sm sm:text-base text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer select-none active:translate-y-[-48%]"
          style={{
            backgroundColor: 'rgba(112, 112, 112, 0.9)',
            border: '2px solid #000000',
            boxShadow: 'inset 2px 2px 0px 0px #ffffff, inset -2px -2px 0px 0px #373737',
            textShadow: '1px 1px 0px #000000',
          }}
        >
          ›
        </button>
      </div>

      {/* Retro Pixel Slide Counter & Indicator */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          type="button"
          onClick={() => scrollTo(currentIndex - 1)}
          className="px-2.5 py-1 font-minecraft-regular text-[10px] sm:text-xs text-white hover:text-[#ffff55] bg-[#4a4a4a] border border-black cursor-pointer shadow-[inset_1px_1px_0px_#8b8b8b,inset_-1px_-1px_0px_#262626]"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          PREV
        </button>
        <span
          className="font-minecraft-regular text-xs text-[#ffff55] tracking-widest uppercase select-none"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          [ {currentIndex + 1} / {images.length} ]
        </span>
        <button
          type="button"
          onClick={() => scrollTo(currentIndex + 1)}
          className="px-2.5 py-1 font-minecraft-regular text-[10px] sm:text-xs text-white hover:text-[#ffff55] bg-[#4a4a4a] border border-black cursor-pointer shadow-[inset_1px_1px_0px_#8b8b8b,inset_-1px_-1px_0px_#262626]"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

const WORK_EXPERIENCE: WorkItem[] = [
  {
    title: "PRETTIVA & CO.",
    subtitle: "Co-Founder & Digital Director",
    date: "2026 - PRESENT",
    url: "https://prettiva.co",
    buttonText: "Visit prettiva.co",
    screenshot: "/prettiva-screenshot.webp",
    tags: ["MINIMALIST", "E-COMMERCE", "ODOO ERP"],
    metrics: [
      { value: "12K+", label: "Monthly Visitors" },
      { value: "100/100", label: "PageSpeed SEO" },
      { value: "45+", label: "Catalog Products" }
    ],
    architecture: [
      { name: "Odoo ERP", role: "Store Core", icon: "odoo" },
      { name: "Embedded Code", role: "Frontend UI", icon: "api" },
      { name: "HTML / CSS", role: "Template Overrides", icon: "react" }
    ],
    description: [
      "Engineered a commercial storefront on Odoo ERP handling high-volume consumer traffic.",
      "Wrote custom embedded code and responsive CSS overrides to break through rigid native template restrictions.",
      "Optimized catalog browsing and checkout funnels to maximize customer conversions."
    ]
  },
  {
    title: "STRAYED",
    subtitle: "Co-Founder & Technical Director",
    date: "2025 - PRESENT",
    url: "https://strayed.in",
    buttonText: "Visit strayed.in",
    screenshot: "/strayed-screenshot.webp",
    tags: ["MINIMALIST", "HEADLESS DTC", "DOCKER & OCI"],
    metrics: [
      { value: "1.4K+", label: "Monthly Organic Views" }
    ],
    architecture: [
      { name: "Next.js 15", role: "SSR Storefront", icon: "nextjs" },
      { name: "Medusa v2", role: "Headless Engine", icon: "headless" },
      { name: "Docker", role: "Containerized", icon: "docker" },
      { name: "Oracle OCI", role: "ARM Cloud Host", icon: "oci" },
      { name: "PostgreSQL", role: "Primary DB", icon: "postgresql" },
      { name: "Redis", role: "Cache Layer", icon: "redis" }
    ],
    description: [
      "Generated 1.4K+ organic monthly search visitors using an autonomous programmatic SEO and AI editorial pipeline.",
      "Architected a decoupled headless monorepo pairing an SSR Next.js 15 storefront with a Medusa v2 Node.js backend engine.",
      "Self-hosted containerized infrastructure on Oracle Cloud (OCI ARM) with Nginx SSL reverse proxies and Redis caching.",
      "Implemented Stripe Elements, Razorpay webhook signature verification, and a 3-stage automated cart recovery drip."
    ]
  },
  {
    title: "PLATTER",
    subtitle: "Lead Mobile Architect & Product Designer",
    date: "2026 • FEATURED MOBILE APP",
    url: "https://platter.deeptanil.in/",
    buttonText: "Visit platter.deeptanil.in",
    tags: ["GLASSMORPHISM", "MOBILE APP", "REACT NATIVE", "EXPO 57"],
    metrics: [
      { value: "13", label: "Native Screens" },
      { value: "60 FPS", label: "UI Thread Motion" }
    ],
    architecture: [
      { name: "React Native", role: "Mobile Framework", icon: "react" },
      { name: "Expo 57", role: "Toolchain & SDK", icon: "mobile" },
      { name: "Reanimated", role: "UI Thread Motion", icon: "api" },
      { name: "AsyncStorage", role: "Offline State", icon: "database" }
    ],
    description: [
      "13-screen mobile culinary discovery app built on React Native 0.86, React 19, and Expo SDK 57.",
      "Designed an Apple-inspired floating dock navigation with dynamic blur and tactile haptic feedback.",
      "Mood-driven discovery filters with geolocation distance calculations and offline-first cart persistence."
    ]
  },
  {
    title: "MANIPAL INSTITUTE OF TECHNOLOGY, BENGALURU",
    subtitle: "B.Tech in Information Technology ('28)",
    date: "2024 - 2028",
    tags: ["ACADEMICS", "COMPUTER SCIENCE", "B.TECH IT"],
    url: "https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mit-blr.html",
    buttonText: "Visit manipal.edu",
    description: [
      "Pursuing B.Tech in IT with core focus on Data Structures, Algorithms, Distributed Systems, and Web Engineering.",
      "Applying academic principles to deploy real-world production web and mobile software."
    ]
  },
  {
    title: "GOOGLE CAREER CERTIFICATES",
    subtitle: "Google UX Design Professional Certificate",
    date: "IN PROGRESS",
    tags: ["CERTIFICATION", "HUMAN-CENTERED DESIGN", "UX RESEARCH"],
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    buttonText: "View Course",
    description: [
      "Undergoing professional certification covering end-to-end UX research, wireframing, high-fidelity prototyping, and usability testing.",
      "Applying human-centered design principles and accessibility standards to modern digital products."
    ]
  },
  {
    title: "SKILLS & TECHNOLOGIES",
    subtitle: "Core Engineering & Design Stack",
    date: "COMPETENCIES",
    tags: ["FULL-STACK", "MOBILE", "DEVOPS & CLOUD", "SYSTEM DESIGN"],
    description: [],
    skillsList: [
      {
        category: "Languages & Frameworks:",
        items: "JavaScript, TypeScript, React, React Native, Next.js 15, Node.js, Expo, Medusa v2, Odoo ERP, HTML5, CSS3/Tailwind CSS, PostgreSQL, Redis, Supabase, C, Python, Java, REST APIs"
      },
      {
        category: "Engineering, Cloud & Design:",
        items: "Full-Stack & Headless Architecture, Docker Compose, Oracle Cloud (OCI), Nginx, Web Performance & SEO, GSAP, UI/UX Design, Git/GitHub, AI-Assisted Engineering (Codex, Antigravity, Claude Code)"
      }
    ]
  }
];

export default function WorkPage() {
  const isAutoScrollingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const scrollAccumulatorRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // 40px/s provides smooth, comfortable chronicle auto-scroll
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
    }, 5000);

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

      {/* Minecraft UI Return Button & Navigation matching Minecraft main menu style */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex flex-wrap items-center gap-2 sm:gap-3">
        <Link
          href="/?scroll=footer"
          className="inline-flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-[38px] sm:h-[44px] px-4 sm:px-6 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
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
        <Link
          href="/about"
          className="inline-flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-[38px] sm:h-[44px] px-4 sm:px-6 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
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
          <span>{preventOrphans("About Me")}</span>
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
            {preventOrphans("WORK & EDUCATION")}
          </h1>
          <p
            className="text-white text-base sm:text-xl tracking-widest uppercase font-sans"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
          >
            {preventOrphans("The Chronicle of Deeptanil Sinha")}
          </p>
        </div>

        {/* Work Timeline Sections */}
        {WORK_EXPERIENCE.map((item, idx) => (
          <div key={idx} className="w-full space-y-4 max-w-2xl">
            <h2
              className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-widest font-minecraft-regular"
              style={{ textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000' }}
            >
              {preventOrphans(item.title)}
            </h2>

            {/* Distinct Subtitle Badge */}
            <div className="flex justify-center">
              <h3
                className="inline-block px-3 py-1 font-minecraft-regular text-xs sm:text-sm tracking-widest uppercase text-[#55ffff] bg-[#141e28]/95 border border-[#55ffff]/50 shadow-[inset_1px_1px_0px_#55ffff33,0_2px_8px_rgba(0,0,0,0.5)]"
                style={{ textShadow: '1px 1px 0px #000000' }}
              >
                {preventOrphans(item.subtitle)}
              </h3>
            </div>

            <p
              className="text-xs sm:text-sm text-[#aaaaaa] tracking-widest uppercase font-minecraft-regular opacity-90"
              style={{ textShadow: '1px 1px 0px #000000' }}
            >
              [{item.date}]
            </p>

            {/* Aesthetic & Tech Stack Badges */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 pt-1 pb-1">
                {item.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 text-[10px] sm:text-xs font-minecraft-regular tracking-wider uppercase text-[#ffff55] bg-[#3c3c3c]/95 border border-black shadow-[inset_1px_1px_0px_#8b8b8b,inset_-1px_-1px_0px_#262626]"
                    style={{ textShadow: '1px 1px 0px #000000' }}
                  >
                    {preventOrphans(tag)}
                  </span>
                ))}
              </div>
            )}

            {/* Project Screenshot / Multi-Image Scrolling Showcase */}
            <ProjectGallery
              images={
                item.screenshots && item.screenshots.length > 0
                  ? item.screenshots
                  : item.screenshot
                  ? [item.screenshot]
                  : []
              }
              title={item.title}
            />

            {/* Infographic Data Points HUD */}
            {item.metrics && item.metrics.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2.5 pt-1">
                {item.metrics.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="min-w-[130px] sm:min-w-[160px] px-3.5 py-2 bg-[#1b1713]/90 border border-black shadow-[inset_1px_1px_0px_#555555,inset_-1px_-1px_0px_#111111] flex flex-col items-center justify-center text-center"
                  >
                    <span
                      className="text-base sm:text-xl font-bold font-minecraft-regular text-[#ffff55]"
                      style={{ textShadow: '1px 1px 0px #000000' }}
                    >
                      {m.value}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] text-[#cfcfcf] uppercase tracking-wider font-minecraft-regular mt-0.5"
                      style={{ textShadow: '1px 1px 0px #000000' }}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Architecture & Stack Badges */}
            {item.architecture && item.architecture.length > 0 && (
              <div className="pt-1 flex flex-wrap justify-center gap-2">
                {item.architecture.map((arch, aIdx) => (
                  <div
                    key={aIdx}
                    className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-[#181818]/90 border border-black shadow-[inset_1px_1px_0px_#444,inset_-1px_-1px_0px_#111]"
                  >
                    <TechIcon name={arch.icon} />
                    <div className="flex flex-col text-left">
                      <span
                        className="text-[11px] font-minecraft-regular text-white leading-tight"
                        style={{ textShadow: '1px 1px 0px #000000' }}
                      >
                        {arch.name}
                      </span>
                      <span className="text-[9px] text-[#55ffff] font-sans uppercase tracking-wider leading-tight">
                        {arch.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Concise Bullet Highlights */}
            {item.description && item.description.length > 0 && (
              <div className="space-y-2 pt-2 text-left max-w-xl mx-auto">
                {item.description.map((line, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2.5">
                    <span className="text-[#ffff55] font-minecraft-regular text-xs sm:text-sm mt-0.5 select-none flex-shrink-0">
                      ◆
                    </span>
                    <p
                      className="text-xs sm:text-sm leading-relaxed tracking-wide text-[#e8e8e8] font-sans"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                    >
                      {preventOrphans(line)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Skills List Rendering */}
            {item.skillsList && (
              <div className="space-y-4 pt-2">
                {item.skillsList.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <h4
                      className="text-sm sm:text-base font-minecraft-regular text-[#ffff55] uppercase tracking-wider"
                      style={{ textShadow: '1px 1px 0px #000000' }}
                    >
                      {preventOrphans(skill.category)}
                    </h4>
                    <p
                      className="text-xs sm:text-sm leading-relaxed tracking-wide text-white font-sans opacity-90"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                    >
                      {preventOrphans(skill.items)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Optional Website Link Button with standardized proportions */}
            {item.url && (
              <div className="pt-2 flex justify-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-w-[160px] sm:min-w-[190px] h-[36px] sm:h-[42px] px-5 sm:px-6 select-none font-minecraft-regular text-xs sm:text-sm text-white hover:text-[#ffff55] hover:bg-[#8b8b8b] transition-colors cursor-pointer active:translate-y-[1px]"
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
                  <span>{preventOrphans(item.buttonText || "Visit Website")}</span>
                </a>
              </div>
            )}
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-16 sm:pt-24 space-y-6 text-center pb-16">
          <p
            className="text-[#ffff55] text-xs sm:text-sm tracking-widest uppercase pt-4 font-minecraft-regular"
            style={{ textShadow: '2px 2px 0px #000000' }}
          >
            {preventOrphans("Open to Software Engineering Internships • Remote / Hybrid (Bengaluru, India)")}
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/about"
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
              <span>{preventOrphans("About Me")}</span>
            </Link>
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
              <span>{preventOrphans("WhatsApp Chat")}</span>
            </a>
            <EmailButton />
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
