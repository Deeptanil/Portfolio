'use client';

import { Edges, MeshPortalMaterial, Text, TextProps, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import gsap from "gsap";
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useIsMobile';

interface GridTileProps {
  id: string;
  title: string;
  textAlign: TextProps['textAlign'];
  children: React.ReactNode;
  color: string;
  position: THREE.Vector3;
}

const GridTile = (props: GridTileProps) => {
  const titleRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const hoverBoxRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const { title, children, color, position, id } = props;
  const { camera } = useThree();
  const router = useRouter();
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const data = useScroll();
  const isMobile = useIsMobile();

  const isWork = id === 'work';

  useEffect(() => {
    if (isMobile && titleRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (titleRef.current as any).fillOpacity = 1;
    }
  }, [id, isMobile]);

  useFrame(() => {
    if (!data) return;
    const d = data.range(0.95, 0.05);
    if (isMobile && titleRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (titleRef.current as any).fillOpacity = Math.max(0.8, d);
    }
  });

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handlePointerDown = (e: any) => {
    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handlePointerUp = (e: any) => {
    if (!touchStartRef.current) return;
    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;
    const moveDist = Math.hypot(clientX - touchStartRef.current.x, clientY - touchStartRef.current.y);
    const duration = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Mistouch Prevention: If finger moved > 12px or tap was < 40ms, treat as scroll swipe & ignore!
    if (moveDist > 12 || duration < 40) {
      return;
    }

    portalInto(e);
  };

  const portalInto = (e: React.SyntheticEvent | Event) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }

    if (id === 'work') {
      router.push('/work');
      return;
    }
    if (id === 'about') {
      router.push('/about');
      return;
    }

    if (isActive || activePortalId) return;
    setActivePortal(id);
  };

  const fontProps: Partial<TextProps> = {
    font: "./soria-font.ttf",
    maxWidth: isMobile ? 1.8 : 3.2,
    anchorX: isMobile ? 'center' : (isWork ? 'left' : 'right'),
    anchorY: isMobile ? 'middle' : 'bottom',
    fontSize: isMobile ? 0.18 : 0.55,
    color: 'white',
    textAlign: isMobile ? 'center' : (isWork ? 'left' : 'right'),
    fillOpacity: isMobile ? 1 : 0,
    outlineWidth: isMobile ? 0.006 : 0,
    outlineColor: '#444444',
    outlineBlur: isMobile ? '40%' : 0,
    outlineOpacity: isMobile ? 0.5 : 0,
    outlineOffsetX: isMobile ? 0.002 : 0,
    outlineOffsetY: isMobile ? -0.002 : 0,
  };

  const textPosition: [number, number, number] = isMobile
    ? [0, 0, 0.4]
    : isWork
    ? [-1.6, -1.6, 0.4]
    : [1.6, -1.6, 0.4];

  const onPointerOver = () => {
    if (isActive || isMobile) return;
    document.body.style.cursor = 'pointer';
    gsap.to(titleRef.current, {
      fillOpacity: 1
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0.5, duration: 0.4 });
      gsap.to(hoverBoxRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    }
  };

  const onPointerOut = () => {
    if (isMobile) return;
    document.body.style.cursor = 'auto';
    gsap.to(titleRef.current, {
      fillOpacity: 0
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0, duration: 0.4 });
      gsap.to(hoverBoxRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
    }
  };

  const getGeometry = () => {
    if (!isMobile) {
      return <planeGeometry args={[4, 4, 1]} />;
    }
    return <planeGeometry args={[1.85, 1.85, 1]} />;
  };

  return (
    <mesh ref={gridRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}>
      { getGeometry() }
      <group>
        {!isMobile && (
          <mesh position={[0, 0, -0.01]} ref={hoverBoxRef} scale={[0, 0, 0]}>
            <boxGeometry args={[4, 4, 0.5]} />
            <meshPhysicalMaterial
              color="#444"
              transparent={true}
              opacity={0.3}
            />
            <Edges color="white" lineWidth={3} />
          </mesh>
        )}
        <Text position={textPosition} {...fontProps} ref={titleRef}>
          {title}
        </Text>
      </group>
      <MeshPortalMaterial ref={portalRef} blend={0} resolution={0} blur={0}>
        <color attach="background" args={[color]} />
        {children}
      </MeshPortalMaterial>
      {isMobile && <Edges color="white" lineWidth={2} />}
    </mesh>
  );
};

export default GridTile;
