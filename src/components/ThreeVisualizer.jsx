import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * ThreeVisualizer component
 * Mode "hero": 3D floating retro multi-colored wireframe Audio Specimen (Cassette/Specimen Core) with spinning reels, gyro rings, and colorful particles
 * Mode "resonator": 3D multi-chromatic psychoacoustic terrain resonator reacting to Spotify energy, valence, and tempo
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

    // ========================================================
    // MODE 1: HERO (Multi-Colored 3D Retro Specimen / Cassette)
    // ========================================================
    if (mode === 'hero') {
      camera.position.set(0, 0, 7.2);

      const group = new THREE.Group();
      scene.add(group);

      // Outer Cassette Body (Wireframe)
      const bodyGeom = new THREE.BoxGeometry(4.3, 2.75, 0.45);
      const edges = new THREE.EdgesGeometry(bodyGeom);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xd4ff00, // Zine Acid Lime
        linewidth: 2,
      });
      const wireframeBody = new THREE.LineSegments(edges, lineMaterial);
      group.add(wireframeBody);

      // Inner Translucent Dark Body Core
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x09090b,
        transparent: true,
        opacity: 0.9,
      });
      const bodyMesh = new THREE.Mesh(bodyGeom, coreMat);
      group.add(bodyMesh);

      // Center Tape Window cutout wireframe in Hot Magenta
      const windowGeom = new THREE.BoxGeometry(2.4, 1.1, 0.48);
      const windowEdges = new THREE.EdgesGeometry(windowGeom);
      const windowLineMat = new THREE.LineBasicMaterial({ color: 0xff007a }); // Hot Pink
      const windowWireframe = new THREE.LineSegments(windowEdges, windowLineMat);
      group.add(windowWireframe);

      // Center Tape Bridge in Solar Orange
      const bridgeGeom = new THREE.BoxGeometry(1.2, 0.08, 0.48);
      const bridgeMat = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
      const bridge = new THREE.Mesh(bridgeGeom, bridgeMat);
      group.add(bridge);

      // Dual Spinning Tape Spools / Reels (Left: Cyan, Right: Tangerine Orange)
      const spoolGeom = new THREE.TorusGeometry(0.38, 0.045, 8, 24);
      const spoolMatLeft = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true }); // Cyber Cyan
      const spoolMatRight = new THREE.MeshBasicMaterial({ color: 0xff6b00, wireframe: true }); // Solar Orange

      const spoolLeft = new THREE.Mesh(spoolGeom, spoolMatLeft);
      spoolLeft.position.set(-0.72, 0, 0.05);
      group.add(spoolLeft);

      const spoolRight = new THREE.Mesh(spoolGeom, spoolMatRight);
      spoolRight.position.set(0.72, 0, 0.05);
      group.add(spoolRight);

      // Spool gear teeth in Electric Lime & Yellow
      const toothGeom = new THREE.BoxGeometry(0.08, 0.22, 0.1);
      const toothMatL = new THREE.MeshBasicMaterial({ color: 0xffd600 }); // Yellow
      const toothMatR = new THREE.MeshBasicMaterial({ color: 0xd4ff00 }); // Lime

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const toothL = new THREE.Mesh(toothGeom, toothMatL);
        toothL.position.set(
          -0.72 + Math.cos(angle) * 0.22,
          Math.sin(angle) * 0.22,
          0.05
        );
        toothL.rotation.z = angle;
        group.add(toothL);

        const toothR = new THREE.Mesh(toothGeom, toothMatR);
        toothR.position.set(
          0.72 + Math.cos(angle) * 0.22,
          Math.sin(angle) * 0.22,
          0.05
        );
        toothR.rotation.z = angle;
        group.add(toothR);
      }

      // Triple Orbiting Gyroscope Rings (Cyan, Violet Purple, Hot Pink)
      const ringGeom1 = new THREE.RingGeometry(2.8, 2.85, 48);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x9d4edd, // Violet Purple
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const orbitRing1 = new THREE.Mesh(ringGeom1, ringMat1);
      orbitRing1.rotation.x = Math.PI / 3;
      group.add(orbitRing1);

      const ringGeom2 = new THREE.RingGeometry(3.1, 3.14, 48);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x00f0ff, // Cyber Cyan
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const orbitRing2 = new THREE.Mesh(ringGeom2, ringMat2);
      orbitRing2.rotation.y = Math.PI / 4;
      group.add(orbitRing2);

      const ringGeom3 = new THREE.RingGeometry(3.3, 3.33, 48);
      const ringMat3 = new THREE.MeshBasicMaterial({
        color: 0xff007a, // Hot Pink
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const orbitRing3 = new THREE.Mesh(ringGeom3, ringMat3);
      orbitRing3.rotation.z = Math.PI / 6;
      group.add(orbitRing3);

      // Multi-Colored Floating Particle Starfield (Yellow, Magenta, Cyan, Lime)
      const particleCount = 180;
      const particleGeom = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);

      const palette = [
        new THREE.Color(0xd4ff00), // Lime
        new THREE.Color(0xff007a), // Pink
        new THREE.Color(0x00f0ff), // Cyan
        new THREE.Color(0xffd600), // Yellow
        new THREE.Color(0x9d4edd), // Purple
        new THREE.Color(0xff6b00), // Orange
      ];

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 10;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 8;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;

        const col = palette[Math.floor(Math.random() * palette.length)];
        colorArray[i * 3] = col.r;
        colorArray[i * 3 + 1] = col.g;
        colorArray[i * 3 + 2] = col.b;
      }
      particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particleGeom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
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
        group.rotation.y = elapsedTime * 0.45 + mouse.x * 0.6;
        group.rotation.x = Math.sin(elapsedTime * 0.8) * 0.15 - mouse.y * 0.4;
        group.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

        // Spin the reels
        spoolLeft.rotation.z -= 0.04;
        spoolRight.rotation.z -= 0.04;

        // Gyro rings rotate in opposite directions
        orbitRing1.rotation.z += 0.015;
        orbitRing2.rotation.x += 0.012;
        orbitRing3.rotation.y -= 0.018;

        particles.rotation.y = elapsedTime * 0.04;
        particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

        renderer.render(scene, camera);
      };
      animate();
    }

    // ==========================================================
    // MODE 2: RESONATOR (3D Multi-Color Psychoacoustic Wave Grid)
    // ==========================================================
    else if (mode === 'resonator') {
      camera.position.set(0, 3.2, 5.5);
      camera.lookAt(0, 0, 0);

      const segmentsX = 42;
      const segmentsY = 42;
      const planeGeom = new THREE.PlaneGeometry(8, 8, segmentsX, segmentsY);
      planeGeom.rotateX(-Math.PI / 2.3);

      // Multi-colored wireframe grid using vertex colors
      const count = planeGeom.attributes.position.count;
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const x = planeGeom.attributes.position.getX(i);
        // Gradient between Cyan, Lime, and Purple
        const ratio = (x + 4) / 8;
        if (ratio < 0.5) {
          colors[i * 3] = 0.0; // r
          colors[i * 3 + 1] = 0.94; // g (Cyan)
          colors[i * 3 + 2] = 1.0; // b
        } else {
          colors[i * 3] = 0.83; // r (Lime)
          colors[i * 3 + 1] = 1.0; // g
          colors[i * 3 + 2] = 0.0; // b
        }
      }
      planeGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const planeMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      const waveMesh = new THREE.Mesh(planeGeom, planeMat);
      scene.add(waveMesh);

      // Hot Pink Central Waveform Ribbon
      const lineGeom = new THREE.BufferGeometry();
      const linePoints = [];
      for (let i = -4; i <= 4; i += 0.08) {
        linePoints.push(new THREE.Vector3(i, 0.4, 0));
      }
      lineGeom.setFromPoints(linePoints);
      const centralLineMat = new THREE.LineBasicMaterial({
        color: 0xff007a, // Hot Pink
        linewidth: 4,
      });
      const centralLine = new THREE.Line(lineGeom, centralLineMat);
      scene.add(centralLine);

      // Secondary Solar Orange Harmonic Waveform
      const lineGeom2 = new THREE.BufferGeometry();
      const linePoints2 = [];
      for (let i = -4; i <= 4; i += 0.08) {
        linePoints2.push(new THREE.Vector3(i, 0.2, 0.3));
      }
      lineGeom2.setFromPoints(linePoints2);
      const secondLineMat = new THREE.LineBasicMaterial({
        color: 0xffd600, // Sunny Yellow
        linewidth: 2,
      });
      const secondLine = new THREE.Line(lineGeom2, secondLineMat);
      scene.add(secondLine);

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

        // Wave terrain manipulation
        for (let i = 0; i < posAttribute.count; i++) {
          const u = initialPositions.getX(i);
          const v = initialPositions.getY(i);

          const wave1 = Math.sin(u * 1.5 + t * 2) * (0.35 * energyNorm);
          const wave2 = Math.cos(v * 1.5 + t * 1.5) * (0.25 * valenceNorm);
          const ripple = Math.sin(Math.sqrt(u * u + v * v) * 2 - t * 3) * 0.22;

          posAttribute.setZ(i, wave1 + wave2 + ripple);
        }
        posAttribute.needsUpdate = true;

        // Primary Pink line oscillation
        const linePos = centralLine.geometry.attributes.position;
        for (let j = 0; j < linePos.count; j++) {
          const lx = linePos.getX(j);
          const ly = Math.sin(lx * 2.5 + t * 4) * (0.6 * energyNorm) + Math.cos(lx * 4 + t * 2) * 0.18;
          linePos.setY(j, ly);
        }
        linePos.needsUpdate = true;

        // Secondary Yellow line oscillation
        const linePos2 = secondLine.geometry.attributes.position;
        for (let k = 0; k < linePos2.count; k++) {
          const lx2 = linePos2.getX(k);
          const ly2 = Math.cos(lx2 * 3.2 - t * 3.5) * (0.45 * valenceNorm) + Math.sin(lx2 * 2 + t * 2) * 0.12;
          linePos2.setY(k, ly2);
        }
        linePos2.needsUpdate = true;

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
