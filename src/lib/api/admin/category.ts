import type { Category } from "@/lib/schemas/category";
import { apiClient } from "../client";

export const adminCategoriesApi = {
    index: async () => {
        const { data } = await apiClient.get<Category[]>("/admin/categories");
        return data;
    },

    show: async (id: number) => {
        const { data } = await apiClient.get<Category>(`/admin/categories/${id}`);
        return data;
    },

    create: async (category: Partial<Category>) => {
        const { data } = await apiClient.post<Category>("/admin/categories", category);
        return data;
    },

    update: async (id: number, category: Partial<Category>) => {
        const { data } = await apiClient.patch<Category>(`/admin/categories/${id}`, category);
        return data;
    },

    destroy: async (id: number) => {
        await apiClient.delete(`/admin/categories/${id}`);
    },
};
