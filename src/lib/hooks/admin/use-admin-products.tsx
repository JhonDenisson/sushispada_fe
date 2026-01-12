import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminProductsApi } from "@/lib/api/admin";
import { Product } from "@/lib/schemas/product";

export const adminProductKeys = {
    all: ["admin", "products"] as const,
    list: (filters?: Record<string, unknown>) => [...adminProductKeys.all, "list", filters] as const,
    detail: (id: number) => [...adminProductKeys.all, "detail", id] as const,
};

export function useAdminProducts(params?: { category_id?: number; search?: string }) {
    return useQuery({
        queryKey: adminProductKeys.list(params),
        queryFn: () => adminProductsApi.index(params),
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminProductsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
            adminProductsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
        },
    });
}
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminProductsApi.destroy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
        },
    });
}