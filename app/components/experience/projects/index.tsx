'use client';

import { Image, Text } from '@react-three/drei';

const Projects = () => {
  return (
    <group position={[0, 0, 0]}>
      <Image
        url="/Stone_Pickaxe.png"
        transparent
        scale={[2.2, 2.2]}
        position={[0, 0.4, 0.1]}
      />
      <Text fontSize={0.35} font="./fonts/MinecraftRegular-Bmg3.otf" color="white" position={[0, -1.2, 0.1]}>
        ABOUT ME
      </Text>
    </group>
  );
};

export default Projects;
