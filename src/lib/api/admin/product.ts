import type { Product } from "@/lib/schemas/product";
import { apiClient } from "../client";

export const adminProductsApi = {
  index: async (params?: { category_id?: number; search?: string }) => {
    const { data } = await apiClient.get<Product[]>("/admin/products", {
      params,
    });
    return data;
  },

  show: async (id: number) => {
    const { data } = await apiClient.get<Product>(`/admin/products/${id}`);
    return data;
  },

  create: async (product: Partial<Product>) => {
    const { data } = await apiClient.post<Product>("/admin/products", product);
    return data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const { data } = await apiClient.patch<Product>(`/admin/products/${id}`, product);
    return data;
  },

  destroy: async (id: number) => {
    await apiClient.delete(`/admin/products/${id}`);
  },
};
