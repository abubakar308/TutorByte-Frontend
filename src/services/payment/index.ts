"use server";

import {  apiPost, apiPatch } from "../api/base";

// Stripe পেমেন্ট শুরু করার জন্য
export const initiateStripePayment = async (bookingId: string) => {
  return apiPost<any>("/payments/initiate", { bookingId });
};

// ম্যানুয়াল (bKash/Nagad) TxID সাবমিট করার জন্য
export const submitManualPayment = async (data: {
  bookingId: string;
  transactionId: string;
  paymentMethod: string;
}) => {
  return apiPost<any>("/payments/submit-manual", data);
};

export const approvePayment = async (bookingId: string) => {
  return apiPatch<any>(`/payments/approve/${bookingId}`, {});
};