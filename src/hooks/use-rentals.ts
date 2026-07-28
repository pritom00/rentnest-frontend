"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rentalsApi, CreateRentalPayload } from "@/lib/api/rentals";
import { RentalStatus } from "@/lib/api/types";

export function useMyRentals() {
  return useQuery({ queryKey: ["my-rentals"], queryFn: rentalsApi.mine });
}

export function useRental(id: string) {
  return useQuery({ queryKey: ["rental", id], queryFn: () => rentalsApi.getById(id), enabled: !!id });
}

export function useLandlordRentals() {
  return useQuery({ queryKey: ["landlord-rentals"], queryFn: rentalsApi.forMyProperties });
}

export function useCreateRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalPayload) => rentalsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-rentals"] }),
  });
}

export function useUpdateRentalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Extract<RentalStatus, "APPROVED" | "REJECTED"> }) =>
      rentalsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-rentals"] });
      qc.invalidateQueries({ queryKey: ["my-properties"] });
    },
  });
}

export function useCompleteRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rentalsApi.complete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["landlord-rentals"] }),
  });
}
