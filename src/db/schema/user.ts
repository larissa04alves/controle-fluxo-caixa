import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("usuario", {
    id: serial("id").primaryKey(),
    nome: varchar("nome", { length: 120 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    senha: varchar("senha", { length: 255 }).notNull(),
});
