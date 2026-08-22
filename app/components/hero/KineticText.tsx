'use client';

import { Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const KineticText = () => {
  const mainTitleRef = useRef<THREE.Group>(null);
  const subtitleRef = useRef<THREE.Group>(null);
  const subtextRef = useRef<THREE.Group>(null);
  const data = useScroll();

  const theme = useThemeStore((state) => state.theme);
  const isSunset = theme.type === 'sunset';

  // High-contrast dynamic colors based on theme
  const titleColor = isSunset ? '#1a0933' : '#ffffff';
  const subtitleColor = isSunset ? '#701a75' : '#a78bfa';
  const subtextColor = isSunset ? '#3b0764' : '#94a3b8';

  useFrame((state, delta) => {
    if (data) {
      const scrollVal = data.range(0, 0.4);

      if (mainTitleRef.current) {
        mainTitleRef.current.position.x = THREE.MathUtils.damp(
          mainTitleRef.current.position.x,
          -scrollVal * 4,
          5,
          delta
        );
        mainTitleRef.current.rotation.z = THREE.MathUtils.damp(
          mainTitleRef.current.rotation.z,
          scrollVal * 0.15,
          5,
          delta
        );
      }

      if (subtitleRef.current) {
        subtitleRef.current.position.x = THREE.MathUtils.damp(
          subtitleRef.current.position.x,
          scrollVal * 4,
          5,
          delta
        );
      }

      if (subtextRef.current) {
        subtextRef.current.position.y = THREE.MathUtils.damp(
          subtextRef.current.position.y,
          -1.2 - scrollVal * 3,
          5,
          delta
        );
      }
    }

    if (mainTitleRef.current) {
      mainTitleRef.current.rotation.y = THREE.MathUtils.lerp(
        mainTitleRef.current.rotation.y,
        state.pointer.x * 0.08,
        0.05
      );
    }
  });

  return (
    <group position={[0, 1.5, -8]}>
      {/* Primary Hero Header */}
      <group ref={mainTitleRef}>
        <Text
          fontSize={1.4}
          color={titleColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          position={[0, 1.2, 0]}
        >
          DEEPTANIL SINHA
        </Text>
      </group>

      {/* Sub-header */}
      <group ref={subtitleRef}>
        <Text
          fontSize={0.65}
          color={subtitleColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
          position={[0, 0.1, 0]}
        >
          CREATIVE FULL-STACK DEVELOPER
        </Text>
      </group>

      {/* Narrative Bio snippet */}
      <group ref={subtextRef} position={[0, -1.2, 0]}>
        <Text
          fontSize={0.28}
          color={subtextColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={7}
          textAlign="center"
          lineHeight={1.4}
        >
          Founder of STRAYED • Co-Founder of Prettiva & Co.
          {"\n"}
          Combining design aesthetics, engineering precision, and business strategy.
        </Text>
      </group>
    </group>
  );
};

export default KineticText;
