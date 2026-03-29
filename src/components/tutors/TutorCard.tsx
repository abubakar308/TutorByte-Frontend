import Link from "next/link";
import { Star, Clock, Languages, ChevronRight } from "lucide-react";
import { TutorProfile } from "@/types/tutor";

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const { user, subjects, languages, hourlyRate, averageRating, totalReviews, id } = tutor;

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      {/* Tutor Image & Price Badge */}
      <div className="relative h-60 w-full overflow-hidden">
        <img
          src={user.image || "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=900&auto=format&fit=crop"}
          alt={user.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3.5 py-1.5 text-sm font-bold text-foreground shadow-sm backdrop-blur-md">
          <span className="text-xs font-medium text-muted-foreground">$</span>
          {Number(hourlyRate).toFixed(2)}
          <span className="text-xs font-medium text-muted-foreground">/hr</span>
        </div>
      </div>

      {/* Tutor Info */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
              {user.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {subjects.map((ts) => (
                <span
                  key={ts.id}
                  className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                >
                  {ts.subject.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
              <Star className="h-4 w-4 fill-current" />
              {averageRating.toFixed(1)}
            </div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {totalReviews} Reviews
            </p>
          </div>
        </div>

        {/* bio snippet */}
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {tutor.bio}
        </p>

        {/* details row */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Languages className="h-3.5 w-3.5" />
              <span>{languages.map(tl => tl.language.name).join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{tutor.experienceYears} Years Exp.</span>
            </div>
          </div>
          
          <Link
            href={`/tutors/${id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
