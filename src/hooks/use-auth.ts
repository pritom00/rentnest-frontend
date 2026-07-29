"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi, RegisterPayload, LoginPayload } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => setSession(data.user, data.token),
  });
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => setSession(data.user, data.token),
  });
}

/**
 * Re-validates the current session against GET /api/auth/me on load.
 * This both keeps the cached profile fresh and catches a token that's
 * expired or belongs to a now-banned user, clearing the local session
 * immediately instead of waiting for some other request to fail.
 */
export function useValidateSession() {
  const { token, hydrated } = useAuthStore();
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    enabled: hydrated && !!token,
    retry: false,
    staleTime: 60_000,
  });
}
