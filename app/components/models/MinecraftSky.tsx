'use client';

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const MinecraftSky = (props: Partial<THREE.Object3D>) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_sky.glb');

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={scene.clone()} scale={5} position={[0, 0, 0]} />
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
