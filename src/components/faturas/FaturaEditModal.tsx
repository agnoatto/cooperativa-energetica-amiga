
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { FaturaForm } from "./FaturaForm";
import type { FaturaEditModalProps } from "./types";
import type { FormState } from "./types/fatura-form";
import { parseValue } from "./utils/calculateValues";

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
      <DialogContent 
        className="sm:max-w-[425px]" 
        onPointerDownOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <FaturaForm
          formState={formState}
          setFormState={setFormState}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
