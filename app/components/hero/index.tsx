'use client';

import CloudContainer from "../models/Cloud";
import ParticleAura from "../models/ParticleAura";
import PortalGateway from "../models/PortalGateway";
import StarsContainer from "../models/Stars";
import KineticText from "./KineticText";

const Hero = () => {
  return (
    <>
      <KineticText />
      <ParticleAura />
      <StarsContainer />
      <CloudContainer />
      <PortalGateway />
    </>
  );
};

export default Hero;
