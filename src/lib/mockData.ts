import { DayOfWeek, SubjectCategory, TutorProfile } from "@/types/tutor";

export const mockSubjects = [
  { id: "s1", name: "English & IELTS", categories: SubjectCategory.LANGUAGE },
  { id: "s2", name: "Mathematics", categories: SubjectCategory.MATHEMATICS },
  { id: "s3", name: "Physics", categories: SubjectCategory.SCIENCE },
  { id: "s4", name: "Web Development", categories: SubjectCategory.TECHNOLOGY },
  { id: "s5", name: "Classical Music", categories: SubjectCategory.ARTS },
];

export const mockLanguages = [
  { id: "l1", name: "English" },
  { id: "l2", name: "Bangla" },
  { id: "l3", name: "Spanish" },
];

export const mockTutors: TutorProfile[] = [
  {
    id: "tp1",
    userId: "u1",
    bio: "Passionate English tutor with 5+ years of experience in helping students achieve their IELTS goals. I focus on practical communication and grammar accuracy.",
    experienceYears: 5,
    hourlyRate: 18.00,
    averageRating: 4.9,
    totalReviews: 124,
    isApproved: true,
    createdAt: new Date().toISOString(),
    user: {
      id: "u1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
      role: "TUTOR"
    },
    subjects: [
      { id: "ts1", tutorId: "tp1", subjectId: "s1", subject: mockSubjects[0] }
    ],
    languages: [
      { id: "tl1", tutorId: "tp1", languageId: "l1", language: mockLanguages[0] },
      { id: "tl2", tutorId: "tp1", languageId: "l2", language: mockLanguages[1] }
    ],
    availabilities: [
      { id: "a1", dayOfWeek: DayOfWeek.MONDAY, startTime: "09:00", endTime: "12:00", isActive: true },
      { id: "a2", dayOfWeek: DayOfWeek.WEDNESDAY, startTime: "14:00", endTime: "18:00", isActive: true },
      { id: "a3", dayOfWeek: DayOfWeek.FRIDAY, startTime: "10:00", endTime: "15:00", isActive: true }
    ],
    reviews: [
      {
        id: "r1", tutorId: "tp1", studentId: "u2", rating: 5, comment: "Sarah is amazing! My IELTS score improved significantly.", createdAt: new Date().toISOString(),
        student: { id: "u2", name: "Abu Bakar", email: "abu@example.com", role: "STUDENT" }
      }
    ]
  },
  {
    id: "tp2",
    userId: "u3",
    bio: "Expert Mathematician with a knack for making complex problems simple. Whether it's Calculus or Basic Algebra, I've got you covered.",
    experienceYears: 8,
    hourlyRate: 25.00,
    averageRating: 4.8,
    totalReviews: 89,
    isApproved: true,
    createdAt: new Date().toISOString(),
    user: {
      id: "u3",
      name: "Arif Rahman",
      email: "arif@example.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
      role: "TUTOR"
    },
    subjects: [
      { id: "ts2", tutorId: "tp2", subjectId: "s2", subject: mockSubjects[1] },
      { id: "ts3", tutorId: "tp2", subjectId: "s3", subject: mockSubjects[2] }
    ],
    languages: [
      { id: "tl3", tutorId: "tp2", languageId: "l1", language: mockLanguages[0] },
      { id: "tl4", tutorId: "tp2", languageId: "l2", language: mockLanguages[1] }
    ],
    availabilities: [
      { id: "a4", dayOfWeek: DayOfWeek.TUESDAY, startTime: "10:00", endTime: "16:00", isActive: true },
      { id: "a5", dayOfWeek: DayOfWeek.THURSDAY, startTime: "10:00", endTime: "16:00", isActive: true }
    ],
    reviews: []
  },
  {
    id: "tp3",
    userId: "u4",
    bio: "Full Stack Developer turned tutor. I'll teach you how to build real-world applications using modern technologies like React and Next.js.",
    experienceYears: 4,
    hourlyRate: 30.00,
    averageRating: 5.0,
    totalReviews: 45,
    isApproved: true,
    createdAt: new Date().toISOString(),
    user: {
      id: "u4",
      name: "Maya Chen",
      email: "maya@example.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop",
      role: "TUTOR"
    },
    subjects: [
      { id: "ts4", tutorId: "tp3", subjectId: "s4", subject: mockSubjects[3] }
    ],
    languages: [
      { id: "tl5", tutorId: "tp3", languageId: "l1", language: mockLanguages[0] }
    ],
    availabilities: [
      { id: "a6", dayOfWeek: DayOfWeek.SATURDAY, startTime: "09:00", endTime: "17:00", isActive: true },
      { id: "a7", dayOfWeek: DayOfWeek.SUNDAY, startTime: "09:00", endTime: "13:00", isActive: true }
    ],
    reviews: []
  }
];
