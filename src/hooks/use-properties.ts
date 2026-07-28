"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertiesApi, PropertyFilters, PropertyFormValues } from "@/lib/api/properties";

export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertiesApi.list(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id,
  });
}

export function useMyProperties() {
  return useQuery({ queryKey: ["my-properties"], queryFn: propertiesApi.mine });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropertyFormValues) => propertiesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-properties"] }),
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PropertyFormValues> & { status?: string }) =>
      propertiesApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertiesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-properties"] }),
  });
}
