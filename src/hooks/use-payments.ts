"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentsApi } from "@/lib/api/payments";

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: (rentalRequestId: string) => paymentsApi.create(rentalRequestId),
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (sessionId: string) => paymentsApi.confirm(sessionId),
  });
}

export function useMyPayments() {
  return useQuery({ queryKey: ["my-payments"], queryFn: paymentsApi.mine });
}

export function usePayment(id: string) {
  return useQuery({ queryKey: ["payment", id], queryFn: () => paymentsApi.getById(id), enabled: !!id });
}
