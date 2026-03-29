import { MessageCircle, Users, ShieldCheck } from "lucide-react";

export default function TrustSection() {
  return (
    <section id="reviews" className="bg-primary py-16 text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
          <Users className="h-8 w-8" />
          <h3 className="mt-4 text-xl font-semibold">Personalized Matching</h3>
          <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
            Find tutors based on subject, language, budget, and availability.
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
          <MessageCircle className="h-8 w-8" />
          <h3 className="mt-4 text-xl font-semibold">Clear Communication</h3>
          <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
            Easy scheduling, booking updates, and student-friendly interactions.
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
          <ShieldCheck className="h-8 w-8" />
          <h3 className="mt-4 text-xl font-semibold">Reliable Experience</h3>
          <p className="mt-2 text-sm leading-7 text-primary-foreground/80">
            Verified profiles, structured booking flow, and scalable backend support.
          </p>
        </div>
      </div>
    </section>
  );
}