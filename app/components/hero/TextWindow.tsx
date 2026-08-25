'use client';

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const TextWindow = () => {
  const data = useScroll();
  const windowRef = useRef<THREE.Group>(null);

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
    frustumCulled: false,
  };

  return (
    <group position={[0, -0.3, 0]} ref={windowRef}>
      {/* Bottom Wall */}
      <Text
        color="white"
        anchorX="left"
        anchorY="middle"
        fontSize={1.3}
        position={[0.12, 0, 0]}
        {...fontProps}
        material-side={THREE.DoubleSide}
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
        material-side={THREE.DoubleSide}
        fontSize={1.3}
        position={[-0.05, 0, -1.4]}
        scale={[-1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        UI/UX & E-COMMERCE
      </Text>

      {/* Left Wall */}
      <group position={[-0.45, 0, -0.3]}>
        <Text
          color="white"
          anchorX="left"
          anchorY="middle"
          {...fontProps}
          material-side={THREE.DoubleSide}
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
          material-side={THREE.DoubleSide}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          scale={[1, -1, 1]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}
        >
          MIT BENGALURU '28
        </Text>
      </group>

      {/* Right Wall */}
      <group position={[0.45, 0, -0.3]}>
        <Text
          color="white"
          anchorX="right"
          anchorY="middle"
          {...fontProps}
          material-side={THREE.DoubleSide}
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
          material-side={THREE.DoubleSide}
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
