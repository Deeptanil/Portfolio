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

/* --- Dynamic B.Tech Status --- */
const btechStatus = document.getElementById('btech-status');
if (btechStatus) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed: 5 is June
  
  let statusText = '3rd Year';
  
  if (currentYear > 2028 || (currentYear === 2028 && currentMonth >= 5)) {
    statusText = 'Complete';
  } else if (currentYear > 2027 || (currentYear === 2027 && currentMonth >= 5)) {
    statusText = '4th Year';
  }
  
  btechStatus.textContent = statusText;
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

/* --- About Section Text Scrub Reveal --- */
const splitTextElements = document.querySelectorAll('.reveal-text');
splitTextElements.forEach(el => {
  const text = el.innerText;
  const words = text.split(' ');
  el.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');

  const spans = el.querySelectorAll('span');
  gsap.fromTo(spans, 
    { opacity: 0.15 },
    {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'bottom 45%',
        scrub: true
      }
    }
  );
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

/* --- Horizontal Scroll for Selected Cases (Desktop Only) --- */
const casesWrapper = document.querySelector('.cases__scroll-wrapper');
const casesTrack = document.querySelector('.cases__track');
const casePanels = gsap.utils.toArray('.case-panel');
const navDots = document.querySelectorAll('.nav-dot');

if (casesWrapper && casesTrack && casePanels.length > 0) {
  let mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    const scrollAmount = casesTrack.scrollWidth - window.innerWidth;
    
    const scrollTween = gsap.to(casesTrack, {
      x: -scrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: casesWrapper,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${scrollAmount}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.min(
            Math.floor(progress * casePanels.length),
            casePanels.length - 1
          );
          
          navDots.forEach((dot, idx) => {
            if (idx === activeIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      }
    });

    // Clicking dots scrolls to corresponding panel
    navDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const scrollAmountVal = casesTrack.scrollWidth - window.innerWidth;
        const targetScroll = casesWrapper.offsetTop + (scrollAmountVal * (idx / (casePanels.length - 1)));
        lenis.scrollTo(targetScroll, { duration: 1.2 });
      });
    });

    return () => {
      if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
    };
  });
}

/* --- Modals for Selected Cases & Credits --- */

// Case Studies Data
const projectsData = {
  'strayed': {
    title: 'STRAYED',
    category: 'Fashion E-Commerce',
    role: 'Founder & Digital Director',
    year: '2026',
    stack: 'Medusa.js, Supabase, PostgreSQL, Tailwind CSS, JavaScript, GitHub',
    desc: 'Designed and developed the complete digital experience for STRAYED, creating a modern fashion platform that combines immersive interactions with a scalable e-commerce architecture. Led both the technical implementation and overall product experience from concept to launch.',
    link: 'https://strayed.in',
    index: '01 / 03',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'prettiva': {
    title: 'Prettiva & Co.',
    category: 'Fashion E-Commerce',
    role: 'Co-Founder & Digital Director',
    year: '2025',
    stack: 'Odoo, JavaScript, CSS, HTML, Razorpay, SEO',
    desc: 'Built and optimized an online fashion store focused on delivering a premium shopping experience. Responsible for website design, frontend customization, performance optimization, SEO, payment integration, and overall digital experience.',
    link: 'https://prettiva.co',
    index: '02 / 03',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  'food-delivery': {
    title: 'Food Delivery Platform',
    category: 'Full-Stack Web Application',
    role: 'Full-Stack Developer',
    year: '2026',
    stack: 'Next.js, React, Node.js, PostgreSQL, Tailwind CSS',
    desc: 'Developing a modern food ordering platform inspired by leading delivery applications, with a focus on intuitive user experience, performance, scalable architecture, and clean interface design.',
    link: '#',
    index: '03 / 03',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1526367790999-015078648c7e?auto=format&fit=crop&q=80&w=1000'
    ]
  }
};


const projectModal = document.getElementById('project-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalContent = projectModal?.querySelector('.modal__content');

const modalIndex = document.getElementById('modal-project-index');
const modalTitle = document.getElementById('modal-project-title');
const modalCategory = document.getElementById('modal-project-category');
const modalRole = document.getElementById('modal-project-role');
const modalYear = document.getElementById('modal-project-year');
const modalStack = document.getElementById('modal-project-stack');
const modalDesc = document.getElementById('modal-project-desc');
const modalLink = document.getElementById('modal-project-link');
const modalImagesContainer = document.getElementById('modal-project-images');

// Lock body scroll when modal open — only prevent html-level scroll,
// do NOT set position:fixed which breaks native touch scroll inside modal
const lockBodyScroll = () => {
  document.documentElement.style.overflow = 'hidden';
};

const unlockBodyScroll = () => {
  document.documentElement.style.overflow = '';
};

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

  // Handle "Coming Soon" links
  if (data.link === '#') {
    modalLink.textContent = 'Coming Soon';
    modalLink.style.opacity = '0.5';
    modalLink.style.pointerEvents = 'none';
  } else {
    modalLink.textContent = 'View Project';
    modalLink.style.opacity = '1';
    modalLink.style.pointerEvents = 'auto';
  }

  // Populate images
  modalImagesContainer.innerHTML = '';
  data.images.forEach(imgUrl => {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = data.title;
    img.loading = 'lazy';
    modalImagesContainer.appendChild(img);
  });

  // Reset modal scroll to top
  if (modalContent) modalContent.scrollTop = 0;

  // Activate Modal
  projectModal.classList.add('active');
  lenis.stop();
  lockBodyScroll();
};

// Function to close project modal
const closeProjectModal = () => {
  projectModal.classList.remove('active');
  lenis.start();
  unlockBodyScroll();
};

// Bind Project Clicks
document.querySelectorAll('.case-panel').forEach(item => {
  item.addEventListener('click', (e) => {
    const projId = item.getAttribute('data-project');
    openProjectModal(projId);
  });
});

// Bind Modal Close triggers
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);

// Credits Modal triggers
const creditsModal = document.getElementById('credits-modal');
const creditsModalContent = creditsModal?.querySelector('.modal__content');
const creditsTrigger = document.getElementById('credits-trigger');
const creditsClose = document.getElementById('credits-close-btn');
const creditsOverlay = document.getElementById('credits-overlay');

const openCredits = () => {
  if (creditsModalContent) creditsModalContent.scrollTop = 0;
  creditsModal.classList.add('active');
  lenis.stop();
  lockBodyScroll();
};

const closeCredits = () => {
  creditsModal.classList.remove('active');
  lenis.start();
  unlockBodyScroll();
};

if (creditsTrigger) creditsTrigger.addEventListener('click', openCredits);
if (creditsClose) creditsClose.addEventListener('click', closeCredits);
if (creditsOverlay) creditsOverlay.addEventListener('click', closeCredits);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (projectModal?.classList.contains('active')) closeProjectModal();
    if (creditsModal?.classList.contains('active')) closeCredits();
  }
});

// Recalculate event listeners on window resize/dom edits if cursor hover class is needed
window.addEventListener('resize', addCursorHoverListeners);
