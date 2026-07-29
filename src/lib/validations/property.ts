import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(10, "Description must be at least 10 characters").max(3000),
  address: z.string().min(3, "Address is required").max(255),
  city: z.string().min(2, "City is required").max(100),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0).default(0),
  bathrooms: z.coerce.number().int().min(0).default(0),
  areaSqft: z.coerce.number().int().positive().optional().or(z.literal(undefined)),
  categoryId: z.string().min(1, "Choose a category"),
  amenitiesText: z.string().optional(),
  imagesText: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const urls = val.split("\n").map((u) => u.trim()).filter(Boolean);
        return urls.every((u) => {
          try {
            new URL(u);
            return true;
          } catch {
            return false;
          }
        });
      },
      { message: "Each line must be a valid image URL (starting with http:// or https://)" }
    ),
});
export type PropertyFormValues = z.infer<typeof propertySchema>;
