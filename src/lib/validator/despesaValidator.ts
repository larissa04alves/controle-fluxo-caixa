import { z } from "zod";

export const despesaStatusEnum = z.enum(["pago", "pendente", "cancelado"]);

export const createDespesaSchema = z.object({
    descricao: z.string().min(1),
    categoria: z.string().min(1),
    valor: z.coerce.number().nonnegative(),
    data: z.coerce.date(),
    status: despesaStatusEnum,
    observacoes: z.string().nullable().optional(),
    usuarioId: z.coerce.number().int().positive(),
});

export const updateDespesaSchema = createDespesaSchema.partial();

export const listDespesasQuerySchema = z.object({
    usuarioId: z.coerce.number().int().positive().optional(),
    dataInicial: z.string().optional(),
    dataFinal: z.string().optional(),
    categoria: z.string().optional(),
    texto: z.string().optional(),
    status: despesaStatusEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateDespesaInput = z.infer<typeof createDespesaSchema>;
export type UpdateDespesaInput = z.infer<typeof updateDespesaSchema>;
export type ListDespesasQuery = z.infer<typeof listDespesasQuerySchema>;
