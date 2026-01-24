"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProduct } from "@/lib/hooks/admin/use-admin-products";
import type { Product } from "@/lib/schemas/product";
import { toast } from "sonner";

interface DeleteProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
}

export function DeleteProductDialog({
    open,
    onOpenChange,
    product,
}: DeleteProductDialogProps) {
    const deleteProduct = useDeleteProduct();

    const handleDelete = async () => {
        if (!product) return;

        try {
            await deleteProduct.mutateAsync(product.id);
            toast.success("Produto excluído com sucesso!");
            onOpenChange(false);
        } catch (error) {
            toast.error("Erro ao excluir produto");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-destructive">Excluir Produto</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o produto{" "}
                        <strong>&quot;{product?.name}&quot;</strong>? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={deleteProduct.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteProduct.isPending}
                    >
                        {deleteProduct.isPending ? "Excluindo..." : "Excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
