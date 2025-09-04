import { pgEnum, pgTable, serial, text, boolean } from "drizzle-orm/pg-core";

export const dreSideEnum = pgEnum("dre_side", ["receita", "despesa", "outros"]);
export const dreLineEnum = pgEnum("dre_line", [
    "receita_bruta",
    "deducoes",
    "receita_liquida",
    "custo_produtos",
    "despesa_vendas",
    "despesa_administrativa",
    "despesa_financeira",
    "outras_receitas",
    "outras_despesas",
]);

export const receitaAccount = pgTable("receita_account", {
    id: serial("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    line: dreLineEnum("line").notNull(),
    side: dreSideEnum("side").notNull(),
    isCogs: boolean("is_cogs").default(false),
});

export const receitaCategory = pgTable("receita_category", {
    id: serial("id").primaryKey(),
    category: text("category").notNull(),
    side: dreSideEnum("side").notNull(),
    accountCode: text("account_code").notNull(),
});
