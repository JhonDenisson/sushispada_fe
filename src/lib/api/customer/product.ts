import type { Product } from "@/lib/schemas/product";
import { apiClient } from "../client";

export const customerProductsApi = {
  index: async (categoryId?: number) => {
    const { data } = await apiClient.get<Product[]>("/customers/products", {
      params: categoryId ? { category_id: categoryId } : undefined,
    });
    return data;
  },

  show: async (id: number) => {
    const { data } = await apiClient.get<Product>(`/customers/products/${id}`);
    return data;
  },
};
