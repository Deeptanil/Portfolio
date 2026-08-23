'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_phantom.glb');
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');

  // Helper for 4-point Cubic Bezier Curve evaluation
  const getCubicBezierPoint = (
    p0: THREE.Vector3,
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
    t: number
  ) => {
    const oneMinusT = 1 - t;
    return new THREE.Vector3()
      .addScaledVector(p0, oneMinusT * oneMinusT * oneMinusT)
      .addScaledVector(p1, 3 * oneMinusT * oneMinusT * t)
      .addScaledVector(p2, 3 * oneMinusT * t * t)
      .addScaledVector(p3, t * t * t);
  };

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    // Phantom flies ONLY in night/dark mode
    if (!isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Phantom activates during night scroll (scroll 20% -> 60%)
    const t = scroll.range(0.20, 0.60);

    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Camera-local space flight curve
      const p0 = new THREE.Vector3(7, 4.5, -3.5);
      const p1 = new THREE.Vector3(5, 1.0, -3.5);
      const p2 = new THREE.Vector3(-1, -2.5, -3.5);
      const p3 = new THREE.Vector3(-9, -6.0, -3.5);

      const localPos = getCubicBezierPoint(p0, p1, p2, p3, t);

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);
      groupRef.current.position.copy(worldPos);

      // Orientation along flight curve
      const nextT = Math.min(1, t + 0.02);
      const nextLocalPos = getCubicBezierPoint(p0, p1, p2, p3, nextT);
      const nextWorldPos = nextLocalPos.clone();
      state.camera.localToWorld(nextWorldPos);

      groupRef.current.lookAt(nextWorldPos);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={4.0} />
      <directionalLight position={[2, 4, 5]} intensity={4.0} />
      <group rotation={[0, 0, 0]}>
        <primitive object={scene} scale={[0.45, 0.45, 0.45]} />
      </group>
    </group>
  );
};

useGLTF.preload('models/minecraft_phantom.glb');

export default MinecraftPhantom;
