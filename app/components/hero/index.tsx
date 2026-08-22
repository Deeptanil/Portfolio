'use client';

import MinecraftClouds from "../models/MinecraftClouds";
import ParticleAura from "../models/ParticleAura";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import KineticText from "./KineticText";
import TextWindow from "./TextWindow";

const Hero = () => {
  return (
    <>
      <KineticText />
      <ParticleAura />
      <StarsContainer />
      <MinecraftClouds />
      
      {/* 3D Window Model Section */}
      <group position={[0, -25, 5.69]}>
        <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ff9e64" castShadow />
        <pointLight position={[1, 1, -2.5]} intensity={60} color="#ff7a00" distance={10} castShadow />
        <WindowModel receiveShadow />
        <TextWindow />
      </group>
    </>
  );
};

export default Hero;
