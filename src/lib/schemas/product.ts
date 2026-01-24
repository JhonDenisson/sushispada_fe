import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price_cents: z.number().positive(),
  category_id: z.number(),
  image_url: z.string().url().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const createProductSchema = productSchema.omit({ id: true });
export type CreateProductInput = z.infer<typeof createProductSchema>;
