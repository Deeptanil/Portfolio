'use client';

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";

const TextWindow = () => {
  const windowRef = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);
  const isMobile = useIsMobile();

  const fontProps = {
    font: "./soria-font.ttf",
    frustumCulled: false,
    side: THREE.DoubleSide, // Guarantees text faces are never culled by WebGL backface culling
  };

  const { textScale, sideX } = useMemo(() => {
    const aspect = size.width / size.height;
    // Desktop aspect (~1.6 or wider) uses scale 1, sideX = 0.45.
    const scaleFactor = THREE.MathUtils.clamp(aspect / 1.6, 0.45, 1.0);
    const sideXVal = 0.45 * THREE.MathUtils.clamp(aspect / 1.4, 0.75, 1.0);
    return {
      textScale: scaleFactor,
      sideX: sideXVal,
    };
  }, [size.width, size.height]);

  // On mobile screens, omit the 3D text tunnel inside the window aperture matching mohitvirli.github.io
  if (isMobile) {
    return null;
  }

  return (
    <group position={[0, -0.3, 0]} scale={textScale} ref={windowRef}>

      {/* Bottom Wall */}
      <Text
        color="white"
        anchorX="left"
        anchorY="middle"
        fontSize={1.3}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        PRODUCT ENGINEER
      </Text>

      {/* Top Wall */}
      <Text
        color="white"
        anchorX="right"
        anchorY="middle"
        {...fontProps}
        fontSize={1.3}
        position={[-0.05, 0, -1.4]}
        scale={[-1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        UI/UX & E-COMMERCE
      </Text>

      {/* Left Wall */}
      <group position={[-sideX, 0, -0.3]}>
        <Text
          color="white"
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          fontSize={0.8}
          scale={[1, -1, 1]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          STRAYED & PRETTIVA
        </Text>

        <Text
          color="white"
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          scale={[1, -1, 1]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          MIT BENGALURU '28
        </Text>
      </group>

      {/* Right Wall */}
      <group position={[sideX, 0, -0.3]}>
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          fontSize={0.8}
          scale={[-1, -1, 1]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          DIGITAL PRODUCT DEV
        </Text>
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          scale={[-1, -1, 1]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          WEB PERFORMANCE & SEO
        </Text>
      </group>
    </group>
  );
};

export default TextWindow;
