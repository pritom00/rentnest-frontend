import { z } from "zod";

export const rentalRequestSchema = z.object({
  moveInDate: z.string().min(1, "Choose a move-in date"),
  message: z.string().max(1000).optional().or(z.literal("")),
});
export type RentalRequestFormValues = z.infer<typeof rentalRequestSchema>;
