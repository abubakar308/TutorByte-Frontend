
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


export type TestimonialItem = {
  id: string;
  studentName: string;
  studentImage: string | null;
  tutorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export function mapReviewsToTestimonials(reviews: ReviewItem[]): TestimonialItem[] {
  return reviews.map((review) => ({
    id: review.id,
    studentName: review.student.name,
    studentImage: review.student.image,
    tutorName: review.tutor.user.name,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  }));
}