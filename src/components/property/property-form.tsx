"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { propertySchema, PropertyFormValues } from "@/lib/validations/property";
import { Property } from "@/lib/api/types";

export function PropertyForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  defaultValues?: Partial<Property>;
  onSubmit: (values: PropertyFormValues & { amenities: string[] }) => void;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      price: defaultValues?.price ? Number(defaultValues.price) : undefined,
      bedrooms: defaultValues?.bedrooms ?? 0,
      bathrooms: defaultValues?.bathrooms ?? 0,
      areaSqft: defaultValues?.areaSqft ?? undefined,
      categoryId: defaultValues?.categoryId ?? "",
      amenitiesText: defaultValues?.amenities?.join(", ") ?? "",
    },
  });

  const submit = (values: PropertyFormValues) => {
    const amenities = (values.amenitiesText || "")
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    onSubmit({ ...values, amenities });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <div>
        <Label htmlFor="title" required>Title</Label>
        <Input id="title" placeholder="Cozy studio in Gulshan" error={errors.title?.message} {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>

      <div>
        <Label htmlFor="description" required>Description</Label>
        <Textarea id="description" placeholder="Describe the property…" error={errors.description?.message} {...register("description")} />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="address" required>Address</Label>
          <Input id="address" placeholder="Road 11, Gulshan-1" error={errors.address?.message} {...register("address")} />
          <FieldError message={errors.address?.message} />
        </div>
        <div>
          <Label htmlFor="city" required>City</Label>
          <Input id="city" placeholder="Dhaka" error={errors.city?.message} {...register("city")} />
          <FieldError message={errors.city?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId" required>Category</Label>
        <Select id="categoryId" error={errors.categoryId?.message} {...register("categoryId")}>
          <option value="">Choose a category</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <FieldError message={errors.categoryId?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="price" required>Rent / month</Label>
          <Input id="price" type="number" error={errors.price?.message} {...register("price")} />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" error={errors.bedrooms?.message} {...register("bedrooms")} />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" error={errors.bathrooms?.message} {...register("bathrooms")} />
        </div>
        <div>
          <Label htmlFor="areaSqft">Area (sqft)</Label>
          <Input id="areaSqft" type="number" error={errors.areaSqft?.message} {...register("areaSqft")} />
        </div>
      </div>

      <div>
        <Label htmlFor="amenitiesText">Amenities (comma-separated)</Label>
        <Input id="amenitiesText" placeholder="WiFi, Parking, Elevator" {...register("amenitiesText")} />
      </div>

      <Button type="submit" variant="primary" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
