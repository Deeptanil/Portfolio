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
  const backgroundColor = useThemeStore((state) => state.theme.color);
  const { progress } = useProgress();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    overflow: "hidden",
  };

  useGSAP(() => {
    if (progress === 100) {
      gsap.to('.base-canvas', { opacity: 1, duration: 3, delay: 1 });
    }
  }, [progress]);

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
    backgroundSize: "64px 64px",
    imageRendering: "pixelated",
  };

  return (
    <div className="h-[100dvh] wrapper relative overflow-hidden" style={minecraftDirtStyle}>
      <div className="h-[100dvh] relative" ref={ref}>
        <Canvas
          className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />

            <ScrollControls pages={4} damping={0.4} maxSpeed={1} distance={1} style={{ zIndex: 1 }}>
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
