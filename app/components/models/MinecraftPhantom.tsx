'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';
import { isMobile } from 'react-device-detect';

// Straight linear path: enters from right, exits to left, centered near Y=0
const PHANTOM_DEPTH = 3.5;
const PHANTOM_MARGIN_FACTOR = 1.15;

const MinecraftPhantom = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_phantom.glb');
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
  // mid-flight. Purely additive — does not touch orientation/rotation/position logic.
  useEffect(() => {
    if (!groupRef.current) return;
    const wasVisible = groupRef.current.visible;
    groupRef.current.visible = true;
    gl.compile(rootScene, camera);
    groupRef.current.visible = wasVisible;
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
  // The rest of the scene (camera, clouds, stars) moves via THREE.MathUtils.damp — an
  // exponential smoothing that inherently absorbs frame-to-frame jitter. This model's
  // position used to be a direct, undamped function of the raw scroll value each frame,
  // which is why its motion read as comparatively less smooth. Damping the progress value
  // itself brings it in line with everything else's feel. Purely a position-smoothing
  // change — does not touch orientation/rotation logic.
  const dampedLinearTRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !scroll) return;

    if (!isDark) {
      groupRef.current.visible = false;
      return;
    }

    // Starts at 0.30 and spans 0.30 distance for smooth leisurely flight
    const linearT = scroll.range(0.30, 0.30);

    const isVisible = linearT > 0.001 && linearT < 0.995;
    groupRef.current.visible = isVisible;

    if (isVisible) {
      dampedLinearTRef.current = THREE.MathUtils.damp(dampedLinearTRef.current, linearT, 8, delta);
      const smoothedT = dampedLinearTRef.current;

      // Ease curve (cosine ease) so progress lingers near center of screen
      const t = 0.5 - 0.5 * Math.cos(Math.PI * smoothedT);

      scratchPos.copy(startLocal).lerp(endLocal, t);
      state.camera.localToWorld(scratchPos);
      groupRef.current.position.copy(scratchPos);

      // Point toward end of path
      const nextSmoothedT = Math.min(1, smoothedT + 0.03);
      const nextT = 0.5 - 0.5 * Math.cos(Math.PI * nextSmoothedT);
      scratchNextPos.copy(startLocal).lerp(endLocal, nextT);
      state.camera.localToWorld(scratchNextPos);

      groupRef.current.lookAt(scratchNextPos);
    } else {
      // Stay in sync so it doesn't visibly "catch up" the next time it becomes visible
      dampedLinearTRef.current = linearT;
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
