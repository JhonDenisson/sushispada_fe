"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/forms/product-form";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/admin/use-admin-products";
import type { CreateProductInput, Product } from "@/lib/schemas/product";
import { toast } from "sonner";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
}

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();

    const isEditing = !!product;
    const isSubmitting = createProduct.isPending || updateProduct.isPending;

    const handleSubmit = async (data: CreateProductInput) => {
        try {
            if (isEditing && product) {
                await updateProduct.mutateAsync({ id: product.id, data });
                toast.success("Produto atualizado com sucesso!");
            } else {
                await createProduct.mutateAsync(data);
                toast.success("Produto criado com sucesso!");
            }
            onOpenChange(false);
        } catch (error) {
            toast.error(isEditing ? "Erro ao atualizar produto" : "Erro ao criar produto");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Faça as alterações necessárias no produto."
                            : "Preencha os dados para criar um novo produto."}
                    </DialogDescription>
                </DialogHeader>
                <ProductForm
                    defaultValues={product ?? undefined}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
