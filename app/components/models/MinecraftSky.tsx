'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ComponentProps, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '@stores';

// Shared material setup for a cloned scene
const createSceneClone = (
  baseScene: THREE.Group,
  isNight: boolean,
  materialsRef: React.MutableRefObject<THREE.MeshStandardMaterial[]>
) => {
  const cloned = baseScene.clone(true);
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

// ─────────────────────────────────────────────────────────────
// 3-Tile Seamless Ring Treadmill
// Uses exact GLB bounding box width so tiles connect edge-to-edge
// with ZERO gaps, ZERO breaks, and off-screen wrap.
// ─────────────────────────────────────────────────────────────
const CloudTreadmill = ({
  y,
  z = 0,
  scale,
  speed,
  initialOffset = 0,
  rotationY = 0,
  materialsRef,
}: {
  y: number;
  z?: number;
  scale: [number, number, number];
  speed: number;
  initialOffset?: number;
  rotationY?: number;
  materialsRef: React.MutableRefObject<THREE.MeshStandardMaterial[]>;
}) => {
  const { scene } = useGLTF('models/minecraft_sky.glb');
  const isNight = useThemeStore((state) => state.theme.type === 'night');

  // Compute exact model bounds and create 3 seamless clones
  const { preparedSceneA, preparedSceneB, preparedSceneC, tileWidth } = useMemo(() => {
    const centeredGroup = scene.clone(true);
    const box = new THREE.Box3().setFromObject(centeredGroup);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center model at origin
    centeredGroup.position.set(-center.x, -center.y, -center.z);

    // Exact tile width scaled into world space (with 1% overlap to eliminate subpixel hairline gaps)
    const w = size.x * scale[0] * 0.99;

    const a = createSceneClone(centeredGroup, isNight, materialsRef);
    const b = createSceneClone(centeredGroup, isNight, materialsRef);
    const c = createSceneClone(centeredGroup, isNight, materialsRef);

    return { preparedSceneA: a, preparedSceneB: b, preparedSceneC: c, tileWidth: w };
  }, [scene, isNight, scale, materialsRef]);

  const refA = useRef<THREE.Group>(null);
  const refB = useRef<THREE.Group>(null);
  const refC = useRef<THREE.Group>(null);
  const drift = useRef(0);

  useFrame((_, delta) => {
    drift.current += delta * speed;

    const span = 3 * tileWidth;
    const halfSpan = 1.5 * tileWidth;
    const refs = [refA, refB, refC];

    refs.forEach((ref, i) => {
      if (!ref.current) return;
      // Position each of the 3 tiles relative to accumulated drift
      let posX = initialOffset + drift.current + (i - 1) * tileWidth;
      
      // Wrap smoothly around [-halfSpan, +halfSpan]
      posX = ((posX + halfSpan) % span) - halfSpan;
      if (posX < -halfSpan) posX += span;

      ref.current.position.x = posX;
    });
  });

  return (
    <group position={[0, y, z]}>
      <group ref={refA}>
        <primitive object={preparedSceneA} scale={scale} rotation={[0, rotationY, 0]} />
      </group>
      <group ref={refB}>
        <primitive object={preparedSceneB} scale={scale} rotation={[0, rotationY, 0]} />
      </group>
      <group ref={refC}>
        <primitive object={preparedSceneC} scale={scale} rotation={[0, rotationY, 0]} />
      </group>
    </group>
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
      {/* Top Cloud Layer — 3-tile seamless treadmill */}
      <CloudTreadmill
        y={12}
        z={0}
        scale={[4.2, 1.8, 4.2]}
        speed={1.2}
        initialOffset={0}
        rotationY={0}
        materialsRef={materialsRef}
      />
      {/* Bottom Cloud Layer — 3-tile seamless treadmill */}
      <CloudTreadmill
        y={-90}
        z={0}
        scale={[5.2, 1.8, 5.2]}
        speed={2.0}
        initialOffset={25}
        rotationY={Math.PI}
        materialsRef={materialsRef}
      />
    </group>
  );
};

useGLTF.preload('models/minecraft_sky.glb');

export default MinecraftSky;
