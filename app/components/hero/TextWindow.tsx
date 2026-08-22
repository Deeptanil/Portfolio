'use client';

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useThemeStore } from "@stores";

const TextWindow = () => {
  const data = useScroll();
  const windowRef = useRef<THREE.Group>(null);
  const isDay = useThemeStore((state) => state.theme.type === 'day');

  const textColor = isDay ? '#1a0933' : '#ffffff';

  useFrame(() => {
    if (!data) return;
    const c = data.range(0.65, 0.15);

    if (windowRef.current) {
      windowRef.current.setRotationFromAxisAngle(new THREE.Vector3(0, -1, 0), 0.5 * Math.PI * c);
      windowRef.current.position.x = -0.6 * c;
      windowRef.current.position.z = -0.6 * c;
    }
  });

  const fontProps = {
    font: "./soria-font.ttf",
  };

  return (
    <group position={[0, -0.3, 0]} ref={windowRef}>
      <Text
        color={textColor}
        anchorX="left"
        anchorY="middle"
        fontSize={1.2}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        PRODUCT ENGINEER
      </Text>

      <Text
        color={textColor}
        anchorX="right"
        anchorY="middle"
        {...fontProps}
        scale={[-1, -1, 1]}
        fontSize={1.2}
        position={[0.12, 0, -1.4]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        UI/UX & E-COMMERCE
      </Text>

      <group position={[-0.45, 0, -0.3]}>
        <Text
          color={textColor}
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          STRAYED & PRETTIVA
        </Text>

        <Text
          color={textColor}
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          MIT BENGALURU '28
        </Text>
      </group>

      <group position={[0.45, 0, -0.3]}>
        <Text
          color={textColor}
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          DIGITAL PRODUCT DEV
        </Text>
        <Text
          color={textColor}
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
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
