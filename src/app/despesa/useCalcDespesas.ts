import { ListMeta } from "@/lib/types/despesaPage.types";
import { DespesaDados } from "@/lib/types/despesaModal.types";
import dayjs from "dayjs";
import { useMemo, useEffect, useState } from "react";

interface UseCalcDespesasProps {
    itens: DespesaDados[];
    meta: ListMeta;
}

export const useCalcDespesas = ({ itens, meta }: UseCalcDespesasProps) => {
    const [todosDados, setTodosDados] = useState<DespesaDados[]>([]);

    // Função auxiliar para converter valor string para number
    const parseValor = (valor: number | string): number => {
        const numValue = typeof valor === "string" ? parseFloat(valor) : valor;
        return Number.isFinite(numValue) ? numValue : 0;
    };

    // Buscar todos os dados para cálculos corretos (não paginados)
    const buscarTodosDados = async () => {
        try {
            const params = new URLSearchParams({
                usuarioId: "1",
                page: "1",
                pageSize: "1000", // Buscar um número grande para pegar todos os dados
                dataInicial: "2025-01-01",
                dataFinal: "2025-12-31",
            });

            const res = await fetch(`/api/despesaApi?${params}`, { cache: "no-store" });
            if (res.ok) {
                const json = await res.json();
                setTodosDados(json.data || []);
            }
        } catch (error) {
            console.error("Erro ao buscar dados para cálculo:", error);
            setTodosDados(itens); // Fallback para os dados da página atual
        }
    };

    useEffect(() => {
        buscarTodosDados();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Usar todosDados para cálculos, itens apenas como fallback
    const dadosParaCalculo = todosDados.length > 0 ? todosDados : itens;

    const totalDespesas = useMemo(
        () => dadosParaCalculo.reduce((acc, d) => acc + parseValor(d.valor), 0),
        [dadosParaCalculo]
    );

    const despesasMes = useMemo(() => {
        const agora = dayjs();
        return dadosParaCalculo
            .filter((d) => dayjs(d.data).isSame(agora, "month"))
            .reduce((acc, d) => acc + parseValor(d.valor), 0);
    }, [dadosParaCalculo]);

    const despesasMesAnterior = useMemo(() => {
        const mesAnterior = dayjs().subtract(1, "month");
        return dadosParaCalculo
            .filter((d) => dayjs(d.data).isSame(mesAnterior, "month"))
            .reduce((acc, d) => acc + parseValor(d.valor), 0);
    }, [dadosParaCalculo]);

    const percentualMesAnterior = useMemo(() => {
        if (despesasMesAnterior === 0) return 0;
        return ((despesasMes - despesasMesAnterior) / despesasMesAnterior) * 100;
    }, [despesasMes, despesasMesAnterior]);

    const mediaDespesas = useMemo(
        () => (dadosParaCalculo.length ? totalDespesas / dadosParaCalculo.length : 0),
        [dadosParaCalculo, totalDespesas]
    );

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    return { totalDespesas, despesasMes, mediaDespesas, totalPages, percentualMesAnterior };
};
