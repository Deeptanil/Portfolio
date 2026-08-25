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

  const textScale = useMemo(() => {
    const aspect = size.width / size.height;
    if (isMobile) {
      return THREE.MathUtils.clamp(aspect / 1.5, 0.45, 0.8);
    }
    return THREE.MathUtils.clamp(aspect / 1.6, 0.5, 1);
  }, [size.width, size.height, isMobile]);

  const primaryFontSize = isMobile ? 0.75 : 1.3;
  const secondaryFontSize = isMobile ? 0.48 : 0.8;
  const sideX = isMobile ? 0.38 : 0.45;

  return (
    <group position={[0, -0.3, 0]} scale={textScale} ref={windowRef}>

      {/* Bottom Wall */}
      <Text
        color="white"
        anchorX="left"
        anchorY="middle"
        fontSize={primaryFontSize}
        position={[isMobile ? 0.08 : 0.12, 0, 0]}
        {...fontProps}
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
        fontSize={primaryFontSize}
        position={[-0.05, 0, -1.4]}
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
          fontSize={secondaryFontSize}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          STRAYED & PRETTIVA
        </Text>

        <Text
          color="white"
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          fontSize={secondaryFontSize}
          position={[0, 0, -0.6]}
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
          fontSize={secondaryFontSize}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          DIGITAL PRODUCT DEV
        </Text>
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          fontSize={secondaryFontSize}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          WEB PERFORMANCE & SEO
        </Text>
      </group>
    </group>
  );
};

export default TextWindow;
