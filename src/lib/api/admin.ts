import { apiRequest, apiRequestWithMeta } from "./client";
import { User, Property, RentalRequest, Category, UserStatus } from "./types";

export const adminApi = {
  listUsers: (page = 1, limit = 20) =>
    apiRequestWithMeta<User[]>(`/admin/users?page=${page}&limit=${limit}`),

  updateUserStatus: (id: string, status: UserStatus) =>
    apiRequest<User>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  listProperties: (page = 1, limit = 20) =>
    apiRequestWithMeta<Property[]>(`/admin/properties?page=${page}&limit=${limit}`),

  listRentals: (page = 1, limit = 20) =>
    apiRequestWithMeta<RentalRequest[]>(`/admin/rentals?page=${page}&limit=${limit}`),

  createCategory: (payload: { name: string; description?: string }) =>
    apiRequest<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCategory: (id: string, payload: { name?: string; description?: string }) =>
    apiRequest<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteCategory: (id: string) =>
    apiRequest<null>(`/admin/categories/${id}`, { method: "DELETE" }),
};
