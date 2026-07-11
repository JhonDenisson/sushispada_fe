"use client";

import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { customerOrdersApi } from "@/lib/api/customer";
import { useProducts } from "@/lib/hooks/customer/use-products";
import type { Product } from "@/lib/schemas/product";

const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );

export default function CustomerPage() {
  const { data: products = [], isLoading, isError } = useProducts();
  const [cart, setCart] = useState<Record<number, number>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const total = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + product.price_cents * (cart[product.id] ?? 0),
        0,
      ),
    [cart, products],
  );

  const changeQuantity = (id: number, delta: number) =>
    setCart((current) => {
      const quantity = Math.max(0, (current[id] ?? 0) + delta);
      const next = { ...current };
      if (quantity === 0) delete next[id];
      else next[id] = quantity;
      return next;
    });

  const checkout = async () => {
    setIsCheckingOut(true);
    try {
      const order = await customerOrdersApi.createDraft();
      await Promise.all(
        Object.entries(cart).map(([productId, quantity]) =>
          customerOrdersApi.addItem(order.id, Number(productId), quantity),
        ),
      );
      await customerOrdersApi.checkoutPickup(order.id);
      setCart({});
      toast.success("Pedido confirmado! Retirada e pagamento via Pix.");
    } catch {
      toast.error(
        "Não foi possível concluir o pedido. Confira se a API está disponível.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <section className="mb-10 overflow-hidden rounded-3xl border bg-gradient-to-br from-red-950 via-card to-card p-8 sm:p-12">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-300">
          <Sparkles size={16} /> Sushi fresco, sem complicação
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Seu japonês favorito, preparado na hora.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Escolha seus itens, monte o pedido e retire no balcão pagando com Pix.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section>
          <h2 className="mb-5 text-2xl font-semibold">Cardápio</h2>
          {isLoading && (
            <p className="text-muted-foreground">Carregando cardápio...</p>
          )}
          {isError && (
            <p className="text-destructive">
              Não foi possível carregar o cardápio.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-red-950 to-zinc-900 text-5xl">
                  🍣
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-10">
                    {product.description ||
                      "Preparado com ingredientes selecionados."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <strong>{money(product.price_cents)}</strong>
                  <div className="flex items-center gap-2">
                    {(cart[product.id] ?? 0) > 0 && (
                      <>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          aria-label={`Remover ${product.name}`}
                          onClick={() => changeQuantity(product.id, -1)}
                        >
                          <Minus />
                        </Button>
                        <span>{cart[product.id]}</span>
                      </>
                    )}
                    <Button
                      size="icon-sm"
                      aria-label={`Adicionar ${product.name}`}
                      onClick={() => changeQuantity(product.id, 1)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag size={20} /> Seu pedido
              </CardTitle>
              <CardDescription>Retirada no balcão · Pix</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Adicione itens para começar.
                </p>
              ) : (
                products
                  .filter((item) => cart[item.id])
                  .map((item) => (
                    <div className="flex justify-between text-sm" key={item.id}>
                      <span>
                        {cart[item.id]}× {item.name}
                      </span>
                      <span>{money(item.price_cents * cart[item.id])}</span>
                    </div>
                  ))
              )}
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
              <Button
                className="w-full"
                disabled={total === 0 || isCheckingOut}
                onClick={checkout}
              >
                {isCheckingOut ? "Confirmando..." : "Confirmar pedido"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
