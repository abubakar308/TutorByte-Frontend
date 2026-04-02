"use server";

export interface Subject {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  name: string;
}

export interface Tutor {
  id: string;
  userId: string;
  bio: string;
  experienceYears: number;
  hourlyRate: string;
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  subjects: { subject: Subject }[];
  languages: { language: Language }[];
  availabilities?: any[];
  reviews?: any[];
}

export const getAllTutors = async (query: Record<string, any> = {}): Promise<{ success: boolean; data: Tutor[]; message?: string }> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors?${new URLSearchParams(query).toString()}`, {
      cache: 'no-store'
    });
    const data = await res.json();
    return { success: data.success, data: data.data, message: data.message };
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return { success: false, data: [], message: "Failed to fetch tutors" };
  }
};

export const getTutorById = async (tutorId: string): Promise<{ success: boolean; data: Tutor | null; message?: string }> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tutors/${tutorId}`);
        const data = await res.json();
        return { success: data.success, data: data.data, message: data.message };
    } catch (error) {
        console.error("Error fetching tutor:", error);
        return { success: false, data: null, message: "Failed to fetch tutor" };
    }
};