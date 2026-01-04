"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Carregando...</div>;

  if (user?.role !== "customer") {
    redirect("/");
  }
  return <>{children}</>;
}
