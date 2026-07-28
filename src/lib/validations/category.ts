import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(300).optional().or(z.literal("")),
});
export type CategoryFormValues = z.infer<typeof categorySchema>;
