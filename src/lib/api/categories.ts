import { apiRequest } from "./client";
import { Category } from "./types";

export const categoriesApi = {
  list: () => apiRequest<Category[]>("/categories", { auth: false }),
};
