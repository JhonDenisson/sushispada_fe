import { z } from "zod";

export const categorySchema = z.object({
    id: z.number(),
    name: z.string().min(1, "Nome obrigatório"),
    description: z.string().optional().nullable(),
    position: z.number().optional(),
});

export type Category = z.infer<typeof categorySchema>;
