'use client';

import { useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const MinecraftStars = () => {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const isDarkTheme = useThemeStore((state) => state.theme.type === 'dark');

  const count = 1000;

  // Generate random square star transforms on a sky sphere surrounding the camera
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const starData = useMemo(() => {
    const list: { x: number; y: number; z: number; scale: number; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 35 + Math.random() * 30;

      list.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.2 + Math.random() * 0.4,
        rot: Math.random() * Math.PI,
      });
    }
    return list;
  }, [count]);

  // Each star's local transform (position/scale/rotation, looking at the origin) never
  // changes after creation — only the whole field's position (tracks camera) and slow
  // group rotation change per frame. This used to rebuild all 1000 instance matrices from
  // scratch every single frame for an identical result every time; instead, compute them
  // once per mesh instance (via this ref callback, which fires exactly once per mount/
  // remount — important since the mesh unmounts/remounts whenever the theme toggles) and
  // just update position/rotation.y in useFrame.
  const setMeshRef = useCallback(
    (mesh: THREE.InstancedMesh | null) => {
      meshRef.current = mesh;
      if (!mesh) return;

      starData.forEach((star, i) => {
        dummy.position.set(star.x, star.y, star.z);
        dummy.scale.setScalar(star.scale);
        dummy.rotation.z = star.rot;
        dummy.lookAt(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
    [starData, dummy]
  );

  useFrame((state) => {
    if (!meshRef.current || !isDarkTheme) return;

    // Track camera position so starfield remains surrounding camera at ALL scroll positions!
    meshRef.current.position.copy(state.camera.position);

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = time * 0.008;
  });

  if (!isDarkTheme) return null;

  return (
    <instancedMesh ref={setMeshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      {/* Small square pixel star geometry */}
      <planeGeometry args={[0.22, 0.22]} />
      <meshBasicMaterial
        color="#ffffff"
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default MinecraftStars;
