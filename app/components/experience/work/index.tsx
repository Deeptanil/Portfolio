'use client';

import { Image, Text } from '@react-three/drei';

const Work = () => {
  return (
    <group position={[0, 0, 0]}>
      <Image
        url="/Enchanted_Book.gif"
        transparent
        scale={[2.2, 2.2]}
        position={[0, 0.4, 0.1]}
      />
      <Text fontSize={0.35} font="./fonts/MinecraftRegular-Bmg3.otf" color="white" position={[0, -1.2, 0.1]}>
        WORK & EDUCATION
      </Text>
    </group>
  );
};

export default Work;
