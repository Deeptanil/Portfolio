'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MinecraftBee = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('models/bee_minecraft_flying.glb');
  const { actions } = useAnimations(animations, groupRef);
  const scroll = useScroll();

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().play();
    }
  }, [actions]);

  // Helper for Cubic Bezier Curve evaluation
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

    // Bee activates at cloud fade start (scroll 10%) and completes exit off screen bottom by 36% scroll
    const t = scroll.range(0.10, 0.36);

    // Visible only while actively flying (0.001 < t < 0.995) — prevents freezing on screen when clamped at 1.0!
    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      const camY = state.camera.position.y;

      // Trajectory: Spawns in TOP-RIGHT corner, curves down across screen, flies DEEP DOWN off bottom edge
      const p0 = new THREE.Vector3(22, camY + 12, 1);    // Top-Right corner spawn
      const p1 = new THREE.Vector3(12, camY + 1, 3);     // Upper-right curve arc
      const p2 = new THREE.Vector3(-4, camY - 14, 4);    // Center-left downward swoop
      const p3 = new THREE.Vector3(-25, camY - 45, 6);   // Deep DOWN off bottom-left screen edge

      const pos = getCubicBezierPoint(p0, p1, p2, p3, t);

      // Organic hovering oscillation
      pos.x += Math.sin(state.clock.elapsedTime * 5) * 0.12;
      pos.y += Math.cos(state.clock.elapsedTime * 4) * 0.15;

      groupRef.current.position.copy(pos);

      // Tangent vector for head-first orientation
      const nextT = Math.min(1, t + 0.02);
      const nextPos = getCubicBezierPoint(p0, p1, p2, p3, nextT);
      const dir = nextPos.sub(pos).normalize();

      if (dir.lengthSq() > 0.001) {
        groupRef.current.rotation.y = Math.atan2(dir.x, dir.z) + Math.PI;
        groupRef.current.rotation.x = dir.y * 0.4;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={3.0} />
      <pointLight position={[0, 0, 5]} intensity={100} />
      {/* 0.09 scale: compact, realistic Minecraft bee */}
      <primitive object={scene} scale={[0.09, 0.09, 0.09]} />
    </group>
  );
};

useGLTF.preload('models/bee_minecraft_flying.glb');

export default MinecraftBee;
