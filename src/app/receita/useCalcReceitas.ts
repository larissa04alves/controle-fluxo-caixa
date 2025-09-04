import { ReceitaDadosUI } from "@/lib/types/receitaModal.types";
import { ListMeta } from "@/lib/types/receitaPage.types";
import dayjs from "dayjs";
import { useMemo, useEffect, useState } from "react";

interface UseCalcReceitasProps {
    itens: ReceitaDadosUI[];
    meta: ListMeta;
    dataInicial?: string;
    dataFinal?: string;
}

export const useCalcReceitas = ({ itens, meta, dataInicial, dataFinal }: UseCalcReceitasProps) => {
    const [todosDados, setTodosDados] = useState<ReceitaDadosUI[]>([]);

    // Função auxiliar para converter valor para number
    const parseValor = (valor: number): number => {
        return Number.isFinite(valor) ? valor : 0;
    };

    // Buscar todos os dados para cálculos corretos (sem filtros de data para permitir comparação com mês anterior)
    const buscarTodosDados = async () => {
        try {
            const allData = [];
            let page = 1;
            const pageSize = 100;
            const currentYear = new Date().getFullYear();

            while (true) {
                const params = new URLSearchParams({
                    usuarioId: "1",
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                    dataInicial: `${currentYear}-01-01`,
                    dataFinal: `${currentYear}-12-31`,
                });

                const res = await fetch(`/api/receitaApi?${params}`, { cache: "no-store" });
                if (!res.ok) break;

                const json = await res.json();
                allData.push(...(json.data || []));

                if ((json.data || []).length < pageSize) {
                    break;
                }

                page++;
            }

            setTodosDados(allData);
        } catch (error) {
            console.error("Erro ao buscar dados para cálculo:", error);
            setTodosDados(itens);
        }
    };

    useEffect(() => {
        buscarTodosDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataInicial, dataFinal]);

    const dadosParaCalculo = todosDados.length > 0 ? todosDados : itens;

    const totalReceitas = useMemo(
        () => dadosParaCalculo.reduce((acc, r) => acc + parseValor(r.valor), 0),
        [dadosParaCalculo]
    );

    const receitasMes = useMemo(() => {
        // Se temos filtro de data, usar o mês filtrado, senão usar o mês atual
        const mesReferencia =
            dataInicial && dataFinal
                ? dayjs(dataInicial).startOf("month")
                : dayjs().startOf("month");

        return dadosParaCalculo
            .filter((r) => dayjs(r.data).isSame(mesReferencia, "month"))
            .reduce((acc, r) => acc + parseValor(r.valor), 0);
    }, [dadosParaCalculo, dataInicial, dataFinal]);

    const receitasMesAnterior = useMemo(() => {
        // Se temos filtro de data, usar o mês anterior ao filtrado, senão usar o mês anterior ao atual
        const mesReferencia =
            dataInicial && dataFinal
                ? dayjs(dataInicial).startOf("month")
                : dayjs().startOf("month");
        const mesAnterior = mesReferencia.subtract(1, "month");

        return dadosParaCalculo
            .filter((r) => dayjs(r.data).isSame(mesAnterior, "month"))
            .reduce((acc, r) => acc + parseValor(r.valor), 0);
    }, [dadosParaCalculo, dataInicial, dataFinal]);

    const percentualMesAnterior = useMemo(() => {
        console.log("Debug - receitasMes:", receitasMes);
        console.log("Debug - receitasMesAnterior:", receitasMesAnterior);
        console.log("Debug - dataInicial:", dataInicial);
        console.log("Debug - dataFinal:", dataFinal);

        if (receitasMesAnterior === 0) return 0;
        return ((receitasMes - receitasMesAnterior) / receitasMesAnterior) * 100;
    }, [receitasMes, receitasMesAnterior, dataInicial, dataFinal]);

    const mediaReceitas = useMemo(
        () => (dadosParaCalculo.length ? totalReceitas / dadosParaCalculo.length : 0),
        [dadosParaCalculo, totalReceitas]
    );

    const categoriaComMaiorReceita = useMemo(() => {
        if (dadosParaCalculo.length === 0) {
            return { categoria: "Nenhuma", valor: 0 };
        }

        const categoriasMap = dadosParaCalculo.reduce((acc, receita) => {
            const valor = parseValor(receita.valor);
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
    }, [dadosParaCalculo]);

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    return {
        totalReceitas,
        receitasMes,
        mediaReceitas,
        categoriaComMaiorReceita,
        totalPages,
        percentualMesAnterior,
    };
};
