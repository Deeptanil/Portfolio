'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

// Individual Minecraft voxel blocky cloud cluster
const MinecraftVoxelCloudCluster = ({
  seed = 1,
  scale = 1.5,
}: {
  seed: number;
  scale?: number;
}) => {
  const blocks = useMemo(() => {
    const list: { x: number; y: number; z: number; width: number; height: number; depth: number }[] = [];
    const numBlocks = 6 + Math.floor((seed % 4) * 2);

    for (let i = 0; i < numBlocks; i++) {
      const hash = Math.sin(seed * 100 + i * 17.3) * 43758.5453;
      const randX = (hash - Math.floor(hash) - 0.5) * 6;
      const randZ = (Math.sin(hash) - 0.5) * 6;
      const width = 3 + Math.floor(Math.abs(randX)) * 2;
      const depth = 3 + Math.floor(Math.abs(randZ)) * 2;

      list.push({
        x: randX,
        y: (i % 2 === 0 ? 0 : 0.4),
        z: randZ,
        width,
        height: 0.8,
        depth,
      });
    }
    return list;
  }, [seed]);

  return (
    <group scale={scale}>
      {blocks.map((b, idx) => (
        <mesh key={idx} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.width, b.height, b.depth]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.85}
            roughness={0.9}
            metalness={0.0}
            flatShading={true}
          />
        </mesh>
      ))}
    </group>
  );
};

// 3D Cloud Fly-Through positions matching original clevir.li cloud positions
const MinecraftClouds = () => {
  return (
    <group>
      {/* Cloud 1: Upper left */}
      <group position={[-3, 1, 0]}>
        <MinecraftVoxelCloudCluster seed={1} scale={1.8} />
      </group>

      {/* Cloud 2: Upper right */}
      <group position={[4, 1, 2]}>
        <MinecraftVoxelCloudCluster seed={3} scale={1.4} />
      </group>

      {/* Cloud 3: Mid-level left */}
      <group position={[-12, -10, 4]}>
        <MinecraftVoxelCloudCluster seed={4} scale={2.2} />
      </group>

      {/* Cloud 4: Mid-level right */}
      <group position={[8, -3, 8]}>
        <MinecraftVoxelCloudCluster seed={5} scale={2.0} />
      </group>

      {/* Cloud 5: Low deep cloud */}
      <group position={[0, -20, 20]}>
        <MinecraftVoxelCloudCluster seed={6} scale={3.5} />
      </group>

      {/* Cloud 6: Horizon side cloud */}
      <group position={[12, -15, -5]}>
        <MinecraftVoxelCloudCluster seed={7} scale={2.8} />
      </group>
    </group>
  );
};

export default MinecraftClouds;
