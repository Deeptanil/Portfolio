'use client';

import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const PortalGateway = () => {
  const outerArchRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const data = useScroll();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Constant slow float animation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = time * 0.15;
      innerCoreRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = -time * 0.25;
      ring1Ref.current.rotation.x = time * 0.1;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = time * 0.3;
      ring2Ref.current.rotation.y = -time * 0.15;
    }

    // Scroll-driven portal unfolding
    if (data) {
      const scrollRange = data.range(0.2, 0.5);

      if (outerArchRef.current) {
        outerArchRef.current.rotation.y = THREE.MathUtils.damp(
          outerArchRef.current.rotation.y,
          Math.PI * 0.5 * scrollRange,
          4,
          delta
        );
        outerArchRef.current.scale.setScalar(1 + scrollRange * 0.4);
      }
    }
  });

  return (
    <group position={[0, -22, 5]} scale={1.2}>
      {/* Point lights for internal glass glow */}
      <pointLight position={[0, 2, 2]} intensity={25} color="#a78bfa" distance={12} />
      <pointLight position={[-2, -2, -2]} intensity={20} color="#38bdf8" distance={10} />

      {/* Main Glass Monolith / Archway */}
      <mesh ref={outerArchRef} castShadow receiveShadow>
        <boxGeometry args={[2.2, 4.2, 0.4]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          opacity={1}
          transparent={true}
          roughness={0.1}
          ior={1.5}
          thickness={1.2}
          specularIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Internal Rotating Core */}
      <group ref={innerCoreRef}>
        <mesh>
          <octahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#4c1d95"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.2}
            wireframe={true}
          />
        </mesh>
      </group>

      {/* Orbital Chrome Rings */}
      <mesh ref={ring1Ref} position={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} />
      </mesh>

      <mesh ref={ring2Ref} position={[0, 0, 0]}>
        <torusGeometry args={[2.4, 0.015, 16, 100]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

export default PortalGateway;
