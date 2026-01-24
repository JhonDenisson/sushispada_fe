import { useQuery } from "@tanstack/react-query";
import { customerProductsApi } from "@/lib/api/customer";

export const customerProductKeys = {
  all: ["customer", "products"] as const,
  list: (categoryId?: number) =>
    [...customerProductKeys.all, "list", categoryId] as const,
  detail: (id: number) => [...customerProductKeys.all, "detail", id] as const,
};


export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: customerProductKeys.list(categoryId),
    queryFn: () => customerProductsApi.index(categoryId),
  });
}


export function useProduct(id: number) {
  return useQuery({
    queryKey: customerProductKeys.detail(id),
    queryFn: () => customerProductsApi.show(id),
    enabled: !!id, // Só executa se id existir
  });
}
