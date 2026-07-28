import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans text-[13px] font-medium tracking-wide uppercase transition-colors disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-ink-900 text-paper-50 hover:bg-ink-700 px-5 py-3",
        outline: "border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-paper-50 px-5 py-3",
        ghost: "text-ink-900 hover:bg-paper-100 px-4 py-2.5",
        stamp: "bg-stamp text-paper-50 hover:opacity-90 px-5 py-3",
        link: "text-ink-900 underline underline-offset-4 decoration-line hover:decoration-ink-900 p-0 normal-case tracking-normal",
      },
      size: {
        default: "",
        sm: "px-3.5 py-2 text-[12px]",
        lg: "px-7 py-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
