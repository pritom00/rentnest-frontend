"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, CreateReviewPayload } from "@/lib/api/reviews";

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewsApi.create(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["property", variables.propertyId] });
    },
  });
}
