"use client";

import { ModalDespesa } from "@/components/despesaModal";
import { ModalReceita } from "@/components/receitaModal";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";

export default function HomePage() {
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
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm">Olá Usuário</h1>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Visão geral do seu fluxo de caixa
              </p>
            </div>
            <div className="flex space-x-2">
              <ModalReceita onSave={() => { }} />
              <ModalDespesa onSave={() => { }} />

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
                        className={`p-2 rounded-full ${transacao.tipo === "entrada"
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
                        className={`font-semibold ${transacao.tipo === "entrada"
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
