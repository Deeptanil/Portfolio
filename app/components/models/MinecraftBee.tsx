'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

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

  // Bee flies left-to-right (opposite to the Phantom), slightly above center
  const startLocal = new THREE.Vector3(-5.5, 1.2, -3.0);
  const endLocal = new THREE.Vector3(5.5, 0.2, -3.0);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Enters at 0.21 and exits earlier at 0.65
    const linearT = scroll.range(0.21, 0.44);

    const isVisible = linearT > 0.001 && linearT < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Cosine ease curve so progress lingers near center of screen
      const t = 0.5 - 0.5 * Math.cos(Math.PI * linearT);

      const localPos = startLocal.clone().lerp(endLocal, t);

      // Gentle natural bobbing
      localPos.y += Math.sin(state.clock.elapsedTime * 4) * 0.04;

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);
      groupRef.current.position.copy(worldPos);

      // Orient toward travel direction
      const nextLinearT = Math.min(1, linearT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextLinearT);
      const nextLocalPos = startLocal.clone().lerp(endLocal, nextT);
      const nextWorldPos = nextLocalPos.clone();
      state.camera.localToWorld(nextWorldPos);

      groupRef.current.lookAt(nextWorldPos);
      groupRef.current.rotateY(Math.PI);
    }
  });

  const beeScale = isMobile ? 0.12 : 0.08;

  return (
    <group ref={groupRef} visible={false}>
      <ambientLight intensity={3.0} />
      <pointLight position={[0, 0, 5]} intensity={100} />
      <primitive object={scene} scale={[beeScale, beeScale, beeScale]} />
    </group>
  );
};

useGLTF.preload('models/bee_minecraft_flying.glb');

export default MinecraftBee;
