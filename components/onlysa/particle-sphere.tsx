"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SA_FLAG_PARTICLE_COLORS } from "@/lib/constants";

const FLAG_COLORS = SA_FLAG_PARTICLE_COLORS.map(
  (hex) => new THREE.Color(hex)
);

interface ParticleSphereProps {
  onClick?: () => void;
  /** Size canvas to parent container instead of full window */
  fillContainer?: boolean;
}

export function ParticleSphere({ onClick, fillContainer }: ParticleSphereProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    const particleCount = fillContainer ? 28000 : 45000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseColors = new Float32Array(particleCount * 3);
    const colorIndices = new Uint8Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);

    for (let i = 0; i < particleCount; i++) {
      const vertexIndex = i % torusKnot.attributes.position.count;
      const x = torusKnot.attributes.position.getX(vertexIndex);
      const y = torusKnot.attributes.position.getY(vertexIndex);
      const z = torusKnot.attributes.position.getZ(vertexIndex);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const ci = i % FLAG_COLORS.length;
      colorIndices[i] = ci;
      const c = FLAG_COLORS[ci];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      baseColors[i * 3] = c.r;
      baseColors[i * 3 + 1] = c.g;
      baseColors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: fillContainer ? 0.032 : 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const updateMouseFromEvent = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      mouse.set(x, y);
    };

    const handleMouseMove = (event: MouseEvent) => {
      updateMouseFromEvent(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        updateMouseFromEvent(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const setSize = () => {
      const w = fillContainer ? container.clientWidth : window.innerWidth;
      const h = fillContainer ? container.clientHeight : window.innerHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    setSize();

    if (fillContainer) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchmove", handleTouchMove, { passive: true });
    } else {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const resizeObserver =
      fillContainer && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(setSize)
        : null;
    resizeObserver?.observe(container);

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const mouseWorld = new THREE.Vector3(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const currentPos = new THREE.Vector3(
          positions[ix],
          positions[iy],
          positions[iz]
        );
        const originalPos = new THREE.Vector3(
          originalPositions[ix],
          originalPositions[iy],
          originalPositions[iz]
        );
        const velocity = new THREE.Vector3(
          velocities[ix],
          velocities[iy],
          velocities[iz]
        );

        const dist = currentPos.distanceTo(mouseWorld);
        const glow = dist < 1.5 ? 1 + (1.5 - dist) * 0.8 : 1;

        colors[ix] = Math.min(1, baseColors[ix] * glow);
        colors[iy] = Math.min(1, baseColors[iy] * glow);
        colors[iz] = Math.min(1, baseColors[iz] * glow);

        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.012;
          const direction = new THREE.Vector3()
            .subVectors(currentPos, mouseWorld)
            .normalize();
          velocity.add(direction.multiplyScalar(force));
          const boost = Math.min(1.35, glow);
          colors[ix] = Math.min(1, baseColors[ix] * boost);
          colors[iy] = Math.min(1, baseColors[iy] * boost);
          colors[iz] = Math.min(1, baseColors[iz] * boost);
        }

        velocity.add(
          new THREE.Vector3()
            .subVectors(originalPos, currentPos)
            .multiplyScalar(0.001)
        );
        velocity.multiplyScalar(0.95);

        positions[ix] += velocity.x;
        positions[iy] += velocity.y;
        positions[iz] += velocity.z;
        velocities[ix] = velocity.x;
        velocities[iy] = velocity.y;
        velocities[iz] = velocity.z;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      points.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleWindowResize = () => {
      if (!fillContainer) setSize();
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      if (fillContainer) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      resizeObserver?.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [fillContainer]);

  return (
    <div
      ref={mountRef}
      className={fillContainer ? "particle-canvas-contained" : "particle-canvas"}
      onClick={onClick}
      role="presentation"
    />
  );
}
