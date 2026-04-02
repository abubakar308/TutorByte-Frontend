
"use server";

import { apiRequest } from "../api/base";
import { ApiResponse } from "../api/types";
import { requireRole } from "@/services/auth";

export interface AdminBooking {
  id: string;
  studentName: string;
  tutorName: string;
  subject: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  amount: number;
  date: string;
}

export interface PaginatedBookings {
  data: AdminBooking[];
  total: number;
  page: number;
  limit: number;
}

export interface ICreateBookingPayload {
  tutorId: string;
  subjectId: string;
  bookingDate: string; // ISO string format
  startTime: string;   // HH:mm format
  endTime: string;     // HH:mm format
}


export const createBooking = async (data: Partial<ICreateBookingPayload>): Promise<ApiResponse<ICreateBookingPayload>> => {
  await requireRole("STUDENT");
  return apiRequest<ICreateBookingPayload>("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


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

export const getAdminBookings = async (
  page = 1,
  limit = 10,
  status = ""
): Promise<ApiResponse<PaginatedBookings>> => {
  const query = createQuery({ page, limit, status });

  return apiRequest<PaginatedBookings>(`/admin/bookings${query}`, {
    method: "GET",
  });
};