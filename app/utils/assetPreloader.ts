'use client';

import { useGLTF, useTexture } from '@react-three/drei';

// All 3D GLTF models used across the portfolio
export const GLTF_ASSETS = [
  'models/bee_minecraft_flying.glb',
  'models/minecraft_phantom.glb',
  'models/minecraft_sky.glb',
  'models/window.glb',
];

// All 2D image textures used in portals, icons, and background materials
export const TEXTURE_ASSETS = [
  '/painting.webp',
  '/painting_m.webp',
  '/Enchanted_Book.webp',
  '/Stone_Pickaxe.png',
  '/minecraft_dirt.webp',
  '/icons/linkedin.svg',
  '/icons/github.svg',
  '/icons/gmail.svg',
  '/icons/file.svg',
];

/**
 * Preloads all 3D models and 2D textures at the JS module execution stage
 * so HTTP downloads start immediately in parallel with HTML parsing.
 */
export function preloadAllAssets() {
  if (typeof window === 'undefined') return;

  GLTF_ASSETS.forEach((modelUrl) => {
    try {
      useGLTF.preload(modelUrl);
    } catch {}
  });

  TEXTURE_ASSETS.forEach((textureUrl) => {
    try {
      useTexture.preload(textureUrl);
    } catch {}
  });
}

// Automatically trigger module-level preload
preloadAllAssets();
