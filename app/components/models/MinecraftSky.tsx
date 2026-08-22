'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

const MinecraftSky = (props: ComponentProps<'group'>) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('models/minecraft_sky.glb');

  // Automatically center bounding box of GLB geometry
  useLayoutEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
    }
  }, [scene]);

  // Continuous visible lateral drift to the right (+X)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x += delta * 1.8;
      if (groupRef.current.position.x > 35) {
        groupRef.current.position.x = -35;
      }
    }
  });

  // Moved down to Y = -18 so the clouds sit cleanly BELOW the text (which is at Y = 2)
  return (
    <group ref={groupRef} position={[0, -18, -6]} {...props} dispose={null}>
      <primitive
        object={scene}
        scale={[5, 3, 5]}
        rotation={[0.1, 0, 0]}
      />
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
