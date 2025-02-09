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
import { useEffect, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import type { FaturaEditModalProps } from "./types";
import { parseValue } from "./utils/calculateValues";

interface FormState {
  consumo: number;
  totalFatura: string;
  faturaConcessionaria: string;
  iluminacaoPublica: string;
  outrosValores: string;
  saldoEnergiaKwh: number;
  observacao: string;
  dataVencimento: string;
}

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    consumo: fatura.consumo_kwh || 0,
    totalFatura: fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    faturaConcessionaria: fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    iluminacaoPublica: fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    outrosValores: fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    saldoEnergiaKwh: fatura.saldo_energia_kwh || 0,
    observacao: fatura.observacao || '',
    dataVencimento: fatura.data_vencimento,
  });

  useEffect(() => {
    if (isOpen) {
      setFormState({
        consumo: fatura.consumo_kwh || 0,
        totalFatura: fatura.total_fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        faturaConcessionaria: fatura.fatura_concessionaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        iluminacaoPublica: fatura.iluminacao_publica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        outrosValores: fatura.outros_valores.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        saldoEnergiaKwh: fatura.saldo_energia_kwh || 0,
        observacao: fatura.observacao || '',
        dataVencimento: fatura.data_vencimento,
      });
      setIsSubmitting(false);
    }
  }, [isOpen, fatura]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSuccess({
        id: fatura.id,
        consumo_kwh: formState.consumo,
        total_fatura: parseValue(formState.totalFatura),
        fatura_concessionaria: parseValue(formState.faturaConcessionaria),
        iluminacao_publica: parseValue(formState.iluminacaoPublica),
        outros_valores: parseValue(formState.outrosValores),
        saldo_energia_kwh: formState.saldoEnergiaKwh,
        observacao: formState.observacao || null,
        data_vencimento: formState.dataVencimento,
        percentual_desconto: fatura.unidade_beneficiaria.percentual_desconto,
      });
      onClose();
    } catch (error) {
      console.error('Error updating fatura:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => {
        if (isSubmitting) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="dataVencimento">Data de Vencimento</Label>
            <Input
              type="date"
              id="dataVencimento"
              value={formState.dataVencimento}
              onChange={(e) => setFormState(prev => ({ ...prev, dataVencimento: e.target.value }))}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="consumo">Consumo (kWh)</Label>
            <Input
              type="number"
              id="consumo"
              value={formState.consumo}
              onChange={(e) => setFormState(prev => ({ ...prev, consumo: Number(e.target.value) }))}
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="totalFatura">Valor Total Original</Label>
            <CurrencyInput
              id="totalFatura"
              value={formState.totalFatura}
              onChange={(value) => setFormState(prev => ({ ...prev, totalFatura: value }))}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Conta de Energia</Label>
            <CurrencyInput
              id="faturaConcessionaria"
              value={formState.faturaConcessionaria}
              onChange={(value) => setFormState(prev => ({ ...prev, faturaConcessionaria: value }))}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <CurrencyInput
              id="iluminacaoPublica"
              value={formState.iluminacaoPublica}
              onChange={(value) => setFormState(prev => ({ ...prev, iluminacaoPublica: value }))}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <CurrencyInput
              id="outrosValores"
              value={formState.outrosValores}
              onChange={(value) => setFormState(prev => ({ ...prev, outrosValores: value }))}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="saldoEnergiaKwh">Saldo de Energia (kWh)</Label>
            <Input
              type="number"
              id="saldoEnergiaKwh"
              value={formState.saldoEnergiaKwh}
              onChange={(e) => setFormState(prev => ({ ...prev, saldoEnergiaKwh: Number(e.target.value) }))}
              step="0.01"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={formState.observacao}
              onChange={(e) => setFormState(prev => ({ ...prev, observacao: e.target.value }))}
              placeholder="Adicione observações relevantes sobre a fatura..."
              className="resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
