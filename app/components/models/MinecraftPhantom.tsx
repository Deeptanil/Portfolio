'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore, useScrollStore } from '@stores';
import { isMobile } from 'react-device-detect';

// Straight linear path: enters from right, exits to left, centered near Y=0
const PHANTOM_DEPTH = 3.5;
const PHANTOM_MARGIN_FACTOR = 1.15;

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_phantom.glb');
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
    // Disable frustum culling & expand bounding spheres so no submesh (head/tail/wings) is ever clipped
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        if (mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundingSphere();
          if (mesh.geometry.boundingSphere) {
            mesh.geometry.boundingSphere.radius = 1000;
          }
        }
      }
    });
  }, [scene]);

  const { startLocal, endLocal } = useMemo(() => {
    const aspect = size.width / size.height;
    const fovRad = THREE.MathUtils.degToRad(camera.fov ?? 75);
    const halfWidth = PHANTOM_DEPTH * Math.tan(fovRad / 2) * aspect * PHANTOM_MARGIN_FACTOR;
    return {
      startLocal: new THREE.Vector3(halfWidth, 0.8, -PHANTOM_DEPTH),
      endLocal: new THREE.Vector3(-halfWidth, -0.8, -PHANTOM_DEPTH),
    };
  }, [size.width, size.height, camera]);

  // Reused every frame
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchNextPos = useMemo(() => new THREE.Vector3(), []);
  const dampedLinearTRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !scroll) return;

    if (!isDark) {
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
      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      const nextSmoothedT = Math.min(1, smoothedT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextSmoothedT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
    } else {
      dampedLinearTRef.current = linearT;
      // Position safely offscreen when not in flight range
      groupRef.current.position.set(0, -9999, -9999);
    }
  });

  const phantomScale = isMobile ? 0.60 : 0.48;

  return (
    <group ref={groupRef} visible={true}>
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
