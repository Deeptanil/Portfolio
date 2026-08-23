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

  // Straight linear path: enters from right, exits to left, centered near Y=0 for mobile visibility
  const startLocal = new THREE.Vector3(4.5, 1.0, -3.5);
  const endLocal = new THREE.Vector3(-4.5, -1.0, -3.5);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    if (!isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Tighter scroll window: enters later, leaves earlier
    const t = scroll.range(0.27, 0.25);

    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Pure linear interpolation in camera local space — no bezier, no bouncing
      const localPos = startLocal.clone().lerp(endLocal, t);

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);
      groupRef.current.position.copy(worldPos);

      // Point toward end of path
      const nextT = Math.min(1, t + 0.05);
      const nextLocal = startLocal.clone().lerp(endLocal, nextT);
      const nextWorld = nextLocal.clone();
      state.camera.localToWorld(nextWorld);

      groupRef.current.lookAt(nextWorld);
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
