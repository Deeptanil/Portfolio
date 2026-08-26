'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useRef, useSyncExternalStore } from "react";
import { isMobile } from "react-device-detect";

import { useThemeStore, useScrollStore } from "@stores";
import { useCallback, useState } from "react";

import "../../utils/assetPreloader";
import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import SkipToPortfolioButton from "./SkipToPortfolioButton";
import ThemeSwitcher from "./ThemeSwitcher";
import WebGLWarmup from "./WebGLWarmup";

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundColor = useThemeStore((state) => state.theme.color);
  const setStoreWarmedUp = useScrollStore((state) => state.setIsWarmedUp);
  const { progress } = useProgress();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [isWarmedUp, setIsWarmedUp] = useState(false);

  const handleWarmupComplete = useCallback(() => {
    setIsWarmedUp(true);
    setStoreWarmedUp(true);
  }, [setStoreWarmedUp]);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    overflow: "hidden",
    willChange: "opacity",
  };

  useGSAP(() => {
    if (progress === 100 && isWarmedUp) {
      gsap.to('.base-canvas', { opacity: 1, duration: 2, delay: 0.2 });
    }
  }, [progress, isWarmedUp]);

  useGSAP(() => {
    if (ref.current) {
      gsap.to(ref.current, {
        backgroundColor: backgroundColor,
        duration: 1,
      });
    }
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        backgroundColor: backgroundColor,
        duration: 1,
      });
    }
  }, [backgroundColor]);

  const minecraftDirtStyle: React.CSSProperties = {
    backgroundColor: "#402c1b",
    backgroundImage: "url('/minecraft_dirt.webp')",
    backgroundRepeat: "repeat",
    backgroundSize: "256px 256px",
    imageRendering: "pixelated",
  };

  return (
    <div className="h-[100dvh] wrapper relative overflow-hidden" style={minecraftDirtStyle} suppressHydrationWarning>
      <div className="h-[100dvh] relative" ref={ref} suppressHydrationWarning>
        <Canvas
          className="base-canvas"
          shadows={!isMobile}
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}
          gl={{ powerPreference: 'high-performance', antialias: !isMobile, alpha: false }}
        >
          {/* Attach dynamic theme background color directly to 3D scene clear color */}
          <color attach="background" args={[backgroundColor]} />

          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />

            <ScrollControls pages={4} damping={0.2} maxSpeed={1} distance={1} style={{ zIndex: 1, willChange: 'transform' }}>
              {props.children}
            </ScrollControls>

            <WebGLWarmup progress={progress} onWarmupComplete={handleWarmupComplete} />
            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated />
        </Canvas>
        <ProgressLoader progress={progress} isWarmedUp={isWarmedUp} />
      </div>
      <ThemeSwitcher />
      <ScrollHint />
      <SkipToPortfolioButton />
    </div>
  );
};

export default CanvasLoader;
