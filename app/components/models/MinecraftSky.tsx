'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

const TopCloudLayer = () => {
  const { scene } = useGLTF('models/minecraft_sky.glb');
  const isNight = useThemeStore((state) => state.theme.type === 'night');

  const preparedScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    cloned.position.set(-center.x, -center.y, -center.z);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat) {
            mat.color = new THREE.Color(isNight ? '#d0d5e8' : '#ffffff');
            mat.emissive = new THREE.Color(isNight ? '#101828' : '#ffffff');
            mat.emissiveIntensity = isNight ? 0.1 : 0.45;
            mat.roughness = 0.9;
          }
        }
      }
    });
    return cloned;
  }, [scene, isNight]);

  return (
    <group dispose={null}>
      {/* TOP LAYER: Positioned far into screen (Z = -28) */}
      <primitive
        object={preparedScene}
        position={[0, 12, -28]}
        scale={[4.2, 1.8, 4.2]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};

const BottomCloudLayer = () => {
  const { scene } = useGLTF('models/minecraft_sky.glb');
  const isNight = useThemeStore((state) => state.theme.type === 'night');

  const preparedScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    cloned.position.set(-center.x, -center.y, -center.z);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat) {
            mat.color = new THREE.Color(isNight ? '#d0d5e8' : '#ffffff');
            mat.emissive = new THREE.Color(isNight ? '#101828' : '#ffffff');
            mat.emissiveIntensity = isNight ? 0.1 : 0.45;
            mat.roughness = 0.9;
          }
        }
      }
    });
    return cloned;
  }, [scene, isNight]);

  return (
    <group dispose={null}>
      {/* BOTTOM LAYER: Shifted further down in Y (Y = -90, Z = 24 closer to user) */}
      <primitive
        object={preparedScene}
        position={[35, -90, 24]}
        scale={[5.2, 1.8, 5.2]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
};

const MinecraftSky = (props: ComponentProps<'group'>) => {
  const topTrack1 = useRef<THREE.Group>(null);
  const topTrack2 = useRef<THREE.Group>(null);

  const bottomTrack1 = useRef<THREE.Group>(null);
  const bottomTrack2 = useRef<THREE.Group>(null);

  const TRACK_WIDTH = 100;
  const TOP_SPEED = 0.95;     // Top clouds speed
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
      {/* Top Layer Tracks (Z = -28) */}
      <group ref={topTrack1} position={[0, 0, 0]}>
        <TopCloudLayer />
      </group>
      <group ref={topTrack2} position={[-TRACK_WIDTH, 0, 0]}>
        <TopCloudLayer />
      </group>

      {/* Bottom Layer Tracks (Y = -90, Z = 24) */}
      <group ref={bottomTrack1} position={[0, 0, 0]}>
        <BottomCloudLayer />
      </group>
      <group ref={bottomTrack2} position={[-TRACK_WIDTH, 0, 0]}>
        <BottomCloudLayer />
      </group>
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
