import { useQuery } from "@tanstack/react-query";
import { adminCategoriesApi } from "@/lib/api/admin";

export const adminCategoryKeys = {
    all: ["admin", "categories"] as const,
    list: () => [...adminCategoryKeys.all, "list"] as const,
    detail: (id: number) => [...adminCategoryKeys.all, "detail", id] as const,
};

export function useAdminCategories() {
    return useQuery({
        queryKey: adminCategoryKeys.list(),
        queryFn: () => adminCategoriesApi.index(),
    });
}
