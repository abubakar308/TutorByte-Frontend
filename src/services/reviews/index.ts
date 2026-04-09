
export type ReviewStudent = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type ReviewTutorUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type ReviewTutor = {
  id: string;
  bio: string;
  user: ReviewTutorUser;
};

export type ReviewItem = {
  id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: string;
  student: ReviewStudent;
  tutor: ReviewTutor;
};

export type ReviewResponse = {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data: ReviewItem[];
};

export type TestimonialItem = {
  id: string;
  studentName: string;
  studentImage: string | null;
  tutorName: string;
  tutorBio: string;
  rating: number;
  comment: string;
  createdAt: string;
  subject: string;
  role: string;
};

export const getAllReviews = async (): Promise<{
  success: boolean;
  data: ReviewItem[];
  message?: string;
}> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
      cache: "no-store",
    });

    const result: ReviewResponse = await res.json();

    return {
      success: result.success,
      data: Array.isArray(result.data) ? result.data : [],
      message: result.message,
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);

    return {
      success: false,
      data: [],
      message: "Failed to fetch reviews",
    };
  }
};