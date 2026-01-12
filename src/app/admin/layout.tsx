"use client";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useAuth();

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
  return <>
    <Header/>
    {children}
  </>;
}
