import * as THREE from 'three';

export const TriangleGeometry = ({ points }: { points: number[][] }) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array(points.flat());
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  return geometry;
};
