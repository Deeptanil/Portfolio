'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

// How far in front of the camera the bee's flight plane sits (local -Z).
const BEE_DEPTH = 3.0;
// How far outside the visible frame edge the path starts/ends
const BEE_MARGIN_FACTOR = 1.34;

const MinecraftBee = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('models/bee_minecraft_flying.glb');
  const { actions } = useAnimations(animations, groupRef);
  const scroll = useScroll();
  const isDark = useThemeStore((state) => state.theme.type === 'dark');
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const rootScene = useThree((state) => state.scene);

  // WebGLRenderer.compile() (which <Preload all/> calls) only visits currently-visible
  // objects via traverseVisible() — since this group starts (and mostly stays) hidden
  // until its scroll range is reached, its shader never gets precompiled up front. Without
  // this, the very first frame it becomes visible mid-scroll pays a real, synchronous
  // shader-compile stall — exactly the "lag right as it enters" symptom. Force-compile it
  // once here, while still hidden behind the loading screen, so that cost never happens
  // mid-flight.
  useEffect(() => {
    if (!groupRef.current) return;
    const wasVisible = groupRef.current.visible;
    groupRef.current.visible = true;
    gl.compile(rootScene, camera);
    groupRef.current.visible = wasVisible;
  }, [gl, rootScene, camera]);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().play();
    }
  }, [actions]);

  const { startLocal, endLocal } = useMemo(() => {
    const aspect = size.width / size.height;
    const fovRad = THREE.MathUtils.degToRad(camera.fov ?? 75);
    const halfWidth = BEE_DEPTH * Math.tan(fovRad / 2) * aspect * BEE_MARGIN_FACTOR;
    // Bee flies left-to-right, slightly above center
    return {
      startLocal: new THREE.Vector3(-halfWidth, 1.2, -BEE_DEPTH),
      endLocal: new THREE.Vector3(halfWidth, 0.2, -BEE_DEPTH),
    };
  }, [size.width, size.height, camera]);

  // Reused every frame
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchNextPos = useMemo(() => new THREE.Vector3(), []);
  // The rest of the scene (camera, clouds, stars) moves via THREE.MathUtils.damp — an
  // exponential smoothing that inherently absorbs frame-to-frame jitter. This model's
  // position used to be a direct, undamped function of the raw scroll value each frame,
  // which is why its motion read as comparatively less smooth. Damping the progress value
  // itself brings it in line with everything else's feel.
  const dampedLinearTRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !scroll) return;

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Starts at 0.30 (around the time it used to end) and spans 0.30 distance for smooth leisurely flight
    const linearT = scroll.range(0.30, 0.30);

    const isVisible = linearT > 0.001 && linearT < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      dampedLinearTRef.current = THREE.MathUtils.damp(dampedLinearTRef.current, linearT, 8, delta);
      const smoothedT = dampedLinearTRef.current;

      // Cosine ease curve so progress lingers near center of screen
      const t = 0.5 - 0.5 * Math.cos(Math.PI * smoothedT);

      scratchPos.copy(startLocal).lerp(endLocal, t);

      // Gentle natural bobbing
      scratchPos.y += Math.sin(state.clock.elapsedTime * 4) * 0.04;

      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      // Orient toward travel direction
      const nextSmoothedT = Math.min(1, smoothedT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextSmoothedT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
      groupRef.current.rotateY(Math.PI);
    } else {
      // Stay in sync so it doesn't visibly "catch up" the next time it becomes visible
      dampedLinearTRef.current = linearT;
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
