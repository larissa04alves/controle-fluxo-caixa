import { z } from "zod";

export const receitaStatusEnum = z.enum(["pago", "pendente", "cancelado"]);

export const createReceitaSchema = z.object({
    descricao: z.string().min(1),
    categoria: z.string().min(1),
    valor: z.coerce.number().nonnegative(),
    data: z.coerce.date(),
    status: receitaStatusEnum,
    observacoes: z.string().nullable().optional(),
    usuarioId: z.coerce.number().int().positive(),
});

export const updateReceitaSchema = createReceitaSchema.partial();

export const listReceitasQuerySchema = z.object({
    usuarioId: z.coerce.number().int().positive().optional(),
    dataInicial: z.string().optional(),
    dataFinal: z.string().optional(),
    categoria: z.string().optional(),
    texto: z.string().optional(),
    status: receitaStatusEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateReceitaInput = z.infer<typeof createReceitaSchema>;
export type UpdateReceitaInput = z.infer<typeof updateReceitaSchema>;
export type ListReceitasQuery = z.infer<typeof listReceitasQuerySchema>;
