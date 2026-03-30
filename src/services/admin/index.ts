"use server";

import { apiGet, apiPost, apiRequest, apiPatch, apiDelete } from "../api/base";
import { ApiResponse } from "../api/types";
import { requireRole } from "../auth";

function createQuery(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

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
  total: number;
  page: number;
  limit: number;
}

// ============ DASHBOARD & STATS ============

export const getAdminDashboardStats = async (): Promise<ApiResponse<AdminDashboardStats>> => {
  await requireRole("ADMIN");
  return apiGet<AdminDashboardStats>("/admin/dashboard-stats");
};

// ============ USER MANAGEMENT (CRUD) ============

export async function getAdminUsers(
  page = 1,
  limit = 10,
  search = "",
  role?: string,
  status?: string
): Promise<ApiResponse<AdminUsersResponse>> {
  await requireRole("ADMIN");
  const query = createQuery({ page, limit, search, role, status });
  return apiRequest<AdminUsersResponse>(`/admin/users${query}`, {
    method: "GET",
  });
}

export const getUserById = async (userId: string): Promise<ApiResponse<AdminUser>> => {
  await requireRole("ADMIN");
  return apiGet<AdminUser>(`/admin/users/${userId}`);
};

export const updateUser = async (
  userId: string,
  data: Partial<AdminUser>
): Promise<ApiResponse<AdminUser>> => {
  await requireRole("ADMIN");
  return apiPatch<AdminUser>(
    `/admin/users/${userId}`,
    data
  );
};

export const deleteUser = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiDelete(`/admin/users/${userId}`);
};

export const blockUser = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/users/${userId}/block`, {});
};

export const unblockUser = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/users/${userId}/unblock`, {});
};

export const changeUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED"
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPatch(`/admin/users/${userId}/status`, { status });
};

// ============ TUTOR MANAGEMENT (CRUD) ============

export async function getAdminTutors(
  page = 1,
  limit = 10,
  search = "",
  status?: "PENDING" | "APPROVED" | "REJECTED"
): Promise<ApiResponse<{ data: AdminTutor[]; total: number }>> {
  await requireRole("ADMIN");
  const query = createQuery({ page, limit, search, status });
  return apiRequest(`/admin/tutors${query}`, {
    method: "GET",
  });
}

export const getTutorById = async (tutorId: string): Promise<ApiResponse<AdminTutor>> => {
  await requireRole("ADMIN");
  return apiGet<AdminTutor>(`/admin/tutors/${tutorId}`);
};

export const approveTutor = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/tutors/${userId}/approve`, {});
};

export const rejectTutor = async (userId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/tutors/${userId}/reject`, {});
};

export const updateTutorStatus = async (
  tutorId: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPatch(`/admin/tutors/${tutorId}/status`, { status });
};

export const updateTutor = async (
  tutorId: string,
  data: Partial<AdminTutor>
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPatch(`/admin/tutors/${tutorId}`, data);
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
  const query = createQuery({ page, limit, status, startDate, endDate });
  const result = await apiGet<AdminPayment[] | { data: AdminPayment[]; total: number }>(
    `/admin/payments${query}`
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
  return apiGet<AdminPayment>(`/admin/payments/${paymentId}`);
};

export const refundPayment = async (paymentId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/payments/${paymentId}/refund`, { reason });
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: "PAID" | "REFUNDED" | "PENDING"
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPatch(`/admin/payments/${paymentId}/status`, { status });
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
  const query = createQuery({ page, limit, status, tutorId, studentId });
  return apiRequest(`/admin/bookings${query}`, {
    method: "GET",
  });
}

export const getBookingById = async (bookingId: string): Promise<ApiResponse<AdminBooking>> => {
  await requireRole("ADMIN");
  return apiGet<AdminBooking>(`/admin/bookings/${bookingId}`);
};

export const updateBooking = async (
  bookingId: string,
  data: Partial<AdminBooking>
): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPatch(`/admin/bookings/${bookingId}`, data);
};

export const cancelBooking = async (bookingId: string, reason?: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/bookings/${bookingId}/cancel`, { reason });
};

export const deleteBooking = async (bookingId: string): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiDelete(`/admin/bookings/${bookingId}`);
};

// ============ LOGS & ACTIVITY ============

export const getAdminLogs = async (
  page = 1,
  limit = 20,
  userId?: string,
  action?: string
): Promise<ApiResponse<AdminLogsResponse>> => {
  await requireRole("ADMIN");
  const query = createQuery({ page, limit, userId, action });
  return apiGet<AdminLogsResponse>(`/admin/logs${query}`);
};

export const getActivityLog = async (
  page = 1,
  limit = 20
): Promise<ApiResponse<{ data: unknown[]; total: number }>> => {
  await requireRole("ADMIN");
  const query = createQuery({ page, limit });
  return apiGet(`/admin/activity${query}`);
};

// ============ BULK OPERATIONS ============

export const bulkBlockUsers = async (userIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/users/bulk/block`, { userIds });
};

export const bulkUnblockUsers = async (userIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/users/bulk/unblock`, { userIds });
};

export const bulkApproveTutors = async (tutorIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/tutors/bulk/approve`, { tutorIds });
};

export const bulkRejectTutors = async (tutorIds: string[]): Promise<ApiResponse> => {
  await requireRole("ADMIN");
  return apiPost(`/admin/tutors/bulk/reject`, { tutorIds });
};