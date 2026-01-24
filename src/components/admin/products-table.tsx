"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Product } from "@/lib/schemas/product";
import type { Category } from "@/lib/schemas/category";

interface ProductsTableProps {
    products: Product[];
    categories: Category[];
    isLoading?: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export function ProductsTable({
    products,
    categories,
    isLoading,
    onEdit,
    onDelete,
}: ProductsTableProps) {
    const getCategoryName = (categoryId: number) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.name ?? "—";
    };

    const formatPrice = (cents: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(cents / 100);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-2 text-4xl">📦</div>
                <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground text-sm">
                    Adicione seu primeiro produto para começar.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Imagem</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="w-[100px] text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                {product.image_url ? (
                                    <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                        📷
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                                    {getCategoryName(product.category_id)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {formatPrice(product.price_cents)}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => onEdit(product)}
                                        title="Editar"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => onDelete(product)}
                                        className="text-destructive hover:text-destructive"
                                        title="Excluir"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
