import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as THREE from 'three';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.1,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Link Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

/* --- Dynamic Date Badge --- */
const dateBadge = document.getElementById('badge-date');
if (dateBadge) {
  const today = new Date();
  const day = today.getDate();
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const month = months[today.getMonth()];
  dateBadge.textContent = `${day} ${month}`;
}

/* --- Custom Trailing Cursor --- */
const cursorOuter = document.getElementById('custom-cursor');
const cursorInner = document.getElementById('custom-cursor-dot');

let mouse = { x: 0, y: 0 };
let cursor = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  if (cursorInner) {
    cursorInner.style.left = `${mouse.x}px`;
    cursorInner.style.top = `${mouse.y}px`;
  }
});

// Animate outer cursor with lag (LERP)
const animateCursor = () => {
  const lerpFactor = 0.15;
  cursor.x += (mouse.x - cursor.x) * lerpFactor;
  cursor.y += (mouse.y - cursor.y) * lerpFactor;
  
  if (cursorOuter) {
    cursorOuter.style.left = `${cursor.x}px`;
    cursorOuter.style.top = `${cursor.y}px`;
  }
  requestAnimationFrame(animateCursor);
};
animateCursor();

// Set cursor hover status
const addCursorHoverListeners = () => {
  const hovers = document.querySelectorAll('a, button, .case-item, .credits-btn, .btn');
  hovers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.closest('.footer') || el.closest('.marquee')) {
        document.body.classList.add('hover-link-inverse');
      } else {
        document.body.classList.add('hover-link');
      }
    });
    
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-link');
      document.body.classList.remove('hover-link-inverse');
    });
  });
};
addCursorHoverListeners();

/* --- WebGL 3D Canvas (Three.js) --- */
const canvas = document.getElementById('webgl-canvas');
if (canvas) {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 6;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true // transparent background
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // Geometry
  // Double-layer structure: translucent solid sphere + outer wireframe sphere
  const innerGeometry = new THREE.IcosahedronGeometry(1.6, 4);
  const outerGeometry = new THREE.IcosahedronGeometry(1.61, 3); // Slightly larger outer wireframe

  // Materials
  const innerMaterial = new THREE.MeshPhongMaterial({
    color: 0xe0e0e0,
    shininess: 90,
    specular: 0xffffff,
    flatShading: true,
    transparent: true,
    opacity: 0.85
  });

  const outerMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });

  // Meshes
  const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
  const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
  
  const meshGroup = new THREE.Group();
  meshGroup.add(innerMesh);
  meshGroup.add(outerMesh);
  scene.add(meshGroup);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x777777, 0.5);
  fillLight.position.set(-5, 3, -2);
  scene.add(fillLight);

  // Mouse Interaction: Track normalized coordinates (-1 to 1)
  let targetRotation = { x: 0, y: 0 };
  let currentRotation = { x: 0, y: 0 };

  window.addEventListener('mousemove', (e) => {
    // Normalize coordinates
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -(e.clientY / window.innerHeight) * 2 + 1;
    
    targetRotation.y = nx * 0.7; // horizontal movement maps to Y axis rotation
    targetRotation.x = -ny * 0.7; // vertical movement maps to X axis rotation
  });

  // Render Loop with mathematical vertex morphing (sine displacement)
  const clock = new THREE.Clock();
  
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotational lerp toward mouse target
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
    
    meshGroup.rotation.x = currentRotation.x + elapsedTime * 0.08;
    meshGroup.rotation.y = currentRotation.y + elapsedTime * 0.12;

    // Procedurally morph inner geometry vertices
    // We displace vertices dynamically using wave equations based on coordinates and elapsed time
    const positionAttribute = innerMesh.geometry.attributes.position;
    const vertex = new THREE.Vector3();
    const originalPositions = innerGeometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(originalPositions, i);
      
      // Compute displacement using sine waves
      const wave = Math.sin(vertex.x * 2.5 + elapsedTime * 1.5) * 
                   Math.cos(vertex.y * 2.5 + elapsedTime * 1.5) * 0.12;
                   
      vertex.addScaledVector(vertex.clone().normalize(), wave);
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true;
    innerMesh.geometry.computeVertexNormals();

    // Render
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

/* --- GSAP Page Reveal Animations --- */
// Staggered reveal for loading items
gsap.utils.toArray('.item-fade').forEach(item => {
  gsap.to(item, {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });
});

// Scroll-triggered skew and translation effects for the Hero Title
if (document.querySelector('.hero')) {
  gsap.to('.hero__title .font-display:first-child', {
    x: -60,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  gsap.to('.hero__title .font-serif-italic', {
    x: 60,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  gsap.to('.hero__title .font-display:last-child', {
    x: -30,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Scale down and fade WebGL canvas slightly on scroll
  gsap.to('#webgl-canvas', {
    scale: 0.75,
    opacity: 0.5,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* --- Modals for Selected Cases & Credits --- */

// Case Studies Mock Data (No placeholders, utilizing real Unsplash links)
const projectsData = {
  'beatrice-cortese': {
    title: 'Beatrice Cortese',
    category: 'Portfolio Site / Art Direction',
    role: 'Lead UX/UI Designer & Developer',
    year: '2025',
    stack: 'HTML, Vanilla CSS, GSAP, Lenis, WebGL',
    desc: 'A highly aesthetic, minimalist portfolio designed for fashion photographer Beatrice Cortese. The website highlights her editorial collections using full-screen horizontal sliders, smooth WebGL page transitions, and strict typographic grids.',
    link: 'https://www.behance.net',
    index: '01 / 05',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'barbara-scerbo': {
    title: 'Barbara Scerbo',
    category: 'E-Commerce / Fashion',
    role: 'Lead Designer & Webflow Developer',
    year: '2024',
    stack: 'Webflow, GSAP ScrollTrigger, Custom CSS',
    desc: 'An online storefront and digital archive built for artist Barbara Scerbo. The site bridges high-fashion collections with architectural grid frameworks, implementing lazy-loaded assets and custom cart micro-interactions.',
    link: 'https://www.behance.net',
    index: '02 / 05',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'viceversa': {
    title: 'Viceversa',
    category: 'Fintech Platform / Brand Identity',
    role: 'Senior Digital Art Director',
    year: '2024',
    stack: 'Figma, NextJS, TailwindCSS, WebGL',
    desc: 'Redesign and branding for Viceversa, a revenue-based growth platform for digital businesses. Designed a clear, structured analytical dashboard that visualizes data points through interactive WebGL financial growth graphics.',
    link: 'https://www.behance.net',
    index: '03 / 05',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'codeway-ch': {
    title: 'Codeway CH',
    category: 'Software Agency / NextJS Dev',
    role: 'Lead Frontend Engineer',
    year: '2023',
    stack: 'React, NextJS, Framer Motion, Tailwind',
    desc: 'Bespoke corporate website and digital catalog for Swiss technical firm Codeway CH. Highlighting their engineering solutions through custom developer dashboards and interactive API simulation cards.',
    link: 'https://www.behance.net',
    index: '04 / 05',
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'miranda': {
    title: 'Miranda',
    category: 'Creative Studio / Typography Design',
    role: 'Branding Designer & Web Developer',
    year: '2023',
    stack: 'WordPress, Custom CSS, GSAP',
    desc: 'Typographic portfolio and design presentation for Milanese studio Miranda. Replicating paper editorial layouts using fluid column systems, massive letter-spacing effects, and CSS blend modes.',
    link: 'https://www.behance.net',
    index: '05 / 05',
    images: [
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1000'
    ]
  }
};

const projectModal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');

const modalIndex = document.getElementById('modal-project-index');
const modalTitle = document.getElementById('modal-project-title');
const modalCategory = document.getElementById('modal-project-category');
const modalRole = document.getElementById('modal-project-role');
const modalYear = document.getElementById('modal-project-year');
const modalStack = document.getElementById('modal-project-stack');
const modalDesc = document.getElementById('modal-project-desc');
const modalLink = document.getElementById('modal-project-link');
const modalImagesContainer = document.getElementById('modal-project-images');

// Function to open project modal
const openProjectModal = (projId) => {
  const data = projectsData[projId];
  if (!data) return;

  // Populate data
  modalIndex.textContent = data.index;
  modalTitle.textContent = data.title;
  modalCategory.textContent = data.category;
  modalRole.textContent = data.role;
  modalYear.textContent = data.year;
  modalStack.textContent = data.stack;
  modalDesc.textContent = data.desc;
  modalLink.href = data.link;

  // Populate images
  modalImagesContainer.innerHTML = '';
  data.images.forEach(imgUrl => {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = data.title;
    modalImagesContainer.appendChild(img);
  });

  // Activate Modal
  projectModal.classList.add('active');
  lenis.stop(); // Lock main page scrolling
};

// Function to close project modal
const closeProjectModal = () => {
  projectModal.classList.remove('active');
  lenis.start(); // Unlock main page scrolling
};

// Bind Project Clicks
document.querySelectorAll('.case-item').forEach(item => {
  item.addEventListener('click', () => {
    const projId = item.getAttribute('data-project');
    openProjectModal(projId);
  });
});

// Bind Modal Close triggers
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

// Credits Modal triggers
const creditsModal = document.getElementById('credits-modal');
const creditsTrigger = document.getElementById('credits-trigger');
const creditsClose = document.getElementById('credits-close-btn');
const creditsOverlay = document.getElementById('credits-overlay');

const openCredits = () => {
  creditsModal.classList.add('active');
  lenis.stop();
};

const closeCredits = () => {
  creditsModal.classList.remove('active');
  lenis.start();
};

if (creditsTrigger) creditsTrigger.addEventListener('click', openCredits);
if (creditsClose) creditsClose.addEventListener('click', closeCredits);
if (creditsOverlay) creditsOverlay.addEventListener('click', closeCredits);

// Recalculate event listeners on window resize/dom edits if cursor hover class is needed
window.addEventListener('resize', addCursorHoverListeners);
