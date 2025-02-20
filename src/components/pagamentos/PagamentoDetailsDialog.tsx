
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PagamentoData } from "./types/pagamento";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, DollarSign, Info, Clock } from "lucide-react";

interface PagamentoDetailsDialogProps {
  pagamento: PagamentoData;
  isOpen: boolean;
  onClose: () => void;
}

export function PagamentoDetailsDialog({
  pagamento,
  isOpen,
  onClose,
}: PagamentoDetailsDialogProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pendente":
        return "secondary";
      case "enviado":
        return "default";
      case "confirmado":
      case "pago":
        return "default";
      case "atrasado":
        return "destructive";
      case "cancelado":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Usina e Investidor */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Informações da Usina
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Investidor:</span>
                <p>{pagamento.usina.investidor.nome_investidor}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Unidade Consumidora:</span>
                <p>{pagamento.usina.unidade_usina.numero_uc}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={getStatusVariant(pagamento.status)} className={
                  pagamento.status === "atrasado" ? "bg-red-500" :
                  pagamento.status === "pago" ? "bg-green-500" :
                  pagamento.status === "pendente" ? "bg-yellow-500" :
                  pagamento.status === "enviado" ? "bg-blue-500" :
                  ""
                }>
                  {pagamento.status}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Data de Vencimento:</span>
                <p>{formatDate(pagamento.data_vencimento)}</p>
              </div>
              {pagamento.data_emissao && (
                <div>
                  <span className="text-muted-foreground">Data de Emissão:</span>
                  <p>{formatDate(pagamento.data_emissao)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Informações de Geração */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Informações de Geração
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Geração:</span>
                <p>{pagamento.geracao_kwh} kWh</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor do kWh:</span>
                <p>{formatCurrency(pagamento.usina.valor_kwh)}</p>
              </div>
              {pagamento.tusd_fio_b && (
                <div>
                  <span className="text-muted-foreground">TUSD/FIO B:</span>
                  <p>{pagamento.tusd_fio_b} kWh</p>
                </div>
              )}
            </div>
          </div>

          {/* Detalhamento de Valores */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Detalhamento de Valores
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Valor Concessionária:</span>
                <span>{formatCurrency(pagamento.valor_concessionaria)}</span>
              </div>
              {pagamento.valor_tusd_fio_b > 0 && (
                <div className="flex justify-between">
                  <span>Valor TUSD/FIO B:</span>
                  <span>{formatCurrency(pagamento.valor_tusd_fio_b)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold">
                <span>Valor Total:</span>
                <span>{formatCurrency(pagamento.valor_total)}</span>
              </div>
            </div>
          </div>

          {/* Histórico de Status */}
          {pagamento.historico_status && pagamento.historico_status.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico de Status
              </h3>
              <div className="space-y-2">
                {pagamento.historico_status.map((historico, index) => (
                  <div key={index} className="text-sm flex items-center justify-between">
                    <div>
                      <Badge 
                        variant={getStatusVariant(historico.novo_status)}
                        className={
                          historico.novo_status === "atrasado" ? "bg-red-500" :
                          historico.novo_status === "pago" ? "bg-green-500" :
                          historico.novo_status === "pendente" ? "bg-yellow-500" :
                          historico.novo_status === "enviado" ? "bg-blue-500" :
                          ""
                        }
                      >
                        {historico.status_anterior} → {historico.novo_status}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">
                      {format(new Date(historico.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informações de Pagamento */}
          {(pagamento.data_pagamento || pagamento.data_confirmacao || pagamento.arquivo_conta_energia_path) && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informações de Pagamento
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {pagamento.data_pagamento && (
                  <div>
                    <span className="text-muted-foreground">Data do Pagamento:</span>
                    <p>{formatDate(pagamento.data_pagamento)}</p>
                  </div>
                )}
                {pagamento.data_confirmacao && (
                  <div>
                    <span className="text-muted-foreground">Data de Confirmação:</span>
                    <p>{formatDate(pagamento.data_confirmacao)}</p>
                  </div>
                )}
                {pagamento.send_method && pagamento.send_method.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Método de Envio:</span>
                    <p>{pagamento.send_method.join(', ')}</p>
                  </div>
                )}
                {pagamento.arquivo_conta_energia_path && (
                  <div>
                    <span className="text-muted-foreground">Conta de Energia:</span>
                    <p>{pagamento.arquivo_conta_energia_nome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observações */}
          {(pagamento.observacao || pagamento.observacao_pagamento) && (
            <div className="space-y-2">
              <h3 className="font-semibold">Observações</h3>
              {pagamento.observacao && (
                <div className="text-sm bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">Observação Geral:</p>
                  <p>{pagamento.observacao}</p>
                </div>
              )}
              {pagamento.observacao_pagamento && (
                <div className="text-sm bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">Observação do Pagamento:</p>
                  <p>{pagamento.observacao_pagamento}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
