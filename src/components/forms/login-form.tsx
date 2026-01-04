"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/hooks/use-auth";
import { type LoginInput, loginSchema } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils/cn";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit((data) => login.mutate(data))}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <span className="text-red-500 font-bold">
                    {form.formState.errors.username.message}
                  </span>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <span className="text-red-500 font-bold">
                    {form.formState.errors.password.message}
                  </span>
                )}
              </Field>
              <Field>
                <Button
                  variant={"outline"}
                  type="submit"
                  disabled={login.isPending}
                >
                  {login.isPending ? "Logging in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
