
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { parseValue } from "./utils/calculateValues";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: {
    id: string;
    valor_assinatura: number;
  };
  onConfirm: (data: {
    id: string;
    data_pagamento: string;
    valor_adicional: number;
    observacao_pagamento: string | null;
  }) => Promise<void>;
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  fatura,
  onConfirm,
}: PaymentConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dataPagamento, setDataPagamento] = useState(new Date().toISOString().split('T')[0]);
  const [valorAdicional, setValorAdicional] = useState('0,00');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onConfirm({
        id: fatura.id,
        data_pagamento: dataPagamento,
        valor_adicional: parseValue(valorAdicional),
        observacao_pagamento: observacao || null,
      });
      
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const valorTotal = fatura.valor_assinatura + parseValue(valorAdicional);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataPagamento">Data do Pagamento</Label>
            <Input
              id="dataPagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorAdicional">Valor Adicional</Label>
            <CurrencyInput
              id="valorAdicional"
              value={valorAdicional}
              onValueChange={setValorAdicional}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações do Pagamento</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Informe o motivo do valor adicional, se houver..."
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center font-medium">
              <span>Valor Total Final:</span>
              <span className="text-lg">
                {valorTotal.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Confirmando..." : "Confirmar Pagamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
