'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

// Straight linear path: enters from right, exits to left, centered near Y=0 for mobile visibility
const startLocal = new THREE.Vector3(5.5, 0.8, -3.5);
const endLocal = new THREE.Vector3(-5.5, -0.8, -3.5);

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_phantom.glb');
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');

  // Reused every frame instead of allocating fresh Vector3s each time
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchNextPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    if (!isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Expanded scroll range (0.18 -> 0.65) so it takes longer to scroll past
    const linearT = scroll.range(0.18, 0.47);

    const isVisible = linearT > 0.001 && linearT < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Ease curve (cosine ease) so progress lingers near center of screen for longer
      const t = 0.5 - 0.5 * Math.cos(Math.PI * linearT);

      scratchPos.copy(startLocal).lerp(endLocal, t);
      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      // Point toward end of path
      const nextLinearT = Math.min(1, linearT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextLinearT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
    }
  });

  const phantomScale = isMobile ? 0.60 : 0.48;

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={4.0} />
      <directionalLight position={[2, 4, 5]} intensity={4.0} />
      <group rotation={[0, 0, 0]}>
        <primitive object={scene} scale={[phantomScale, phantomScale, phantomScale]} />
      </group>
    </group>
  );
};

useGLTF.preload('models/minecraft_phantom.glb');

export default MinecraftPhantom;
