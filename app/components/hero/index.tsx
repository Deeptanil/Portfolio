'use client';

import { Text, useProgress, useTexture } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const buttonWidth = isMobile ? 4.8 : 6.2;
  const buttonHeight = isMobile ? 0.9 : 1.15;
  const borderWidth = 0.07;

  // Real Minecraft dirt-block texture on the face instead of a flat color, so it reads as
  // an actual in-game UI button rather than a generic bevel.
  const dirtTexture = useTexture('/minecraft_dirt.webp');
  const faceTexture = useMemo(() => {
    const tex = dirtTexture.clone();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(isMobile ? 3.5 : 4.5, 1);
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, [dirtTexture]);

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
      {/* Outer Black Border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[buttonWidth + borderWidth * 2, buttonHeight + borderWidth * 2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Top/Left White Bevel Highlight */}
      <mesh position={[-borderWidth / 2, borderWidth / 2, 0.005]}>
        <planeGeometry args={[buttonWidth, buttonHeight]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Bottom/Right Dark Bevel Shadow */}
      <mesh position={[borderWidth / 2, -borderWidth / 2, 0.006]}>
        <planeGeometry args={[buttonWidth, buttonHeight]} />
        <meshBasicMaterial color="#373737" />
      </mesh>

      {/* Button Center Face — real dirt-block texture, tinted yellow on hover */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[buttonWidth - borderWidth * 2, buttonHeight - borderWidth * 2]} />
        <meshBasicMaterial map={faceTexture} color={hovered ? "#ffff55" : "#ffffff"} />
      </mesh>

      {/* Text Shadow */}
      <Text
        position={[0.018, -0.018, 0.015]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.32 : 0.48}
        color="#373737"
        anchorX="center"
        anchorY="middle"
      >
        Skip to Portfolio
      </Text>

      {/* Main Text */}
      <Text
        position={[0, 0, 0.02]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.32 : 0.48}
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

        {/* 3D Native Canvas Button with authentic Minecraft bevel styling and enlarged dimensions */}
        <SkipButton3D />
      </group>

      <StarsContainer />
      <MinecraftSky />
      <MinecraftBee />
      <MinecraftPhantom />

      <group position={[0, -25, 5.69]}>
        <ambientLight intensity={1.5} />
        {/* Only one shadow-casting light — the window's handle/pane rotate continuously
            during this scroll range, so every additional shadow-casting light doubles the
            shadow-map recompute cost for the entire time it's on screen. */}
        <directionalLight position={[3, 5, 4]} intensity={3.5} castShadow />
        <pointLight position={[1, 1, -2.5]} intensity={60} distance={10} />
        <WindowModel receiveShadow />
        <TextWindow />
      </group>
    </>
  );
};

export default Hero;
