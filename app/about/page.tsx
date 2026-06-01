import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ui/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="text-base font-display tracking-wider">Only<span className="text-accent-red">SA</span></span>
          <span className="text-text-muted text-sm">/ About</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-20 pb-12">
        <div className="mb-8 mt-4">
          <h1 className="text-5xl font-display text-text-primary tracking-wide mb-3">
            What is<br/><span className="text-accent-red">OnlySA?</span>
          </h1>
        </div>

        <div className="space-y-6 text-text-secondary text-sm leading-relaxed">
          <p>
            OnlySA is a hyperlocal anonymous platform built for South Africans. No login. No username. No profile picture. Just your raw, unfiltered take on the places and things you know.
          </p>
          <p>
            From Durban confessions to Joburg rants, PMB reviews to Cape Town hot takes — OnlySA is the feed that South Africa actually deserves.
          </p>
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-text-primary font-semibold mb-3 font-mono text-xs uppercase tracking-wider">How it works</h2>
            <ul className="space-y-2 text-text-muted text-sm font-mono">
              <li>01. Pick your area</li>
              <li>02. Pick a category</li>
              <li>03. Write your post</li>
              <li>04. Hit post — done</li>
            </ul>
          </div>
          <p className="text-text-muted text-xs font-mono">
            All posts are reviewed by AI before publishing. OnlySA does not tolerate hate speech, threats, or personal information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
