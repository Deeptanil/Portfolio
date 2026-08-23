'use client';

import { Text, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import MinecraftSky from "../models/MinecraftSky";
import MinecraftBee from "../models/MinecraftBee";
import MinecraftPhantom from "../models/MinecraftPhantom";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(
        titleRef.current.position,
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

  return (
    <>
      <Text position={[0, 2, -10]} {...fontProps} ref={titleRef}>
        Hi, I am Deeptanil Sinha.
      </Text>
      <StarsContainer />
      
      {/* Minecraft Sky clouds centered and positioned BELOW the text */}
      <MinecraftSky />

      {/* Day Mode: Flying Minecraft Bee */}
      <MinecraftBee />

      {/* Night Mode: Flying Minecraft Phantom with glowing eyes */}
      <MinecraftPhantom />

      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10} />
        <WindowModel receiveShadow />
        <TextWindow />
      </group>
    </>
  );
};

export default Hero;
