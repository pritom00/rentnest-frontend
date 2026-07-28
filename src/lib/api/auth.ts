import { apiRequest } from "./client";
import { AuthResponse, User, Role } from "./types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  me: () => apiRequest<User>("/auth/me"),
};
