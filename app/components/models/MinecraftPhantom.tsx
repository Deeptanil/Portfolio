'use client';

import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

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

// ─────────────────────────────────────────────────────────────
// Minecraft Phantom Voxel Model (Night Mob)
// Dark navy body, flapping wings, and glowing green eyes.
// ─────────────────────────────────────────────────────────────
const PhantomModel = () => {
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Flapping wings animation
    const flap = Math.sin(state.clock.elapsedTime * 9) * 0.35;
    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.7 }),
    []
  );
  const wingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.8 }),
    []
  );
  const eyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4ade80',
        emissive: '#22c55e',
        emissiveIntensity: 3.5,
        roughness: 0.2,
      }),
    []
  );

  return (
    <group scale={[0.18, 0.18, 0.18]}>
      {/* Central Body & Spine */}
      <mesh material={bodyMat} position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.4, 2.2]} />
      </mesh>

      {/* Head */}
      <mesh material={bodyMat} position={[0, -0.05, 1.3]}>
        <boxGeometry args={[0.7, 0.35, 0.6]} />
      </mesh>

      {/* Glowing Green Eyes */}
      <mesh material={eyeMat} position={[-0.22, 0.05, 1.55]}>
        <boxGeometry args={[0.18, 0.1, 0.15]} />
      </mesh>
      <mesh material={eyeMat} position={[0.22, 0.05, 1.55]}>
        <boxGeometry args={[0.18, 0.1, 0.15]} />
      </mesh>

      {/* Left Wing (Flapping) */}
      <group ref={leftWingRef} position={[-0.4, 0, 0.2]}>
        <mesh material={wingMat} position={[-1.2, 0, 0]}>
          <boxGeometry args={[2.4, 0.08, 1.4]} />
        </mesh>
      </group>

      {/* Right Wing (Flapping) */}
      <group ref={rightWingRef} position={[0.4, 0, 0.2]}>
        <mesh material={wingMat} position={[1.2, 0, 0]}>
          <boxGeometry args={[2.4, 0.08, 1.4]} />
        </mesh>
      </group>

      {/* Tail membrane */}
      <mesh material={wingMat} position={[0, 0.05, -1.5]}>
        <boxGeometry args={[0.5, 0.1, 1.0]} />
      </mesh>
    </group>
  );
};

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');

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

      // Organic phantom flight swoop oscillation
      localPos.x += Math.sin(state.clock.elapsedTime * 4) * 0.08;
      localPos.y += Math.cos(state.clock.elapsedTime * 3) * 0.08;

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
      <ambientLight intensity={2.0} />
      <pointLight position={[0, 0, 5]} intensity={80} />
      <PhantomModel />
    </group>
  );
};

export default MinecraftPhantom;
