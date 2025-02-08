
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
import { toast } from "sonner";
import { CurrencyInput } from "./CurrencyInput";
import { parseValue } from "./utils/calculateValues";
import type { FaturaEditModalProps } from "./types";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh?.toString() || "0");
  const [totalFatura, setTotalFatura] = useState(fatura.total_fatura.toFixed(2).replace('.', ','));
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(fatura.fatura_concessionaria.toFixed(2).replace('.', ','));
  const [iluminacaoPublica, setIluminacaoPublica] = useState(fatura.iluminacao_publica.toFixed(2).replace('.', ','));
  const [outrosValores, setOutrosValores] = useState(fatura.outros_valores.toFixed(2).replace('.', ','));
  const [saldoEnergiaKwh, setSaldoEnergiaKwh] = useState(fatura.saldo_energia_kwh?.toString() || "0");
  const [observacao, setObservacao] = useState(fatura.observacao || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSuccess({
        id: fatura.id,
        consumo_kwh: Number(consumo),
        total_fatura: parseValue(totalFatura),
        fatura_concessionaria: parseValue(faturaConcessionaria),
        iluminacao_publica: parseValue(iluminacaoPublica),
        outros_valores: parseValue(outrosValores),
        saldo_energia_kwh: Number(saldoEnergiaKwh),
        observacao: observacao || null,
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="consumo">Consumo (kWh)</Label>
            <Input
              type="number"
              id="consumo"
              value={consumo}
              onChange={(e) => setConsumo(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="totalFatura">Valor Total Original</Label>
            <CurrencyInput
              id="totalFatura"
              value={totalFatura}
              onChange={setTotalFatura}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
            <CurrencyInput
              id="faturaConcessionaria"
              value={faturaConcessionaria}
              onChange={setFaturaConcessionaria}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <CurrencyInput
              id="iluminacaoPublica"
              value={iluminacaoPublica}
              onChange={setIluminacaoPublica}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <CurrencyInput
              id="outrosValores"
              value={outrosValores}
              onChange={setOutrosValores}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="saldoEnergiaKwh">Saldo de Energia (kWh)</Label>
            <Input
              type="number"
              id="saldoEnergiaKwh"
              value={saldoEnergiaKwh}
              onChange={(e) => setSaldoEnergiaKwh(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Adicione observações relevantes sobre a fatura..."
              className="resize-none"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
