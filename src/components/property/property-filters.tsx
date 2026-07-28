"use client";

import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/use-categories";
import { Input, Select, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyFilters } from "@/lib/api/properties";

export function PropertyFiltersPanel({
  value,
  onChange,
}: {
  value: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
}) {
  const { data: categories } = useCategories();
  const [local, setLocal] = useState<PropertyFilters>(value);

  useEffect(() => setLocal(value), [value]);

  const apply = () => onChange({ ...local, page: 1 });
  const reset = () => {
    const cleared = { page: 1, limit: value.limit };
    setLocal(cleared);
    onChange(cleared);
  };

  return (
    <aside className="border border-line p-5">
      <p className="plaque mb-5">Filter · Listings</p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. Dhaka"
            value={local.city ?? ""}
            onChange={(e) => setLocal((f) => ({ ...f, city: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={local.categoryId ?? ""}
            onChange={(e) => setLocal((f) => ({ ...f, categoryId: e.target.value || undefined }))}
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minPrice">Min price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={local.minPrice ?? ""}
              onChange={(e) =>
                setLocal((f) => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined }))
              }
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="Any"
              value={local.maxPrice ?? ""}
              onChange={(e) =>
                setLocal((f) => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bedrooms">Min bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="Any"
            value={local.bedrooms ?? ""}
            onChange={(e) =>
              setLocal((f) => ({ ...f, bedrooms: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={apply}>
            Apply
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </aside>
  );
}
