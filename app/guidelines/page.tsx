import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function GuidelinesPage() {
  const allowed = [
    "Confessions and personal stories",
    "Rants about your city, traffic, infrastructure",
    "Business and restaurant reviews",
    "Community observations and neighbourhood watch",
    "Hot takes and opinions",
    "Questions to your community",
  ];

  const notAllowed = [
    "Hate speech, racism, or discrimination",
    "Full names, phone numbers, or addresses",
    "Threats or calls to violence",
    "Content involving minors",
    "Doxxing or stalking",
    "Instructions for illegal activity",
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="text-base font-display tracking-wider">Only<span className="text-accent-red">SA</span></span>
          <span className="text-text-muted text-sm">/ Guidelines</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-12">
        <div className="mb-8 mt-4">
          <h1 className="text-5xl font-display text-text-primary tracking-wide mb-2">
            Community<br /><span className="text-accent-red">Guidelines</span>
          </h1>
          <p className="text-text-muted text-sm font-mono">Anonymous does not mean lawless.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-accent-green text-xs font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-accent-green">✓</span> What&apos;s welcome
            </h2>
            <ul className="space-y-2">
              {allowed.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-accent-green mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-accent-red text-xs font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✗</span> What gets you removed
            </h2>
            <ul className="space-y-2">
              {notAllowed.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                  <span className="text-accent-red mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-text-muted text-xs font-mono text-center">
            3 reports = auto-hidden pending manual review. We take this seriously.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
