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

  useFrame((state, delta) => {
    if (!groupRef.current || !scroll) return;

    if (!isDark) {
      groupRef.current.visible = false;
      return;
    }

    const t = scroll.range(0.20, 0.60);
    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      const p0 = new THREE.Vector3(7, 4.5, -3.5);
      const p1 = new THREE.Vector3(5, 1.0, -3.5);
      const p2 = new THREE.Vector3(-1, -2.5, -3.5);
      const p3 = new THREE.Vector3(-9, -6.0, -3.5);

      const localPos = getCubicBezierPoint(p0, p1, p2, p3, t);

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);

      // Smooth lerp position
      groupRef.current.position.lerp(worldPos, Math.min(1, delta * 6));

      // Right-side up orientation along flight path
      const nextT = Math.min(1, t + 0.03);
      const nextLocalPos = getCubicBezierPoint(p0, p1, p2, p3, nextT);
      const nextWorldPos = nextLocalPos.clone();
      state.camera.localToWorld(nextWorldPos);

      const targetRotation = new THREE.Matrix4().lookAt(
        groupRef.current.position,
        nextWorldPos,
        new THREE.Vector3(0, 1, 0)
      );
      const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotation);
      groupRef.current.quaternion.slerp(targetQuat, Math.min(1, delta * 8));
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={4.0} />
      <directionalLight position={[2, 4, 5]} intensity={4.0} />
      <primitive object={scene} scale={[0.45, 0.45, 0.45]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};

useGLTF.preload('models/minecraft_phantom.glb');

export default MinecraftPhantom;
