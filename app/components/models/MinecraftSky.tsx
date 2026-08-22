'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const SingleCloudLayer = ({
  isBottom = false,
}: {
  isBottom?: boolean;
}) => {
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

  if (isBottom) {
    return (
      <group dispose={null}>
        {/* BOTTOM LAYER: Shifted slightly lower to Y = -68 with X = 35 offset */}
        <primitive
          object={preparedScene}
          position={[35, -68, -6]}
          scale={[5.2, 1.8, 5.2]}
          rotation={[0, Math.PI, 0]}
        />
      </group>
    );
  }

  return (
    <group dispose={null}>
      {/* TOP LAYER: Positioned above text at Y = 12 */}
      <primitive
        object={preparedScene}
        position={[0, 12, -6]}
        scale={[4.2, 1.8, 4.2]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

const MinecraftSky = (props: ComponentProps<'group'>) => {
  // Top Layer Track Refs (Increased Speed: 0.95)
  const topTrack1 = useRef<THREE.Group>(null);
  const topTrack2 = useRef<THREE.Group>(null);

  // Bottom Layer Track Refs (Speed: 1.6)
  const bottomTrack1 = useRef<THREE.Group>(null);
  const bottomTrack2 = useRef<THREE.Group>(null);

  const TRACK_WIDTH = 100;
  const TOP_SPEED = 0.95;     // Increased top clouds speed
  const BOTTOM_SPEED = 1.6;   // Bottom clouds speed

  useFrame((_, delta) => {
    // 1. Move Top Layer
    const topMove = delta * TOP_SPEED;
    if (topTrack1.current && topTrack2.current) {
      topTrack1.current.position.x += topMove;
      topTrack2.current.position.x += topMove;

      if (topTrack1.current.position.x >= TRACK_WIDTH) {
        topTrack1.current.position.x = topTrack2.current.position.x - TRACK_WIDTH;
      }
      if (topTrack2.current.position.x >= TRACK_WIDTH) {
        topTrack2.current.position.x = topTrack1.current.position.x - TRACK_WIDTH;
      }
    }

    // 2. Move Bottom Layer
    const bottomMove = delta * BOTTOM_SPEED;
    if (bottomTrack1.current && bottomTrack2.current) {
      bottomTrack1.current.position.x += bottomMove;
      bottomTrack2.current.position.x += bottomMove;

      if (bottomTrack1.current.position.x >= TRACK_WIDTH) {
        bottomTrack1.current.position.x = bottomTrack2.current.position.x - TRACK_WIDTH;
      }
      if (bottomTrack2.current.position.x >= TRACK_WIDTH) {
        bottomTrack2.current.position.x = bottomTrack1.current.position.x - TRACK_WIDTH;
      }
    }
  });

  return (
    <group {...props}>
      {/* Top Layer Tracks (Increased Speed = 0.95) */}
      <group ref={topTrack1} position={[0, 0, 0]}>
        <SingleCloudLayer isBottom={false} />
      </group>
      <group ref={topTrack2} position={[-TRACK_WIDTH, 0, 0]}>
        <SingleCloudLayer isBottom={false} />
      </group>

      {/* Bottom Layer Tracks (Position Y = -68, Speed = 1.6) */}
      <group ref={bottomTrack1} position={[0, 0, 0]}>
        <SingleCloudLayer isBottom={true} />
      </group>
      <group ref={bottomTrack2} position={[-TRACK_WIDTH, 0, 0]}>
        <SingleCloudLayer isBottom={true} />
      </group>
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
