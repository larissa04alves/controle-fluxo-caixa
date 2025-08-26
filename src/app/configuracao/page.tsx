"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Menu,
    X,
    Home,
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    Settings,
    User,
    Bell,
    Shield,
    Download,
    Save,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function ConfiguracaoPage() {
    const [notificacoes, setNotificacoes] = useState(true)
    const [notificacoesEmail, setNotificacoesEmail] = useState(false)
    const [backupAutomatico, setBackupAutomatico] = useState(true)


    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            {/* Conteúdo Principal */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-card border-b border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
                            <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Save className="h-4 w-4 mr-2" />
                            Salvar Alterações
                        </Button>
                    </div>
                </header>

                {/* Conteúdo */}
                <main className="p-6 space-y-6">
                    {/* Configurações de Perfil */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-primary" />
                                <CardTitle>Perfil da Empresa</CardTitle>
                            </div>
                            <CardDescription>Informações básicas da sua empresa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                                    <Input id="nomeEmpresa" defaultValue="Minha Empresa LTDA" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cnpj">CNPJ</Label>
                                    <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail</Label>
                                    <Input id="email" type="email" defaultValue="contato@minhaempresa.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="telefone">Telefone</Label>
                                    <Input id="telefone" defaultValue="(11) 99999-9999" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endereco">Endereço</Label>
                                <Input id="endereco" defaultValue="Rua das Flores, 123 - Centro - São Paulo/SP" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configurações Financeiras */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <CardTitle>Configurações Financeiras</CardTitle>
                            </div>
                            <CardDescription>Configurações de moeda e formato</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="moeda">Moeda Padrão</Label>
                                    <Select defaultValue="brl">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brl">Real Brasileiro (R$)</SelectItem>
                                            <SelectItem value="usd">Dólar Americano (US$)</SelectItem>
                                            <SelectItem value="eur">Euro (€)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="formato">Formato de Data</Label>
                                    <Select defaultValue="dd/mm/yyyy">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                                            <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                                            <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="anoFiscal">Início do Ano Fiscal</Label>
                                <Select defaultValue="janeiro">
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="janeiro">Janeiro</SelectItem>
                                        <SelectItem value="abril">Abril</SelectItem>
                                        <SelectItem value="julho">Julho</SelectItem>
                                        <SelectItem value="outubro">Outubro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configurações de Notificações */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Bell className="h-5 w-5 text-primary" />
                                <CardTitle>Notificações</CardTitle>
                            </div>
                            <CardDescription>Configure como você deseja receber notificações</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notificacoes">Notificações Push</Label>
                                    <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
                                </div>
                                <Switch id="notificacoes" checked={notificacoes} onCheckedChange={setNotificacoes} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="notificacoesEmail">Notificações por E-mail</Label>
                                    <p className="text-sm text-muted-foreground">Receba resumos diários por e-mail</p>
                                </div>
                                <Switch id="notificacoesEmail" checked={notificacoesEmail} onCheckedChange={setNotificacoesEmail} />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="frequencia">Frequência dos Relatórios</Label>
                                <Select defaultValue="semanal">
                                    <SelectTrigger className="w-full md:w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="diario">Diário</SelectItem>
                                        <SelectItem value="semanal">Semanal</SelectItem>
                                        <SelectItem value="mensal">Mensal</SelectItem>
                                        <SelectItem value="nunca">Nunca</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configurações de Segurança */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle>Segurança</CardTitle>
                            </div>
                            <CardDescription>Configurações de segurança e privacidade</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="senhaAtual">Senha Atual</Label>
                                <Input id="senhaAtual" type="password" placeholder="Digite sua senha atual" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="novaSenha">Nova Senha</Label>
                                    <Input id="novaSenha" type="password" placeholder="Digite a nova senha" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                                    <Input id="confirmarSenha" type="password" placeholder="Confirme a nova senha" />
                                </div>
                            </div>
                            <Button variant="outline" className="w-full md:w-auto bg-transparent">
                                Alterar Senha
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Configurações de Backup */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <Download className="h-5 w-5 text-primary" />
                                <CardTitle>Backup e Exportação</CardTitle>
                            </div>
                            <CardDescription>Gerencie backups e exportação de dados</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="backupAutomatico">Backup Automático</Label>
                                    <p className="text-sm text-muted-foreground">Backup automático dos dados semanalmente</p>
                                </div>
                                <Switch id="backupAutomatico" checked={backupAutomatico} onCheckedChange={setBackupAutomatico} />
                            </div>
                            <Separator />
                            <div className="flex flex-col md:flex-row gap-4">
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Dados (CSV)
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Relatório (PDF)
                                </Button>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    <strong>Último backup:</strong> 15/01/2024 às 14:30
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    <strong>Próximo backup:</strong> 22/01/2024 às 14:30
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    )
}
