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

  const w = isMobile ? 3.4 : 5.4;
  const h = isMobile ? 0.60 : 0.90;
  const b = isMobile ? 0.04 : 0.05; // border bevel thickness

  return (
    <group
      position={[0, isMobile ? 0.2 : -0.85, -10]}
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
      {/* 1. Outer Black Container Border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 2. Top Inner Highlight (White) */}
      <mesh position={[0, h / 2 - b, 0.005]}>
        <planeGeometry args={[w - b * 2, b]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3. Left Inner Highlight (White) */}
      <mesh position={[-w / 2 + b, 0, 0.005]}>
        <planeGeometry args={[b, h - b * 2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 4. Bottom Inner Shadow (Dark Grey #373737) */}
      <mesh position={[0, -h / 2 + b, 0.005]}>
        <planeGeometry args={[w - b * 2, b]} />
        <meshBasicMaterial color="#373737" />
      </mesh>

      {/* 5. Right Inner Shadow (Dark Grey #373737) */}
      <mesh position={[w / 2 - b, 0, 0.005]}>
        <planeGeometry args={[b, h - b * 2]} />
        <meshBasicMaterial color="#373737" />
      </mesh>

      {/* 6. Button Center Face (#707070, hover #8b8b8b) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w - b * 3, h - b * 3]} />
        <meshBasicMaterial color={hovered ? "#8b8b8b" : "#707070"} />
      </mesh>

      {/* 7. Text Drop Shadow (#373737) */}
      <Text
        position={[0.015, -0.015, 0.015]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.22 : 0.38}
        color="#373737"
        anchorX="center"
        anchorY="middle"
      >
        Skip to Portfolio
      </Text>

      {/* 8. Main Text (White #ffffff, hover #ffff55) */}
      <Text
        position={[0, 0, 0.02]}
        font="./fonts/MinecraftRegular-Bmg3.otf"
        fontSize={isMobile ? 0.22 : 0.38}
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
          Native 3D Mesh SkipButton3D pinned inside titleGroupRef matching authentic Minecraft button
          design from user screenshot (black container, 4-sided inner highlight/shadow bevels, #707070 face)
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
