'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
  return (
    <main suppressHydrationWarning className="w-full h-full">
      <CanvasLoader>
        <ScrollWrapper>
          <Hero />
          <Experience />
          <Footer />
        </ScrollWrapper>
      </CanvasLoader>
    </main>
  );
};

export default Home;
