'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const MinecraftClouds = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate Minecraft blocky cloud clusters
  const cloudBlocks = useMemo(() => {
    const blocks: { x: number; y: number; z: number; width: number; height: number; depth: number }[] = [];
    
    // Cluster 1
    for (let x = -15; x <= 15; x += 3) {
      for (let z = -10; z <= 10; z += 3) {
        if (Math.random() > 0.35) {
          blocks.push({
            x: x + (Math.random() - 0.5),
            y: (Math.random() - 0.5) * 0.8,
            z: z + (Math.random() - 0.5),
            width: 3 + Math.floor(Math.random() * 2) * 2,
            height: 1.2,
            depth: 3 + Math.floor(Math.random() * 2) * 2,
          });
        }
      }
    }

    // Cluster 2 (high clouds)
    for (let x = -25; x <= 25; x += 4) {
      for (let z = -20; z <= 20; z += 4) {
        if (Math.random() > 0.5) {
          blocks.push({
            x: x,
            y: 8 + (Math.random() - 0.5) * 1.5,
            z: z,
            width: 4,
            height: 1.5,
            depth: 4,
          });
        }
      }
    }

    return blocks;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 0.4;
      // Loop clouds smoothly
      if (groupRef.current.position.x > 30) {
        groupRef.current.position.x = -30;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -5]}>
      {cloudBlocks.map((block, idx) => (
        <mesh key={idx} position={[block.x, block.y, block.z]}>
          <boxGeometry args={[block.width, block.height, block.depth]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.88}
            roughness={0.9}
            metalness={0.1}
            flatShading={true}
          />
        </mesh>
      ))}
    </group>
  );
};

export default MinecraftClouds;
