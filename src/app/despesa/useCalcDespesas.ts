import { ListMeta } from "@/lib/types/despesaPage.types";
import { DespesaDados } from "@/lib/types/despesaModal.types";
import dayjs from "dayjs";
import { useMemo, useEffect, useState } from "react";

interface UseCalcDespesasProps {
    itens: DespesaDados[];
    meta: ListMeta;
    dataInicial?: string;
    dataFinal?: string;
}

export const useCalcDespesas = ({ itens, meta, dataInicial, dataFinal }: UseCalcDespesasProps) => {
    const [todosDados, setTodosDados] = useState<DespesaDados[]>([]);

    // Função auxiliar para converter valor string para number
    const parseValor = (valor: number | string): number => {
        const numValue = typeof valor === "string" ? parseFloat(valor) : valor;
        return Number.isFinite(numValue) ? numValue : 0;
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

                const res = await fetch(`/api/despesaApi?${params}`, { cache: "no-store" });
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

    const totalDespesas = useMemo(
        () => dadosParaCalculo.reduce((acc, d) => acc + parseValor(d.valor), 0),
        [dadosParaCalculo]
    );

    const despesasMes = useMemo(() => {
        // Se temos filtro de data, usar o mês filtrado, senão usar o mês atual
        const mesReferencia =
            dataInicial && dataFinal
                ? dayjs(dataInicial).startOf("month")
                : dayjs().startOf("month");

        return dadosParaCalculo
            .filter((d) => dayjs(d.data).isSame(mesReferencia, "month"))
            .reduce((acc, d) => acc + parseValor(d.valor), 0);
    }, [dadosParaCalculo, dataInicial, dataFinal]);

    const despesasMesAnterior = useMemo(() => {
        // Se temos filtro de data, usar o mês anterior ao filtrado, senão usar o mês anterior ao atual
        const mesReferencia =
            dataInicial && dataFinal
                ? dayjs(dataInicial).startOf("month")
                : dayjs().startOf("month");
        const mesAnterior = mesReferencia.subtract(1, "month");

        return dadosParaCalculo
            .filter((d) => dayjs(d.data).isSame(mesAnterior, "month"))
            .reduce((acc, d) => acc + parseValor(d.valor), 0);
    }, [dadosParaCalculo, dataInicial, dataFinal]);

    const percentualMesAnterior = useMemo(() => {
        console.log("Debug - despesasMes:", despesasMes);
        console.log("Debug - despesasMesAnterior:", despesasMesAnterior);
        console.log("Debug - dataInicial:", dataInicial);
        console.log("Debug - dataFinal:", dataFinal);

        if (despesasMesAnterior === 0) return 0;
        return ((despesasMes - despesasMesAnterior) / despesasMesAnterior) * 100;
    }, [despesasMes, despesasMesAnterior, dataInicial, dataFinal]);

    const mediaDespesas = useMemo(
        () => (dadosParaCalculo.length ? totalDespesas / dadosParaCalculo.length : 0),
        [dadosParaCalculo, totalDespesas]
    );

    const categoriaComMaiorDespesa = useMemo(() => {
        if (dadosParaCalculo.length === 0) {
            return { categoria: "Nenhuma", valor: 0 };
        }

        const categoriasMap = dadosParaCalculo.reduce((acc, despesa) => {
            const valor = parseValor(despesa.valor);
            acc[despesa.categoria] = (acc[despesa.categoria] || 0) + valor;
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
        totalDespesas,
        despesasMes,
        mediaDespesas,
        categoriaComMaiorDespesa,
        totalPages,
        percentualMesAnterior,
    };
};
