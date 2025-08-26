import { useState } from "react";
import { Button } from "./ui/button";
import { BarChart3, Home, Menu, Settings, TrendingDown, TrendingUp, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    return (
        <div
            className={`${sidebarOpen ? "w-64" : "w-16"
                } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col`}
        >
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center justify-between">
                    {sidebarOpen && (
                        <h2 className="text-lg font-semibold text-sidebar-foreground">
                            Flow Cash
                        </h2>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <nav className="flex-1 p-2">
                <div className="space-y-2">
                    <Button
                        asChild
                        variant="ghost"
                        className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"
                            } text-sidebar-foreground hover:bg-sidebar-accent`}
                    >
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Dashboard</span>}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"
                            } text-sidebar-foreground hover:bg-sidebar-accent`}
                    >
                        <Link href="/receita">
                            <TrendingUp className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Receitas</span>}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"
                            } text-sidebar-foreground hover:bg-sidebar-accent`}
                    >
                        <Link href="/despesa">
                            <TrendingDown className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Despesas</span>}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"
                            } text-sidebar-foreground hover:bg-sidebar-accent`}
                    >
                        <Link href="/relatorio">
                            <BarChart3 className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Relatórios</span>}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        className={`w-full ${sidebarOpen ? "justify-start" : "justify-center"
                            } text-sidebar-foreground hover:bg-sidebar-accent`}
                    >
                        <Link href="/configuracao">
                            <Settings className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Configurações</span>}
                        </Link>
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
    )
}