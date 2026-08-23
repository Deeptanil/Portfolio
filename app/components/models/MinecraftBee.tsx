'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

// How far in front of the camera the bee's flight plane sits (local -Z).
const BEE_DEPTH = 3.0;
// How far outside the visible frame edge the path starts/ends, as a multiple of the
// visible half-width at BEE_DEPTH — tuned so a typical 16:9 desktop matches the old
// hardcoded ±5.5 path closely.
const BEE_MARGIN_FACTOR = 1.34;

const MinecraftBee = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('models/bee_minecraft_flying.glb');
  const { actions } = useAnimations(animations, groupRef);
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().play();
    }
  }, [actions]);

  // The flight path's horizontal extent is derived from the camera's actual field of
  // view at the current aspect ratio, not a fixed desktop-tuned constant — vertical FOV
  // is constant, but horizontal FOV narrows sharply on tall/narrow mobile screens, so a
  // fixed ±5.5 path (tuned for wide desktop) used to fly off almost instantly on mobile.
  const { startLocal, endLocal } = useMemo(() => {
    const aspect = size.width / size.height;
    const fovRad = THREE.MathUtils.degToRad(camera.fov ?? 75);
    const halfWidth = BEE_DEPTH * Math.tan(fovRad / 2) * aspect * BEE_MARGIN_FACTOR;
    // Bee flies left-to-right (opposite to the Phantom), slightly above center
    return {
      startLocal: new THREE.Vector3(-halfWidth, 1.2, -BEE_DEPTH),
      endLocal: new THREE.Vector3(halfWidth, 0.2, -BEE_DEPTH),
    };
  }, [size.width, size.height, camera]);

  // Reused every frame instead of allocating fresh Vector3s each time
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchNextPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!groupRef.current || !scroll) return;

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Enters at 0.21 and fully exits by ~0.32 — well before the window scene starts
    // opening at scroll ~0.4, so the bee is gone before the window comes into focus.
    const linearT = scroll.range(0.21, 0.11);

    const isVisible = linearT > 0.001 && linearT < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      // Cosine ease curve so progress lingers near center of screen
      const t = 0.5 - 0.5 * Math.cos(Math.PI * linearT);

      scratchPos.copy(startLocal).lerp(endLocal, t);

      // Gentle natural bobbing
      scratchPos.y += Math.sin(state.clock.elapsedTime * 4) * 0.04;

      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      // Orient toward travel direction
      const nextLinearT = Math.min(1, linearT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextLinearT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
      groupRef.current.rotateY(Math.PI);
    }
  });

  const beeScale = isMobile ? 0.09 : 0.08;

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
