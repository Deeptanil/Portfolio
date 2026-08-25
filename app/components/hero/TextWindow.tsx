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
  };

  const textScale = useMemo(() => {
    const aspect = size.width / size.height;
    if (isMobile) {
      return THREE.MathUtils.clamp(aspect / 1.1, 0.65, 1);
    }
    return THREE.MathUtils.clamp(aspect / 1.6, 0.5, 1);
  }, [size.width, size.height, isMobile]);

  const primaryFontSize = isMobile ? 0.65 : 1.3;
  const secondaryFontSize = isMobile ? 0.42 : 0.8;

  return (
    <group position={[0, -0.3, 0]} scale={textScale} ref={windowRef}>

      <Text color="white" anchorX="left" anchorY="middle"
        fontSize={primaryFontSize}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}>
        PRODUCT ENGINEER
      </Text>

      <Text color="white" anchorX="right" anchorY="middle"
        {...fontProps}
        scale={[-1, -1, 1]}
        fontSize={primaryFontSize}
        position={[-0.05, 0, -1.4]}
        rotation={[0, 0, -Math.PI / 2]}>
        UI/UX & E-COMMERCE
      </Text>

      <group position={[isMobile ? -0.70 : -0.45, 0, -0.3]}>
        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={secondaryFontSize}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          STRAYED & PRETTIVA
        </Text>

        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={secondaryFontSize}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          MIT BENGALURU '28
        </Text>
      </group>

      <group position={[isMobile ? 0.70 : 0.45, 0, -0.3]}>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={secondaryFontSize}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          DIGITAL PRODUCT DEV
        </Text>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={secondaryFontSize}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          WEB PERFORMANCE & SEO
        </Text>
      </group>
    </group>
  );
};

export default TextWindow;
