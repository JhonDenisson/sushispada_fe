import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional().nullable(),
  price_cents: z.number().nonnegative(),
  category_id: z.number(),
  image_url: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .nullable(),
  active: z.boolean().optional(),
  category: z.object({ id: z.number(), name: z.string() }).optional(),
});

export type Product = z.infer<typeof productSchema>;

export const createProductSchema = productSchema.omit({ id: true });
export type CreateProductInput = z.infer<typeof createProductSchema>;

export interface PaginatedProducts {
  data: Product[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}
