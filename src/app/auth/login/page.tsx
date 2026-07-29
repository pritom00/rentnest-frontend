"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { handleApiError } from "@/lib/handle-error";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";

const dashboardPath: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && user) {
      router.replace(dashboardPath[user.role] || "/");
    }
  }, [hydrated, user, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        toast.success(`Welcome back, ${data.user.name.split(" ")[0]}`);
        const next = searchParams.get("next");
        router.push(next || dashboardPath[data.user.role] || "/");
      },
      onError: (err) => handleApiError(err, setError),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password" required>Password</Label>
        <Input id="password" type="password" placeholder="Your password" error={errors.password?.message} {...register("password")} />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" variant="primary" className="w-full" loading={loginMutation.isPending}>
        Sign in
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-16 sm:px-8">
        <p className="plaque mb-2">Registry · Sign In</p>
        <h1 className="mb-8 font-display text-3xl italic text-ink-900">Welcome back</h1>

        <Suspense fallback={<p className="text-[13px] text-ink-500">Loading…</p>}>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-[13px] text-ink-500">
          New to RentNest?{" "}
          <Link href="/auth/register" className="text-ink-900 underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
