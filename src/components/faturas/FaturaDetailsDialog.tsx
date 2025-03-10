
/**
 * Diálogo de detalhes da fatura
 * 
 * Este componente exibe os detalhes completos de uma fatura com opções
 * para transição de status.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatarMoeda, formatarKwh } from "@/utils/formatters";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { getStatusColor, getStatusLabel } from "./table/utils/statusUtils";
import { StatusTransitionButtons } from "./StatusTransitionButtons";
import { X } from "lucide-react";

interface FaturaDetailsDialogProps {
  fatura: Fatura;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaDetailsDialog({
  fatura,
  isOpen,
  onClose,
  onUpdateStatus
}: FaturaDetailsDialogProps) {
  const formatLabel = (label: string) => (
    <span className="text-sm font-medium text-gray-500">{label}:</span>
  );

  const formatValue = (value: React.ReactNode) => (
    <span className="text-sm font-medium">{value}</span>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Detalhes da Fatura</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Botões de Transição de Status */}
        {onUpdateStatus && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Ações disponíveis:</h3>
              <StatusTransitionButtons 
                fatura={fatura} 
                onUpdateStatus={onUpdateStatus} 
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Informações Básicas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                {formatLabel("Status")}
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                    fatura.status
                  )}`}
                >
                  {getStatusLabel(fatura.status)}
                </span>
              </div>
              <div className="flex justify-between">
                {formatLabel("Referência")}
                {formatValue(`${fatura.mes}/${fatura.ano}`)}
              </div>
              <div className="flex justify-between">
                {formatLabel("Vencimento")}
                {formatValue(formatDateToPtBR(fatura.data_vencimento))}
              </div>
              <div className="flex justify-between">
                {formatLabel("Número UC")}
                {formatValue(fatura.unidade_beneficiaria.numero_uc)}
              </div>
              <div className="flex justify-between">
                {formatLabel("Cooperado")}
                {formatValue(fatura.unidade_beneficiaria.cooperado.nome)}
              </div>
              {fatura.data_pagamento && (
                <div className="flex justify-between">
                  {formatLabel("Data Pagamento")}
                  {formatValue(formatDateToPtBR(fatura.data_pagamento))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Valores</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                {formatLabel("Consumo")}
                {formatValue(`${formatarKwh(fatura.consumo_kwh)} kWh`)}
              </div>
              <div className="flex justify-between">
                {formatLabel("Valor Total Fatura")}
                {formatValue(formatarMoeda(fatura.total_fatura))}
              </div>
              <div className="flex justify-between">
                {formatLabel("Iluminação Pública")}
                {formatValue(formatarMoeda(fatura.iluminacao_publica))}
              </div>
              <div className="flex justify-between">
                {formatLabel("Outros Valores")}
                {formatValue(formatarMoeda(fatura.outros_valores))}
              </div>
              <div className="flex justify-between">
                {formatLabel("Valor Concessionária")}
                {formatValue(formatarMoeda(fatura.fatura_concessionaria))}
              </div>
              <div className="flex justify-between">
                {formatLabel("Desconto Aplicado")}
                {formatValue(formatarMoeda(fatura.valor_desconto))}
              </div>
              <div className="flex justify-between font-semibold text-primary">
                {formatLabel("Valor Assinatura")}
                {formatValue(formatarMoeda(fatura.valor_assinatura))}
              </div>
              {fatura.valor_adicional > 0 && (
                <div className="flex justify-between">
                  {formatLabel("Valor Adicional")}
                  {formatValue(formatarMoeda(fatura.valor_adicional))}
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          {(fatura.observacao || fatura.observacao_pagamento) && (
            <div className="col-span-1 md:col-span-2 border-t pt-3 mt-2">
              <h3 className="text-sm font-semibold mb-2">Observações</h3>
              <div className="space-y-3">
                {fatura.observacao && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">Observação Geral:</h4>
                    <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{fatura.observacao}</p>
                  </div>
                )}
                
                {fatura.observacao_pagamento && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500">Observação de Pagamento:</h4>
                    <p className="text-sm mt-1 bg-gray-50 p-2 rounded">{fatura.observacao_pagamento}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
