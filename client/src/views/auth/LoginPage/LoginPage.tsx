import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components";
import { FormField } from "@/containers";
import { useAuth } from "@/context/useAuth";

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof userLoginSchema>;

export const LoginPage = (): JSX.Element => {
  const router = useRouter();
  const auth = useAuth();
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userLoginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setIsLoading(true);
    toast.promise(auth.logIn(data.email, data.password), {
      loading: "Signing In",
      success: () => {
        router.push("/dashboard/main");
        setIsLoading(false);
        return "Signed in successfully";
      },
      error: (err) => {
        setIsLoading(false);
        return err?.response?.data?.message || "Error during sign-in";
      },
    });
  };

  if (auth.currentUser) {
    router.push("/dashboard/main");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center h-96">
      <div
        className={clsx(
          "bg-white max-w-sm w-full",
          "border border-gray",
          "rounded-lg p-4"
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/taskbase-logo.png" className="w-1/2 mx-auto my-4" alt="" />
        <h1 className="text-center font-medium text-gray-500 mb-4">
          Login to continue to your tasks
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

            <Button width="full" className="mt-6" disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        New to {"TaskBase"}?{" "}
        <Link className="text-brand-main underline" href="/auth/signup">
          Create an Account
        </Link>
      </p>
    </div>
  );
};
