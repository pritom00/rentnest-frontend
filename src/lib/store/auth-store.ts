"use client";

import { create } from "zustand";
import Cookies from "js-cookie";
import { User } from "@/lib/api/types";
import { TOKEN_COOKIE, ROLE_COOKIE } from "@/lib/api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  hydrate: () => void;
}

// Cookies (not just localStorage) are required here because our route
// protection runs in Next.js Middleware, which executes on the edge and
// has no access to localStorage — only to request cookies.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setSession: (user, token) => {
    Cookies.set(TOKEN_COOKIE, token, { expires: 7, sameSite: "lax" });
    Cookies.set(ROLE_COOKIE, user.role, { expires: 7, sameSite: "lax" });
    localStorage.setItem("rentnest_user", JSON.stringify(user));
    set({ user, token });
  },

  clearSession: () => {
    Cookies.remove(TOKEN_COOKIE);
    Cookies.remove(ROLE_COOKIE);
    localStorage.removeItem("rentnest_user");
    set({ user: null, token: null });
  },

  hydrate: () => {
    const token = Cookies.get(TOKEN_COOKIE) ?? null;
    const rawUser = typeof window !== "undefined" ? localStorage.getItem("rentnest_user") : null;
    const user = rawUser ? (JSON.parse(rawUser) as User) : null;
    set({ token, user, hydrated: true });
  },
}));
