'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

// How far in front of the camera the phantom's flight plane sits (local -Z).
const PHANTOM_DEPTH = 3.5;
// How far outside the visible frame edge the path starts/ends, as a multiple of the
// visible half-width at PHANTOM_DEPTH — tuned so a typical 16:9 desktop matches the old
// hardcoded ±5.5 path closely.
const PHANTOM_MARGIN_FACTOR = 1.15;

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_phantom.glb');
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);

  // The flight path's horizontal extent is derived from the camera's actual field of
  // view at the current aspect ratio, not a fixed desktop-tuned constant — vertical FOV
  // is constant, but horizontal FOV narrows sharply on tall/narrow mobile screens, so a
  // fixed ±5.5 path (tuned for wide desktop) used to fly off almost instantly on mobile.
  const { startLocal, endLocal } = useMemo(() => {
    const aspect = size.width / size.height;
    const fovRad = THREE.MathUtils.degToRad(camera.fov ?? 75);
    const halfWidth = PHANTOM_DEPTH * Math.tan(fovRad / 2) * aspect * PHANTOM_MARGIN_FACTOR;
    // Straight linear path: enters from right, exits to left, centered near Y=0 for mobile visibility
    return {
      startLocal: new THREE.Vector3(halfWidth, 0.8, -PHANTOM_DEPTH),
      endLocal: new THREE.Vector3(-halfWidth, -0.8, -PHANTOM_DEPTH),
    };
  }, [size.width, size.height, camera]);

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
