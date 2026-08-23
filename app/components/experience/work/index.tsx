'use client';

import { Image, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';

const Work = () => {
  const isMobile = useIsMobile();
  const paintingTexture = useTexture(isMobile ? '/painting_m.webp' : '/painting.webp');

  const bgTexture = useMemo(() => {
    const tex = paintingTexture.clone();
    tex.needsUpdate = true;
    if (isMobile) {
      tex.repeat.set(1.0, 0.5);
      tex.offset.set(0.0, 0.5); // Top half for Work tile on mobile
    } else {
      tex.repeat.set(0.5, 1.0);
      tex.offset.set(0.0, 0.0); // Left half for Work tile on PC
    }
    return tex;
  }, [paintingTexture, isMobile]);

  return (
    <group position={[0, 0, 0]}>
      {/* Spanning Background Painting restored to full original brightness */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[isMobile ? 1.85 : 4, isMobile ? 1.85 : 4]} />
        <meshBasicMaterial
          map={bgTexture}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Foreground Icon */}
      <Image
        url="/Enchanted_Book.gif"
        transparent
        scale={[isMobile ? 1.35 : 2.2, isMobile ? 1.35 : 2.2]}
        position={[0, 0, 0.1]}
      />
    </group>
  );
};

export default Work;
