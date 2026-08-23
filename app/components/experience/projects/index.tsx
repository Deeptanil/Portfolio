'use client';

import { Image, useTexture } from '@react-three/drei';
import { isMobile } from 'react-device-detect';
import { useMemo } from 'react';

const Projects = () => {
  const paintingTexture = useTexture(isMobile ? '/painting_m.webp' : '/painting.webp');

  const bgTexture = useMemo(() => {
    const tex = paintingTexture.clone();
    tex.needsUpdate = true;
    if (isMobile) {
      tex.repeat.set(1.0, 0.5);
      tex.offset.set(0.0, 0.0); // Bottom half for About tile on mobile
    } else {
      tex.repeat.set(0.5, 1.0);
      tex.offset.set(0.5, 0.0); // Right half for About tile on PC
    }
    return tex;
  }, [paintingTexture]);

  return (
    <group position={[0, 0, 0]}>
      {/* Spanning Background Painting with reduced brightness on mobile for text readability */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[isMobile ? 1.85 : 4, isMobile ? 1.85 : 4]} />
        <meshBasicMaterial
          map={bgTexture}
          transparent
          opacity={isMobile ? 0.52 : 0.88}
          color={isMobile ? "#888888" : "#ffffff"}
        />
      </mesh>

      {/* Foreground Icon */}
      <Image
        url="/Stone_Pickaxe.png"
        transparent
        scale={[isMobile ? 1.35 : 2.2, isMobile ? 1.35 : 2.2]}
        position={[0, 0, 0.1]}
      />
    </group>
  );
};

export default Projects;
