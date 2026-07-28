"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { UserStatus } from "@/lib/api/types";

export function useAdminUsers(page = 1, limit = 20) {
  return useQuery({ queryKey: ["admin-users", page], queryFn: () => adminApi.listUsers(page, limit) });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) => adminApi.updateUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useAdminProperties(page = 1, limit = 20) {
  return useQuery({ queryKey: ["admin-properties", page], queryFn: () => adminApi.listProperties(page, limit) });
}

export function useAdminRentals(page = 1, limit = 20) {
  return useQuery({ queryKey: ["admin-rentals", page], queryFn: () => adminApi.listRentals(page, limit) });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
