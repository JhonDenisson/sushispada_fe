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
import { useRegister } from "@/lib/hooks/use-auth";
import { type RegisterInput, registerSchema } from "@/lib/schemas/auth";

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const register = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>
          Peça seus combinados favoritos em poucos minutos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => register.mutate(data))}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <Input id="name" autoComplete="name" {...form.register("name")} />
              <FieldDescription>
                {form.formState.errors.name?.message}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...form.register("email")}
              />
              <FieldDescription>
                {form.formState.errors.email?.message}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="new-password">Senha</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                {...form.register("password")}
              />
              <FieldDescription>
                {form.formState.errors.password?.message}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password-confirmation">
                Confirme a senha
              </FieldLabel>
              <Input
                id="password-confirmation"
                type="password"
                autoComplete="new-password"
                {...form.register("password_confirmation")}
              />
              <FieldDescription>
                {form.formState.errors.password_confirmation?.message}
              </FieldDescription>
            </Field>
            <Button type="submit" disabled={register.isPending}>
              {register.isPending ? "Criando conta..." : "Criar conta"}
            </Button>
            <FieldDescription className="text-center">
              Já possui uma conta?{" "}
              <Link className="text-primary hover:underline" href="/sign-in">
                Entrar
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
