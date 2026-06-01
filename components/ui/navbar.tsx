"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, PenLine, Menu, X } from "lucide-react";
import { AREAS, type Area } from "@/lib/utils";

interface NavProps {
  selectedArea?: Area;
  onAreaChange?: (area: Area) => void;
}

const C = {
  bg:        "#080808",
  bgCard:    "#141414",
  bgElev:    "#1C1C1C",
  bgSecond:  "#111111",
  border:    "#232323",
  text:      "#F0EDE8",
  textSec:   "#9A9590",
  textMuted: "#5A5652",
  red:       "#E63946",
};

export function Navbar({ selectedArea = "All SA", onAreaChange }: NavProps) {
  const [areaOpen, setAreaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAreaSelect = (area: Area) => {
    onAreaChange?.(area);
    setAreaOpen(false);
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        backgroundColor: "rgba(8,8,8,0.88)",
        borderBottom: `1px solid rgba(35,35,35,0.6)`,
      }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-display,'Bebas Neue',sans-serif)", fontSize: "20px", letterSpacing: "0.08em", color: C.text }}>
              Only<span style={{ color: C.red }}>SA</span>
            </span>
          </Link>

          {/* Area selector — desktop */}
          <div style={{ position: "relative", display: "none" }} className="nav-desktop-area">
            <button
              onClick={() => setAreaOpen(!areaOpen)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", borderRadius: "8px",
                backgroundColor: C.bgElev, border: `1px solid ${C.border}`,
                color: C.textSec, fontSize: "13px",
                fontFamily: "var(--font-mono,monospace)", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedArea}</span>
              <ChevronDown size={12} style={{ transition: "transform 0.2s", transform: areaOpen ? "rotate(180deg)" : "none" }} />
            </button>

            {areaOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setAreaOpen(false)} />
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0,
                  width: "192px", backgroundColor: C.bgCard,
                  border: `1px solid ${C.border}`, borderRadius: "12px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  overflow: "hidden", zIndex: 20, padding: "4px 0",
                }}>
                  {AREAS.map((area) => (
                    <button
                      key={area}
                      onClick={() => handleAreaSelect(area)}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "8px 16px", fontSize: "13px",
                        fontFamily: "var(--font-mono,monospace)",
                        color: selectedArea === area ? C.text : C.textSec,
                        backgroundColor: selectedArea === area ? C.bgElev : "transparent",
                        border: "none", cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/post"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", borderRadius: "10px",
                backgroundColor: C.red, color: "#fff",
                fontSize: "13px", fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(230,57,70,0.28)",
                transition: "opacity 0.2s",
              }}
            >
              <PenLine size={14} />
              <span className="nav-cta-text">Post Anonymously</span>
            </Link>

            <button
              className="nav-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: "6px", borderRadius: "8px",
                backgroundColor: "transparent", border: "none",
                color: C.textMuted, cursor: "pointer",
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile area drawer */}
        {menuOpen && (
          <div className="nav-mobile-menu" style={{
            borderTop: `1px solid rgba(35,35,35,0.6)`,
            padding: "12px 16px",
            backgroundColor: C.bgSecond,
          }}>
            <p style={{ fontSize: "11px", fontFamily: "var(--font-mono,monospace)", color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "8px" }}>
              Filter by area
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => { handleAreaSelect(area); setMenuOpen(false); }}
                  style={{
                    padding: "4px 12px", borderRadius: "9999px",
                    fontSize: "12px", fontFamily: "var(--font-mono,monospace)",
                    border: `1px solid ${selectedArea === area ? C.red : C.border}`,
                    backgroundColor: selectedArea === area ? "rgba(230,57,70,0.1)" : "transparent",
                    color: selectedArea === area ? C.red : C.textSec,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="nav-bottom" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(8,8,8,0.92)",
        borderTop: `1px solid rgba(35,35,35,0.6)`,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 16px" }}>
          <Link href="/" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: C.textMuted, textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono,monospace)" }}>Feed</span>
          </Link>

          <Link href="/post" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            padding: "8px 20px", borderRadius: "12px",
            backgroundColor: C.red, color: "#fff", textDecoration: "none",
          }}>
            <PenLine size={18} />
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono,monospace)", fontWeight: 600 }}>Post</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span style={{ fontSize: "10px", fontFamily: "var(--font-mono,monospace)" }}>Areas</span>
          </button>
        </div>
      </nav>

      {/* Responsive overrides */}
      <style>{`
        .nav-desktop-area { display: none !important; }
        .nav-menu-btn     { display: flex !important; }
        .nav-bottom       { display: block !important; }
        .nav-cta-text     { display: none; }
        @media (min-width: 640px) {
          .nav-desktop-area { display: block !important; }
          .nav-menu-btn     { display: none !important; }
          .nav-bottom       { display: none !important; }
          .nav-cta-text     { display: inline !important; }
        }
      `}</style>
    </>
  );
}
