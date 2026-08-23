'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const MinecraftStars = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');

  const count = 600;

  // Generate random square star transforms on a sky sphere surrounding the camera
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const starData = useMemo(() => {
    const list: { x: number; y: number; z: number; scale: number; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 35 + Math.random() * 25;

      list.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.3 + Math.random() * 0.5,
        rot: Math.random() * Math.PI,
      });
    }
    return list;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || !isDarkTheme) return;

    // Track camera position so starfield remains surrounding camera at ALL scroll positions!
    meshRef.current.position.copy(state.camera.position);

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.01;

    starData.forEach((star, i) => {
      dummy.position.set(star.x, star.y, star.z);
      dummy.scale.setScalar(star.scale);
      dummy.rotation.z = star.rot;
      dummy.lookAt(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!isDarkTheme) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      {/* Minecraft square pixel star geometry */}
      <planeGeometry args={[0.8, 0.8]} />
      <meshBasicMaterial
        color="#ffffff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default MinecraftStars;
