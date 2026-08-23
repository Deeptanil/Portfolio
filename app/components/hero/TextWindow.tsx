'use client';

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const TextWindow = () => {
  const windowRef = useRef<THREE.Group>(null);
  const size = useThree((state) => state.size);

  const fontProps = {
    font: "./soria-font.ttf",
  };

  // The camera flies directly along its own view axis through this text ensemble as the
  // user scrolls, so there's a narrow moment where all four sides (top/bottom/left/right)
  // are simultaneously close and readable before perspective distortion takes over. On a
  // narrow/tall mobile aspect, horizontal FOV is much tighter, so that "all four visible"
  // window is much smaller — shrinking the whole ensemble on narrower aspects buys more
  // scroll room where every side stays in frame together, matching the desktop experience.
  // Desktop-ish aspect (~16:9) keeps scale at 1 (unchanged); narrower aspects shrink down,
  // floored so text never becomes illegibly small.
  const textScale = useMemo(() => {
    const aspect = size.width / size.height;
    return THREE.MathUtils.clamp(aspect / 1.6, 0.5, 1);
  }, [size.width, size.height]);

  return (
    <group position={[0, -0.3, 0]} scale={textScale} ref={windowRef}>

      <Text color="white" anchorX="left" anchorY="middle"
        fontSize={1.3}
        position={[0.12, 0, 0]}
        {...fontProps}
        scale={[1, -1, 1]}
        rotation={[0, 0, -Math.PI / 2]}>
        PRODUCT ENGINEER
      </Text>

      <Text color="white" anchorX="right" anchorY="middle"
        {...fontProps}
        scale={[-1, -1, 1]}
        fontSize={1.3}
        position={[-0.05, 0, -1.4]}
        rotation={[0, 0, -Math.PI / 2]}>
        UI/UX & E-COMMERCE
      </Text>

      <group position={[-0.45, 0, -0.3]}>
        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          STRAYED & PRETTIVA
        </Text>

        <Text color="white" anchorX="left" anchorY="middle"
          {...fontProps}
          scale={[1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          MIT BENGALURU '28
        </Text>
      </group>

      <group position={[0.45, 0, -0.3]}>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          DIGITAL PRODUCT DEV
        </Text>
        <Text color="white" anchorX="right" anchorY="middle"
          {...fontProps}
          scale={[-1, -1, 1]}
          fontSize={0.8}
          position={[0, 0, -0.6]}
          rotation={[0, -Math.PI / 2, -Math.PI / 2]}>
          WEB PERFORMANCE & SEO
        </Text>
      </group>
    </group>
  );
};

export default TextWindow;
