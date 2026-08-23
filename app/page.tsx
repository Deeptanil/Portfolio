'use client';

import dynamic from "next/dynamic";

// The 3D experience (three.js/@react-three/fiber/@react-three/drei/gsap + all models) is
// code-split into its own chunk, separate from this page's core JS, so it doesn't have to
// be parsed before the rest of the app becomes interactive. ssr:false is safe here since
// Scene is a WebGL canvas — it has never rendered meaningful server-side markup anyway.
const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

const Home = () => {
  return (
    <>
      {/* Preload the 3D canvas's custom fonts only on this route — /about and /work
          never render the canvas and don't need these.
          Note: only the CSS-consumed MinecraftRegular file could be converted to WOFF2 —
          troika-three-text (the 3D <Text> mesh renderer) only supports WOFF1/OTF/TTF, so
          soria-font and Vercetti-Regular stay in their original formats. */}
      <link rel="preload" href="/fonts/MinecraftRegular-Bmg3.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/soria-font.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      <link rel="preload" href="/Vercetti-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      <main suppressHydrationWarning className="w-full h-full">
        <Scene />
      </main>
    </>
  );
};

export default Home;
