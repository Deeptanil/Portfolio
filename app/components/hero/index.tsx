'use client';

import { Text, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { useScrollStore } from "@stores";
import MinecraftSky from "../models/MinecraftSky";
import MinecraftBee from "../models/MinecraftBee";
import MinecraftPhantom from "../models/MinecraftPhantom";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const SkipButton3D = () => {
  const requestSkipToEnd = useScrollStore((state) => state.requestSkipToEnd);
  const [hovered, setHovered] = useState(false);

  const buttonWidth = isMobile ? 4.8 : 6.0;
  const buttonHeight = isMobile ? 0.9 : 1.1;
  const borderWidth = 0.06;

  return (
    <group
      position={[0, isMobile ? 0.0 : -0.85, -10]}
      onClick={(e) => {
        e.stopPropagation();
        requestSkipToEnd();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Outer Black Border (from danbovey/MinecraftSplashScreen border: 2px solid #000) */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[buttonWidth + borderWidth * 2, buttonHeight + borderWidth * 2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Top/Left Inset Highlight Bevel (inset 2px 2px 0 rgba(255, 255, 255, 0.3)) */}
      <mesh position={[-borderWidth / 2, borderWidth / 2, 0.005]}>
        <planeGeometry args={[buttonWidth, buttonHeight]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Bottom/Right Inset Dark Shadow Bevel (inset 0px -4px 0 rgba(0, 0, 0, 0.3)) */}
      <mesh position={[borderWidth / 2, -borderWidth / 2, 0.006]}>
        <planeGeometry args={[buttonWidth, buttonHeight]} />
        <meshBasicMaterial color="#373737" />
      </mesh>

      {/* Button Center Face (danbovey/MinecraftSplashScreen background: #6A6A6A / hover #8b8b8b) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[buttonWidth - borderWidth * 2, buttonHeight - borderWidth * 2]} />
        <meshBasicMaterial color={hovered ? "#8b8b8b" : "#6a6a6a"} />
      </mesh>

      {/* Text Shadow (Minecraft text shadow: 2px 2px 0 rgba(0, 0, 0, 0.6)) */}
      <Text
        position={[0.016, -0.016, 0.015]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.32 : 0.44}
        color="#373737"
        anchorX="center"
        anchorY="middle"
      >
        Skip to Portfolio
      </Text>

      {/* Main Text in Minecraft Font */}
      <Text
        position={[0, 0, 0.02]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.32 : 0.44}
        color={hovered ? "#ffff55" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        Skip to Portfolio
      </Text>
    </group>
  );
};

const Hero = () => {
  const titleGroupRef = useRef<THREE.Group>(null);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && titleGroupRef.current) {
      gsap.fromTo(
        titleGroupRef.current.position,
        { y: isMobile ? -4 : -8 },
        { y: 0, duration: isMobile ? 1.0 : 1.5, ease: "power2.out" }
      );
    }
  }, [progress]);

  const fontProps = {
    font: "./fonts/MinecraftRegular-Bmg3.otf",
    fontSize: isMobile ? 0.45 : 1.0,
    maxWidth: isMobile ? 6 : undefined,
    textAlign: "center" as const,
    anchorX: "center" as const,
  };

  const roleFontProps = {
    font: "./fonts/MinecraftRegular-Bmg3.otf",
    fontSize: isMobile ? 0.22 : 0.42,
    maxWidth: isMobile ? 6 : undefined,
    textAlign: "center" as const,
    anchorX: "center" as const,
  };

  return (
    <>
      <group ref={titleGroupRef}>
        <Text position={[0, 2, -10]} {...fontProps}>
          Hi, I am Deeptanil Sinha.
        </Text>
        <Text position={[0, isMobile ? 1.55 : 1.05, -10]} {...roleFontProps} color="#ffff55">
          Product Engineer
        </Text>

        {/* 
          Native 3D Mesh SkipButton3D pinned inside titleGroupRef using Minecraft font and
          danbovey/MinecraftSplashScreen button colors (#6A6A6A, inset highlights, #000 border)
        */}
        <SkipButton3D />
      </group>

      <StarsContainer />
      <MinecraftSky />
      <MinecraftBee />
      <MinecraftPhantom />

      <group position={[0, -25, 5.69]}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 4]} intensity={3.5} castShadow />
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10} />
        <WindowModel receiveShadow />
        <TextWindow />
      </group>
    </>
  );
};

export default Hero;
