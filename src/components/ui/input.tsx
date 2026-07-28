import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full border bg-paper-50 px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-300",
          "focus:outline-none focus:ring-1 focus:ring-ink-900",
          error ? "border-stamp" : "border-line",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full border bg-paper-50 px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-300",
        "focus:outline-none focus:ring-1 focus:ring-ink-900 min-h-[100px] resize-y",
        error ? "border-stamp" : "border-line",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className, error, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full border bg-paper-50 px-3.5 py-2.5 text-[14px] text-ink-900",
        "focus:outline-none focus:ring-1 focus:ring-ink-900",
        error ? "border-stamp" : "border-line",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[12px] text-stamp">{message}</p>;
}

export function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[12px] font-medium uppercase tracking-widest2 text-ink-500">
      {children}
      {required && <span className="text-stamp"> *</span>}
    </label>
  );
}
