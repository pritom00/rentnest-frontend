import { apiRequest } from "./client";
import { RentalRequest, RentalStatus } from "./types";

export interface CreateRentalPayload {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export const rentalsApi = {
  create: (payload: CreateRentalPayload) =>
    apiRequest<RentalRequest>("/rentals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  mine: () => apiRequest<RentalRequest[]>("/rentals"),

  getById: (id: string) => apiRequest<RentalRequest>(`/rentals/${id}`),

  // Landlord-only
  forMyProperties: () => apiRequest<RentalRequest[]>("/landlord/requests"),

  updateStatus: (id: string, status: Extract<RentalStatus, "APPROVED" | "REJECTED">) =>
    apiRequest<RentalRequest>(`/landlord/requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  complete: (id: string) =>
    apiRequest<RentalRequest>(`/landlord/requests/${id}/complete`, {
      method: "PATCH",
    }),
};
