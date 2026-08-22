'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const CloudTile = () => {
  // Generate classic Minecraft flat cloud slabs matching image1.png
  const slabs = useMemo(() => {
    const items: { x: number; y: number; z: number; width: number; height: number; depth: number }[] = [];
    const gridSize = 12;
    const spacing = 6;

    for (let gx = -gridSize; gx <= gridSize; gx++) {
      for (let gz = -gridSize; gz <= gridSize; gz++) {
        // Pseudo-random cloud formation logic mimicking Minecraft cloud map
        const hash = Math.sin(gx * 12.9898 + gz * 78.233) * 43758.5453;
        const rand = hash - Math.floor(hash);

        if (rand > 0.45) {
          const width = 4 + Math.floor(rand * 3) * 3;
          const depth = 4 + Math.floor((1 - rand) * 3) * 3;
          const yOffset = (rand - 0.5) * 0.4;

          items.push({
            x: gx * spacing,
            y: yOffset,
            z: gz * spacing,
            width,
            height: 0.6, // Thin extruded slab shape from Minecraft image
            depth,
          });
        }
      }
    }
    return items;
  }, []);

  return (
    <group>
      {slabs.map((slab, idx) => (
        <mesh key={idx} position={[slab.x, slab.y, slab.z]}>
          <boxGeometry args={[slab.width, slab.height, slab.depth]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.78}
            roughness={0.9}
            metalness={0.0}
            flatShading={true}
          />
        </mesh>
      ))}
    </group>
  );
};

const MinecraftClouds = () => {
  const track1Ref = useRef<THREE.Group>(null);
  const track2Ref = useRef<THREE.Group>(null);

  const LOOP_WIDTH = 144; // Total grid span
  const SPEED = 0.8; // Smooth drift speed

  useFrame((_, delta) => {
    const moveAmount = delta * SPEED;

    if (track1Ref.current && track2Ref.current) {
      track1Ref.current.position.x += moveAmount;
      track2Ref.current.position.x += moveAmount;

      // Infinite continuous wrap: when track 1 moves past LOOP_WIDTH, wrap to -LOOP_WIDTH
      if (track1Ref.current.position.x >= LOOP_WIDTH) {
        track1Ref.current.position.x = track2Ref.current.position.x - LOOP_WIDTH;
      }

      if (track2Ref.current.position.x >= LOOP_WIDTH) {
        track2Ref.current.position.x = track1Ref.current.position.x - LOOP_WIDTH;
      }
    }
  });

  return (
    <group position={[0, 4, -10]} rotation={[0.08, 0, 0]}>
      <group ref={track1Ref} position={[0, 0, 0]}>
        <CloudTile />
      </group>
      <group ref={track2Ref} position={[-LOOP_WIDTH, 0, 0]}>
        <CloudTile />
      </group>
    </group>
  );
};

export default MinecraftClouds;
