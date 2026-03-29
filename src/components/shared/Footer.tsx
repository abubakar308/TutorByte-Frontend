import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">TutorByte</p>
              <p className="text-xs text-muted-foreground">
                Smart Tutor Booking Platform
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            TutorByte helps students discover expert tutors, book sessions easily,
            and build better learning journeys with confidence.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            Platform
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><Link href="/tutors" className="hover:text-primary transition-colors">Find Tutors</Link></li>
            <li><Link href="/register?role=tutor" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link href="/#reviews" className="hover:text-primary transition-colors">Reviews</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            Company
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            Newsletter
          </h4>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Get product updates, learning tips, and featured tutor picks.
          </p>
          <div className="mt-4 flex gap-3">
            <input
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50"
            />
            <button className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:bg-primary/90">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row lg:px-8">
          <p>© 2026 TutorByte. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}