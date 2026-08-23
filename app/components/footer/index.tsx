'use client';

import { Html, Image, Text, useCursor, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { FOOTER_LINKS } from "@constants";
import { FooterLink } from "@types";

interface ToastState {
  message: string;
  x?: number;
  y?: number;
}

const FooterLinkItem = ({ link, onToast }: { link: FooterLink; onToast: (msg: string, x?: number, y?: number) => void }) => {
  const textRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const onClick = (e?: any) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }

    let clientX: number | undefined;
    let clientY: number | undefined;
    if (e && e.nativeEvent) {
      clientX = e.nativeEvent.clientX ?? e.clientX;
      clientY = e.nativeEvent.clientY ?? e.clientY;
    }

    if (link.name.toLowerCase() === 'email' || link.url.startsWith('mailto:')) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('deeptanilsinha27@gmail.com');
        onToast('Copied!', clientX, clientY);
      }
      window.location.href = 'mailto:deeptanilsinha27@gmail.com';
      return;
    }

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
    const iconPath = link.icon.startsWith('/') ? link.icon : `/${link.icon}`;
    return (
      <mesh onClick={onClick} onPointerDown={onClick} onPointerUp={onClick}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial visible={false} />
        <Image
          url={iconPath}
          transparent
          scale={[0.45, 0.45]}
          position={[0, 0, 0.05]}
        />
      </mesh>
    );
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
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleToast = (msg: string, x?: number, y?: number) => {
    setToast({ message: msg, x, y });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

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
          <FooterLinkItem link={link} onToast={handleToast} />
        </group>
      );
    });
  };

  return (
    <>
      <group position={[0, -44, 18]} rotation={[-Math.PI / 2, 0, 0]} ref={groupRef}>
        <group position={[isMobile ? -2.25 : -3.75, 0, 0]}>
          {getLinks()}
        </group>
      </group>

      {/* Minecraft-styled Toast Popup near Mouse Cursor */}
      {toast && (
        <Html center={!toast.x} zIndexRange={[100, 0]}>
          <div
            className="fixed z-50 px-4 py-2 bg-[#3c3c3c]/95 text-[#ffff55] border-2 border-black font-minecraft-regular text-xs sm:text-sm tracking-wider uppercase select-none shadow-[inset_-2px_-2px_0px_0px_#262626,inset_2px_2px_0px_0px_#8b8b8b] animate-bounce whitespace-nowrap pointer-events-none"
            style={
              toast.x && toast.y
                ? {
                    left: `${toast.x}px`,
                    top: `${toast.y - 30}px`,
                    transform: 'translate(-50%, -100%)',
                  }
                : {
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }
            }
            suppressHydrationWarning
          >
            <span style={{ textShadow: '2px 2px 0px #000000' }}>
              {toast.message}
            </span>
          </div>
        </Html>
      )}
    </>
  );
};

export default Footer;
