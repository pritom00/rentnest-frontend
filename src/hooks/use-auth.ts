"use client";

import { useMutation } from "@tanstack/react-query";
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
