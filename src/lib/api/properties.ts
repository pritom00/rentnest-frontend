import { apiRequest, apiRequestWithMeta } from "./client";
import { Pagination, Property } from "./types";

export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface PropertyFormValues {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  amenities: string[];
  images: string[];
  categoryId: string;
}

function toQuery(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const propertiesApi = {
  list: (filters: PropertyFilters = {}) =>
    apiRequestWithMeta<Property[]>(`/properties${toQuery(filters)}`, { auth: false }),

  getById: (id: string) => apiRequest<Property>(`/properties/${id}`, { auth: false }),

  // Landlord-only
  mine: () => apiRequest<Property[]>("/landlord/properties/mine"),

  create: (payload: PropertyFormValues) =>
    apiRequest<Property>("/landlord/properties", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<PropertyFormValues> & { status?: string }) =>
    apiRequest<Property>(`/landlord/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    apiRequest<null>(`/landlord/properties/${id}`, { method: "DELETE" }),
};

export type { Pagination };
