import Link from "next/link";
import { Star, Clock, Languages, MapPin } from "lucide-react";
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
    languages 
  } = tutor;

  const fallbackImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxa1q_08JfYWirXMUJ5d0XdjdvrGUpa5mgTQ&s";
  
  const name = user?.name || "Tutor Name";
  const image = user?.image;
  const firstSubject = subjects?.[0]?.subject?.name || "General";
  const languagesText =
    languages?.map((l) => l.language.name).join(", ") || "English";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl">
      <div className="relative h-52 w-full">
        <img
          src={image || fallbackImage}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          ${hourlyRate}<span className="text-xs text-muted-foreground">/hr</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">{name}</h3>
            <p className="mt-1 text-sm font-medium text-primary">{firstSubject}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {subjects?.slice(1, 3).map((s) => (
                <span key={s.subject.id} className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {s.subject.name}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="h-4 w-4 fill-current" /> 
              {averageRating > 0 ? averageRating.toFixed(1) : "New"}
            </div>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">({totalReviews} reviews)</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">{bio || "Experienced tutor focused on practical outcomes and consistent student progress."}</p>

        <div className="mt-5 space-y-1.5 border-t border-border/70 pt-4">
          <div className="space-y-1 overflow-hidden">
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
        </div>

        <Link
          href={`/tutors/${id}`}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}