'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useRef, useSyncExternalStore } from "react";
import { isMobile } from "react-device-detect";

import { useThemeStore } from "@stores";

import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import SoundToggle from "./SoundToggle";
import ThemeSwitcher from "./ThemeSwitcher";

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeStore((state) => state.theme);
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

  useGSAP(() => {
    const isSunset = theme.type === 'sunset';
    const bgStyle = isSunset
      ? 'linear-gradient(135deg, #e65c00 0%, #f9d423 50%, #2c3e50 100%)'
      : 'linear-gradient(135deg, #0b1021 0%, #050814 100%)';

    if (ref.current) {
      gsap.to(ref.current, {
        background: bgStyle,
        duration: 1.2,
      });
    }
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        background: bgStyle,
        duration: 1.2,
      });
    }
  }, [theme]);

  const noiseOverlayStyle = {
    backgroundBlendMode: "soft-light",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "100px",
  };

  return (
    <div className="h-[100dvh] wrapper relative overflow-hidden" style={noiseOverlayStyle}>
      <div className="h-[100dvh] relative transition-colors duration-1000" ref={ref}>
        <Canvas
          className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={theme.type === 'sunset' ? 0.9 : 0.4} />

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
