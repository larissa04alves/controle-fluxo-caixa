"use client";

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ModalReceita } from "@/components/receitaModal";
import { ModalDelete } from "@/components/deleteModal";
import { BarChart3, DollarSign, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiListResponse, ListMeta } from "@/lib/types/receitaPage.types";
import { ReceitaDadosUI } from "@/lib/types/receitaModal.types";
import { useCalcReceitas } from "./useCalcReceitas";
import { useFilterDate } from "../../lib/hooks/useFilterDate";
import { toast } from "sonner";
import { getDefaultMonthFilter } from "@/lib/utils/dateUtils";

dayjs.locale("pt-br");

const getCurrentMonth = getDefaultMonthFilter;

const uiToApiStatus: Record<string, string> = {
    Recebido: "pago",
    Pendente: "pendente",
    Cancelado: "cancelado",
};

const qs = (params: Record<string, string | number | undefined | null>) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).length > 0) {
            search.set(k, String(v));
        }
    });
    return search.toString();
};

export default function ReceitaPage() {
    const [filtroCategoria, setFiltroCategoria] = useState<string>("todas");
    const [filtroStatus, setFiltroStatus] = useState<string>("todos");
    const [filtroMes, setFiltroMes] = useState<string>(getCurrentMonth());
    const [busca, setBusca] = useState<string>("");
    const [debouncedBusca, setDebouncedBusca] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [itens, setItens] = useState<ReceitaDadosUI[]>([]);
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
                status:
                    filtroStatus !== "todos"
                        ? uiToApiStatus[filtroStatus] || filtroStatus
                        : undefined,
                texto: debouncedBusca || undefined,
                dataInicial,
                dataFinal,
            };
            const res = await fetch(`/api/receitaApi?${qs(params)}`, { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`Falha ao carregar receitas (${res.status})`);
            }
            const json: ApiListResponse<ReceitaDadosUI> = await res.json();
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
    }, [filtroCategoria, filtroStatus, filtroMes, debouncedBusca, page, pageSize]);

    const handleSaved = () => {
        setPage(1);
        carregar();
    };

    const { totalReceitas, receitasMes, mediaReceitas, totalPages } = useCalcReceitas({
        itens: itens,
        meta,
    });

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/receitaApi/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Não foi possível excluir.");
            const restam = itens.length - 1;
            if (restam <= 0 && page > 1) setPage((p) => p - 1);
            else carregar();

            toast.success("Receita excluída com sucesso!", {
                description: "A receita foi removida do sistema.",
            });
        } catch (error: unknown) {
            const message = (error as Error)?.message ?? "Erro ao excluir.";
            toast.error("Erro ao excluir receita", {
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
                            <h1 className="text-2xl font-bold text-foreground">Receitas</h1>
                            <p className="text-muted-foreground">Gerencie todas as suas receitas</p>
                        </div>
                        <ModalReceita usuarioId={1} onSave={handleSaved} />
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-800">
                                    Total de Receitas
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {" "}
                                    {totalReceitas.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-green-600 mt-1">Acumulado</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-800">
                                    Receitas do Mês
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-900">
                                    {receitasMes.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                    Referente ao mês atual{" "}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-800">
                                    Média por Receita
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900">
                                    {mediaReceitas.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">Valor médio</p>
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
                                            placeholder="Buscar por Receitas..."
                                            value={busca}
                                            onChange={(e) => {
                                                setPage(1);
                                                setBusca(e.target.value);
                                            }}
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
                                        <SelectItem value="pix">Pix</SelectItem>
                                        <SelectItem value="debito">Cartão de Débito</SelectItem>
                                        <SelectItem value="credito">Cartão de Crédito</SelectItem>
                                        <SelectItem value="boletos">Boletos</SelectItem>
                                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                        <SelectItem value="transferencia">Transferência</SelectItem>
                                        <SelectItem value="outros">Outros</SelectItem>
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
                                        <SelectItem value="Recebido">Recebido</SelectItem>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
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

                    {/* Lista de Receitas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Receitas</CardTitle>
                            <CardDescription>
                                {loading
                                    ? "Carregando..."
                                    : `${meta.total} receita(s) encontrada(s)${
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

                                {itens.map((r) => (
                                    <div
                                        key={r.id}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                        )}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 rounded-full bg-green-100 text-green-600">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {r.descricao}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {r.categoria}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {dayjs(r.data).format("DD/MM/YYYY")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600">
                                                    {r.valor.toLocaleString("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </p>
                                                <Badge
                                                    variant={
                                                        r.status === "Recebido"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {r.status}
                                                </Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                <ModalReceita
                                                    receita={r}
                                                    usuarioId={1}
                                                    onSave={handleSaved}
                                                />
                                                <ModalDelete
                                                    itemName={r.descricao}
                                                    itemType="receita"
                                                    onConfirm={() => handleDelete(r.id)}
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
