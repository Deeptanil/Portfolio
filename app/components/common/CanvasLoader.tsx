'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useRef, useSyncExternalStore } from "react";
import { isMobile } from "react-device-detect";

import { useScrollStore, useThemeStore } from "@stores";

import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import SoundToggle from "./SoundToggle";
import ThemeSwitcher from "./ThemeSwitcher";



const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const scrollProgress = useScrollStore((state) => state.scrollProgress);
  const { progress } = useProgress();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    overflow: "hidden",
    ...(mounted && !isMobile && {
      inset: '1rem',
      width: 'calc(100% - 2rem)',
      height: 'calc(100% - 2rem)',
    }),
  };

  useGSAP(() => {
    if (progress === 100) {
      gsap.to('.base-canvas', { opacity: 1, duration: 2, delay: 0.3 });
    }
  }, [progress]);

  // Scroll-driven dynamic gradient transition for Day mode
  useGSAP(() => {
    if (theme.type === 'day') {
      // Interpolate gradient based on scrollProgress (0 to 1)
      const p = Math.min(1, Math.max(0, scrollProgress));
      
      // Top color: Orange -> Rich Coral -> Magenta
      const r1 = Math.round(255 - p * 30);
      const g1 = Math.round(126 - p * 56);
      const b1 = Math.round(95 + p * 26);
      const topColor = `rgb(${r1}, ${g1}, ${b1})`;

      // Mid color: Orange-Yellow -> Coral Pink
      const r2 = Math.round(255 - p * 20);
      const g2 = Math.round(170 - p * 100);
      const b2 = Math.round(51 + p * 70);
      const midColor = `rgb(${r2}, ${g2}, ${b2})`;

      // Bottom color: Bright Yellow (#ffe259) -> Deep Warm Sunset Dusk (#a83279)
      const r3 = Math.round(255 - p * 87);
      const g3 = Math.round(226 - p * 176);
      const b3 = Math.round(89 + p * 32);
      const bottomColor = `rgb(${r3}, ${g3}, ${b3})`;

      const bgGradient = `linear-gradient(180deg, ${topColor} 0%, ${midColor} 50%, ${bottomColor} 100%)`;

      if (ref.current) ref.current.style.background = bgGradient;
      if (canvasRef.current) canvasRef.current.style.background = bgGradient;
    } else {
      const bgGradient = 'linear-gradient(180deg, #0b1021 0%, #050814 100%)';
      if (ref.current) ref.current.style.background = bgGradient;
      if (canvasRef.current) canvasRef.current.style.background = bgGradient;
    }
  }, [theme, scrollProgress]);

  const noiseOverlayStyle = {
    backgroundBlendMode: "soft-light",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "100px",
  };

  return (
    <div className="h-[100dvh] wrapper relative overflow-hidden" style={noiseOverlayStyle}>
      <div className="h-[100dvh] relative transition-colors duration-500" ref={ref}>
        <Canvas
          className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={theme.ambientIntensity} />

            <ScrollControls pages={3} damping={0.4} maxSpeed={1} distance={1} style={{ zIndex: 1 }}>
              {props.children}
            </ScrollControls>

            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
        <ProgressLoader progress={progress} />
      </div>
      <SoundToggle />
      <ThemeSwitcher />
      <ScrollHint />
    </div>
  );
};

export default CanvasLoader;
