"use client";

import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { BarChart3, DollarSign, Search, TrendingDown } from "lucide-react";
import { ModalDespesa } from "@/components/despesaModal";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DespesaDados } from "@/lib/types/despesaModal.types";
import { ApiListResponse, ListMeta } from "@/lib/types/despesaPage.types";
import { toast } from "sonner";
import { useCalcDespesas } from "./useCalcDespesas";
import { ModalDelete } from "@/components/deleteModal";
import { useFilterDate } from "@/lib/hooks/useFilterDate";
import { getDefaultMonthFilter } from "@/lib/utils/dateUtils";

dayjs.locale("pt-br");

const getCurrentMonth = getDefaultMonthFilter;

const qs = (params: Record<string, string | number | undefined | null>) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).length > 0) {
            search.set(k, String(v));
        }
    });
    return search.toString();
};

export default function DespesaPage() {
    const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
    const [filtroStatus, setFiltroStatus] = useState<string>("todos");
    const [filtroMes, setFiltroMes] = useState<string>(getCurrentMonth());

    const [busca, setBusca] = useState<string>("");
    const [debouncedBusca, setDebouncedBusca] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [itens, setItens] = useState<DespesaDados[]>([]);
    const [meta, setMeta] = useState<ListMeta>({ page: 1, pageSize: 10, total: 0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { dataInicial, dataFinal, MonthSelectComponent } = useFilterDate(filtroMes, setFiltroMes);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedBusca(busca.trim()), 350);
        return () => clearTimeout(t);
    }, [busca]);

    const carregar = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const params = {
                usuarioId: 1,
                page,
                pageSize,
                categoria: filtroCategoria !== "todas" ? filtroCategoria : undefined,
                status: filtroStatus !== "todos" ? filtroStatus : undefined,
                texto: debouncedBusca || undefined,
                dataInicial,
                dataFinal,
            };

            const res = await fetch(`/api/despesaApi?${qs(params)}`, { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`Falha ao carregar despesas (${res.status})`);
            }
            const json: ApiListResponse<DespesaDados> = await res.json();
            setItens(json.data);
            setMeta(json.meta);
        } catch (error: unknown) {
            setErrorMsg((error as Error)?.message ?? "Erro ao carregar dados");
            setItens([]);
            setMeta((m) => ({ ...m, total: 0 }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtroCategoria, filtroStatus, debouncedBusca, page, pageSize, dataInicial, dataFinal]);

    const handleSaved = () => {
        setPage(1);
        carregar();
    };

    const {
        despesasMes,
        mediaDespesas,
        categoriaComMaiorDespesa,
        totalPages,
        percentualMesAnterior,
    } = useCalcDespesas({
        itens,
        meta,
        dataInicial,
        dataFinal,
    });

    const handleDelete = async (id?: number) => {
        try {
            const res = await fetch(`/api/despesaApi/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Não foi possível excluir.");
            const restam = itens.length - 1;
            if (restam <= 0 && page > 1) setPage((p) => p - 1);
            else carregar();

            toast.success("Despesa excluída com sucesso!", {
                description: "A despesa foi removida do sistema.",
            });
        } catch (error: unknown) {
            const message = (error as Error)?.message ?? "Erro ao excluir.";
            toast.error("Erro ao excluir despesa", {
                description: message,
            });
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <header className="bg-card border-b border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Despesas</h1>
                            <p className="text-muted-foreground">Gerencie todas as suas despesas</p>
                        </div>
                        <ModalDespesa onSave={handleSaved} usuarioId={1} />
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-red-50 border-red-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-red-800">
                                    Categoria com Maior Despesa
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-900">
                                    R${" "}
                                    {categoriaComMaiorDespesa.valor.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-red-600 mt-1">
                                    {categoriaComMaiorDespesa.categoria}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50 border-orange-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-800">
                                    Despesas do Mês
                                </CardTitle>
                                <TrendingDown className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-900">
                                    R${" "}
                                    {despesasMes.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-orange-600 mt-1">
                                    {percentualMesAnterior > 0
                                        ? `+${percentualMesAnterior.toFixed(
                                              1
                                          )}% em relação ao mês anterior`
                                        : percentualMesAnterior < 0
                                        ? `${percentualMesAnterior.toFixed(
                                              1
                                          )}% em relação ao mês anterior`
                                        : "Sem dados do mês anterior"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-800">
                                    Média por Despesa
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900">
                                    R${" "}
                                    {mediaDespesas.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">
                                    Valor médio por transação
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Filtros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por despesas..."
                                            value={busca}
                                            onChange={(e) => setBusca(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select
                                    value={filtroCategoria}
                                    onValueChange={(v) => {
                                        setPage(1);
                                        setFiltroCategoria(v);
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas as categorias</SelectItem>
                                        <SelectItem value="Retirada de Sócio">
                                            Retirada de Sócio
                                        </SelectItem>
                                        <SelectItem value="Pix">Pix</SelectItem>
                                        <SelectItem value="Fornecedores">Fornecedores</SelectItem>
                                        <SelectItem value="Juros">Juros</SelectItem>
                                        <SelectItem value="Impostos">Impostos</SelectItem>
                                        <SelectItem value="Despesa Pessoal">
                                            Despesa Pessoal
                                        </SelectItem>
                                        <SelectItem value="Saque">Saque</SelectItem>
                                        <SelectItem value="Despesa Oficina">
                                            Despesa Oficina
                                        </SelectItem>
                                        <SelectItem value="Contador">Contador</SelectItem>
                                        <SelectItem value="Despesas com salario">
                                            Despesas com salário
                                        </SelectItem>
                                        <SelectItem value="Despesa água/luz">
                                            Despesa água/luz
                                        </SelectItem>
                                        <SelectItem value="Despesa internet/telefone">
                                            Despesa internet/telefone
                                        </SelectItem>
                                        <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filtroStatus}
                                    onValueChange={(v) => {
                                        setPage(1);
                                        setFiltroStatus(v);
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos</SelectItem>
                                        <SelectItem value="pago">Pago</SelectItem>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                        <SelectItem value="cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={String(pageSize)}
                                    onValueChange={(v) => {
                                        setPage(1);
                                        setPageSize(Number(v));
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Itens por página" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>

                                <MonthSelectComponent
                                    filtroMes={filtroMes}
                                    setFiltroMes={setFiltroMes}
                                    setPage={setPage}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Despesas</CardTitle>
                            <CardDescription>
                                {loading
                                    ? "Carregando..."
                                    : `${meta.total} despesa(s) encontrada(s)${
                                          debouncedBusca ? ` para "${debouncedBusca}"` : ""
                                      }`}
                                {errorMsg ? (
                                    <span className="ml-2 text-destructive">— {errorMsg}</span>
                                ) : null}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {!loading && itens.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Nenhum registro encontrado.
                                    </p>
                                ) : null}

                                {itens.map((despesa) => (
                                    <div
                                        key={despesa.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                                <TrendingDown className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {despesa.descricao}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {despesa.categoria}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {dayjs(despesa.data).format("DD/MM/YYYY")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-red-600">
                                                    {(typeof despesa.valor === "string"
                                                        ? parseFloat(despesa.valor)
                                                        : despesa.valor
                                                    ).toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                                <Badge
                                                    variant={
                                                        despesa.status === "pago"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {despesa.status}
                                                </Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                <ModalDespesa
                                                    despesa={despesa}
                                                    usuarioId={1}
                                                    onSave={handleSaved}
                                                />
                                                <ModalDelete
                                                    itemName={despesa.descricao}
                                                    itemType="despesa"
                                                    onConfirm={() => handleDelete(despesa.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Página {meta.page} de {totalPages}
                                </p>
                                <div className="space-x-2">
                                    <Button
                                        variant="outline"
                                        disabled={loading || page <= 1}
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        disabled={loading || page >= totalPages}
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
