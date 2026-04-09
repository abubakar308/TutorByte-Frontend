import Link from "next/link";
import { Star, Clock, Languages, MapPin, BadgeDollarSign } from "lucide-react";
import { Tutor } from "@/services/tutors";

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const {
    id,
    bio,
    hourlyRate,
    experienceYears,
    averageRating,
    totalReviews,
    user,
    subjects,
    languages,
  } = tutor;

  const fallbackImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa1q_08JfYWirXMUJ5d0XdjdvrGUpa5mgTQ&s";

  const name = user?.name || "Tutor Name";
  const image = user?.image || fallbackImage;
  const firstSubject = subjects?.[0]?.subject?.name || "General";
  const extraSubjects = subjects?.slice(1, 3) || [];
  const languagesText =
    languages?.map((l) => l.language?.name).filter(Boolean).join(", ") || "English";

  return (
    <article className="group flex -z-100 h-full min-h-[420px] w-full flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur-md">
          <BadgeDollarSign className="h-3.5 w-3.5 text-primary" />
          ${Number(hourlyRate || 0).toFixed(0)}
          <span className="text-muted-foreground">/hr</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-lg font-bold tracking-tight transition-colors group-hover:text-primary">
              {name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-primary">
              {firstSubject}
            </p>

            {extraSubjects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {extraSubjects.map((s) => (
                  <span
                    key={s.subject.id}
                    className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {s.subject.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="h-4 w-4 fill-current" />
              {averageRating > 0 ? Number(averageRating).toFixed(1) : "New"}
            </div>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">
              ({totalReviews} reviews)
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 min-h-[48px] line-clamp-2 text-sm leading-6 text-muted-foreground">
          {bio ||
            "Experienced tutor focused on practical outcomes and consistent student progress."}
        </p>

        {/* Meta Info */}
        <div className="mt-5 space-y-2 border-t border-border/70 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Languages className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{languagesText}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{experienceYears} Years Experience</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>Online</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/tutors/${id}`}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}