"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "./form-components/form-input";
import { AdminLoginInput, adminLoginSchema } from "@/validationSchema/loginSchema";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/admin/useLogin";

export default function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useLogin();


  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
function getErrorMessage(error: AxiosError): string {
  console.log(error.response)
  return (error.response?.data as { message?: string })?.message || error.message;
}

 function onSubmit(values: AdminLoginInput) {
  mutate(values, {
    onSuccess: (message:string) => {
      toast.success(message || "Successfully logged in");
      router.push("/dashboard");
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

  if (isPending) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Show API error message if exists */}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              {getErrorMessage(error)}
            </p>
          )}

          <FormInput
            control={form.control}
            label="Email"
            name="email"
            placeHolder="Enter your Username"
            type="text"
          />

          <FormInput
            control={form.control}
            label="Password"
            name="password"
            placeHolder="Enter your Password"
            type="password"
          />

          <Button
            type="submit"
            className="w-full h-11 text-base text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
}
