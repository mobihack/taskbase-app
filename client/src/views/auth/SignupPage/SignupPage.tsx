import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { postSignUpAPI } from "@/api/auth/postSignUpAPI";
import { Button } from "@/components";
import { FormField } from "@/containers";
import { useAuth } from "@/context/useAuth";
const userSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    password_confirm: z.string().min(8),
  })
  .superRefine(({ password_confirm, password }, ctx) => {
    if (password_confirm !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords did not match",
        path: ["password_confirm"],
      });
    }
  });
type FormValues = z.infer<typeof userSchema>;

export const SignupPage = (): JSX.Element => {
  const auth = useAuth();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
    },
    resolver: zodResolver(userSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    toast.promise(auth.signUp(data.email, data.password), {
      loading: "Signing Up",
      success: () => {
        router.push("/dashboard/main");
        setIsLoading(false);
        return "Signed up successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during sign-up";
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center h-96">
      <div
        className={clsx(
          "max-w-sm w-full",
          "border border-gray",
          "rounded-lg p-4"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/taskbase-logo.png" className="w-1/2 mx-auto my-4" alt="" />
        <h1 className="text-center font-medium text-gray-500 mb-4">
          Create an account to continue
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mt-4">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  label="Email Address"
                  placeholder="john@example.com"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter your email address"
                  }
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  type="password"
                  label="Password"
                  placeholder="•••••••••••••••••"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Enter your personal password"
                  }
                  disabled={isLoading}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field, fieldState }) => (
                <FormField
                  {...field}
                  type="password"
                  label="Confirm Password"
                  placeholder="•••••••••••••••••"
                  error={Boolean(fieldState.error)}
                  helperText={
                    (fieldState.error && fieldState.error?.message) ||
                    "Confirm your personal password"
                  }
                  disabled={isLoading}
                />
              )}
            />

            <Button width="full" className="mt-6" disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Already got a {"TaskBase"} account?{" "}
        <Link className="text-brand-main underline" href="/auth/login">
          Login
        </Link>
      </p>
    </div>
  );
};
