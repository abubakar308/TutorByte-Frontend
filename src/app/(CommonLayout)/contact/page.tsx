import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock3,
  MessageSquare,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";

const contactCards = [
  {
    icon: Mail,
    title: "Email Support",
    description:
      "Reach out to our support team for general questions, tutor issues, or platform guidance.",
    value: "support@tutorbyte.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description:
      "Talk to our team for urgent support, account help, or platform-related questions.",
    value: "+880 1234-567890",
  },
  {
    icon: MapPin,
    title: "Office Address",
    description:
      "TutorByte operates with a modern learning-first approach and support team based in Bangladesh.",
    value: "Ashulia, Savar, Dhaka, Bangladesh",
  },
  {
    icon: Clock3,
    title: "Support Hours",
    description:
      "Our team is available throughout the week to help students, tutors, and admins.",
    value: "Sat - Thu, 9:00 AM - 8:00 PM",
  },
];

const faqs = [
  {
    question: "How do I book a tutor on TutorByte?",
    answer:
      "Browse tutors by subject, language, rating, and availability. Then visit the tutor profile and choose a suitable time slot to book a session.",
  },
  {
    question: "Can I become a tutor on TutorByte?",
    answer:
      "Yes. Students or professionals can apply to become tutors by completing their tutor profile and submitting the required teaching details for approval.",
  },
  {
    question: "What if I need help with my booking?",
    answer:
      "You can contact our support team using the form below or reach us by email for booking-related issues, updates, or guidance.",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <MessageSquare className="h-3.5 w-3.5" />
              Contact TutorByte
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              We are here to support your learning journey.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Whether you are a student looking for guidance, a tutor needing help,
              or an admin managing the platform, our team is ready to assist you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/help"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Visit Help Center
              </Link>
              <Link
                href="/tutors"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                Explore Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {contactCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm sm:p-10">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Send Us a Message
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Let us know how we can help.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Fill out the form and our team will get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-semibold text-foreground"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What do you need help with?"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="text-sm font-semibold text-foreground"
                  >
                    I am a
                  </label>
                  <select
                    id="role"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  >
                    <option>Student</option>
                    <option>Tutor</option>
                    <option>Admin</option>
                    <option>Visitor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Write your message here..."
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-black tracking-tight">
                Need faster support?
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Visit our help center to find answers to common questions about
                bookings, tutor approvals, account settings, and platform usage.
              </p>

              <Link
                href="/help"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
              >
                Go to Help Center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
                Frequently Asked Questions
              </p>

              <div className="mt-6 space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-border/70 p-5">
                    <h3 className="text-base font-bold tracking-tight">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}