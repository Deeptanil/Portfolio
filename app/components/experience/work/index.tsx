'use client';

import { Image } from '@react-three/drei';

const Work = () => {
  return (
    <group position={[0, 0, 0]}>
      <Image
        url="/Enchanted_Book.gif"
        transparent
        scale={[2.5, 2.5]}
        position={[0, 0, 0.1]}
      />
    </group>
  );
};

export default Work;
