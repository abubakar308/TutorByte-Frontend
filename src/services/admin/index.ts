"use server";

import { apiRequest } from "../api/base";
import { ApiResponse } from "../api/types";
import { requireRole } from "@/services/auth";


// ============ INTERFACES ============

export interface AdminDashboardStats {
  totalStudents: number;
  totalUsers: number;
  totalTutors: number;
  totalBookings: number;
  recentStats?: {
    revenueChange: number;
    usersChange: number;
    activeSessionsLive: number;
    pendingTutors: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string;
}

export interface AdminPayment {
  id: string;
  studentName: string;
  tutorName: string;
  amount: number;
  status: "PAID" | "REFUNDED" | "PENDING";
  gateway: string;
  createdAt: string;
}

export interface AdminTutor {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  experienceYears: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  studentId: string;
  tutorId: string;
  studentName: string;
  tutorName: string;
  subject: string;
  scheduledDate: string;
  duration: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface AdminLogsResponse {
  data: unknown[];
  total?: number;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  filter?: {
    search: string;
    role: string;
    status: string;
  };
  total: number;
  page?: number;
  limit?: number;
}

export interface Subject {
  id: string;
  name: string;
 categories:  "ACADEMIC" | "SKILLS" | "LANGUAGE"
}

export interface Language {
  id: string;
  name: string;
}

// ============ DASHBOARD & STATS ============

export const getAdminDashboardStats = async (): Promise<ApiResponse<AdminDashboardStats>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminDashboardStats>("/admin/dashboard-stats", {
    method: "GET",
  });
};

// ============ USER MANAGEMENT (CRUD) ============

// export async function getAdminUsers(
//   page = 1,
//   limit = 10,
//   search = "",
//   role?: string,
//   status?: string
// ): Promise<ApiResponse<AdminUsersResponse>> {
//   await requireRole("ADMIN");
//   const params = new URLSearchParams();
//   params.append("page", String(page));
//   params.append("limit", String(limit));
//   if (search) params.append("search", search);
//   if (role) params.append("role", role);
//   if (status) params.append("status", status);
//   const query = params.toString() ? `?${params.toString()}` : "";
//   return apiRequest<AdminUsersResponse>(`/admin/users${query}`, {
//     method: "GET",
//   });
// }

export async function getAdminUsers(
  page = 1,
  limit = 10,
  search = "",
  role?: string,
  status?: string
): Promise<ApiResponse<AdminUser[]>> {
  await requireRole("ADMIN");

  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search) params.append("search", search);
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const query = params.toString() ? `?${params.toString()}` : "";

  return apiRequest<AdminUser[]>(`/admin/users${query}`, {
    method: "GET",
  });
}

export const getUserById = async (userId: string): Promise<ApiResponse<AdminUser>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminUser>(`/admin/users/${userId}`, {
    method: "GET",
  });
};

export const updateUser = async (
  userId: string,
  data: Partial<AdminUser>
): Promise<ApiResponse<AdminUser>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminUser>(
    `/admin/users/${userId}`,
    { method: "PATCH", body: JSON.stringify(data) }
  );
};

export const deleteUser = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/users/${userId}`, {
    method: "DELETE",
  });
};

export const changeUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED"
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ============ TUTOR MANAGEMENT (CRUD) ============

export async function getAdminTutors(
  page = 1,
  limit = 10,
  search = "",
  status?: "PENDING" | "APPROVED" | "REJECTED"
): Promise<ApiResponse<{ data: AdminTutor[]; total: number }>> {
  await requireRole("ADMIN");
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/admin/tutors${query}`, {
    method: "GET",
  });
}

export const getTutorById = async (tutorId: string): Promise<ApiResponse<AdminTutor>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminTutor>(`/admin/tutors/${tutorId}`, {
    method: "GET",
  });
};

export const approveTutor = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/tutors/${userId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
};

export const rejectTutor = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/tutors/${userId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
};

export const updateTutor = async (
  tutorId: string,
  data: Partial<AdminTutor>
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/tutors/${tutorId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// ============ PAYMENT MANAGEMENT (CRUD) ============

export const getAdminPayments = async (
  page = 1,
  limit = 10,
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<{ data: AdminPayment[]; total: number }>> => {
  await requireRole("ADMIN");
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  const result = await apiRequest<AdminPayment[] | { data: AdminPayment[]; total: number }>(
    `/admin/payments${query}`,
    { method: "GET" }
  );

  if (!result.success || !result.data) {
    return {
      success: false,
      message: result.message || "Failed to fetch payments",
    };
  }

  if (Array.isArray(result.data)) {
    return {
      success: true,
      data: {
        data: result.data,
        total: result.data.length,
      },
    };
  }

  return {
    success: true,
    data: {
      data: result.data.data || [],
      total: result.data.total || result.data.data?.length || 0,
    },
  };
};

export const getPaymentById = async (paymentId: string): Promise<ApiResponse<AdminPayment>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminPayment>(`/admin/payments/${paymentId}`, {
    method: "GET",
  });
};

export const refundPayment = async (paymentId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/payments/${paymentId}/refund`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "PAID" | "REFUNDED" | "PENDING"
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/payments/${paymentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

// ============ BOOKING MANAGEMENT (CRUD) ============

export async function getAdminBookings(
  page = 1,
  limit = 10,
  status?: string,
  tutorId?: string,
  studentId?: string
): Promise<ApiResponse<{ data: AdminBooking[]; total: number }>> {
  await requireRole("ADMIN");
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (status) params.append("status", status);
  if (tutorId) params.append("tutorId", tutorId);
  if (studentId) params.append("studentId", studentId);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/admin/bookings${query}`, {
    method: "GET",
  });
}

export const getBookingById = async (bookingId: string): Promise<ApiResponse<AdminBooking>> => {
  await requireRole("ADMIN");
  return apiRequest<AdminBooking>(`/admin/bookings/${bookingId}`, {
    method: "GET",
  });
};

export const updateBooking = async (
  bookingId: string,
  data: Partial<AdminBooking>
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const cancelBooking = async (bookingId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/bookings/${bookingId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
};

export const deleteBooking = async (bookingId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/bookings/${bookingId}`, {
    method: "DELETE",
  });
};

// ============ LOGS & ACTIVITY ============

export const getAdminLogs = async (
  page = 1,
  limit = 20,
  userId?: string,
  action?: string
): Promise<ApiResponse<AdminLogsResponse>> => {
  await requireRole("ADMIN");
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (userId) params.append("userId", userId);
  if (action) params.append("action", action);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<AdminLogsResponse>(`/admin/logs${query}`, {
    method: "GET",
  });
};

export const getActivityLog = async (
  page = 1,
  limit = 20
): Promise<ApiResponse<{ data: unknown[]; total: number }>> => {
  await requireRole("ADMIN");
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/admin/activity${query}`, {
    method: "GET",
  });
};

// ============ BULK OPERATIONS ============

export const bulkBlockUsers = async (userIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/users/bulk/block`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
};

export const bulkUnblockUsers = async (userIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/users/bulk/unblock`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
};

export const bulkApproveTutors = async (tutorIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/tutors/bulk/approve`, {
    method: "POST",
    body: JSON.stringify({ tutorIds }),
  });
};

export const bulkRejectTutors = async (tutorIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/tutors/bulk/reject`, {
    method: "POST",
    body: JSON.stringify({ tutorIds }),
  });
};

// ============ SUBJECT MANAGEMENT ============

export const createSubject = async (data: { name: string; description?: string }): Promise<ApiResponse<Subject>> => {
  await requireRole("ADMIN");
  return apiRequest<Subject>(`/subjects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getSubjects = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<ApiResponse<{ data: Subject[]; total: number }>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/subject${query}`, {
    method: "GET",
  });
};

// ============ LANGUAGE MANAGEMENT ============

export const createLanguage = async (data: { name: string; code: string }): Promise<ApiResponse<Language>> => {
  return apiRequest<Language>(`/languages`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getLanguages = async (
  page = 1,
  limit = 10,
  search = "",
): Promise<ApiResponse<{ data: Language[]; total: number }>> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("limit", String(limit));
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/language${query}`, {
    method: "GET",
  });
};

export const updateLanguage = async (
  languageId: string,
  data: Partial<Language>
): Promise<ApiResponse<Language>> => {
  await requireRole("ADMIN");
  return apiRequest<Language>(`/languages/${languageId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteLanguage = async (languageId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiRequest(`/admin/languages/${languageId}`, {
    method: "DELETE",
  });
};