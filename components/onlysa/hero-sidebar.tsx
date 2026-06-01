"use client";

import { ParticleSphere } from "./particle-sphere";

export function HeroSidebar() {
  return (
    <aside className="hero-sidebar">
      <div className="hero-sidebar-inner">
        <p className="hero-sidebar-label">INTERACTIVE SPHERE</p>
        <p className="hero-sidebar-hint">Move your cursor · SA flag particles</p>
        <div className="hero-sidebar-canvas">
          <ParticleSphere fillContainer />
        </div>
        <p className="hero-sidebar-footer">The rainbow nation, in motion</p>
      </div>
    </aside>
  );
}
