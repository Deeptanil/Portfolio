'use client';

import { Text, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const KineticText = () => {
  const mainTitleRef = useRef<THREE.Group>(null);
  const subtitleRef = useRef<THREE.Group>(null);
  const subtextRef = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (data) {
      const scrollVal = data.range(0, 0.4);

      // Kinetic skewing and lateral motion on scroll
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
          -2 - scrollVal * 3,
          5,
          delta
        );
      }
    }

    // Subtle pointer parallax effect
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
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
          position={[0, 1.2, 0]}
        >
          DEEPTANIL SINHA
        </Text>
      </group>

      {/* Sub-header with italic contrast */}
      <group ref={subtitleRef}>
        <Text
          fontSize={0.65}
          color="#a78bfa"
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
          color="#94a3b8"
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
