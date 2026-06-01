"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  /** When true, sizes to parent element instead of the window */
  fillContainer?: boolean;
  theme?: "dark" | "light";
};

export function DottedSurface({
  className,
  fillContainer = false,
  theme = "dark",
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(theme === "dark" ? 0x0a0a0a : 0xffffff, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, 1, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(scene.fog.color, 0);

    const positions: number[] = [];
    const colors: number[] = [];

    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        if (theme === "dark") {
          colors.push(210, 210, 220);
        } else {
          colors.push(30, 30, 40);
        }
      }
    }

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    container.appendChild(renderer.domElement);

    let count = 0;
    let animationId = 0;

    const setSize = () => {
      const w = fillContainer ? container.clientWidth : window.innerWidth;
      const h = fillContainer ? container.clientHeight : window.innerHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    setSize();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const positionAttribute = geometry.attributes.position;
      const arr = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          arr[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      positionAttribute.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.06;
    };

    animate();

    const handleResize = () => setSize();
    window.addEventListener("resize", handleResize);

    const resizeObserver =
      fillContainer && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(setSize)
        : null;
    resizeObserver?.observe(container);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
      cancelAnimationFrame(animationId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme, fillContainer]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
      {...props}
    />
  );
}
