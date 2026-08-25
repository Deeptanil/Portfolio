'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLWarmupProps {
  progress: number;
  onWarmupComplete: () => void;
}

export const WebGLWarmup = ({ progress, onWarmupComplete }: WebGLWarmupProps) => {
  const { gl, scene, camera } = useThree();
  const frameCountRef = useRef(0);
  const isCompleteRef = useRef(false);

  useEffect(() => {
    if (progress === 100 && scene && camera) {
      // Traverse scene and force GPU texture allocation for all loaded materials
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            const m = mat as any;
            if (m.map) gl.initTexture(m.map);
            if (m.emissiveMap) gl.initTexture(m.emissiveMap);
            if (m.normalMap) gl.initTexture(m.normalMap);
            if (m.roughnessMap) gl.initTexture(m.roughnessMap);
            if (m.metalnessMap) gl.initTexture(m.metalnessMap);
            if (m.aoMap) gl.initTexture(m.aoMap);
          });
        }
      });

      // Synchronously compile all shaders currently attached to scene objects
      try {
        gl.compile(scene, camera);
      } catch {}
    }
  }, [progress, gl, scene, camera]);

  useFrame(() => {
    if (progress < 100 || isCompleteRef.current) return;

    frameCountRef.current += 1;

    // After 6 WebGL render passes (allowing offscreen portal FBOs to compile & render), mark complete
    if (frameCountRef.current >= 6) {
      isCompleteRef.current = true;
      onWarmupComplete();
    }
  });

  return null;
};

export default WebGLWarmup;
