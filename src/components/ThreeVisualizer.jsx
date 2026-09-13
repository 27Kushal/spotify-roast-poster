import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * ThreeVisualizer component
 * Mode "hero": 3D floating retro wireframe Audio Specimen (Cassette/Specimen Core) with spinning reels and mouse tracking
 * Mode "resonator": 3D psychoacoustic terrain resonator reacting to Spotify energy, valence, and tempo
 */
export default function ThreeVisualizer({
  mode = 'hero',
  stats = { avgEnergy: 65, avgValence: 45, avgTempo: 120 },
  className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    let animationFrameId;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width - 0.5) * 2;
      mouse.targetY = (clientY / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ==========================================
    // MODE 1: HERO (3D Retro Specimen / Cassette)
    // ==========================================
    if (mode === 'hero') {
      camera.position.set(0, 0, 7);

      const group = new THREE.Group();
      scene.add(group);

      // Outer Cassette Body (Wireframe + Glassy core)
      const bodyGeom = new THREE.BoxGeometry(4.2, 2.7, 0.45);
      const edges = new THREE.EdgesGeometry(bodyGeom);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xd4ff00, // Zine Lime
        linewidth: 2,
      });
      const wireframeBody = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframeBody);

      // Inner Translucent Core
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.85,
      });
      const bodyMesh = new THREE.Mesh(bodyGeom, coreMat);
      group.add(bodyMesh);

      // Center Tape Window cutout wireframe
      const windowGeom = new THREE.BoxGeometry(2.4, 1.1, 0.48);
      const windowEdges = new THREE.EdgesGeometry(windowGeom);
      const windowLineMat = new THREE.LineBasicMaterial({ color: 0xff007a }); // Hot Pink
      const windowWireframe = new THREE.LineSegments(windowEdges, windowLineMat);
      group.add(windowWireframe);

      // Dual Spinning Tape Spools / Reels
      const spoolGeom = new THREE.TorusGeometry(0.38, 0.04, 8, 24);
      const spoolMatLeft = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true }); // Cyan
      const spoolMatRight = new THREE.MeshBasicMaterial({ color: 0xd4ff00, wireframe: true }); // Lime

      const spoolLeft = new THREE.Mesh(spoolGeom, spoolMatLeft);
      spoolLeft.position.set(-0.72, 0, 0.05);
      group.add(spoolLeft);

      const spoolRight = new THREE.Mesh(spoolGeom, spoolMatRight);
      spoolRight.position.set(0.72, 0, 0.05);
      group.add(spoolRight);

      // Spool gear teeth
      const toothGeom = new THREE.BoxGeometry(0.08, 0.22, 0.1);
      const toothMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const toothL = new THREE.Mesh(toothGeom, toothMat);
        toothL.position.set(
          -0.72 + Math.cos(angle) * 0.22,
          Math.sin(angle) * 0.22,
          0.05
        );
        toothL.rotation.z = angle;
        group.add(toothL);

        const toothR = new THREE.Mesh(toothGeom, toothMat);
        toothR.position.set(
          0.72 + Math.cos(angle) * 0.22,
          Math.sin(angle) * 0.22,
          0.05
        );
        toothR.rotation.z = angle;
        group.add(toothR);
      }

      // Orbiting Specimen Ring
      const ringGeom = new THREE.RingGeometry(2.8, 2.84, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const orbitRing = new THREE.Mesh(ringGeom, ringMat);
      orbitRing.rotation.x = Math.PI / 3;
      group.add(orbitRing);

      // Floating Particle Cloud (Acoustic Specimen Dust)
      const particleCount = 120;
      const particleGeom = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 8;
      }
      particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xff007a,
        transparent: true,
        opacity: 0.65,
      });
      const particles = new THREE.Points(particleGeom, particleMat);
      scene.add(particles);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse follow
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Floating hover + mouse tilt
        group.rotation.y = elapsedTime * 0.4 + mouse.x * 0.6;
        group.rotation.x = Math.sin(elapsedTime * 0.8) * 0.15 - mouse.y * 0.4;
        group.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Spin the reels
        spoolLeft.rotation.z -= 0.035;
        spoolRight.rotation.z -= 0.035;

        orbitRing.rotation.z += 0.01;
        particles.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
      };
      animate();
    }

    // ===============================================
    // MODE 2: RESONATOR (3D Psychoacoustic Wave Grid)
    // ===============================================
    else if (mode === 'resonator') {
      camera.position.set(0, 3.2, 5.5);
      camera.lookAt(0, 0, 0);

      const segmentsX = 40;
      const segmentsY = 40;
      const planeGeom = new THREE.PlaneGeometry(8, 8, segmentsX, segmentsY);
      planeGeom.rotateX(-Math.PI / 2.3);

      // Custom wireframe material
      const planeMat = new THREE.MeshBasicMaterial({
        color: 0xd4ff00, // Neon Lime Grid
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const waveMesh = new THREE.Mesh(planeGeom, planeMat);
      scene.add(waveMesh);

      // High-energy central waveform line
      const lineGeom = new THREE.BufferGeometry();
      const linePoints = [];
      for (let i = -4; i <= 4; i += 0.1) {
        linePoints.push(new THREE.Vector3(i, 0.4, 0));
      }
      lineGeom.setFromPoints(linePoints);
      const centralLineMat = new THREE.LineBasicMaterial({
        color: 0xff007a, // Hot Pink Pulse
        linewidth: 3,
      });
      const centralLine = new THREE.Line(lineGeom, centralLineMat);
      scene.add(centralLine);

      // Extract real user stats
      const energyNorm = (stats.avgEnergy || 50) / 100;
      const tempoSpeed = ((stats.avgTempo || 120) / 120) * 1.8;
      const valenceNorm = (stats.avgValence || 50) / 100;

      const posAttribute = planeGeom.attributes.position;
      const initialPositions = posAttribute.clone();

      let clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime() * tempoSpeed;

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Wave manipulation
        for (let i = 0; i < posAttribute.count; i++) {
          const u = initialPositions.getX(i);
          const v = initialPositions.getY(i);

          const wave1 = Math.sin(u * 1.5 + t * 2) * (0.35 * energyNorm);
          const wave2 = Math.cos(v * 1.5 + t * 1.5) * (0.25 * valenceNorm);
          const ripple = Math.sin(Math.sqrt(u * u + v * v) * 2 - t * 3) * 0.2;

          posAttribute.setZ(i, wave1 + wave2 + ripple);
        }
        posAttribute.needsUpdate = true;

        // Central line oscillation
        const linePos = centralLine.geometry.attributes.position;
        for (let j = 0; j < linePos.count; j++) {
          const lx = linePos.getX(j);
          const ly = Math.sin(lx * 2.5 + t * 4) * (0.6 * energyNorm) + Math.cos(lx * 4 + t * 2) * 0.15;
          linePos.setY(j, ly);
        }
        linePos.needsUpdate = true;

        // Subtle camera track
        camera.position.x = mouse.x * 0.8;
        camera.position.y = 3.2 - mouse.y * 0.4;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode, stats]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
    />
  );
}
