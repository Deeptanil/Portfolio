'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import VideoBackground from '../components/common/VideoBackground';

function preventOrphans(str: string): string {
  const lastSpaceIndex = str.lastIndexOf(' ');
  if (lastSpaceIndex === -1) return str;
  return str.slice(0, lastSpaceIndex) + '\u00A0' + str.slice(lastSpaceIndex + 1);
}

const WORK_EXPERIENCE = [
  {
    title: "PRETTIVA & CO.",
    subtitle: "Co-Founder & Digital Director",
    date: "2026 - PRESENT",
    url: "https://prettiva.co",
    buttonText: "Visit prettiva.co ↗",
    screenshot: "/prettiva-screenshot.webp",
    description: [
      "Built and optimized a 45+ product e-commerce platform with 12K+ monthly visitors.",
      "Achieved a 100/100 PageSpeed SEO score with sub-second page loading speeds.",
      "Engineered high-converting storefront UI/UX, product catalog systems, and analytics funnels."
    ]
  },
  {
    title: "STRAYED",
    subtitle: "Co-Founder & Technical Director",
    date: "2025 - PRESENT",
    url: "https://strayed.in",
    buttonText: "Visit strayed.in ↗",
    screenshot: "/strayed-screenshot.webp",
    description: [
      "Architected and built a custom e-commerce platform from scratch with 90% lower load times.",
      "Integrated secure payment gateways, cloud hosting infrastructure, order fulfillment, coupons, and customer loyalty rewards.",
      "Utilized AI-assisted engineering and modern web technology stacks to scale brand operations."
    ]
  },
  {
    title: "MANIPAL INSTITUTE OF TECHNOLOGY, BENGALURU",
    subtitle: "B.Tech in Information Technology ('28)",
    date: "2024 - 2028",
    url: "https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mit-blr.html",
    buttonText: "Visit manipal.edu ↗",
    description: [
      "Pursuing B.Tech in Information Technology with a focus on web performance, graphics programming, and software architecture.",
      "Specializing in bridging frontend UX design with backend systems and digital product infrastructure."
    ]
  },
  {
    title: "GOOGLE CAREER CERTIFICATES",
    subtitle: "Google UX Design Professional Certificate",
    date: "IN PROGRESS",
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    buttonText: "View Course ↗",
    description: [
      "Currently pursuing professional certification in end-to-end UX research, wireframing, prototyping, and usability testing.",
      "Applying human-centered design principles to modern web applications and e-commerce platforms."
    ]
  },
  {
    title: "SKILLS & TECHNOLOGIES",
    subtitle: "Technical & Product Stack",
    date: "CORE COMPETENCIES",
    description: [],
    skillsList: [
      {
        category: "Development:",
        items: "JavaScript, HTML5, CSS3, C, Python, Java, Next.js, React, Node.js, Three.js / React Three Fiber, Git, GitHub, Supabase"
      },
      {
        category: "Product & Design:",
        items: "UI/UX Design, Web Performance Optimization, SEO, E-commerce Architecture, AI-Assisted Engineering (Codex, Antigravity, Claude Code)"
      }
    ]
  }
];

export default function WorkPage() {
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
            {/* Live site screenshot with half-width brown border (9px) */}
            {item.screenshot && (
              <div className="pt-2">
                <img
                  src={item.screenshot}
                  alt={`Screenshot of the ${item.title} website homepage`}
                  className="w-full h-auto"
                  style={{
                    border: '9px solid #3b2415',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                  }}
                  loading="lazy"
                />
              </div>
            )}
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
                  <span>{preventOrphans(item.buttonText || "Visit Website ↗")}</span>
                </a>
              </div>
            )}
          </div>
        ))}

        {/* End Credits Footer Note */}
        <div className="pt-16 sm:pt-24 space-y-6 text-center pb-16">
          <p
            className="text-white text-xs sm:text-sm tracking-widest uppercase pt-4 font-minecraft-regular opacity-80"
            style={{ textShadow: '1px 1px 0px #000000' }}
          >
            [End of Document]
          </p>
        </div>

      </div>
    </main>
  );
}
