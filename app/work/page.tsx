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

interface WorkItem {
  title: string;
  subtitle: string;
  date: string;
  url?: string;
  buttonText?: string;
  screenshot?: string;
  screenshots?: string[];
  tags?: string[];
  description: string[];
  skillsList?: SkillCategory[];
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
    tags: ["E-COMMERCE", "ODOO ERP", "CUSTOM FRONTEND", "PERFORMANCE & SEO"],
    description: [
      "Engineered and launched a 45+ product commercial e-commerce storefront on Odoo ERP handling 12K+ monthly active visitors.",
      "Authored custom embedded frontend code, styling overrides, and interactive components to overcome rigid Odoo template restrictions.",
      "Optimized catalog browsing, conversion funnels, and image delivery to secure a 100/100 Google PageSpeed SEO score with sub-second TTFB."
    ],
    skillsList: [
      {
        category: "Platform & Frontend Customization:",
        items: "Odoo ERP, Embedded Frontend Code (HTML5 / CSS3 / JavaScript), Template Architecture Overrides, Custom Component Injection"
      },
      {
        category: "Performance & Storefront Operations:",
        items: "100/100 PageSpeed SEO, High-Converting Catalog Architecture, Analytics Tracking, 12K+ Monthly Active Visitors"
      }
    ]
  },
  {
    title: "STRAYED",
    subtitle: "Co-Founder & Technical Director",
    date: "2025 - PRESENT",
    url: "https://strayed.in",
    buttonText: "Visit strayed.in",
    screenshot: "/strayed-screenshot.webp",
    tags: ["HEADLESS DTC", "NEXT.JS 15 & MEDUSA V2", "DOCKER & OCI", "RAZORPAY & STRIPE"],
    description: [
      "Engineered a production-grade, headless direct-to-consumer e-commerce monorepo decoupling an SSR Next.js 15 storefront from a Medusa v2 Node.js backend engine with tag-based ISR revalidation.",
      "Self-hosted and containerized full infrastructure on Oracle Cloud Infrastructure (OCI ARM Ampere) using multi-container Docker Compose, Nginx SSL reverse proxies, PostgreSQL, and Redis caching.",
      "Integrated dual payment gateways (Razorpay dynamic SDK signature verification webhooks & Stripe Elements) alongside a 3-stage automated abandoned cart recovery drip engine via Resend.",
      "Built an autonomous programmatic SEO engine seeding 20+ validated streetwear editorial guides into PostgreSQL, paired with PostHog client telemetry and custom 30-day analytics APIs."
    ],
    skillsList: [
      {
        category: "Cloud, Backend & Data Architecture:",
        items: "Medusa v2 Headless Core, Next.js 15 (App Router / Server Actions), PostgreSQL (MikroORM 6.6 / Knex), Redis Caching, Docker Compose, OCI (Oracle Cloud), Nginx Reverse Proxy, Turborepo"
      },
      {
        category: "Aesthetic, Motion & Integrations:",
        items: "Luxury Minimalist (#0A0A0A & Gold), Playfair Display, GSAP 3.15, OGL WebGL Shaders, Razorpay & Stripe Webhooks, Resend Email Drip, PostHog Telemetry, Cloudinary Asset Pipeline"
      }
    ]
  },
  {
    title: "PLATTER",
    subtitle: "Lead Mobile Architect & Product Designer",
    date: "2026 • FEATURED MOBILE APP",
    url: "https://platter.deeptanil.in/",
    buttonText: "Visit platter.deeptanil.in",
    tags: ["MOBILE APP", "FOODTECH UX", "REACT NATIVE", "EXPO 57", "GLASSMORPHISM"],
    description: [
      "Architected a 13-screen mobile culinary discovery app on React Native 0.86, React 19, and Expo SDK 57 featuring fluid 60fps UI-thread animations via Reanimated and Native Stack transitions.",
      "Crafted an Apple-inspired glassmorphism aesthetic with floating translucent dock navigation (expo-blur), custom luxury editorial typography (Casko Luxury Demo), and tactile haptic feedback (expo-haptics).",
      "Engineered mood-driven discovery and budget filters ('Under ₹250', Late Night, Street, Healthy) alongside localized geolocation calculations (expo-location) and offline-persisted cart state (AsyncStorage)."
    ],
    skillsList: [
      {
        category: "Aesthetic & Motion Language:",
        items: "Glassmorphism, Floating Dock Bar, BlurView, Custom Casko Typography, Haptic Tactile Engine, Confetti Cannon Celebrations"
      },
      {
        category: "Architecture & Hardware APIs:",
        items: "Multi-Provider React Context (Cart, User, Theme, Settings), AsyncStorage Offline State, Expo Location, NetInfo, Reanimated 60fps Worklets"
      }
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
      "Pursuing B.Tech in IT focusing on Data Structures & Algorithms, Web Systems Architecture, and Full-Stack Engineering.",
      "Maintaining strong academic performance while building real-world digital products and scalable web applications."
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
      "Currently pursuing professional certification in end-to-end UX research, wireframing, high-fidelity prototyping, and usability testing.",
      "Applying human-centered design principles and accessibility standards to modern web applications."
    ]
  },
  {
    title: "SKILLS & TECHNOLOGIES",
    subtitle: "Technical & Product Stack",
    date: "CORE COMPETENCIES",
    tags: ["FULL-STACK", "MOBILE", "DEVOPS & CLOUD", "SYSTEM DESIGN"],
    description: [],
    skillsList: [
      {
        category: "Languages & Frameworks:",
        items: "JavaScript, TypeScript, React, React Native, Next.js 15, Node.js, Expo, Medusa v2, Odoo ERP, HTML5, CSS3/Tailwind CSS, PostgreSQL, Redis, Supabase, C, Python, Java, REST APIs"
      },
      {
        category: "Engineering, Cloud & Design:",
        items: "Full-Stack & Headless Architecture, Docker & Docker Compose, Oracle Cloud (OCI), Nginx, Web Performance & SEO, GSAP & WebGL Shaders, UI/UX Design, Git/GitHub, AI-Assisted Engineering (Codex, Antigravity, Claude Code)"
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
            <p
              className="text-xs sm:text-sm text-white tracking-widest uppercase font-minecraft-regular opacity-90"
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
            {item.description && item.description.length > 0 && (
              <div className="space-y-4 pt-2">
                {item.description.map((line, lIdx) => (
                  <p
                    key={lIdx}
                    className="text-base sm:text-lg leading-relaxed tracking-wide text-white font-sans"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                  >
                    {preventOrphans(line)}
                  </p>
                ))}
              </div>
            )}

            {/* Skills List Rendering */}
            {item.skillsList && (
              <div className="space-y-6 pt-2">
                {item.skillsList.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h4
                      className="text-lg sm:text-xl font-medium text-white uppercase tracking-wider font-sans opacity-95"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
                    >
                      {preventOrphans(skill.category)}
                    </h4>
                    <p
                      className="text-base sm:text-lg leading-relaxed tracking-wide text-white font-sans"
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
