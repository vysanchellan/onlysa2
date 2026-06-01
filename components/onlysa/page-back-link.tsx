import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageBackLinkProps {
  href?: string;
  label?: string;
}

/** Stable back control — no motion wrapper (avoids layout/scale glitches). */
export function PageBackLink({ href = "/", label = "Back" }: PageBackLinkProps) {
  return (
    <div className="page-back-bar">
      <Link href={href} className="post-back-pill">
        <ChevronLeft size={14} strokeWidth={2.25} aria-hidden />
        <span>{label}</span>
      </Link>
    </div>
  );
}
