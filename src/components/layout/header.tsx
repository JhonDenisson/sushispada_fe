"use client";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useLogout } from "@/lib/hooks/use-auth";
export function Header() {
  const { user } = useAuth();
  const logout = useLogout();
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href={user?.role === "admin" ? "/admin" : "/customer"}
            className="text-xl font-bold"
          >
            Sushispada
          </Link>
          {user?.role === "admin" && (
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
              Admin
            </span>
          )}
          {user?.role === "admin" && (
            <Link
              className="text-sm text-muted-foreground hover:text-foreground"
              href="/admin/products"
            >
              Produtos
            </Link>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <User size={18} />
              {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => logout.mutate()}
              className="text-destructive"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
