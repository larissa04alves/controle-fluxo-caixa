"use client"

import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    BarChart3,
    DollarSign,
    Edit,
    Search,
    Trash2,
    TrendingDown
} from "lucide-react"
import { ModalDespesa } from "@/components/despesaModal"
import { useState } from "react"

export default function DespesaPage() {
    const [filtroCategoria, setFiltroCategoria] = useState("todas")
    const [busca, setBusca] = useState("")


    const totalDespesas = 18450.0
    const despesasMes = 6200.0
    const mediaDespesas = 1025.56

    const despesas = [
        {
            id: 1,
            descricao: "Aluguel do escritório",
            categoria: "Fixas",
            valor: 2500.0,
            data: "2024-01-15",
            status: "Pago",
        },
        {
            id: 2,
            descricao: "Material de escritório",
            categoria: "Operacionais",
            valor: 450.0,
            data: "2024-01-13",
            status: "Pago",
        },
        {
            id: 3,
            descricao: "Combustível",
            categoria: "Transporte",
            valor: 320.0,
            data: "2024-01-12",
            status: "Pendente",
        },
        {
            id: 4,
            descricao: "Energia elétrica",
            categoria: "Fixas",
            valor: 680.0,
            data: "2024-01-10",
            status: "Pago",
        },
        {
            id: 5,
            descricao: "Marketing digital",
            categoria: "Marketing",
            valor: 1200.0,
            data: "2024-01-08",
            status: "Pago",
        },
        {
            id: 6,
            descricao: "Manutenção equipamentos",
            categoria: "Operacionais",
            valor: 850.0,
            data: "2024-01-05",
            status: "Pago",
        },
    ]

    const despesasFiltradas = despesas.filter((despesa) => {
        const matchCategoria = filtroCategoria === "todas" || despesa.categoria.toLowerCase() === filtroCategoria
        const matchBusca = despesa.descricao.toLowerCase().includes(busca.toLowerCase())
        return matchCategoria && matchBusca
    })

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar - mesma estrutura da página principal */}
            <Sidebar />

            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-card border-b border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Despesas</h1>
                            <p className="text-muted-foreground">Gerencie todas as suas despesas</p>
                        </div>
                        <ModalDespesa onSave={() => { }} />
                    </div>
                </header>

                {/* Conteúdo */}
                <main className="p-6 space-y-6">
                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-red-50 border-red-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-red-800">Total de Despesas</CardTitle>
                                <DollarSign className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-900">
                                    R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-red-600 mt-1">Acumulado no período</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-50 border-orange-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-orange-800">Despesas do Mês</CardTitle>
                                <TrendingDown className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-900">
                                    R$ {despesasMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-orange-600 mt-1">-8% em relação ao mês anterior</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-purple-50 border-purple-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-800">Média por Despesa</CardTitle>
                                <BarChart3 className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-900">
                                    R$ {mediaDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">Valor médio por transação</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtros e Busca */}
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
                                            placeholder="Buscar despesas..."
                                            value={busca}
                                            onChange={(e) => setBusca(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue placeholder="Categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todas">Todas as categorias</SelectItem>
                                        <SelectItem value="fixas">Fixas</SelectItem>
                                        <SelectItem value="operacionais">Operacionais</SelectItem>
                                        <SelectItem value="transporte">Transporte</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de Despesas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Despesas</CardTitle>
                            <CardDescription>{despesasFiltradas.length} despesa(s) encontrada(s)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {despesasFiltradas.map((despesa) => (
                                    <div
                                        key={despesa.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                                <TrendingDown className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{despesa.descricao}</p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {despesa.categoria}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">{despesa.data}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-red-600">
                                                    R$ {despesa.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                                </p>
                                                <Badge variant={despesa.status === "Pago" ? "default" : "secondary"} className="text-xs">
                                                    {despesa.status}
                                                </Badge>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
