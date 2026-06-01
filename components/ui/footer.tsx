import Link from "next/link";

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(35,35,35,0.6)",
      padding: "32px 16px",
      marginTop: "48px",
    }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="footer-inner">
          <div>
            <span style={{
              fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)",
              fontSize: "18px", letterSpacing: "0.08em", color: "#F0EDE8",
            }}>
              Only<span style={{ color: "#E63946" }}>SA</span>
            </span>
            <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652", marginTop: "2px" }}>
              Anonymous. Unfiltered. SA.
            </p>
          </div>

          <nav style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
            {[
              { href: "/about",                   label: "About" },
              { href: "/guidelines",              label: "Guidelines" },
              { href: "mailto:abuse@onlysa.co.za", label: "Report Abuse" },
              { href: "mailto:hello@onlysa.co.za", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                style={{ fontSize: "12px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652", textDecoration: "none", transition: "color 0.2s" }}
                className="footer-link"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{
          marginTop: "24px", paddingTop: "24px",
          borderTop: "1px solid rgba(35,35,35,0.4)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "8px",
        }}>
          <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652" }}>
            © {new Date().getFullYear()} OnlySA · For SA eyes only
          </p>
          <p style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "#5A5652" }}>
            🇿🇦 Made in SA
          </p>
        </div>
      </div>

      <style>{`
        .footer-link:hover { color: #9A9590 !important; }
        @media (min-width: 640px) {
          .footer-inner { flex-direction: row !important; justify-content: space-between; align-items: center; }
        }
      `}</style>
    </footer>
  );
}
