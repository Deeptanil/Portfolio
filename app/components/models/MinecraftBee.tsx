'use client';

import { useAnimations, useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore, useScrollStore } from '@stores';
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
  const isAutoScrolling = useScrollStore((state) => state.isAutoScrolling);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const rootScene = useThree((state) => state.scene);

  useEffect(() => {
    if (!groupRef.current) return;
    // Keep visible = true so gl.compile() during initial loading screen pre-compiles all shaders
    groupRef.current.visible = true;
    gl.compile(rootScene, camera);
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
    return {
      startLocal: new THREE.Vector3(-halfWidth, 1.2, -BEE_DEPTH),
      endLocal: new THREE.Vector3(halfWidth, 0.2, -BEE_DEPTH),
    };
  }, [size.width, size.height, camera]);

  // Reused every frame
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchNextPos = useMemo(() => new THREE.Vector3(), []);
  const dampedLinearTRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !scroll) return;

    // Bee flies ONLY in Day mode (when not dark)
    if (isDark) {
      groupRef.current.position.set(0, -9999, -9999);
      return;
    }

    // Keep visible = true always so Three.js shaders stay pre-compiled without mid-scroll stalls
    groupRef.current.visible = true;

    const linearT = scroll.range(0.30, 0.30);
    const isVisible = linearT > 0.001 && linearT < 0.995;

    if (isVisible) {
      const safeDelta = Math.min(delta, 0.033);
      const dampSpeed = isAutoScrolling ? 25 : 8;
      dampedLinearTRef.current = THREE.MathUtils.damp(dampedLinearTRef.current, linearT, dampSpeed, safeDelta);
      const smoothedT = dampedLinearTRef.current;

      const t = 0.5 - 0.5 * Math.cos(Math.PI * smoothedT);

      scratchPos.copy(startLocal).lerp(endLocal, t);
      scratchPos.y += Math.sin(state.clock.elapsedTime * 4) * 0.04;

      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      const nextSmoothedT = Math.min(1, smoothedT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextSmoothedT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
      groupRef.current.rotateY(Math.PI);
    } else {
      dampedLinearTRef.current = linearT;
      // Position safely offscreen when not in flight range
      groupRef.current.position.set(0, -9999, -9999);
    }
  });

  const beeScale = isMobile ? 0.09 : 0.08;

  return (
    <group ref={groupRef} visible={true}>
      <ambientLight intensity={3.0} />
      <pointLight position={[0, 0, 5]} intensity={100} />
      <primitive object={scene} scale={[beeScale, beeScale, beeScale]} />
    </group>
  );
};

useGLTF.preload('models/bee_minecraft_flying.glb');

export default MinecraftBee;
