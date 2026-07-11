"use client";

import { ArrowRight, Package, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminCategories } from "@/lib/hooks/admin/use-admin-categories";
import { useAdminProducts } from "@/lib/hooks/admin/use-admin-products";

export default function AdminPage() {
  const { data: products = [] } = useAdminProducts();
  const { data: categories = [] } = useAdminCategories();
  const activeProducts = products.filter(
    (product) => product.active !== false,
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-primary">
          PAINEL ADMINISTRATIVO
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Visão geral da operação
        </h1>
        <p className="mt-2 text-muted-foreground">
          Acompanhe o cardápio e mantenha a loja pronta para receber pedidos.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Produtos cadastrados</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {products.length}
              <Package className="text-primary" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Produtos ativos</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {activeProducts}
              <Store className="text-primary" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Categorias</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {categories.length}
              <ShieldCheck className="text-primary" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Gerencie seu cardápio</CardTitle>
          <CardDescription>
            Crie, edite e remova os produtos exibidos aos clientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/admin/products">
              Abrir produtos <ArrowRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
