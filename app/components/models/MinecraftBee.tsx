'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const MinecraftBee = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('models/bee_minecraft_flying.glb');
  const { actions } = useAnimations(animations, groupRef);
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().play();
    }
  }, [actions]);

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

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Bee activates as cloud fading starts (scroll 20% -> 60%)
    const t = scroll.range(0.20, 0.60);

    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Camera local space trajectory
      const p0 = new THREE.Vector3(7, 4.5, -3.5);
      const p1 = new THREE.Vector3(5, 1.0, -3.5);
      const p2 = new THREE.Vector3(-1, -2.5, -3.5);
      const p3 = new THREE.Vector3(-9, -6.0, -3.5);

      const localPos = getCubicBezierPoint(p0, p1, p2, p3, t);

      localPos.x += Math.sin(state.clock.elapsedTime * 5) * 0.05;
      localPos.y += Math.cos(state.clock.elapsedTime * 4) * 0.05;

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);
      groupRef.current.position.copy(worldPos);

      const nextT = Math.min(1, t + 0.02);
      const nextLocalPos = getCubicBezierPoint(p0, p1, p2, p3, nextT);
      const nextWorldPos = nextLocalPos.clone();
      state.camera.localToWorld(nextWorldPos);

      groupRef.current.lookAt(nextWorldPos);
      groupRef.current.rotateY(Math.PI);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={3.0} />
      <pointLight position={[0, 0, 5]} intensity={100} />
      <primitive object={scene} scale={[0.08, 0.08, 0.08]} />
    </group>
  );
};

useGLTF.preload('models/bee_minecraft_flying.glb');

export default MinecraftBee;
