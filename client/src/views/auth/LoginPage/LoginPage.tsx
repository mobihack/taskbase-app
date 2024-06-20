import { Button } from "@/components";
import { CONFIG } from "@/config";
import { FormField } from "@/containers";
import clsx from "clsx";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";

export const LoginPage = (): JSX.Element => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center h-96">
      <div
        className={clsx(
          "max-w-sm w-full",
          "border border-gray",
          "rounded-lg p-4"
        )}
      >
        <h1 className="text-center text-xl text-gray-800 font-medium mb-2">
          Login to {"TaskBase™"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <FormField
              {...register("email")}
              label="Email Address"
              placeholder="john@example.com"
              className="mb-2"
            />
            <FormField
              {...register("password")}
              type="password"
              label="Password"
              placeholder="•••••••••••••••••"
            />

            <Button width="full" className="mt-6">
              Login
            </Button>
          </div>
        </form>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        New to {"TaskBase™"}?{" "}
        <Link className="text-brand-main underline" href="/auth/signup">
          Create an Account
        </Link>
      </p>
    </div>
  );
};
