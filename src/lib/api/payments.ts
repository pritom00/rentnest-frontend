import { apiRequest } from "./client";
import { Payment } from "./types";

export interface CreatePaymentSessionResult {
  payment: Payment;
  checkoutUrl: string;
  sessionId: string;
}

export const paymentsApi = {
  create: (rentalRequestId: string) =>
    apiRequest<CreatePaymentSessionResult>("/payments/create", {
      method: "POST",
      body: JSON.stringify({ rentalRequestId }),
    }),

  confirm: (sessionId: string) =>
    apiRequest<Payment>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),

  mine: () => apiRequest<Payment[]>("/payments"),

  getById: (id: string) => apiRequest<Payment>(`/payments/${id}`),
};
