import { toast } from "sonner";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ApiError } from "@/lib/api/client";

/**
 * Central error handler for mutations. Shows a toast with the backend's
 * message, and — if the error came with Zod field-level details and a
 * form's setError is provided — also wires those into inline field
 * errors so validation feedback matches what the server enforced.
 */
export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
) {
  if (error instanceof ApiError) {
    toast.error(error.message, {
      description: error.status >= 500 ? "Please try again in a moment." : undefined,
    });

    if (setError) {
      const fields = error.fieldErrors();
      Object.entries(fields).forEach(([key, message]) => {
        setError(key as Path<T>, { type: "server", message });
      });
    }
    return;
  }

  toast.error("Something went wrong. Please check your connection and try again.");
}
