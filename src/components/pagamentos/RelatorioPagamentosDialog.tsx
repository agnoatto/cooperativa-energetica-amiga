
/**
 * Diálogo de relatório de pagamentos
 * 
 * Este componente exibe um relatório detalhado dos pagamentos para o período selecionado,
 * permitindo a visualização de estatísticas e exportação em PDF.
 */
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Printer, Download, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RelatorioPagamentosDialogProps {
  pagamentos: PagamentoData[];
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
}

export function RelatorioPagamentosDialog({
  pagamentos,
  isOpen,
  onClose,
  currentDate
}: RelatorioPagamentosDialogProps) {
  const [exporting, setExporting] = useState(false);
  
  const mesAnoFormatado = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  
  // Cálculo de estatísticas
  const totalPagamentos = pagamentos.length;
  const totalValor = pagamentos.reduce((sum, item) => sum + (Number(item.valor_total) || 0), 0);
  const totalGeracaoKwh = pagamentos.reduce((sum, item) => sum + (Number(item.geracao_kwh) || 0), 0);
  
  // Cálculo de pagamentos por status
  const statusCount = pagamentos.reduce((acc, item) => {
    const status = item.status || "pendente";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Preparar dados para o gráfico
  const chartData = Object.entries(statusCount).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    quantidade: count,
  }));
  
  // Cores para o gráfico com base no status
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Pendente: "#FFC107",
      Pago: "#4CAF50",
      Atrasado: "#F44336",
      Enviado: "#2196F3",
      Cancelado: "#9E9E9E"
    };
    return statusColors[status] || "#9E9E9E";
  };

  // Função para exportar o relatório como PDF
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Simulação de exportação (você pode implementar a exportação real depois)
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Exportando relatório como PDF");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    } finally {
      setExporting(false);
    }
  };

  // Função para imprimir o relatório
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileText className="mr-2 h-5 w-5" />
            Relatório de Pagamentos - {mesAnoFormatado}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Cards com resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPagamentos}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Valor Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalValor)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Geração Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGeracaoKwh.toFixed(2)} kWh</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Gráfico de status */}
          <Card className="p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pagamentos por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} pagamentos`, "Quantidade"]} />
                    <Bar dataKey="quantidade" fill="#8884d8">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          {/* Tabela de pagamentos */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Lista de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Usina</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagamentos.length > 0 ? (
                    pagamentos.slice(0, 10).map((pagamento) => (
                      <TableRow key={pagamento.id}>
                        <TableCell>
                          {pagamento.data_pagamento ? format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                        <TableCell>{pagamento.usina_nome || '-'}</TableCell>
                        <TableCell>{formatCurrency(Number(pagamento.valor_total) || 0)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            pagamento.status === 'pago' ? 'success' : 
                            pagamento.status === 'pendente' ? 'warning' :
                            pagamento.status === 'cancelado' ? 'destructive' : 'outline'
                          }>
                            {pagamento.status?.charAt(0).toUpperCase() + pagamento.status?.slice(1) || 'Pendente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        Nenhum pagamento encontrado para este período.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {pagamentos.length > 10 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" className="text-xs">
                    Ver mais <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Separator />
          
          {/* Observações e análises financeiras */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Análise Financeira</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Este relatório apresenta um resumo dos pagamentos registrados para {mesAnoFormatado}.
                A geração total de energia foi de {totalGeracaoKwh.toFixed(2)} kWh, gerando um valor total de {formatCurrency(totalValor)}.
              </p>
              <p className="mt-2">
                {pagamentos.filter(p => p.status === 'pago').length} pagamentos foram confirmados, 
                representando {formatCurrency(pagamentos.reduce((sum, item) => sum + (item.status === 'pago' ? (Number(item.valor_total) || 0) : 0), 0))} 
                do valor total.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <div className="flex gap-2 w-full justify-between">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button onClick={handleExportPDF} disabled={exporting}>
                <Download className="h-4 w-4 mr-2" />
                {exporting ? "Exportando..." : "Exportar PDF"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
