import { Star } from "lucide-react";

type Tutor = {
  name: string;
  subject: string;
  language: string;
  rating: number;
  price: string;
  image: string;
};

const featuredTutors: Tutor[] = [
  {
    name: "Sarah Johnson",
    subject: "English & IELTS",
    language: "English, Bangla",
    rating: 4.9,
    price: "$18/hr",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Arif Rahman",
    subject: "Math & Physics",
    language: "Bangla, English",
    rating: 4.8,
    price: "$15/hr",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Maya Chen",
    subject: "Web Development",
    language: "English",
    rating: 5.0,
    price: "$22/hr",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop",
  },
];



export default function FeaturedTutorsSection() {
  return (
    <section id="tutors" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Featured tutors
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet top-rated tutors ready to help you grow.
            </h2>
          </div>
          <button className="rounded-2xl border border-border bg-card px-5 py-3 font-medium text-card-foreground transition hover:border-primary/30">
            View All Tutors
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredTutors.map((tutor) => (
            <div
              key={tutor.name}
              className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground shadow">
                  {tutor.price}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {tutor.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tutor.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    <Star className="h-4 w-4 fill-current" />
                    {tutor.rating}
                  </div>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  Teaches in: {tutor.language}
                </p>

                <div className="mt-6 flex gap-3">
                  <button className="flex-1 rounded-2xl bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:bg-primary/90">
                    Book Now
                  </button>
                  <button className="rounded-2xl border border-border px-4 py-3 font-medium text-card-foreground transition hover:border-primary/30">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
