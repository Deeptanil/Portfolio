'use client';

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from 'react';
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { useScrollStore } from "@stores";

const ScrollWrapper = (props: { children: React.ReactNode | React.ReactNode[] }) => {
  const { camera } = useThree();
  const data = useScroll();
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('scroll=footer')) {
      if (data && data.el) {
        // Start at top of the home page so user sees the initial 3D scene
        data.el.scrollTop = 0;

        // Smoothly auto-scroll from top to bottom over 3.5 seconds
        const timer = setTimeout(() => {
          const targetScroll = data.el.scrollHeight - data.el.clientHeight;
          gsap.to(data.el, {
            scrollTop: targetScroll,
            duration: 3.5,
            ease: "power1.inOut",
            onComplete: () => {
              window.history.replaceState(null, '', window.location.pathname);
            }
          });
        }, 400);

        return () => clearTimeout(timer);
      }
    }
  }, [data]);

  useFrame((state, delta) => {
    if (data) {
      const a = data.range(0, 0.3);
      const b = data.range(0.3, 0.5);
      const d = data.range(0.85, 0.18);

      camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, -0.5 * Math.PI * a, 5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -37 * b, 7, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 5 + 10 * d, 7, delta);

      setScrollProgress(data.range(0, 1));

      // Move camera slightly on mouse movement.
      if (!isMobile) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 90, 0.05);
      }
    }
  });

  const children = Array.isArray(props.children) ? props.children : [props.children];

  return (
    <>
      {children.map((child, index) => (
        <group key={index}>
          {child}
        </group>
      ))}
    </>
  );
};

export default ScrollWrapper;
