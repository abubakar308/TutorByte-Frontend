"use server";

import { apiGet, apiPost } from "../api/base";
import { ApiResponse } from "../api/types";

export interface Payment {
  id: string;
  studentName: string;
  tutorName: string;
  amount: number;
  status: "PAID" | "REFUNDED" | "PENDING";
  gateway: string;
  createdAt: string;
}

export interface PaginatedPayments {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
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

export const getPayments = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<ApiResponse<PaginatedPayments>> => {
  const query = createQuery({ page, limit, status });
  return apiGet<PaginatedPayments>(`/payments${query}`);
};

export const refundPayment = async (paymentId: string): Promise<ApiResponse> => {
  return apiPost(`/payments/${paymentId}/refund`, {});
};
