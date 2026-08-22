'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
  return (
    <CanvasLoader>
      <ScrollWrapper>
        <Hero />
        <Footer />
      </ScrollWrapper>
    </CanvasLoader>
  );
};

export default Home;
