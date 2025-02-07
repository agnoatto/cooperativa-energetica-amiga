
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
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FaturaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  fatura: {
    id: string;
    consumo_kwh: number;
    total_fatura: number;
    fatura_concessionaria: number;
    iluminacao_publica: number;
    outros_valores: number;
    unidade_beneficiaria: {
      percentual_desconto: number;
    };
  };
  onSuccess: () => void;
}

export function FaturaEditModal({ isOpen, onClose, fatura, onSuccess }: FaturaEditModalProps) {
  const [consumo, setConsumo] = useState(fatura.consumo_kwh.toString());
  const [totalFatura, setTotalFatura] = useState(fatura.total_fatura.toString());
  const [faturaConcessionaria, setFaturaConcessionaria] = useState(fatura.fatura_concessionaria.toString());
  const [iluminacaoPublica, setIluminacaoPublica] = useState(fatura.iluminacao_publica.toString());
  const [outrosValores, setOutrosValores] = useState(fatura.outros_valores.toString());
  const [isLoading, setIsLoading] = useState(false);

  // Calcula o valor do desconto e valor final automaticamente
  const calculateValues = () => {
    const total = Number(totalFatura);
    const iluminacao = Number(iluminacaoPublica);
    const outros = Number(outrosValores);
    const percentualDesconto = fatura.unidade_beneficiaria.percentual_desconto / 100;

    // Base para cálculo do desconto
    const baseDesconto = total - iluminacao - outros;
    // Valor do desconto
    const valorDesconto = baseDesconto * percentualDesconto;
    // Valor final
    const valorFinal = total - iluminacao - outros - valorDesconto;

    return {
      valor_desconto: valorDesconto,
      valor_total: valorFinal
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const calculatedValues = calculateValues();

    try {
      const { error } = await supabase
        .from("faturas")
        .update({
          consumo_kwh: Number(consumo),
          total_fatura: Number(totalFatura),
          fatura_concessionaria: Number(faturaConcessionaria),
          iluminacao_publica: Number(iluminacaoPublica),
          outros_valores: Number(outrosValores),
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Input
              type="number"
              id="totalFatura"
              value={totalFatura}
              onChange={(e) => setTotalFatura(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="faturaConcessionaria">Valor Concessionária</Label>
            <Input
              type="number"
              id="faturaConcessionaria"
              value={faturaConcessionaria}
              onChange={(e) => setFaturaConcessionaria(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="iluminacaoPublica">Iluminação Pública</Label>
            <Input
              type="number"
              id="iluminacaoPublica"
              value={iluminacaoPublica}
              onChange={(e) => setIluminacaoPublica(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="outrosValores">Outros Valores</Label>
            <Input
              type="number"
              id="outrosValores"
              value={outrosValores}
              onChange={(e) => setOutrosValores(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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
