"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import { cn } from "@/lib/utils"

interface ModalReceitaProps {
    receita?: {
        id: number
        descricao: string
        categoria: string
        valor: number
        data: string
        status: string
        observacoes?: string
    }
    onSave?: (receita: unknown) => void
}

export function ModalReceita({ receita, onSave }: ModalReceitaProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        descricao: receita?.descricao || "",
        categoria: receita?.categoria || "",
        valor: receita?.valor?.toString() || "",
        data: receita?.data ? new Date(receita.data) : new Date(),
        status: receita?.status || "Pendente",
        observacoes: receita?.observacoes || "",
    })

    dayjs.locale("pt-br")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const novaReceita = {
            id: receita?.id || Date.now(),
            descricao: formData.descricao,
            categoria: formData.categoria,
            valor: Number.parseFloat(formData.valor),
            data: dayjs(formData.data).format("YYYY-MM-DD"),
            status: formData.status,
            observacoes: formData.observacoes,
        }

        onSave?.(novaReceita)
        setOpen(false)

        if (!receita) {
            setFormData({
                descricao: "",
                categoria: "",
                valor: "",
                data: new Date(),
                status: "Pendente",
                observacoes: "",
            })
        }
    }

    const isEditing = !!receita

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Receita
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar Receita" : "Nova Receita"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Edite as informações da receita abaixo."
                            : "Preencha as informações para adicionar uma nova receita."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="descricao">Descrição *</Label>
                            <Input
                                id="descricao"
                                placeholder="Ex: Venda de produto, Prestação de serviço..."
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                required
                            />
                        </div>

                        <div className="w-full items-center flex gap-4">
                            <div className="w-1/2 gap-2 flex flex-col">
                                <Label htmlFor="categoria">Categoria *</Label>
                                <Select
                                    value={formData.categoria}
                                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                                    required
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Vendas">Vendas</SelectItem>
                                        <SelectItem value="Serviços">Serviços</SelectItem>
                                        <SelectItem value="Comissões">Comissões</SelectItem>
                                        <SelectItem value="Investimentos">Investimentos</SelectItem>
                                        <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>

                            <div className="w-1/2 gap-2 flex flex-col">
                                <Label htmlFor="valor">Valor (R$) *</Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0,00"
                                    value={formData.valor}
                                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex w-full gap-4 items-center">
                            <div className="w-1/2 gap-2 flex flex-col">
                                <Label>Data *</Label>
                                <Popover>
                                    <PopoverTrigger asChild className="w-full">
                                        <Button
                                            variant="outline"
                                            className={cn("justify-start text-left font-normal", !formData.data && "text-muted-foreground")}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.data ? dayjs(formData.data).format("DD/MM/YYYY") : <span>Selecione a data</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.data}
                                            onSelect={(date) => date && setFormData({ ...formData, data: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex flex-col w-1/2 gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Recebido">Recebido</SelectItem>
                                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                placeholder="Informações adicionais sobre a receita..."
                                value={formData.observacoes}
                                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="pt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            {isEditing ? "Salvar Alterações" : "Adicionar Receita"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
