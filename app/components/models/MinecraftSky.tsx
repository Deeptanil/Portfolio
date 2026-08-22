'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useRef } from 'react';
import * as THREE from 'three';

const MinecraftSky = (props: ComponentProps<'group'>) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_sky.glb');

  // Continuous lateral drift to the right
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 0.4;
      // Loop laterally
      if (groupRef.current.position.x > 25) {
        groupRef.current.position.x = -25;
      }
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Scaled & positioned at bottom of Hero section for fly-through scroll */}
      <primitive
        object={scene.clone()}
        scale={3.5}
        position={[0, -4, 0]}
        rotation={[0.1, 0, 0]}
      />
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
