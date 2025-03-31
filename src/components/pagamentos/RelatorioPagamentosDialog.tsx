
/**
 * Modal para visualização de relatório de pagamentos
 * 
 * Este componente exibe um relatório detalhado dos pagamentos, incluindo
 * gráficos, estatísticas e informações consolidadas sobre os pagamentos
 * de um determinado período.
 */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { PagamentoData } from "./types/pagamento";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
  const [activeTab, setActiveTab] = useState("resumo");

  // Função para calcular estatísticas
  const calcularEstatisticas = () => {
    if (!pagamentos || pagamentos.length === 0) return {
      total: 0,
      mediaGeracao: 0,
      totalConcessionaria: 0,
      mediaValorTotal: 0,
      totalPendente: 0,
      totalPago: 0,
      mediaTusdFioB: 0
    };
    
    const total = pagamentos.reduce((acc, p) => acc + p.valor_total, 0);
    const totalGeracao = pagamentos.reduce((acc, p) => acc + p.geracao_kwh, 0);
    const totalConcessionaria = pagamentos.reduce((acc, p) => acc + p.valor_concessionaria, 0);
    const totalTusdFioB = pagamentos.reduce((acc, p) => acc + p.valor_tusd_fio_b, 0);
    const totalPendente = pagamentos
      .filter(p => p.status === "pendente" || p.status === "enviado")
      .reduce((acc, p) => acc + p.valor_total, 0);
    const totalPago = pagamentos
      .filter(p => p.status === "pago")
      .reduce((acc, p) => acc + p.valor_total, 0);

    return {
      total,
      mediaGeracao: totalGeracao / pagamentos.length,
      totalConcessionaria,
      mediaValorTotal: total / pagamentos.length,
      totalPendente,
      totalPago,
      mediaTusdFioB: totalTusdFioB / pagamentos.length
    };
  };

  // Dados para o gráfico de status
  const prepararDadosStatusPagamentos = () => {
    const statusCount = pagamentos.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  };

  // Dados para o gráfico de valores
  const prepararDadosValoresPagamentos = () => {
    if (!pagamentos || pagamentos.length === 0) return [];
    
    // Agrupar por investidor
    const valorPorInvestidor = pagamentos.reduce((acc, p) => {
      const investidor = p.usina.investidor.nome_investidor;
      if (!acc[investidor]) {
        acc[investidor] = 0;
      }
      acc[investidor] += p.valor_total;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(valorPorInvestidor).map(([name, value]) => ({
      name,
      valor: value
    }));
  };

  // Dados para a tabela de pagamentos
  const prepararDadosTabela = () => {
    return [...pagamentos]
      .sort((a, b) => new Date(b.data_vencimento).getTime() - new Date(a.data_vencimento).getTime())
      .slice(0, 10); // Limitando aos 10 mais recentes
  };

  const estatisticas = calcularEstatisticas();
  const dadosStatus = prepararDadosStatusPagamentos();
  const dadosValores = prepararDadosValoresPagamentos();
  const dadosTabela = prepararDadosTabela();

  // Cores para os status
  const COLORS = {
    "Pendente": "#FFB800", 
    "Enviado": "#0088FE", 
    "Pago": "#00C49F",
    "Atrasado": "#FF8042",
    "Cancelado": "#FF0000"
  };

  // Exportar relatório em PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    const mesAno = format(currentDate, 'MMMM yyyy', { locale: ptBR });
    
    // Título
    doc.setFontSize(18);
    doc.text(`Relatório de Pagamentos - ${mesAno}`, 14, 22);
    
    // Estatísticas
    doc.setFontSize(14);
    doc.text("Resumo Financeiro", 14, 35);
    doc.setFontSize(10);
    doc.text(`Total de Pagamentos: ${formatarMoeda(estatisticas.total)}`, 14, 45);
    doc.text(`Total Pendente: ${formatarMoeda(estatisticas.totalPendente)}`, 14, 52);
    doc.text(`Total Pago: ${formatarMoeda(estatisticas.totalPago)}`, 14, 59);
    doc.text(`Média de Geração: ${estatisticas.mediaGeracao.toFixed(2)} kWh`, 105, 45);
    doc.text(`Média Valor Total: ${formatarMoeda(estatisticas.mediaValorTotal)}`, 105, 52);
    doc.text(`Média TUSD Fio B: ${formatarMoeda(estatisticas.mediaTusdFioB)}`, 105, 59);
    
    // Tabela de pagamentos
    doc.setFontSize(14);
    doc.text("Pagamentos Recentes", 14, 75);
    
    const headers = [
      ["UC", "Investidor", "Geração (kWh)", "Valor Conc.", "Valor Total", "Vencimento", "Status"]
    ];
    
    const data = dadosTabela.map(p => [
      p.usina.unidade_usina.numero_uc,
      p.usina.investidor.nome_investidor.substring(0, 20), // Limitando o tamanho
      p.geracao_kwh.toString(),
      formatarMoeda(p.valor_concessionaria),
      formatarMoeda(p.valor_total),
      format(new Date(p.data_vencimento), 'dd/MM/yyyy'),
      p.status.charAt(0).toUpperCase() + p.status.slice(1)
    ]);
    
    // @ts-ignore - Necessário para usar o plugin jspdf-autotable
    doc.autoTable({
      startY: 80,
      head: headers,
      body: data,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 290);
      doc.text(`Página ${i} de ${pageCount}`, 180, 290);
    }
    
    doc.save(`relatorio_pagamentos_${format(currentDate, 'MM_yyyy')}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Relatório de Pagamentos</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </div>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" onClick={exportarPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
        </div>

        <Tabs defaultValue="resumo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="graficos">Gráficos</TabsTrigger>
            <TabsTrigger value="detalhe">Detalhes</TabsTrigger>
          </TabsList>
          
          {/* Tab Resumo */}
          <TabsContent value="resumo" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                  <CardDescription>Valores totais e médias do período</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 flex justify-between">
                      <dt>Total de Pagamentos:</dt>
                      <dd className="font-semibold">{formatarMoeda(estatisticas.total)}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Total Pendente:</dt>
                      <dd className="font-semibold">{formatarMoeda(estatisticas.totalPendente)}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Total Pago:</dt>
                      <dd className="font-semibold text-green-600">{formatarMoeda(estatisticas.totalPago)}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Total Concessionária:</dt>
                      <dd className="font-semibold">{formatarMoeda(estatisticas.totalConcessionaria)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Médias e Indicadores</CardTitle>
                  <CardDescription>Valores médios por pagamento</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 flex justify-between">
                      <dt>Média de Geração:</dt>
                      <dd className="font-semibold">{estatisticas.mediaGeracao.toFixed(2)} kWh</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Média Valor Total:</dt>
                      <dd className="font-semibold">{formatarMoeda(estatisticas.mediaValorTotal)}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Média TUSD Fio B:</dt>
                      <dd className="font-semibold">{formatarMoeda(estatisticas.mediaTusdFioB)}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt>Total de Pagamentos:</dt>
                      <dd className="font-semibold">{pagamentos.length}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos Recentes</CardTitle>
                <CardDescription>10 pagamentos mais recentes por data de vencimento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>UC</TableHead>
                        <TableHead>Investidor</TableHead>
                        <TableHead className="text-right">Geração (kWh)</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="text-right">Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dadosTabela.map((pagamento) => (
                        <TableRow key={pagamento.id}>
                          <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
                          <TableCell className="max-w-[180px] truncate">
                            {pagamento.usina.investidor.nome_investidor}
                          </TableCell>
                          <TableCell className="text-right">{pagamento.geracao_kwh.toLocaleString('pt-BR')}</TableCell>
                          <TableCell className="text-right">{formatarMoeda(pagamento.valor_total)}</TableCell>
                          <TableCell className="text-right">
                            {format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                pagamento.status === 'pago' ? 'bg-green-100 text-green-800 border-green-300' :
                                pagamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                pagamento.status === 'enviado' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                pagamento.status === 'atrasado' ? 'bg-red-100 text-red-800 border-red-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }
                            >
                              {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {dadosTabela.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            Nenhum pagamento encontrado para este período
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab Gráficos */}
          <TabsContent value="graficos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Pagamentos</CardTitle>
                  <CardDescription>Distribuição por status</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div style={{ width: "100%", height: 250 }}>
                    <PieChart width={320} height={250}>
                      <Pie
                        data={dadosStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosStatus.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.name as keyof typeof COLORS] || "#BDBDBD"} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} pagamentos`, ""]} />
                    </PieChart>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Valores por Investidor</CardTitle>
                  <CardDescription>Total por investidor</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div style={{ width: "100%", height: 250 }}>
                    <BarChart
                      width={320}
                      height={250}
                      data={dadosValores}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" tick={false} />
                      <YAxis tickFormatter={(value) => `R$ ${value/1000}k`} />
                      <Tooltip 
                        formatter={(value) => [formatarMoeda(value as number), "Valor"]}
                        labelFormatter={(label) => `Investidor: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="valor" name="Valor Total" fill="#0088FE" />
                    </BarChart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Tab Detalhes */}
          <TabsContent value="detalhe">
            <Card>
              <CardHeader>
                <CardTitle>Lista Completa de Pagamentos</CardTitle>
                <CardDescription>Todos os pagamentos do período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>UC</TableHead>
                        <TableHead>Investidor</TableHead>
                        <TableHead className="text-right">Geração (kWh)</TableHead>
                        <TableHead className="text-right">Valor TUSD</TableHead>
                        <TableHead className="text-right">Valor Conc.</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead className="text-right">Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagamentos.map((pagamento) => (
                        <TableRow key={pagamento.id}>
                          <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
                          <TableCell className="max-w-[150px] truncate">
                            {pagamento.usina.investidor.nome_investidor}
                          </TableCell>
                          <TableCell className="text-right">{pagamento.geracao_kwh.toLocaleString('pt-BR')}</TableCell>
                          <TableCell className="text-right">{formatarMoeda(pagamento.valor_tusd_fio_b)}</TableCell>
                          <TableCell className="text-right">{formatarMoeda(pagamento.valor_concessionaria)}</TableCell>
                          <TableCell className="text-right">{formatarMoeda(pagamento.valor_total)}</TableCell>
                          <TableCell className="text-right">
                            {format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                pagamento.status === 'pago' ? 'bg-green-100 text-green-800 border-green-300' :
                                pagamento.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                pagamento.status === 'enviado' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                pagamento.status === 'atrasado' ? 'bg-red-100 text-red-800 border-red-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }
                            >
                              {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {pagamentos.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                            Nenhum pagamento encontrado para este período
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
