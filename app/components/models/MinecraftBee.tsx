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

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    // Bee activates as cloud fading starts (scroll range 0.10 -> 0.35)
    const beeProgress = scroll.range(0.10, 0.35);

    // Visible while active
    const isVisible = beeProgress > 0.001 && beeProgress < 0.999;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Fly across page from top-right corner to bottom-left corner
      const startX = 22;
      const endX = -25;
      const startY = 12;
      const endY = -12;
      const startZ = -2;
      const endZ = 6;

      const currentX = THREE.MathUtils.lerp(startX, endX, beeProgress);
      const currentY = THREE.MathUtils.lerp(startY, endY, beeProgress);
      const currentZ = THREE.MathUtils.lerp(startZ, endZ, beeProgress);

      groupRef.current.position.set(currentX, currentY, currentZ);

      // Facing direction towards flight trajectory + subtle flapping tilt
      groupRef.current.rotation.y = -Math.PI / 3 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 6) * 0.12;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={scene} scale={[0.8, 0.8, 0.8]} />
    </group>
  );
};

useGLTF.preload('models/bee_minecraft_flying.glb');

export default MinecraftBee;
