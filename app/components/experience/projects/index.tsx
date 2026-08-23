'use client';

import { Image } from '@react-three/drei';

const Projects = () => {
  return (
    <group position={[0, 0, 0]}>
      <Image
        url="/Stone_Pickaxe.png"
        transparent
        scale={[2.5, 2.5]}
        position={[0, 0, 0.1]}
      />
    </group>
  );
};

export default Projects;
