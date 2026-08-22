'use client';

import { Svg, Text, useCursor, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { FOOTER_LINKS } from "@constants";
import { FooterLink } from "@types";

const FooterLinkItem = ({ link }: { link: FooterLink }) => {
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);

  const onClick = () => {
    if (link.download || link.url.endsWith('.pdf')) {
      const a = document.createElement('a');
      a.href = link.url;
      a.download = 'Deeptanil_Sinha_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      window.open(link.url, '_blank');
    }
  };
  
  const onPointerMove = (e: MouseEvent) => {
    if (isMobile) return;
    const hoverDiv = document.getElementById(`footer-link-${link.name}`);
    if (hoverDiv) {
      gsap.to(hoverDiv, {
        top: `${e.clientY + 14}px`,
        left: `${e.clientX}px`,
        duration: 0.6,
      });
    }
  };

  const fontProps = {
    font: "./Vercetti-Regular.woff",
    fontSize: 0.25,
    color: 'white',
    onPointerOver,
    onPointerMove,
    onPointerOut,
    onClick,
  };

  useEffect(() => {
    if (!document.getElementById(`footer-link-${link.name}`)) {
      const hoverDiv = document.createElement('div');
      hoverDiv.id = `footer-link-${link.name}`;
      hoverDiv.textContent = link.hoverText ?? link.name.toUpperCase();
      hoverDiv.style.position = 'fixed';
      hoverDiv.style.zIndex = '2';
      hoverDiv.style.bottom = '0';
      hoverDiv.style.opacity = '0';
      hoverDiv.style.left = window.innerWidth / 2 + 'px';
      hoverDiv.style.fontSize = '0.8rem';
      hoverDiv.style.fontFamily = 'var(--font-vercetti), sans-serif';
      hoverDiv.style.color = '#ffffff';
      hoverDiv.style.pointerEvents = 'none';
      document.body.appendChild(hoverDiv);
    }

    return () => {
      const el = document.getElementById(`footer-link-${link.name}`);
      if (el) el.remove();
    };
  }, [link.name, link.hoverText]);

  useEffect(() => {
    if (isMobile) return;

    const hoverDiv = document.getElementById(`footer-link-${link.name}`);

    if (hovered) {
      gsap.fromTo(hoverDiv, { opacity: 0 }, { opacity: 0.8, delay: 0.1 });
    } else {
      gsap.to(hoverDiv, { opacity: 0 });
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        letterSpacing: hovered ? 0.3 : 0,
        duration: 0.3,
      });
    }

    return () => {
      if (hoverDiv) gsap.killTweensOf(hoverDiv);
      if (textRef.current) gsap.killTweensOf(textRef.current);
    };
  }, [hovered, link.name]);

  useCursor(hovered);

  if (isMobile) {
    return <Svg onClick={onClick} scale={0.0015} position={[0.1, 0.25, 0]} src={link.icon} />;
  }

  return (
    <Text ref={textRef} {...fontProps}>
      {link.name.toUpperCase()}
    </Text>
  );
};

const Footer = () => {
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();

  useFrame(() => {
    if (!data) return;
    const d = data.range(0.7, 0.3);
    if (groupRef.current) {
      groupRef.current.visible = d > 0;
    }
  });

  const getLinks = () => {
    return FOOTER_LINKS.map((link, i) => {
      return (
        <group key={i} position={[i * (isMobile ? 1.5 : 2.5), 0, 0]}>
          <FooterLinkItem link={link} />
        </group>
      );
    });
  };

  return (
    <group position={[0, -44, 18]} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>
      <group position={[isMobile ? -2.5 : -3.75, 0, 0]}>
        {getLinks()}
      </group>
    </group>
  );
};

export default Footer;
