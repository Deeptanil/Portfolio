'use client';

import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import { useRef } from "react";
import * as THREE from 'three';
import GridTile from "./GridTile";
import Projects from "./projects";
import Work from "./work";
import { useIsMobile } from "../../hooks/useIsMobile";

const Experience = () => {
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const isActive = usePortalStore((state) => !!state.activePortalId);
  const isMobile = useIsMobile();
  // This whole section (title letters + both portal tiles) normally stays .visible=false
  // until scrolled into range — meaning its content, including the portals' inner scenes,
  // never gets a real render pass (and thus never compiles its shaders / uploads its
  // textures) until the user actually scrolls here. Force it visible for a handful of
  // frames right after mount, while still hidden behind the loading screen's fade-in, so
  // that one-time cost happens up front instead of showing up as a lag spike later.
  const warmupFramesRef = useRef(8);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.22 : 0.4,
    color: 'white',
    anchorX: 'center' as const,
  };

  useFrame((state, delta) => {
    if (!data) return;
    const d = data.range(0.74, 0.24);

    if (groupRef.current && !isActive) {
      groupRef.current.position.y = (d > 0 || warmupFramesRef.current > 0) ? -1 : -30;
      if (warmupFramesRef.current > 0) {
        groupRef.current.visible = true;
        warmupFramesRef.current -= 1;
      } else {
        groupRef.current.visible = d > 0;
      }
    }

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        // Mobile target Y: 0.0 (sitting at Y=0.95 in parent space, lower down right above Work button)
        const yTarget = isMobile ? 0.0 : 0.5;
        const y = Math.max(Math.min((1 - d) * (10 - i), 10), yTarget);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = d > 0 ? 1 : 0;
      });
    }
  });

  const getTitle = () => {
    const title = 'EXPERIENCE';
    if (isMobile) {
      const diff = 0.22;
      const startX = -((title.length - 1) * diff) / 2;
      return title.split('').map((char, i) => {
        return (
          <Text
            key={i}
            {...fontProps}
            fontSize={0.22}
            anchorX="center"
            frustumCulled={false}
            position={[startX + i * diff, 0.0, 0.4]}
          >
            {char}
          </Text>
        );
      });
    }

    const diff = 0.8;
    return title.split('').map((char, i) => {
      return (
        <Text key={i} {...fontProps} anchorX="left" frustumCulled={false} position={[i * diff, 2, 1]}>
          {char}
        </Text>
      );
    });
  };

  return (
    <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={[isMobile ? 0 : -3.6, isMobile ? 0.95 : 1.5, isMobile ? 0.4 : -2]}>
          {getTitle()}
        </group>

        <group position={[0, -1, 0]} ref={groupRef}>
          <GridTile title={isMobile ? "WORK AND\nEDUCATION" : "WORK AND EDUCATION"}
            id="work"
            color='#b9c6d6'
            textAlign='center'
            position={new THREE.Vector3(isMobile ? 0 : -2, isMobile ? 0.915 : 0, isMobile ? 0.01 : 0)}>
            <Work/>
          </GridTile>
          <GridTile title='ABOUT ME'
            id="about"
            color='#bdd1e3'
            textAlign='center'
            position={new THREE.Vector3(isMobile ? 0 : 2, isMobile ? -0.915 : 0, 0)}>
            <Projects/>
          </GridTile>
        </group>
      </group>
    </group>
  );
};

export default Experience;
