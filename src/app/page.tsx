"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  X,
  Home,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Dados mockados para demonstração
  const saldoAtual = 15750.5;
  const entradasMes = 8500.0;
  const saidasMes = 3200.0;

  const transacoesRecentes = [
    {
      id: 1,
      tipo: "entrada",
      descricao: "Venda de produto",
      valor: 1200.0,
      data: "2024-01-15",
    },
    {
      id: 2,
      tipo: "saida",
      descricao: "Pagamento fornecedor",
      valor: 850.0,
      data: "2024-01-14",
    },
    {
      id: 3,
      tipo: "entrada",
      descricao: "Prestação de serviço",
      valor: 2500.0,
      data: "2024-01-13",
    },
    {
      id: 4,
      tipo: "saida",
      descricao: "Aluguel escritório",
      valor: 1500.0,
      data: "2024-01-12",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
      >
        {/* Header da Sidebar */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                FluxoCaixa
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu da Sidebar */}
        <nav className="flex-1 p-2">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <Home className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Dashboard</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <a href="/receita"></a>
              <TrendingUp className="h-4 w-4" />
              {sidebarOpen && <a href="/receita">Receitas</a>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <TrendingDown className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Despesas</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <BarChart3 className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Relatórios</span>}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-start" : "justify-center"
              } text-sidebar-foreground hover:bg-sidebar-accent`}
            >
              <Settings className="h-4 w-4" />
              {sidebarOpen && <span className="ml-2">Configurações</span>}
            </Button>
          </div>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                U
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  Usuário
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  usuario@email.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Visão geral do seu fluxo de caixa
              </p>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-6 space-y-6">
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">
                  Saldo Atual
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  R${" "}
                  {saldoAtual.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Posição atual do caixa
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">
                  Entradas do Mês
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  R${" "}
                  {entradasMes.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  +12% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">
                  Saídas do Mês
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">
                  R${" "}
                  {saidasMes.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-red-600 mt-1">
                  -5% em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>
                Últimas movimentações do seu fluxo de caixa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transacoesRecentes.map((transacao) => (
                  <div
                    key={transacao.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transacao.tipo === "entrada"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transacao.tipo === "entrada" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transacao.descricao}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transacao.data}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transacao.tipo === "entrada"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transacao.tipo === "entrada" ? "+" : "-"}R${" "}
                        {transacao.valor.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <Badge
                        variant={
                          transacao.tipo === "entrada" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {transacao.tipo === "entrada" ? "Receita" : "Despesa"}
                      </Badge>
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
