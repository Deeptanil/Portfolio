'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

// Shared material setup for a cloned scene
const prepareScene = (
  scene: THREE.Group,
  isNight: boolean,
  materialsRef: React.MutableRefObject<THREE.MeshStandardMaterial[]>
) => {
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
        const origMat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        if (origMat) {
          const mat = origMat.clone();
          mat.color = new THREE.Color(isNight ? '#d0d5e8' : '#ffffff');
          mat.emissive = new THREE.Color(isNight ? '#101828' : '#ffffff');
          mat.emissiveIntensity = isNight ? 0.1 : 0.45;
          mat.roughness = 0.9;
          mat.transparent = true;
          mat.opacity = 1.0;
          mesh.material = mat;
          materialsRef.current.push(mat);
        }
      }
    }
  });
  return cloned;
};

const CloudTreadmill = ({
  y,
  z = 0,
  scale,
  speed,
  spacing,
  initialOffset = 0,
  rotationY = 0,
  materialsRef,
}: {
  y: number;
  z?: number;
  scale: [number, number, number];
  speed: number;
  spacing: number;
  initialOffset?: number;
  rotationY?: number;
  materialsRef: React.MutableRefObject<THREE.MeshStandardMaterial[]>;
}) => {
  const { scene } = useGLTF('models/minecraft_sky.glb');
  const isNight = useThemeStore((state) => state.theme.type === 'night');

  const sceneA = useMemo(() => prepareScene(scene, isNight, materialsRef), [scene, isNight, materialsRef]);
  const sceneB = useMemo(() => prepareScene(scene, isNight, materialsRef), [scene, isNight, materialsRef]);

  const refA = useRef<THREE.Group>(null);
  const refB = useRef<THREE.Group>(null);
  const drift = useRef(0);

  useFrame((_, delta) => {
    drift.current += delta * speed;
    const pos = drift.current % spacing;
    if (refA.current) refA.current.position.x = initialOffset + pos;
    if (refB.current) refB.current.position.x = initialOffset + pos - spacing;
  });

  return (
    <>
      <group ref={refA} position={[initialOffset, y, z]}>
        <primitive object={sceneA} scale={scale} rotation={[0, rotationY, 0]} />
      </group>
      <group ref={refB} position={[initialOffset - spacing, y, z]}>
        <primitive object={sceneB} scale={scale} rotation={[0, rotationY, 0]} />
      </group>
    </>
  );
};

const MinecraftSky = (props: ComponentProps<'group'>) => {
  const cloudGroupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const scroll = useScroll();

  useFrame((_, delta) => {
    if (!cloudGroupRef.current || !scroll) return;

    // windowRange: 0 -> 1 as camera moves toward window (scroll 10% -> 30%)
    const windowRange = scroll.range(0.10, 0.30);

    // 1. Quadratic scale up as window becomes visible
    const targetScale = 1 + 8 * windowRange * windowRange;
    cloudGroupRef.current.scale.setScalar(
      THREE.MathUtils.damp(cloudGroupRef.current.scale.x, targetScale, 6, delta)
    );

    // 2. Upward screen motion (+Z and +Y)
    const targetY = 180 * windowRange;
    const targetZ = 220 * windowRange;
    cloudGroupRef.current.position.y = THREE.MathUtils.damp(
      cloudGroupRef.current.position.y, targetY, 6, delta
    );
    cloudGroupRef.current.position.z = THREE.MathUtils.damp(
      cloudGroupRef.current.position.z, targetZ, 6, delta
    );

    // 3. Smooth slow opacity fade out: 1.0 at top (scroll < 10%), slowly dissolves to 0.0 by scroll 32%
    const fadeRange = scroll.range(0.10, 0.32);
    const targetOpacity = Math.max(0, 1 - fadeRange);

    const isVisible = targetOpacity > 0.001;
    cloudGroupRef.current.visible = isVisible;

    if (isVisible) {
      materialsRef.current.forEach((mat) => {
        mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOpacity, 6, delta);
      });
    }
  });

  return (
    <group ref={cloudGroupRef} {...props}>
      {/* Top Cloud Layer — Single depth Z = 0 */}
      <CloudTreadmill
        y={12}
        z={0}
        scale={[4.2, 1.8, 4.2]}
        speed={0.95}
        spacing={90}
        initialOffset={0}
        rotationY={0}
        materialsRef={materialsRef}
      />
      {/* Bottom Cloud Layer — Single depth Z = 0 */}
      <CloudTreadmill
        y={-90}
        z={0}
        scale={[5.2, 1.8, 5.2]}
        speed={1.6}
        spacing={90}
        initialOffset={35}
        rotationY={Math.PI}
        materialsRef={materialsRef}
      />
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
