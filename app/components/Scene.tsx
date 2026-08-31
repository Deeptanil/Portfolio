'use client';

// Everything that touches three.js / @react-three/fiber / @react-three/drei / gsap lives
// behind this single component so it can be loaded via next/dynamic(ssr:false) from
// page.tsx - keeping the heavy 3D bundle out of the initial page chunk without changing
// anything about what renders or how it behaves once mounted.
import CanvasLoader from "./common/CanvasLoader";
import ScrollWrapper from "./common/ScrollWrapper";
import Experience from "./experience";
import Footer from "./footer";
import Hero from "./hero";

const Scene = () => {
  return (
    <CanvasLoader>
      <ScrollWrapper>
        <Hero />
        <Experience />
        <Footer />
      </ScrollWrapper>
    </CanvasLoader>
  );
};

export default Scene;
