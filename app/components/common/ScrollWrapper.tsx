'use client';

import { useProgress, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from 'react';
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { useScrollStore } from "@stores";

const ScrollWrapper = (props: { children: React.ReactNode | React.ReactNode[] }) => {
  const { camera } = useThree();
  const data = useScroll();
  const { progress } = useProgress();
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('scroll=footer')) {
      if (data && data.el && progress === 100) {
        // Only run auto-scroll if screen/tab is currently in focus and visible
        if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }

        // Start at top of the home page so user sees the initial 3D scene
        data.el.scrollTop = 0;

        // Prevent user scroll inputs during auto-scroll
        const blockScrollInput = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        };

        const targetEl = data.el;
        targetEl.style.pointerEvents = 'none';
        window.addEventListener('wheel', blockScrollInput, { capture: true, passive: false });
        window.addEventListener('touchstart', blockScrollInput, { capture: true, passive: false });
        window.addEventListener('touchmove', blockScrollInput, { capture: true, passive: false });
        window.addEventListener('keydown', blockScrollInput, { capture: true, passive: false });

        const unlockScroll = () => {
          targetEl.style.pointerEvents = 'auto';
          window.removeEventListener('wheel', blockScrollInput, { capture: true });
          window.removeEventListener('touchstart', blockScrollInput, { capture: true });
          window.removeEventListener('touchmove', blockScrollInput, { capture: true });
          window.removeEventListener('keydown', blockScrollInput, { capture: true });
          window.history.replaceState(null, '', window.location.pathname);
        };

        let scrollTween: gsap.core.Tween | null = null;

        const handleFocusLoss = () => {
          if (scrollTween) {
            scrollTween.kill();
          }
          unlockScroll();
        };

        window.addEventListener('blur', handleFocusLoss, { passive: true });
        document.addEventListener('visibilitychange', handleFocusLoss, { passive: true });

        const timer = setTimeout(() => {
          const targetScroll = targetEl.scrollHeight - targetEl.clientHeight;
          scrollTween = gsap.to(targetEl, {
            scrollTop: targetScroll,
            duration: 2.8,
            ease: "power2.inOut",
            onComplete: unlockScroll
          });
        }, 50);

        return () => {
          clearTimeout(timer);
          if (scrollTween) scrollTween.kill();
          window.removeEventListener('blur', handleFocusLoss);
          document.removeEventListener('visibilitychange', handleFocusLoss);
          unlockScroll();
        };
      }
    }
  }, [data, progress]);

  useFrame((state, delta) => {
    // Pause frame updates if window is out of focus or tab is hidden
    if (typeof document !== 'undefined' && (document.hidden || !document.hasFocus())) {
      return;
    }

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
