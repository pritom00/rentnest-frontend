"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/handle-error";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

const roleOptions: { value: "TENANT" | "LANDLORD"; title: string; description: string }[] = [
  { value: "TENANT", title: "Tenant", description: "I'm looking for a place to rent" },
  { value: "LANDLORD", title: "Landlord", description: "I want to list my property" },
];

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD">("TENANT");

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TENANT" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(
      { ...values, phone: values.phone || undefined },
      {
        onSuccess: (data) => {
          toast.success(`Welcome to RentNest, ${data.user.name.split(" ")[0]}`);
          router.push(data.user.role === "LANDLORD" ? "/dashboard/landlord" : "/dashboard/tenant");
        },
        onError: (err) => handleApiError(err, setError),
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <p className="plaque mb-2">Registry · New Account</p>
        <h1 className="mb-8 font-display text-3xl italic text-ink-900">Create your account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label required>I am a…</Label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    setSelectedRole(opt.value);
                    setValue("role", opt.value);
                  }}
                  className={cn(
                    "border p-3 text-left transition-colors",
                    selectedRole === opt.value ? "border-ink-900 bg-ink-900 text-paper-50" : "border-line text-ink-700 hover:border-ink-500"
                  )}
                >
                  <p className="text-[13px] font-medium">{opt.title}</p>
                  <p className={cn("text-[11px]", selectedRole === opt.value ? "text-paper-100" : "text-ink-500")}>
                    {opt.description}
                  </p>
                </button>
              ))}
            </div>
            <FieldError message={errors.role?.message} />
          </div>

          <div>
            <Label htmlFor="name" required>Full name</Label>
            <Input id="name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="email" required>Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" placeholder="+8801700000000" error={errors.phone?.message} {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>

          <div>
            <Label htmlFor="password" required>Password</Label>
            <Input id="password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register("password")} />
            <FieldError message={errors.password?.message} />
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={registerMutation.isPending}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-ink-900 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
