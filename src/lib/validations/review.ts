import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  comment: z.string().max(1000).optional().or(z.literal("")),
});
export type ReviewFormValues = z.infer<typeof reviewSchema>;
