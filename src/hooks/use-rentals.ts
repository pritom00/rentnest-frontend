"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rentalsApi, CreateRentalPayload } from "@/lib/api/rentals";
import { RentalRequest, RentalStatus } from "@/lib/api/types";

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

/**
 * Approve/reject a request with an optimistic update: the table row
 * flips to the new status instantly, before the server has even
 * responded. If the request fails, the previous table state is
 * restored and an error toast (handled by the caller) explains why.
 */
export function useUpdateRentalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Extract<RentalStatus, "APPROVED" | "REJECTED"> }) =>
      rentalsApi.updateStatus(id, status),

    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["landlord-rentals"] });
      const previous = qc.getQueryData<RentalRequest[]>(["landlord-rentals"]);

      qc.setQueryData<RentalRequest[]>(["landlord-rentals"], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status } : r))
      );

      return { previous };
    },

    onError: (_err, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(["landlord-rentals"], context.previous);
      }
    },

    onSettled: () => {
      // Reconcile with the server's actual state once the request
      // finishes, whether it succeeded or was rolled back.
      qc.invalidateQueries({ queryKey: ["landlord-rentals"] });
      qc.invalidateQueries({ queryKey: ["my-properties"] });
    },
  });
}

export function useCompleteRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rentalsApi.complete(id),

    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ["landlord-rentals"] });
      const previous = qc.getQueryData<RentalRequest[]>(["landlord-rentals"]);

      qc.setQueryData<RentalRequest[]>(["landlord-rentals"], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status: "COMPLETED" } : r))
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(["landlord-rentals"], context.previous);
      }
    },

    onSettled: () => qc.invalidateQueries({ queryKey: ["landlord-rentals"] }),
  });
}
