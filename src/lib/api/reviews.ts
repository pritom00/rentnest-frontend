import { apiRequest } from "./client";
import { Review } from "./types";

export interface CreateReviewPayload {
  propertyId: string;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  create: (payload: CreateReviewPayload) =>
    apiRequest<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
