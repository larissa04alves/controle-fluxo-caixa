"use client";

import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  DollarSign,
  Edit,
  Plus,
  Search,
  Trash2,
  TrendingUp
} from "lucide-react";
import { ModalReceita } from "@/components/receitaModal";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ReceitaPage() {
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [busca, setBusca] = useState("");

  // Dados mockados para demonstração
  const totalReceitas = 25750.0;
  const receitasMes = 8500.0;
  const mediaReceitas = 1416.67;

  const receitas = [
    {
      id: 1,
      descricao: "Venda de produto A",
      categoria: "Vendas",
      valor: 1200.0,
      data: "2024-01-15",
      status: "Recebido",
    },
    {
      id: 2,
      descricao: "Prestação de serviço",
      categoria: "Serviços",
      valor: 2500.0,
      data: "2024-01-13",
      status: "Recebido",
    },
    {
      id: 3,
      descricao: "Comissão de vendas",
      categoria: "Comissões",
      valor: 800.0,
      data: "2024-01-12",
      status: "Pendente",
    },
    {
      id: 4,
      descricao: "Venda de produto B",
      categoria: "Vendas",
      valor: 1500.0,
      data: "2024-01-10",
      status: "Recebido",
    },
    {
      id: 5,
      descricao: "Consultoria técnica",
      categoria: "Serviços",
      valor: 3000.0,
      data: "2024-01-08",
      status: "Recebido",
    },
    {
      id: 6,
      descricao: "Royalties",
      categoria: "Outros",
      valor: 500.0,
      data: "2024-01-05",
      status: "Recebido",
    },
  ];

  const receitasFiltradas = receitas.filter((receita) => {
    const matchCategoria =
      filtroCategoria === "todas" ||
      receita.categoria.toLowerCase() === filtroCategoria;
    const matchBusca = receita.descricao
      .toLowerCase()
      .includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

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
              <h1 className="text-2xl font-bold text-foreground">Receitas</h1>
              <p className="text-muted-foreground">
                Gerencie todas as suas receitas
              </p>
            </div>
            <ModalReceita onSave={() => { }} />
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-6 space-y-6">
          {/* Cards de Resumo */}
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
                  R${" "}
                  {totalReceitas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Acumulado no período
                </p>
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
                  R${" "}
                  {receitasMes.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  +12% em relação ao mês anterior
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
                  R${" "}
                  {mediaReceitas.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Valor médio por transação
                </p>
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
                      placeholder="Buscar receitas..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={filtroCategoria}
                  onValueChange={setFiltroCategoria}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as categorias</SelectItem>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="serviços">Serviços</SelectItem>
                    <SelectItem value="comissões">Comissões</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Receitas */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Receitas</CardTitle>
              <CardDescription>
                {receitasFiltradas.length} receita(s) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {receitasFiltradas.map((receita) => (
                  <div
                    key={receita.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {receita.descricao}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {receita.categoria}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {receita.data}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          R${" "}
                          {receita.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <Badge
                          variant={
                            receita.status === "Recebido"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {receita.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                        >
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
  );
}
