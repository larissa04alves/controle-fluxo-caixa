import { ReceitaDadosUI } from "@/lib/types/receitaModal.types";
import { ListMeta } from "@/lib/types/receitaPage.types";
import dayjs from "dayjs";
import { useMemo } from "react";

interface UseCalcReceitasProps {
    itens: ReceitaDadosUI[];
    meta: ListMeta;
    dataInicial?: string;
    dataFinal?: string;
}

export const useCalcReceitas = ({ itens, meta }: UseCalcReceitasProps) => {
    const totalReceitas = useMemo(
        () => itens.reduce((acc, r) => acc + (Number.isFinite(r.valor) ? r.valor : 0), 0),
        [itens]
    );

    const receitasMes = useMemo(() => {
        const agora = dayjs();
        return itens
            .filter((r) => dayjs(r.data).isSame(agora, "month"))
            .reduce((acc, r) => acc + (Number.isFinite(r.valor) ? r.valor : 0), 0);
    }, [itens]);

    const mediaReceitas = useMemo(
        () => (itens.length ? totalReceitas / itens.length : 0),
        [itens, totalReceitas]
    );

    const categoriaComMaiorReceita = useMemo(() => {
        if (itens.length === 0) {
            return { categoria: "Nenhuma", valor: 0 };
        }

        const categoriasMap = itens.reduce((acc, receita) => {
            const valor = Number.isFinite(receita.valor) ? receita.valor : 0;
            acc[receita.categoria] = (acc[receita.categoria] || 0) + valor;
            return acc;
        }, {} as Record<string, number>);

        const categoriaComMaiorValor = Object.entries(categoriasMap).reduce(
            (maior, [categoria, valor]) => {
                return valor > maior.valor ? { categoria, valor } : maior;
            },
            { categoria: "", valor: 0 }
        );

        return categoriaComMaiorValor;
    }, [itens]);

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    return { totalReceitas, receitasMes, mediaReceitas, categoriaComMaiorReceita, totalPages };
};
