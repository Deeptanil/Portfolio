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

  // Bee flies left-to-right (opposite to the Phantom), slightly above center
  const startLocal = new THREE.Vector3(-5, 1.5, -3.0);
  const endLocal = new THREE.Vector3(5, 0.2, -3.0);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Tighter scroll window matching Phantom: enters at 27%, exits at 52%
    const t = scroll.range(0.27, 0.25);

    const isVisible = t > 0.001 && t < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Pure linear interpolation — no bezier, no bouncing
      const localPos = startLocal.clone().lerp(endLocal, t);

      // Gentle natural bobbing (small amplitude so it doesn't look like bouncing)
      localPos.y += Math.sin(state.clock.elapsedTime * 4) * 0.04;

      const worldPos = localPos.clone();
      state.camera.localToWorld(worldPos);
      groupRef.current.position.copy(worldPos);

      // Orient toward travel direction
      const nextT = Math.min(1, t + 0.05);
      const nextLocalPos = startLocal.clone().lerp(endLocal, nextT);
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
