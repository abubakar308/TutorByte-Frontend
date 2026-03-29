export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum SubjectCategory {
  SCIENCE = "SCIENCE",
  LANGUAGE = "LANGUAGE",
  ARTS = "ARTS",
  MATHEMATICS = "MATHEMATICS",
  TECHNOLOGY = "TECHNOLOGY",
  OTHERS = "OTHERS",
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

export interface Subject {
  id: string;
  name: string;
  categories: SubjectCategory;
}

export interface Language {
  id: string;
  name: string;
}

export interface TutorSubjects {
  id: string;
  tutorId: string;
  subjectId: string;
  subject: Subject;
}

export interface TutorLanguages {
  id: string;
  tutorId: string;
  languageId: string;
  language: Language;
}

export interface Availability {
  id: string;
  tutorId?: string;
  studentId?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isActive: boolean;
}

export interface Review {
  id: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: User;
}

export interface TutorProfile {
  id: string;
  userId: string;
  bio: string;
  experienceYears: number;
  hourlyRate: number; // Decimal in Prisma, number in TS
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
  createdAt: string;

  user: User;
  subjects: TutorSubjects[];
  languages: TutorLanguages[];
  availabilities: Availability[];
  reviews: Review[];
}
