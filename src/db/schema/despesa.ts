import { pgTable, serial, varchar, numeric, date, text, integer } from "drizzle-orm/pg-core";
import { user } from "./user";

export const despesa = pgTable("despesa", {
    id: serial("id").primaryKey(),
    descricao: varchar("descricao", { length: 255 }).notNull(),
    categoria: varchar("categoria", { length: 100 }).notNull(),
    valor: numeric("valor", { precision: 12, scale: 2 }).notNull(),
    data: date("data").notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    observacoes: text("observacoes"),
    usuarioId: integer("usuario_id")
        .references(() => user.id, { onDelete: "cascade" }) // vínculo ao usuário
        .notNull(),
});

export type Despesa = typeof despesa.$inferSelect;
export type NovaDespesa = typeof despesa.$inferInsert;
