
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CurrencyInput } from "./CurrencyInput";
import { FileUploadSection } from "./FileUploadSection";
import { calculateValues, parseValue } from "./utils/calculateValues";
import type { FaturaEditModalProps } from "./types";

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh.toString());
  const [totalFatura, setTotalFatura] = useState(fatura.total_fatura.toFixed(2).replace('.', ','));
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(fatura.fatura_concessionaria.toFixed(2).replace('.', ','));
  const [iluminacaoPublica, setIluminacaoPublica] = useState(fatura.iluminacao_publica.toFixed(2).replace('.', ','));
  const [outrosValores, setOutrosValores] = useState(fatura.outros_valores.toFixed(2).replace('.', ','));
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const calculatedValues = calculateValues(
      totalFatura,
      iluminacaoPublica,
      outrosValores,
      faturaConcessionaria,
      fatura.unidade_beneficiaria.percentual_desconto
    );

    try {
      const { error } = await supabase
        .from("faturas")
        .update({
          consumo_kwh: Number(consumo),
          total_fatura: parseValue(totalFatura),
          fatura_concessionaria: parseValue(faturaConcessionaria),
          iluminacao_publica: parseValue(iluminacaoPublica),
          outros_valores: parseValue(outrosValores),
          valor_desconto: calculatedValues.valor_desconto,
          valor_total: calculatedValues.valor_total,
        })
        .eq("id", fatura.id);

      if (error) throw error;

      toast.success("Fatura atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar fatura:", error);
      toast.error("Erro ao atualizar fatura");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploaded = () => {
    onSuccess();
  };

  const handleOpenChange = (open: boolean) => {
    if (!isUploading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => {
        if (isUploading) {
          e.preventDefault();
        }
      }}>
        <DialogHeader>
          <DialogTitle>Editar Fatura</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUploadSection
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            faturaId={fatura.id}
            arquivoConcessionariaPath={fatura.arquivo_concessionaria_path}
            arquivoConcessionariaNome={fatura.arquivo_concessionaria_nome}
            onFileUploaded={handleFileUploaded}
          />

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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
