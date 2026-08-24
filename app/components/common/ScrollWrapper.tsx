'use client';

import { useProgress, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from 'react';
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { useScrollStore } from "@stores";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// Shared "smoothly scroll to the very bottom" behavior — used both when returning from
// /about or /work with ?scroll=footer, and when a visitor clicks the "Skip to Portfolio"
// button. If tab loses focus or is put in the background mid-scroll, it completes the scroll
// instantly to the target position so it always finishes scrolling reliably.
function runAutoScrollToBottom(
  targetEl: HTMLElement,
  options: { resetToTop: boolean; clearUrlParam: boolean; reducedMotion: boolean }
) {
  const { resetToTop, clearUrlParam, reducedMotion } = options;

  if (resetToTop) {
    targetEl.scrollTop = 0;
  }

  const targetScroll = targetEl.scrollHeight - targetEl.clientHeight;

  // If the document/tab is currently hidden or out of focus when triggered, or if reduced motion is requested,
  // finish the scroll immediately so the target position is reached 100% reliably.
  if (reducedMotion || (typeof document !== 'undefined' && (document.hidden || !document.hasFocus()))) {
    targetEl.scrollTop = targetScroll;
    if (clearUrlParam) window.history.replaceState(null, '', window.location.pathname);
    return () => {};
  }

  // Prevent user scroll inputs during auto-scroll
  const blockScrollInput = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

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
    if (clearUrlParam) window.history.replaceState(null, '', window.location.pathname);
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let scrollTween: any = null;

  // When browser tab is switched or put in the background mid-scroll, finish scrolling to target position instantly!
  const handleFocusLoss = () => {
    if (scrollTween) {
      scrollTween.kill();
    }
    targetEl.scrollTop = targetScroll;
    unlockScroll();
  };

  window.addEventListener('blur', handleFocusLoss, { passive: true });
  document.addEventListener('visibilitychange', handleFocusLoss, { passive: true });

  const timer = setTimeout(async () => {
    const gsapModule = await import('gsap');
    const gsap = gsapModule.default || gsapModule;
    scrollTween = gsap.to(targetEl, {
      scrollTop: targetScroll,
      duration: 4.2,
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

const ScrollWrapper = (props: { children: React.ReactNode | React.ReactNode[] }) => {
  const { camera } = useThree();
  const data = useScroll();
  const { progress } = useProgress();
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);
  const skipToEndToken = useScrollStore((state) => state.skipToEndToken);
  const skipTokenSeenRef = useRef(skipToEndToken);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('scroll=footer')) {
      if (data && data.el && progress === 100) {
        return runAutoScrollToBottom(data.el, {
          resetToTop: true,
          clearUrlParam: true,
          reducedMotion: prefersReducedMotion,
        });
      }
    }
  }, [data, progress, prefersReducedMotion]);

  useEffect(() => {
    // Skip the initial mount value — only react to actual "Skip to Portfolio" presses
    if (skipToEndToken === skipTokenSeenRef.current) return;
    skipTokenSeenRef.current = skipToEndToken;

    if (data && data.el) {
      return runAutoScrollToBottom(data.el, {
        resetToTop: false,
        clearUrlParam: false,
        reducedMotion: prefersReducedMotion,
      });
    }
  }, [skipToEndToken, data, prefersReducedMotion]);

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

      // Move camera slightly on mouse movement (skipped for prefers-reduced-motion visitors).
      if (!isMobile && !prefersReducedMotion) {
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
