import { 
  ArrowRight, 
  GraduationCap, 
  Mail, 
  MapPin, 
  PhoneCall 
} from "lucide-react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 relative">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-foreground">TutorByte</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                  Elite Learning Hub
                </p>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              TutorByte helps students discover verified tutors, book secure sessions, and progress
              confidently with personalized one-on-one learning.
            </p>
            
            <div className="flex items-center gap-3">
              {[
                { icon: FaFacebook, href: "https://facebook.com/tutorbyte", label: "Facebook" },
                { icon: FaTwitter, href: "https://twitter.com/tutorbyte", label: "Twitter" },
                { icon: FaLinkedin, href: "https://linkedin.com/company/tutorbyte", label: "LinkedIn" },
                { icon: FaInstagram, href: "https://instagram.com/tutorbyte", label: "Instagram" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-muted text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              Platform
            </h4>
            <ul className="mt-8 space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/tutors" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Browse Tutors</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Our Process</Link></li>
              <li><Link href="/#subjects" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Expert Subjects</Link></li>
              <li><Link href="/#reviews" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              Support
            </h4>
            <ul className="mt-8 space-y-5 text-sm font-medium text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>Ashulia, Savar,<br />Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-2 group"><ArrowRight className="h-3 w-3 opacity-0 -ml-5 transition-all group-hover:opacity-100 group-hover:ml-0" /> Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-muted/30 p-6 lg:p-7">
            <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
            
            <h4 className="relative text-xs font-bold uppercase tracking-[0.22em] text-foreground">
              Join Newsletter
            </h4>
            <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
              Weekly learning tips, featured tutors, and product updates from TutorByte.
            </p>
            <form className="relative mt-6 space-y-3">
              <div className="relative">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-4 text-sm font-medium outline-none ring-offset-background transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              © 2026 <span className="text-foreground">TutorByte</span>. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Network Status: Active
              </p>
              <div className="flex gap-4">
                <Link href="/terms" className="hover:text-primary">Terms</Link>
                <Link href="/cookies" className="hover:text-primary">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}