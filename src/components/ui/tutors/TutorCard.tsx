import Link from "next/link";
import { Star, Clock, Languages, ChevronRight } from "lucide-react";

export default function TutorCard({ tutor }: { tutor: any }) {

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

  // ইউজার অবজেক্ট থেকে নাম এবং ইমেজ নিন
  const name = user?.name || "Tutor Name";
  const image = user?.image;

  return (
    <div className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
      {/* Image Section */}
      <div className="relative h-60 w-full">
        <img
          src={image || "https://images.unsplash.com/photo-1544717297-fa15739a5447?q=80&w=900&auto=format&fit=crop"}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3.5 py-1.5 text-sm font-bold backdrop-blur-md">
          ${hourlyRate}<span className="text-xs text-muted-foreground">/hr</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{name}</h3>
            
            {/* Subjects Chips */}
            <div className="mt-2 flex flex-wrap gap-1">
              {subjects?.map((s: any) => (
                <span key={s.subject.id} className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {s.subject.name}
                </span>
              ))}
            </div>
          </div>

          {/* Rating Section */}
          <div className="text-right">
            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
              <Star className="h-4 w-4 fill-current" /> 
              {averageRating > 0 ? averageRating.toFixed(1) : "New"}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground font-medium">({totalReviews} reviews)</p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground h-10">{bio}</p>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between border-t pt-5">
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Languages className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {languages?.map((l: any) => l.language.name).join(", ") || "English"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{experienceYears} Years Experience</span>
            </div>
          </div>
          
          {/* Action Button */}
          <Link 
            href={`/tutors/${id}`} 
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}