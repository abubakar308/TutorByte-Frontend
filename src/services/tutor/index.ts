"use server";

import { apiRequest } from "../api/base";
import { ApiResponse } from "../api/types";
import { requireRole } from "@/services/auth";

// ============ INTERFACES ============

export interface TutorStats {
  totalEarnings: number;
  totalSessions: number;
  averageRating: number;
  activeStudents: number;
}

export interface TutorBooking {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subject: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  meetingLink?: string;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface TutorAvailability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface TutorProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  bio: string;
  experienceYears: number;
  hourlyRate: number;
  averageRating: number;
  totalReviews: number;
  isApproved: boolean;
  subjects: any[];
  languages: any[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============ DASHBOARD & STATS ============

export const getTutorDashboardStats = async (): Promise<ApiResponse<TutorStats>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorStats>("/tutors/dashboard/stats", { method: "GET" });
};

// ============ PROFILE MANAGEMENT ============

export const getTutorProfile = async (tutorId?: string): Promise<ApiResponse<TutorProfile>> => {
  const endpoint = tutorId ? `/tutors/${tutorId}` : "/tutors/me";
  return apiRequest<TutorProfile>(endpoint, { method: "GET" });
};

export const updateTutorProfile = async (
  data: Partial<TutorProfile>
): Promise<ApiResponse<TutorProfile>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorProfile>("/tutors/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const updateTutorProfileById = async (
  tutorId: string,
  data: Partial<TutorProfile>
): Promise<ApiResponse<TutorProfile>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorProfile>(`/tutors/${tutorId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// ============ BOOKING MANAGEMENT ============

export const getTutorBookings = async (
  page = 1,
  limit = 10,
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<{ data: TutorBooking[]; total: number }>> => {
  await requireRole("TUTOR");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: TutorBooking[]; total: number }>(
    `/tutors/bookings${query}`,
    { method: "GET" }
  );
};

export const getBookingById = async (bookingId: string): Promise<ApiResponse<TutorBooking>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorBooking>(`/tutors/bookings/${bookingId}`, {
    method: "GET",
  });
};

export const acceptBooking = async (bookingId: string): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/bookings/${bookingId}/accept`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};

export const rejectBooking = async (bookingId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/bookings/${bookingId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

export const completeBooking = async (
  bookingId: string,
  notes?: string
): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/bookings/${bookingId}/complete`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
};

export const cancelBooking = async (bookingId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/bookings/${bookingId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

export const updateBooking = async (
  bookingId: string,
  data: Partial<TutorBooking>
): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// ============ AVAILABILITY MANAGEMENT ============

export const getTutorAvailabilities = async (): Promise<
  ApiResponse<TutorAvailability[]>
> => {
  await requireRole("TUTOR");
  return apiRequest<TutorAvailability[]>("/tutors/availabilities", {
    method: "GET",
  });
};

export const createAvailability = async (
  data: Omit<TutorAvailability, "id">
): Promise<ApiResponse<TutorAvailability>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorAvailability>("/tutors/availabilities", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateAvailability = async (
  availabilityId: string,
  data: Partial<TutorAvailability>
): Promise<ApiResponse<TutorAvailability>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorAvailability>(
    `/tutors/availabilities/${availabilityId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
};

export const deleteAvailability = async (availabilityId: string): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest(`/tutors/availabilities/${availabilityId}`, {
    method: "DELETE",
  });
};

export const bulkUpdateAvailabilities = async (
  availabilities: Partial<TutorAvailability>[]
): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest("/tutors/availabilities/bulk", {
    method: "POST",
    body: JSON.stringify({ availabilities }),
  });
};

// ============ REVIEWS ============

export const getTutorReviews = async (
  page = 1,
  limit = 5,
  rating?: number
): Promise<ApiResponse<{ data: TutorReview[]; total: number }>> => {
  await requireRole("TUTOR");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));
  if (rating) params.append("rating", String(rating));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<{ data: TutorReview[]; total: number }>(
    `/tutors/reviews${query}`,
    { method: "GET" }
  );
};

export const getReviewById = async (reviewId: string): Promise<ApiResponse<TutorReview>> => {
  await requireRole("TUTOR");
  return apiRequest<TutorReview>(`/tutors/reviews/${reviewId}`, {
    method: "GET",
  });
};

// ============ EARNINGS ============

export const getTutorEarnings = async (
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<{ total: number; breakdown: any }>> => {
  await requireRole("TUTOR");
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/tutors/earnings${query}`, { method: "GET" });
};

export const getTutorWithdrawals = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<{ data: any[]; total: number }>> => {
  await requireRole("TUTOR");
  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/tutors/withdrawals${query}`, { method: "GET" });
};

export const requestWithdrawal = async (amount: number): Promise<ApiResponse> => {
  await requireRole("TUTOR");
  return apiRequest("/tutors/withdrawals", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};