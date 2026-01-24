"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductDialog } from "@/components/admin/product-dialog";
import { DeleteProductDialog } from "@/components/admin/delete-product-dialog";
import { useAdminProducts } from "@/lib/hooks/admin/use-admin-products";
import { useAdminCategories } from "@/lib/hooks/admin/use-admin-categories";
import type { Product } from "@/lib/schemas/product";

export default function AdminProductsPage() {
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const { data: products = [], isLoading: productsLoading } = useAdminProducts({
        category_id: categoryFilter !== "all" ? parseInt(categoryFilter) : undefined,
        search: search || undefined,
    });
    const { data: categories = [], isLoading: categoriesLoading } = useAdminCategories();

    const filteredProducts = useMemo(() => {
        const productList = Array.isArray(products) ? products : [];
        if (!search) return productList;
        const searchLower = search.toLowerCase();
        return productList.filter((product) =>
            product.name.toLowerCase().includes(searchLower)
        );
    }, [products, search]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setProductDialogOpen(true);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleCreateNew = () => {
        setSelectedProduct(null);
        setProductDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setProductDialogOpen(open);
        if (!open) {
            setSelectedProduct(null);
        }
    };

    const handleDeleteDialogClose = (open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setSelectedProduct(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">
                        Gerencie os produtos do seu cardápio
                    </p>
                </div>
                <Button onClick={handleCreateNew} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar produtos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <ProductsTable
                products={filteredProducts}
                categories={categories}
                isLoading={productsLoading || categoriesLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Dialogs */}
            <ProductDialog
                open={productDialogOpen}
                onOpenChange={handleDialogClose}
                product={selectedProduct}
            />

            <DeleteProductDialog
                open={deleteDialogOpen}
                onOpenChange={handleDeleteDialogClose}
                product={selectedProduct}
            />
        </div>
    );
}
