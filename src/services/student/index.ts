"use server";

import { apiRequest } from "../api/base";
import { ApiResponse } from "../api/types";
import { requireRole } from "@/services/auth";

// ============ INTERFACES ============

export interface StudentStats {
  totalSessions: number;
  hoursLearned: number;
  totalSpent: number;
  averageRating: number;
}

export interface CreateBookingRequest {
  tutorId: string;
  subjectId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
}

export interface StudentBooking {
  id: string;
  tutorId: string;
  tutorName: string;
  subjectId: string;
  subject: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  meetingLink?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  bio?: string;
  image?: string;
  grade?: string;
  preferences?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendedTutor {
  id: string;
  userId: string;
  name: string;
  subject: string;
  averageRating: number;
  hourlyRate: number;
  image?: string;
}

export interface StudentPayment {
  id: string;
  bookingId: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentReview {
  id: string;
  bookingId: string;
  tutorId: string;
  tutorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ============ DASHBOARD & STATS ============

export const getStudentDashboardStats = async (): Promise<ApiResponse<StudentStats>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentStats>("/users/student-stats", { method: "GET" });
};

// ============ PROFILE MANAGEMENT ============

export const getStudentProfile = async (
  studentId?: string
): Promise<ApiResponse<StudentProfile>> => {
  const endpoint = studentId ? `/students/${studentId}` : "/students/me";
  return apiRequest<StudentProfile>(endpoint, { method: "GET" });
};

export const updateStudentProfile = async (
  data: Partial<StudentProfile>
): Promise<ApiResponse<StudentProfile>> => {
  // Allow STUDENT and ADMIN to use this service
  const user = await requireRole("STUDENT").catch(async () => await requireRole("ADMIN"));
  return apiRequest<StudentProfile>("/users/update-profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const updateStudentProfileById = async (
  studentId: string,
  data: Partial<StudentProfile>
): Promise<ApiResponse<StudentProfile>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentProfile>(`/students/${studentId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const uploadUserAvatar = async (
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiRequest<{ avatarUrl: string }>("/users/upload-avatar", {
    method: "POST",
    body: formData,
  });
};

// ============ BOOKING MANAGEMENT ============

export const getStudentBookings = async (
  page = 1,
  limit = 10,
  status?: string,
  tutorId?: string
): Promise<ApiResponse<{ data: StudentBooking[]; total: number }>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (tutorId) params.append("tutorId", tutorId);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: StudentBooking[]; total: number }>(
    `/bookings/student${query}`,
    { method: "GET" }
  );
};

export const getBookingById = async (bookingId: string): Promise<ApiResponse<StudentBooking>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentBooking>(`/students/bookings/${bookingId}`, {
    method: "GET",
  });
};

export const createBooking = async (
  data: CreateBookingRequest
): Promise<ApiResponse<StudentBooking>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentBooking>("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateBooking = async (
  bookingId: string,
  data: Partial<StudentBooking>
): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};


// ============ TUTORS DISCOVERY ============

export const getRecommendedTutors = async (
  limit = 3,
  subject?: string
): Promise<ApiResponse<RecommendedTutor[]>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (subject) params.append("subject", subject);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<RecommendedTutor[]>(`/students/recommended-tutors${query}`, {
    method: "GET",
  });
};

export const getTutorDetails = async (tutorId: string): Promise<ApiResponse<any>> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/tutors/${tutorId}`, { method: "GET" });
};

// ============ PAYMENT MANAGEMENT ============

export const getStudentPayments = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<ApiResponse<{ data: StudentPayment[]; total: number }>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: StudentPayment[]; total: number }>(
    `/students/payments${query}`,
    { method: "GET" }
  );
};

export const getPaymentById = async (paymentId: string): Promise<ApiResponse<StudentPayment>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentPayment>(`/students/payments/${paymentId}`, {
    method: "GET",
  });
};

export const initiatePayment = async (
  bookingId: string,
  amount: number
): Promise<ApiResponse<{ sessionId: string; paymentUrl: string }>> => {
  await requireRole("STUDENT");
  return apiRequest<{ sessionId: string; paymentUrl: string }>(
    "/students/payments/initiate",
    {
      method: "POST",
      body: JSON.stringify({ bookingId, amount }),
    }
  );
};

export const verifyPayment = async (
  paymentId: string,
  transactionId: string
): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest("/students/payments/verify", {
    method: "POST",
    body: JSON.stringify({ paymentId, transactionId }),
  });
};

export const requestRefund = async (paymentId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

// ============ REVIEWS ============

export const getStudentReviews = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<{ data: StudentReview[]; total: number }>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: StudentReview[]; total: number }>(
    `/students/reviews${query}`,
    { method: "GET" }
  );
};

export const getReviewById = async (reviewId: string): Promise<ApiResponse<StudentReview>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentReview>(`/students/reviews/${reviewId}`, {
    method: "GET",
  });
};

export const createReview = async (
  bookingId: string,
  tutorId: string,
  rating: number,
  comment: string
): Promise<ApiResponse<StudentReview>> => {
  await requireRole("STUDENT");
  return apiRequest<StudentReview>("/reviews", {
    method: "POST",
    body: JSON.stringify({
      bookingId,
      tutorId,
      rating,
      comment,
    }),
  });
};

export const updateReview = async (
  reviewId: string,
  data: Partial<StudentReview>
): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteReview = async (reviewId: string): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

// ============ FAVORITES ============

export const addFavoriteTutor = async (tutorId: string): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/favorites/${tutorId}`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};

export const removeFavoriteTutor = async (tutorId: string): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/favorites/${tutorId}`, {
    method: "DELETE",
  });
};

export const getFavoriteTutors = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<{ data: RecommendedTutor[]; total: number }>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: RecommendedTutor[]; total: number }>(
    `/students/favorites${query}`,
    { method: "GET" }
  );
};

// ============ NOTIFICATIONS & PREFERENCES ============

export const getStudentNotifications = async (
  page = 1,
  limit = 10,
  read?: boolean
): Promise<ApiResponse<any>> => {
  await requireRole("STUDENT");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  if (read !== undefined) params.append("read", String(read));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/students/notifications${query}`, { method: "GET" });
};

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest(`/students/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
};

export const updateStudentPreferences = async (preferences: any): Promise<ApiResponse> => {
  await requireRole("STUDENT");
  return apiRequest("/students/preferences", {
    method: "PATCH",
    body: JSON.stringify(preferences),
  });
};