'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const SingleCloudLayer = () => {
  const { scene } = useGLTF('models/minecraft_sky.glb');
  const isNight = useThemeStore((state) => state.theme.type === 'night');

  // Clone scene and accurately center its 3D geometry bounding box
  const preparedScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    
    // Offset cloned scene so geometry origin is at (0, 0, 0)
    cloned.position.set(-center.x, -center.y, -center.z);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat) {
            if (!isNight) {
              mat.color = new THREE.Color('#ffffff');
              mat.emissive = new THREE.Color('#ffffff');
              mat.emissiveIntensity = 0.45;
              mat.roughness = 0.9;
            } else {
              mat.color = new THREE.Color('#d0d5e8');
              mat.emissive = new THREE.Color('#101828');
              mat.emissiveIntensity = 0.1;
              mat.roughness = 0.9;
            }
          }
        }
      }
    });

    return cloned;
  }, [scene, isNight]);

  return (
    <group dispose={null}>
      {/* 
        LAYER 1: TOP CLOUD LAYER (Positioned above text at Y = 12)
      */}
      <primitive
        object={preparedScene}
        position={[0, 12, -6]}
        scale={[4.5, 1.8, 4.5]}
        rotation={[0, 0, 0]}
      />

      {/* 
        LAYER 2: BOTTOM CLOUD LAYER (Shifted down to Y = -56 for perfect breathing room below text)
      */}
      <primitive
        object={preparedScene.clone()}
        position={[0, -56, -6]}
        scale={[4.5, 1.8, 4.5]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

const MinecraftSky = (props: ComponentProps<'group'>) => {
  const track1Ref = useRef<THREE.Group>(null);
  const track2Ref = useRef<THREE.Group>(null);

  const TRACK_WIDTH = 100;
  const SPEED = 1.0;

  useFrame((_, delta) => {
    const moveAmount = delta * SPEED;

    if (track1Ref.current && track2Ref.current) {
      track1Ref.current.position.x += moveAmount;
      track2Ref.current.position.x += moveAmount;

      if (track1Ref.current.position.x >= TRACK_WIDTH) {
        track1Ref.current.position.x = track2Ref.current.position.x - TRACK_WIDTH;
      }

      if (track2Ref.current.position.x >= TRACK_WIDTH) {
        track2Ref.current.position.x = track1Ref.current.position.x - TRACK_WIDTH;
      }
    }
  });

  return (
    <group {...props}>
      <group ref={track1Ref} position={[0, 0, 0]}>
        <SingleCloudLayer />
      </group>
      <group ref={track2Ref} position={[-TRACK_WIDTH, 0, 0]}>
        <SingleCloudLayer />
      </group>
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
