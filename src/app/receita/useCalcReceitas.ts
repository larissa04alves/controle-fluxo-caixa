import { ReceitaDados } from "@/lib/types/receitaModal.types";
import { ListMeta } from "@/lib/types/receitaPage.types";
import dayjs from "dayjs";
import { useMemo } from "react";

interface UseCalcReceitasProps {
    itens: ReceitaDados[];
    meta: ListMeta;
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

    const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));

    return { totalReceitas, receitasMes, mediaReceitas, totalPages };
};
